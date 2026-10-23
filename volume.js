/* Výpočetní část bez DOM. Základní jednotka je celé mm³ (BigInt). */
(function (root) {
  'use strict';
  const UNITS = Object.freeze({ ml: 1000n, cl: 10000n, dl: 100000n, l: 1000000n, hl: 100000000n, 'mm³': 1n, 'cm³': 1000n, 'dm³': 1000000n, 'm³': 1000000000n, 'km³': 1000000000000000000n });
  const LEVELS = Object.freeze({
    easy: { name: 'Rozjezd', capacities: [500000n, 1000000n, 2000000n], description: 'Rozjezd · Dělení na 2, 5 nebo 10. Odpovědi ve stejné jednotce.' },
    medium: { name: 'Výzva', capacities: [50000n, 250000n, 500000n, 2500000n], description: 'Výzva · Dělení na 2, 5 nebo 10. Převody mezi všemi jednotkami.' },
    hard: { name: 'Expert', capacities: [50000n, 250000n, 2500000n, 10000000n], description: 'Expert · Dělení na 2, 5 nebo 10. Objem odečti ze stupnice.' },
    sigma: { name: 'Sigma', capacities: [50000n, 250000n, 2500000n, 10000000n], description: 'Sigma · Dělení na 2, 5 nebo 10. Odečti hladinu a zapiš převod.' }
  });
  function factor(unit) {
    if (!Object.hasOwn(UNITS, unit)) throw new RangeError('Neznámá jednotka: ' + unit);
    return UNITS[unit];
  }
  function parseVolume(value, unit) {
    const multiplier = factor(unit);
    const input = String(value).replace(/[\s\u00a0\u202f]/g, '').replace(',', '.');
    if (!/^\d+(\.\d+)?$/.test(input)) throw new TypeError('Zadejte nezáporné desetinné číslo.');
    const [integer, fraction = ''] = input.split('.');
    const denominator = 10n ** BigInt(fraction.length);
    const numerator = BigInt(integer + fraction) * multiplier;
    if (numerator % denominator !== 0n) throw new RangeError('Hodnota není celé mm³; zaokrouhlování není povoleno.');
    return numerator / denominator;
  }
  function formatNumber(volume, unit) {
    if (typeof volume !== 'bigint' || volume < 0n) throw new TypeError('Objem musí být nezáporný BigInt.');
    const divisor = factor(unit);
    const whole = (volume / divisor).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
    const remainder = volume % divisor;
    if (!remainder) return whole;
    const places = divisor.toString().length - 1;
    return whole + ',' + remainder.toString().padStart(places, '0').replace(/0+$/, '');
  }
  const formatVolume = (volume, unit) => formatNumber(volume, unit) + '\u00a0' + unit;
  const pick = (items, rng) => items[Math.floor(rng() * items.length)];
  function shuffle(items, rng) {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }
  const SHAPES = Object.freeze(['bottle', 'aquarium', 'pool', 'barrel', 'flask', 'watering']);
  const commonUnits = Object.keys(UNITS).filter(unit => unit !== 'km³');
  const randomUnit = rng => rng() < 0.01 ? 'km³' : pick(commonUnits, rng);
  function generateTask(level = 'easy', rng = Math.random, settings = {}) {
    if (!Object.hasOwn(LEVELS, level)) throw new RangeError('Neznámá obtížnost.');
    const config = LEVELS[level];
    
    const sourceUnit = settings.sourceUnit || (level === 'easy' ? pick(['ml', 'l'], rng) : randomUnit(rng));
    const targetUnit = settings.targetUnit || randomUnit(rng);
    factor(sourceUnit);
    if (level === 'easy' && !['ml', 'l'].includes(sourceUnit)) throw new RangeError('Rozjezd používá ml nebo l.');
    factor(targetUnit);
    const capacities = sourceUnit === 'km³' ? [1000000000000000n, 10000000000000000n, 100000000000000000n] : sourceUnit === 'hl' ? [100000000n, 500000000n, 1000000000n] : sourceUnit === 'mm³' ? [1000n, 10000n, 100000n] : sourceUnit === 'm³' ? [10000000n, 100000000n, 1000000000n] : config.capacities;
    const capacity = pick(capacities, rng);
    const divisions = 10 * pick([2, 5, 10], rng);
    const step = capacity / BigInt(divisions);
    const amount = step * BigInt(1 + Math.floor(rng() * (divisions - 1)));
    const base = { level, sourceUnit, targetUnit, capacity, step, divisions, amount };
    if (level === 'sigma') return { ...base, options: [] };
    // Jen posuny desetinné čárky: všechny nabídky zachovají číslice zadání.
    // Dělení povolíme pouze tehdy, když zůstane přesný počet celých mm³.
    const candidates = [amount * 10n, amount * 100n, amount * 1000n];
    for (const divisor of [10n, 100n, 1000n]) if (amount % divisor === 0n) candidates.push(amount / divisor);
    const unique = [...new Set(candidates)];
    const wrong = shuffle(unique, rng).slice(0, 3);
    const shapes = shuffle([...SHAPES], rng).slice(0, 4);
    const options = [amount, ...wrong].map((volume, index) => ({
      volume,
      unit: index === 0 || level === 'easy' ? targetUnit : pick(commonUnits, rng),
      shape: shapes[index]
    }));
    return { ...base, options: shuffle(options, rng) };
  }
  function isCorrect(task, index) { return Number.isInteger(index) && !!task.options[index] && task.options[index].volume === task.amount; }
  function explanation(task, index) {
    const unit = task.level === 'sigma' ? task.targetUnit : task.options[index].unit;
    const source = factor(task.sourceUnit);
    const target = factor(unit);
    let rule;
    if (source === target) rule = task.sourceUnit === unit ? 'Jednotky jsou stejné, číslo se tedy nemění.' : 'Tyto jednotky mají stejnou velikost, číslo se tedy nemění.';
    else if (source > target) rule = 'Při převodu z ' + task.sourceUnit + ' na ' + unit + ' násobíme ' + formatNumber(source / target, 'mm³') + '.';
    else rule = 'Při převodu z ' + task.sourceUnit + ' na ' + unit + ' dělíme ' + formatNumber(target / source, 'mm³') + '.';
    return rule + ' ' + formatVolume(task.amount, task.sourceUnit) + ' = ' + formatVolume(task.amount, unit) + '.';
  }
  function checkNumericAnswer(task, value) {
    const input = String(value).trim().replace(/[\s\u00a0\u202f]/g, '').replace(',', '.');
    if (input.length > 120 || !/^\d+(\.\d+)?$/.test(input)) return { valid: false, correct: false };
    const [whole, fraction = ''] = input.split('.');
    // Porovnání zlomků dovoluje vyhodnotit i chybný výsledek menší než mm³.
    return { valid: true, correct: BigInt(whole + fraction) * factor(task.targetUnit) === task.amount * 10n ** BigInt(fraction.length) };
  }
  const api = Object.freeze({ UNITS, LEVELS, SHAPES, checkNumericAnswer, parseVolume, formatNumber, formatVolume, generateTask, isCorrect, explanation });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Volume = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
