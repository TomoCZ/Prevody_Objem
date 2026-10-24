/* Přesná logika ostatních veličin. Objem deleguje na prověřený volume.js. */
(function (root) {
  'use strict';
  const V = typeof module !== 'undefined' && module.exports ? require('./volume.js') : root.Volume;
  const prefixedUnits = symbol => Object.fromEntries([['m', 1n], ['', 1000n], ['k', 1000000n], ['M', 1000000000n], ['G', 1000000000000n]].map(([prefix, factor]) => [prefix + symbol, factor]));
  const prefixHints = symbol => [`1 ${symbol} = 1 000 m${symbol}`, `1 k${symbol} = 1 000 ${symbol}`, `1 M${symbol} = 1 000 k${symbol}`, `1 G${symbol} = 1 000 M${symbol}`, `m = mili, k = kilo, M = mega, G = giga. Velikost písmen je důležitá.`];
  const QUANTITIES = Object.freeze({
    volume: { name: 'Objem', units: V.UNITS, hints: ['1 l = 1 dm³', '1 ml = 1 cm³', '1 l = 10 dl = 100 cl = 1 000 ml', '1 hl = 100 l', '1 m³ = 1 000 l', '1 cm³ = 1 000 mm³', '1 km³ = 1 000 000 000 m³'] },
    length: { name: 'Délka', units: { mm: 1n, cm: 10n, dm: 100n, m: 1000n, km: 1000000n }, hints: ['1 cm = 10 mm', '1 dm = 10 cm', '1 m = 10 dm = 100 cm', '1 km = 1 000 m'] },
    area: { name: 'Obsah', units: { 'mm²': 1n, 'cm²': 100n, 'dm²': 10000n, 'm²': 1000000n, 'km²': 1000000000000n }, hints: ['1 cm² = 100 mm²', '1 dm² = 100 cm²', '1 m² = 100 dm² = 10 000 cm²', '1 km² = 1 000 000 m²', 'U obsahu se převodní faktor délky umocňuje na druhou.'] },
    current: { name: 'Elektrický proud', units: prefixedUnits('A'), hints: prefixHints('A') },
    voltage: { name: 'Elektrické napětí', units: prefixedUnits('V'), hints: prefixHints('V') },
    resistance: { name: 'Elektrický odpor', units: prefixedUnits('Ω'), hints: prefixHints('Ω') },
    energy: { name: 'Energie', units: prefixedUnits('J'), hints: prefixHints('J') },
    power: { name: 'Výkon', units: prefixedUnits('W'), hints: [...prefixHints('W'), '1 W = 1 J/s. Výkon a energie jsou různé veličiny.'] },
    mass: { name: 'Hmotnost', units: { mg: 1n, g: 1000n, dag: 10000n, kg: 1000000n, q: 100000000n, t: 1000000000n }, hints: ['1 g = 1 000 mg', '1 dag = 10 g', '1 kg = 100 dag = 1 000 g', '1 q = 100 kg', '1 t = 10 q = 1 000 kg'] },
    density: { name: 'Hustota', units: { 'kg/m³': 1000n, 'g/cm³': 1000000n }, hints: ['1 g/cm³ = 1 000 kg/m³'] },
    // Mikrosekundy a 1/18 000 000 m/s umožňují i desetinné vstupy bez plovoucí čárky.
    time: { name: 'Čas', units: { s: 1000000n, min: 60000000n, h: 3600000000n, den: 86400000000n }, hints: ['1 min = 60 s', '1 h = 60 min = 3 600 s', '1 den = 24 h = 1 440 min = 86 400 s'] },
    speed: { name: 'Rychlost', units: { 'm/s': 18000000n, 'km/h': 5000000n }, hints: ['1 m/s = 3,6 km/h', 'Z m/s na km/h násob 3,6. Z km/h na m/s děl 3,6.'] },
    pressure: { name: 'Tlak', units: { mPa: 1n, kPa: 1000000n, MPa: 1000000000n, GPa: 1000000000000n }, hints: ['1 kPa = 1 000 000 mPa', '1 MPa = 1 000 kPa', '1 GPa = 1 000 MPa', 'mPa je milipascal, MPa je megapascal. Velikost písmen je důležitá.'] }
  });
  const LEVELS = {
    easy: { name: 'Rozjezd', description: 'Rozjezd · Jednodušší hodnoty, odpovědi ve stejné jednotce.' },
    medium: { name: 'Výzva', description: 'Výzva · Desetinné hodnoty a různé jednotky v odpovědích.' },
    hard: { name: 'Expert', description: 'Expert · Vyber správný převod. U veličin s přístrojem nejprve odečti hodnotu.' },
    sigma: { name: 'Sigma', description: 'Sigma · Zapiš převod. U veličin s přístrojem nejprve odečti hodnotu.' }
  };
  function factor(quantity, unit) {
    if (!Object.hasOwn(QUANTITIES, quantity) || !Object.hasOwn(QUANTITIES[quantity].units, unit)) throw new RangeError('Neznámá veličina nebo jednotka.');
    return QUANTITIES[quantity].units[unit];
  }
  const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
  function decimal(n, d) {
    if (n < 0n || d <= 0n) throw new RangeError('Neplatná hodnota.');
    let denominator = d / gcd(n, d);
    for (const p of [2n, 5n]) while (denominator % p === 0n) denominator /= p;
    if (denominator !== 1n) throw new RangeError('Výsledek nemá konečný desetinný zápis.');
    let text = (n / d).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0'), remainder = n % d;
    if (remainder) text += ',';
    while (remainder) { remainder *= 10n; text += remainder / d; remainder %= d; }
    return text;
  }
  const formatNumber = (quantity, amount, unit) => decimal(amount, factor(quantity, unit));
  const formatValue = (task, amount, unit) => formatNumber(task.quantity || 'volume', amount, unit) + '\u00a0' + unit;
  function checkNumericAnswer(task, value) {
    const input = String(value).trim().replace(/\s/g, '').replace(',', '.');
    if (input.length > 120 || !/^\d+(\.\d+)?$/.test(input)) return { valid: false, correct: false };
    const [whole, fraction = ''] = input.split('.');
    return { valid: true, correct: BigInt(whole + fraction) * factor(task.quantity || 'volume', task.targetUnit) === task.amount * 10n ** BigInt(fraction.length) };
  }
  const pick = (items, rng) => items[Math.floor(rng() * items.length)];
  function shuffle(items, rng) {
    for (let i = items.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [items[i], items[j]] = [items[j], items[i]]; }
    return items;
  }
  function createPicker(keys, rng = Math.random) {
    if (!keys.length || keys.some(key => !Object.hasOwn(QUANTITIES, key))) throw new RangeError('Vyber alespoň jednu veličinu.');
    let bag = [];
    return () => { if (!bag.length) bag = shuffle([...new Set(keys)], rng); return bag.pop(); };
  }
  function hasFiniteResult(quantity, amount, unit) {
    try { formatNumber(quantity, amount, unit); return true; } catch { return false; }
  }
  function instrumentTask(quantity, sourceUnit, targetUnit, rng) {
    if (quantity === 'time') {
      // Stopky zobrazují uplynulý čas: dny a HH:MM:SS, nikoli denní čas.
      const seconds = [15, 30, 45, 60, 90, 120, 180, 270, 300, 450, 600, 900, 1800, 2700, 3600, 5400, 7200, 86400, 129600, 172800];
      const values = seconds.map(n => BigInt(n) * 1000000n).filter(amount => hasFiniteResult(quantity, amount, sourceUnit) && hasFiniteResult(quantity, amount, targetUnit));
      const amount = pick(values, rng);
      return { amount, instrument: { kind: 'stopwatch', seconds: amount / 1000000n } };
    }
    const divisions = quantity === 'length' ? 100 : 10 * pick([2, 5, 10], rng);
    const source = factor(quantity, sourceUnit);
    const capacities = [];
    for (const n of [1n, 2n, 5n, 10n, 20n, 50n, 100n, 200n, 500n, 1000n]) for (const d of [1n, 10n, 100n]) {
      if (source * n % (d * BigInt(divisions)) === 0n) capacities.push(source * n / d);
    }
    const capacity = pick([...new Set(capacities)], rng);
    const step = capacity / BigInt(divisions);
    const ticks = Array.from({ length: divisions - 1 }, (_, i) => i + 1).filter(tick => hasFiniteResult(quantity, step * BigInt(tick), targetUnit));
    const tick = pick(ticks, rng);
    return { amount: step * BigInt(tick), instrument: { kind: quantity === 'length' ? 'ruler' : 'dial', capacity, divisions, step, tick } };
  }
  function generateTask(quantity, level = 'easy', rng = Math.random, settings = {}) {
    if (!Object.hasOwn(LEVELS, level) || !Object.hasOwn(QUANTITIES, quantity)) throw new RangeError('Neznámá obtížnost nebo veličina.');
    if (quantity === 'volume') return { ...V.generateTask(level, rng, settings), quantity };
    const units = Object.keys(QUANTITIES[quantity].units);
    const sourceUnit = settings.sourceUnit || pick(units, rng);
    const targetUnit = settings.targetUnit || pick(units.filter(unit => unit !== sourceUnit), rng);
    const source = factor(quantity, sourceUnit);
    factor(quantity, targetUnit);
    const coefficients = quantity === 'time' ? [1, 2, 3, 5, 10, 15, 20, 24, 30, 45, 60, 90, 120, 180, 300, 600, 900, 1440, 1800, 2700, 3600, 5400, 86400] : [1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 25, 27, 30, 36, 45, 50, 54, 60, 72, 75, 81, 90, 100, 125, 250, 500, 1000];
    const denominators = level === 'easy' ? [1n] : level === 'medium' ? [10n, 1n] : [100n, 1000n, 10n];
    const candidates = [];
    for (const divisor of denominators) for (const coefficient of coefficients) {
      const numerator = source * BigInt(coefficient);
      if (numerator % divisor !== 0n) continue;
      const value = numerator / divisor;
      if (hasFiniteResult(quantity, value, targetUnit)) candidates.push(value);
    }
    // Každá dvojice má přesné kandidáty; nikdy nenutíme žáka zaokrouhlovat.
    if (!candidates.length) throw new Error('Chybí přesné zadání.');
    const expert = level === 'hard' || level === 'sigma';
    const electrical = ['current', 'voltage', 'resistance'].includes(quantity);
    const measured = expert && electrical
      ? { amount: pick([...new Set(candidates)], rng), instrument: { kind: 'multimeter' } }
      : expert && ['length', 'mass', 'time', 'speed', 'pressure'].includes(quantity)
        ? instrumentTask(quantity, sourceUnit, targetUnit, rng) : null;
    const amount = measured ? measured.amount : pick([...new Set(candidates)], rng);
    const task = { quantity, level, sourceUnit, targetUnit, amount, options: [], ...(measured ? { instrument: measured.instrument } : {}) };
    if (level === 'sigma') return task;
    const wrong = new Set([amount * 10n, amount * 100n, amount * 1000n]);
    for (const d of [10n, 100n, 1000n]) if (amount % d === 0n) wrong.add(amount / d);
    // Pro čas a rychlost navíc chyby ve směru převodu či v převodním faktoru.
    if (quantity === 'time' || quantity === 'speed') {
      const target = factor(quantity, targetUnit);
      for (const [n, d] of [[amount * target, source], [amount * target * target, source * source], [amount * 60n, 1n], [amount, 60n]]) {
        if (n % d === 0n && n / d > 0n && n / d !== amount) wrong.add(n / d);
      }
    }
    const usableUnits = value => units.filter(unit => hasFiniteResult(quantity, value, unit) && hasFiniteResult(quantity, amount, unit));
    const usable = [...wrong].filter(value => usableUnits(value).length && (level !== 'easy' || hasFiniteResult(quantity, value, targetUnit)));
    task.options = [amount, ...shuffle(usable, rng).slice(0, 3)].map((volume, index) => ({
      volume,
      unit: index === 0 || level === 'easy' ? targetUnit : pick(usableUnits(volume), rng)
    }));
    shuffle(task.options, rng);
    return task;
  }
  function explanation(task, index) {
    if (!task.quantity || task.quantity === 'volume') return V.explanation(task, index);
    const unit = task.level === 'sigma' ? task.targetUnit : task.options[index].unit;
    const source = factor(task.quantity, task.sourceUnit), target = factor(task.quantity, unit);
    const rule = source === target ? 'Jednotky jsou stejné, číslo se nemění.' : source > target ? `Z ${task.sourceUnit} na ${unit} násobíme ${decimal(source, target)}.` : `Z ${task.sourceUnit} na ${unit} dělíme ${decimal(target, source)}.`;
    return rule + ' ' + formatValue(task, task.amount, task.sourceUnit) + ' = ' + formatValue(task, task.amount, unit) + '.';
  }
  const api = Object.freeze({ QUANTITIES, LEVELS, formatNumber, formatValue, generateTask, createPicker, checkNumericAnswer, explanation, isCorrect: V.isCorrect });
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Quantities = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
