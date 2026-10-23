'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const V = require('../volume.js');
const units = Object.keys(V.UNITS);
function random(seed) { return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; }; }

test('Základní fyzikální vztahy a desetinná čárka', () => {
  assert.equal(V.parseVolume('1', 'l'), V.parseVolume('1', 'dm³'));
  assert.equal(V.parseVolume('1', 'ml'), V.parseVolume('1', 'cm³'));
  assert.equal(V.parseVolume('1', 'm³'), V.parseVolume('1 000', 'l'));
  assert.equal(V.parseVolume('1', 'cm³'), V.parseVolume('1000', 'mm³'));
  assert.equal(V.parseVolume('0,000000001', 'm³'), 1n);
  assert.equal(V.parseVolume('0,001', 'ml'), 1n);
  assert.equal(V.formatVolume(62500n, 'l'), '0,0625\u00a0l');
  assert.equal(V.formatVolume(62500n, 'm³'), '0,0000625\u00a0m³');
  assert.equal(V.formatVolume(1000000n, 'mm³'), '1\u00a0000\u00a0000\u00a0mm³');
});

test('Všech 100 směrů převodu zachová přesnou hodnotu bez zaokrouhlení', () => {
  for (const volume of [0n, 1n, 17n, 1000n, 62500n, 123456789n, 100000000000n, 999999999999999999999n]) {
    for (const source of units) for (const target of units) {
      const parsed = V.parseVolume(V.formatNumber(volume, source), source);
      assert.equal(V.parseVolume(V.formatNumber(parsed, target), target), volume);
    }
  }
});

test('Nepřípustné hodnoty se odmítají; nic se tiše nezaokrouhluje', () => {
  for (const value of ['-1', 'NaN', 'Infinity', '', '1,2,3', '1e5']) assert.throws(() => V.parseVolume(value, 'l'));
  assert.throws(() => V.parseVolume('0,1', 'mm³'), RangeError);
  assert.throws(() => V.parseVolume('1', 'kg'), RangeError);
  assert.throws(() => V.formatNumber(-1n, 'l'), TypeError);
  assert.throws(() => V.generateTask('invalid'), RangeError);
});

test('320 000 úloh: všechny jednotky a čtyři obtížnosti', () => {
  const rng = random(20261022);
  for (const level of Object.keys(V.LEVELS)) for (const sourceUnit of (level === 'easy' ? ['ml', 'l'] : units)) for (const targetUnit of units) {
    for (let i = 0; i < 1000; i++) {
      const task = V.generateTask(level, rng, { sourceUnit, targetUnit });
      assert.equal(task.options.length, level === 'sigma' ? 0 : 4);
      if (level !== 'sigma') {
      assert.equal(new Set(task.options.map(option => option.volume)).size, 4);
      assert.equal(task.options.filter((_, index) => V.isCorrect(task, index)).length, 1);
      assert.equal(task.options.find(option => option.volume === task.amount).unit, targetUnit);
      } else assert.equal(V.checkNumericAnswer(task, V.formatNumber(task.amount, task.targetUnit)).correct, true);
      assert.ok(task.amount > 0n && task.amount < task.capacity);
      assert.equal(task.amount % task.step, 0n);
      assert.equal(task.capacity, task.step * BigInt(task.divisions));
      assert.ok([2, 5, 10].includes(task.divisions / 10));
      for (const option of task.options) {
        assert.ok(option.volume > 0n);
        assert.equal(V.parseVolume(V.formatNumber(option.volume, option.unit), option.unit), option.volume);
      }
      assert.equal(V.parseVolume(V.formatNumber(task.amount, sourceUnit), sourceUnit), task.amount);
      assert.equal(V.isCorrect(task, -1), false);
      assert.equal(V.isCorrect(task, 4), false);
    }
  }
});

