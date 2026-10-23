'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const V = require('../volume.js');

// Nezávislý etalon: mocniny deseti v mm³, nikoli tabulka nebo parser hry.
const powers = { ml: 3, cl: 4, dl: 5, l: 6, hl: 8, 'mm³': 0, 'cm³': 3, 'dm³': 6, 'm³': 9, 'km³': 18 };
const units = Object.keys(powers);
function read(text, unit) {
  const [whole, decimal = ''] = text.replace(/\s/g, '').replace(',', '.').split('.');
  return { numerator: BigInt(whole + decimal) * 10n ** BigInt(powers[unit]), denominator: 10n ** BigInt(decimal.length) };
}
function printed(amount, unit) {
  const places = powers[unit];
  const digits = amount.toString().padStart(places + 1, '0');
  if (!places) return digits;
  const fraction = digits.slice(-places).replace(/0+$/, '');
  return digits.slice(0, -places) + (fraction ? ',' + fraction : '');
}
function same(text, unit, amount) {
  const value = read(text, unit);
  assert.equal(value.numerator, amount * value.denominator);
}
function capacities(level, unit) {
  if (unit === 'km³') return [10n ** 15n, 10n ** 16n, 10n ** 17n];
  if (unit === 'hl') return [100000000n, 500000000n, 1000000000n];
  if (unit === 'mm³') return [1000n, 10000n, 100000n];
  if (unit === 'm³') return [10000000n, 100000000n, 1000000000n];
  if (level === 'easy') return [500000n, 1000000n, 2000000n];
  if (level === 'medium') return [50000n, 250000n, 500000n, 2500000n];
  return [50000n, 250000n, 2500000n, 10000000n];
}

test('Úplný audit 190 380 zadání: každá kapacita, ryska, dělení, směr převodu a obtížnost', () => {
  let count = 0;
  for (const [unit, power] of Object.entries(powers)) assert.equal(V.UNITS[unit], 10n ** BigInt(power));
  for (const level of ['easy', 'medium', 'hard', 'sigma']) {
    for (const sourceUnit of level === 'easy' ? ['ml', 'l'] : units) for (const targetUnit of units) {
      const caps = capacities(level, sourceUnit);
      for (let c = 0; c < caps.length; c++) for (const [d, divisions] of [20, 50, 100].entries()) {
        for (let tick = 1; tick < divisions; tick++) {
          const sequence = [(c + 0.5) / caps.length, (d + 0.5) / 3, (tick - 0.5) / (divisions - 1)];
          let seed = count + 73;
          const rng = () => sequence.length ? sequence.shift() : ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
          const task = V.generateTask(level, rng, { sourceUnit, targetUnit });
          const expected = caps[c] * BigInt(tick) / BigInt(divisions);
          assert.equal(caps[c] % BigInt(divisions), 0n);
          assert.equal(task.capacity, caps[c]); assert.equal(task.divisions, divisions);
          assert.equal(task.amount, expected); assert.equal(task.step * BigInt(tick), expected);
          same(V.formatNumber(task.amount, sourceUnit), sourceUnit, expected);
          same(V.formatNumber(task.amount, targetUnit), targetUnit, expected);
          // Každý popisek hlavní stupnice také musí zachovat skutečný objem.
          for (let major = 0; major <= 10; major++) {
            const value = caps[c] * BigInt(major) / 10n;
            same(V.formatNumber(value, sourceUnit), sourceUnit, value);
          }
          if (level === 'sigma') {
            assert.equal(task.options.length, 0);
            for (const text of [printed(expected, targetUnit), printed(expected, targetUnit).replace(',', '.')]) {
              assert.deepEqual(V.checkNumericAnswer(task, text), { valid: true, correct: true });
            }
            assert.deepEqual(V.checkNumericAnswer(task, printed(expected + 1n, targetUnit)), { valid: true, correct: false });
            assert.deepEqual(V.checkNumericAnswer(task, printed(expected - 1n, targetUnit)), { valid: true, correct: false });
          } else {
            assert.equal(task.options.length, 4);
            assert.equal(new Set(task.options.map(o => o.volume)).size, 4);
            let matches = 0;
            task.options.forEach((option, index) => {
              const value = read(V.formatNumber(option.volume, option.unit), option.unit);
              const correct = value.numerator === expected * value.denominator;
              assert.equal(V.isCorrect(task, index), correct);
              if (correct) matches++;
              const explanation = V.explanation(task, index).replace(/\s/g, '');
              assert.ok(explanation.endsWith(printed(expected, sourceUnit) + sourceUnit + '=' + printed(expected, option.unit) + option.unit + '.'));
              const delta = powers[sourceUnit] - powers[option.unit];
              if (delta) assert.ok(explanation.includes((delta > 0 ? 'násobíme' : 'dělíme') + 10n ** BigInt(Math.abs(delta)) + '.'));
            });
            assert.equal(matches, 1);
          }
          count++;
        }
      }
    }
  }
  assert.equal(count, 190380);
});

test('Každý povolený chybný násobek zůstává chybný ve všech jednotkách a pozicích', () => {
  for (const amount of [10n, 1230n, 600000n, 99000000000000000n]) {
    for (const exponent of [-3, -2, -1, 1, 2, 3]) {
      const multiplier = 10n ** BigInt(Math.abs(exponent));
      if (exponent < 0 && amount % multiplier !== 0n) continue;
      const wrong = exponent < 0 ? amount / multiplier : amount * multiplier;
      for (const unit of units) for (let index = 0; index < 4; index++) {
        const options = Array.from({ length: 4 }, () => ({ volume: wrong, unit }));
        options[index] = { volume: amount, unit };
        const task = { amount, options };
        options.forEach((option, i) => {
          const value = read(V.formatNumber(option.volume, unit), unit);
          assert.equal(value.numerator === amount * value.denominator, i === index);
          assert.equal(V.isCorrect(task, i), i === index);
        });
      }
    }
  }
});
