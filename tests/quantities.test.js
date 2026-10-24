'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const Q = require('../quantities.js');
// Nezávislé faktory v SI (metry, kilogramy, kg/m³, sekundy, m/s a pascaly).
const reference = {
  area: { 'mm²':[1n,1000000n], 'cm²':[1n,10000n], 'dm²':[1n,100n], 'm²':[1n,1n], 'km²':[1000000n,1n] },
  current: { mA:[1n,1000n], A:[1n,1n], kA:[1000n,1n], MA:[1000000n,1n], GA:[1000000000n,1n] },
  voltage: { mV:[1n,1000n], V:[1n,1n], kV:[1000n,1n], MV:[1000000n,1n], GV:[1000000000n,1n] },
  resistance: { 'mΩ':[1n,1000n], 'Ω':[1n,1n], 'kΩ':[1000n,1n], 'MΩ':[1000000n,1n], 'GΩ':[1000000000n,1n] },
  energy: { mJ:[1n,1000n], J:[1n,1n], kJ:[1000n,1n], MJ:[1000000n,1n], GJ:[1000000000n,1n] },
  power: { mW:[1n,1000n], W:[1n,1n], kW:[1000n,1n], MW:[1000000n,1n], GW:[1000000000n,1n] },
  length: { mm:[1n,1000n], cm:[1n,100n], dm:[1n,10n], m:[1n,1n], km:[1000n,1n] },
  mass: { mg:[1n,1000000n], g:[1n,1000n], dag:[1n,100n], kg:[1n,1n], q:[100n,1n], t:[1000n,1n] },
  density: { 'kg/m³':[1n,1n], 'g/cm³':[1000n,1n] },
  time: { s:[1n,1n], min:[60n,1n], h:[3600n,1n], den:[86400n,1n] },
  speed: { 'm/s':[1n,1n], 'km/h':[5n,18n] },
  pressure: { mPa:[1n,1000n], kPa:[1000n,1n], MPa:[1000000n,1n], GPa:[1000000000n,1n] }
};
function parse(text, quantity, unit) {
  const [whole, part=''] = text.replace(/\s/g,'').replace(',','.').split('.');
  const [n,d] = reference[quantity][unit];
  return [BigInt(whole+part)*n, 10n**BigInt(part.length)*d];
}
const equal = (a,b) => a[0]*b[1]===b[0]*a[1];
function random(seed) { return () => ((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296); }

test('Základní vztahy: délka, hmotnost, hustota, čas, rychlost, tlak', () => {
  const cases = [
    ['length',1000000n,'km','1'], ['length',1000000n,'m','1 000'],
    ['mass',100000000n,'q','1'], ['mass',100000000n,'kg','100'],
    ['density',1000000n,'g/cm³','1'], ['density',1000000n,'kg/m³','1 000'],
    ['time',86400000000n,'den','1'], ['time',86400000000n,'h','24'],
    ['time',86400000000n,'min','1 440'], ['time',86400000000n,'s','86 400'],
    ['speed',18000000n,'m/s','1'], ['speed',18000000n,'km/h','3,6'],
    ['speed',450000000n,'m/s','25'], ['speed',450000000n,'km/h','90'],
    ['pressure',1000000000n,'MPa','1'], ['pressure',1000000000n,'mPa','1 000 000 000'],
    ['pressure',1000000000000n,'GPa','1'], ['pressure',1000000000000n,'kPa','1 000 000']
  ];
  for(const [quantity,amount,unit,expected] of cases) assert.equal(Q.formatNumber(quantity,amount,unit).replace(/\s/g,' '),expected);
  assert.throws(()=>Q.formatNumber('speed',5000000n,'m/s'),RangeError);
});

test('301 200 úloh: všech 251 směrů mimo objem, čtyři obtížnosti, nezávislé SI ověření', () => {
  const rng=random(2381); let count=0;
  const subdivisions = {};
  for(const [quantity,units] of Object.entries(reference)) for(const sourceUnit of Object.keys(units)) for(const targetUnit of Object.keys(units)) for(const level of Object.keys(Q.LEVELS)) {
    for(let i=0;i<300;i++) {
      const task=Q.generateTask(quantity,level,rng,{sourceUnit,targetUnit});
      if ((level === 'hard' || level === 'sigma') && !['density', 'area', 'energy', 'power'].includes(quantity)) {
        assert.ok(task.instrument);
        const instrument = task.instrument;
        if (['current', 'voltage', 'resistance'].includes(quantity)) {
          assert.equal(instrument.kind, 'multimeter');
        } else if (quantity === 'time') {
          assert.equal(instrument.kind, 'stopwatch');
          assert.equal(instrument.seconds * 1000000n, task.amount);
          const seconds = instrument.seconds;
          assert.equal((seconds / 86400n) * 86400n + (seconds / 3600n % 24n) * 3600n + (seconds / 60n % 60n) * 60n + seconds % 60n, seconds);
        } else {
          assert.equal(instrument.kind, quantity === 'length' ? 'ruler' : 'dial');
          assert.ok([20, 50, 100].includes(instrument.divisions));
          if (quantity === 'length') assert.equal(instrument.divisions, 100);
          else (subdivisions[`${quantity}:${level}`] ??= new Set()).add(instrument.divisions / 10);
          assert.equal(instrument.capacity, instrument.step * BigInt(instrument.divisions));
          assert.equal(task.amount, instrument.step * BigInt(instrument.tick));
          assert.ok(instrument.tick > 0 && instrument.tick < instrument.divisions);
        }
      } else assert.equal(task.instrument, undefined);
      const sourceText=Q.formatNumber(quantity,task.amount,sourceUnit);
      const targetText=Q.formatNumber(quantity,task.amount,targetUnit);
      const expected=parse(sourceText,quantity,sourceUnit);
      assert.ok(equal(expected,parse(targetText,quantity,targetUnit)));
      assert.equal(Q.checkNumericAnswer(task,targetText).correct,true);
      assert.equal(Q.checkNumericAnswer(task,'0').correct,false);
      assert.equal(Q.checkNumericAnswer(task,'abc').valid,false);
      if(level==='sigma') assert.equal(task.options.length,0);
      else {
        assert.equal(task.options.length,4);
        assert.equal(new Set(task.options.map(o=>o.volume)).size,4);
        let correct=0;
        task.options.forEach((option,index)=>{
          const text=Q.formatNumber(quantity,option.volume,option.unit);
          const matches=equal(expected,parse(text,quantity,option.unit));
          assert.equal(Q.isCorrect(task,index),matches);
          if(matches)correct++;
          const explanation=Q.explanation(task,index);
          const equation=explanation.slice(explanation.indexOf('. ')+2,-1);
          const [left,right]=equation.split(' = ');
          assert.ok(equal(parse(left.slice(0,-sourceUnit.length).trim(),quantity,sourceUnit),parse(right.slice(0,-option.unit.length).trim(),quantity,option.unit)));
        });
        assert.equal(correct,1);
        if(level==='easy')assert.ok(task.options.every(o=>o.unit===targetUnit));
      }
      assert.ok(Q.explanation(task,0).includes(' = '));
      count++;
    }
  }
  assert.equal(count,301200);
  for (const quantity of ['mass', 'speed', 'pressure']) for (const level of ['hard', 'sigma']) {
    assert.deepEqual([...subdivisions[`${quantity}:${level}`]].sort((a,b) => a-b), [2, 5, 10]);
  }
});

test('Výběr jedné nebo více veličin: každý blok obsahuje právě zvolené veličiny', () => {
  const keys=Object.keys(Q.QUANTITIES);
  for(let mask=1;mask<(1<<keys.length);mask++) {
    const selected=keys.filter((_,i)=>mask&(1<<i));
    const next=Q.createPicker(selected,random(mask));
    for(let round=0;round<10;round++)assert.deepEqual(Array.from({length:selected.length},()=>next()).sort(),[...selected].sort());
  }
  assert.throws(()=>Q.createPicker([]),RangeError);
  assert.throws(()=>Q.createPicker(['invalid']),RangeError);
});

test('Objem dál používá původní logiku a přesné vyhodnocení', () => {
  const rng=random(450);
  for(const level of Object.keys(Q.LEVELS)) for(let i=0;i<1000;i++) {
    const task=Q.generateTask('volume',level,rng);
    assert.equal(task.quantity,'volume');
    assert.equal(Q.checkNumericAnswer(task,Q.formatNumber('volume',task.amount,task.targetUnit)).correct,true);
    assert.ok([20,50,100].includes(task.divisions));
  }
});