test('Náhodné generování pokrývá všechny kombinace i pozice odpovědí', () => {
  const rng = random(42);
  for (const level of Object.keys(V.LEVELS)) {
    const combinations = new Set(), positions = new Set(), shapes = new Set(), subdivisions = new Set();
    for (let i = 0; i < 100000; i++) {
      const task = V.generateTask(level, rng);
      combinations.add(task.sourceUnit + '/' + task.targetUnit);
      subdivisions.add(task.divisions / 10);
      positions.add(task.options.findIndex(option => option.volume === task.amount));
      task.options.forEach(option => shapes.add(option.shape));
    }
    assert.equal(combinations.size, level === 'easy' ? 20 : 100);
    assert.deepEqual([...subdivisions].sort((a, b) => a - b), [2, 5, 10]);
    assert.equal(positions.size, level === 'sigma' ? 1 : 4);
    assert.equal(shapes.size, level === 'sigma' ? 0 : V.SHAPES.length);
  }
});

test('Vysvětlení uvádí přesnou rovnost také pro chybně zvolenou jednotku', () => {
  const rng = random(100);
  for (const sourceUnit of ['ml', 'l']) for (const targetUnit of units) {
    const task = V.generateTask('easy', rng, { sourceUnit, targetUnit });
    const index = task.options.findIndex(option => option.volume !== task.amount);
    const text = V.explanation(task, index);
    assert.ok(text.includes(V.formatVolume(task.amount, sourceUnit) + ' = ' + V.formatVolume(task.amount, targetUnit)));
  }
});

const significantDigits = text => text.replace(/[^0-9]/g, '').replace(/^0+/, '').replace(/0+$/, '');
test('Všechny nabídky zachovají číslice původní hodnoty; mění se pouze řád', () => {
  const rng = random(20261023);
  for (const level of Object.keys(V.LEVELS)) {
    let decimals = 0;
    for (let i = 0; i < 3000; i++) {
      const task = V.generateTask(level, rng);
      const original = V.formatNumber(task.amount, task.sourceUnit);
      if (original.includes(',')) decimals++;
      for (const option of task.options) assert.equal(significantDigits(V.formatNumber(option.volume, option.unit)), significantDigits(original));
      if (level === 'easy') assert.ok(task.options.every(option => option.unit === task.targetUnit));
    }
    assert.ok(decimals > 0);
  }
});

test('Nové jednotky včetně km³ mají přesné fyzikální vztahy', () => {
  for (const [value, unit] of [['1000','ml'],['100','cl'],['10','dl'],['1','l'],['0,01','hl']]) assert.equal(V.parseVolume(value,unit),1000000n);
  assert.equal(V.parseVolume('1','km³'), V.parseVolume('1000000000','m³'));
  assert.equal(V.formatNumber(1n,'km³'), '0,000000000000000001');
});
test('Sigma: formát, přesnost, chybná i neplatná odpověď', () => {
  const task = {amount:600000n,targetUnit:'l'};
  for (const input of ['0,6','0.6','00,6000',' 0,6 ']) assert.deepEqual(V.checkNumericAnswer(task,input),{valid:true,correct:true});
  for (const input of ['6','0','0,600000000000000001']) assert.deepEqual(V.checkNumericAnswer(task,input),{valid:true,correct:false});
  for (const input of ['', ' ', '-1','0,6 l','0,6,0','1e3','NaN']) assert.equal(V.checkNumericAnswer(task,input).valid,false);
  assert.equal(V.checkNumericAnswer({amount:1n,targetUnit:'km³'},'0,000000000000000001').correct,true);
});
test('Km³ se objevují vzácně, ostatní jednotky pravidelně', () => {
  const rng = random(9123), counts = Object.fromEntries(units.map(u=>[u,0]));
  for(let i=0;i<20000;i++) { const task=V.generateTask('sigma',rng); counts[task.sourceUnit]++; counts[task.targetUnit]++; }
  assert.ok(counts['km³']>200 && counts['km³']<700);
  for(const unit of units.filter(u=>u!=='km³')) assert.ok(counts[unit]>3000);
});
