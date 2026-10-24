/* SVG měřidla: geometrie je odvozena ze stejné přesné rysky jako zadání. */
(function (root) {
  'use strict';
  const Q = root.Quantities;
  const names = { length: 'Pravítko', mass: 'Analogová váha', time: 'Stopky', speed: 'Tachometr', pressure: 'Tlakoměr' };
  const label = (x, y, text, size = 12, anchor = 'middle', extra = '') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" fill="#40566d" ${extra}>${text}</text>`;
  function render(task) {
    const instrument = task.instrument;
    let content, accessible, zoomView;
    if (instrument.kind === 'multimeter') {
      const value = Q.formatNumber(task.quantity, task.amount, task.sourceUnit);
      const mode = { current: 'A', voltage: 'V', resistance: 'Ω' }[task.quantity];
      const angle = { current: -45, voltage: 0, resistance: 45 }[task.quantity];
      accessible = `Výukový digitální multimetr. ${Q.QUANTITIES[task.quantity].name}: ${value} ${task.sourceUnit}.`;
      zoomView = '35 20 250 304.6875';
      content = `<rect x="35" y="25" width="250" height="335" rx="30" fill="var(--tint-strong, #e5dff8)" stroke="var(--accent, #6b55cb)" stroke-width="3"/>
        <rect x="49" y="39" width="222" height="307" rx="21" fill="#25304a"/>
        ${label(160, 63, 'MULTIMETR · VÝUKOVÝ MODEL', 9, 'middle', 'style="fill:#fff"')}
        <rect x="59" y="80" width="202" height="100" rx="9" fill="#eaf2dc"/>
        ${label(245, 130, value, Math.min(34, 215 / value.length), 'end', 'data-part="reading" font-weight="700" style="font-variant-numeric:tabular-nums"')}
        ${label(242, 161, task.sourceUnit, 18, 'end', 'data-part="unit" font-weight="700"')}
        ${label(94, 216, 'A', 15, 'middle', `style="fill:${mode === 'A' ? '#fff' : '#a5afbf'}"`)}
        ${label(160, 202, 'V', 15, 'middle', `style="fill:${mode === 'V' ? '#fff' : '#a5afbf'}"`)}
        ${label(226, 216, 'Ω', 15, 'middle', `style="fill:${mode === 'Ω' ? '#fff' : '#a5afbf'}"`)}
        <circle cx="160" cy="257" r="39" fill="#45516b" stroke="#7e8ba3" stroke-width="2"/>
        <g transform="rotate(${angle} 160 257)"><rect x="151" y="225" width="18" height="64" rx="6" fill="#d8dfe9"/><path d="M160 225v12" stroke="var(--accent, #6b55cb)" stroke-width="5"/></g>
        <circle cx="113" cy="321" r="9" fill="#101827" stroke="#a5afbf" stroke-width="2"/>
        <circle cx="207" cy="321" r="9" fill="#101827" stroke="#e07777" stroke-width="3"/>
        ${label(113, 308, 'COM', 8, 'middle', 'style="fill:#fff"')}${label(207, 308, mode, 9, 'middle', 'style="fill:#fff"')}
        <path d="M113 328v37q0 15-36 15M207 328v37q0 15 36 15" fill="none" stroke="#56657b" stroke-width="4"/>`;
    } else if (instrument.kind === 'stopwatch') {
      zoomView = '35 45 250 304.6875';
      const seconds = instrument.seconds;
      const days = seconds / 86400n;
      const hours = seconds / 3600n % 24n;
      const minutes = seconds / 60n % 60n;
      const rest = seconds % 60n;
      const two = n => n.toString().padStart(2, '0');
      accessible = `Stopky, uplynulý čas: ${days} dnů, ${hours} hodin, ${minutes} minut, ${rest} sekund.`;
      content = `<rect x="139" y="36" width="42" height="20" rx="7" fill="#95a9b9"/><path d="M160 56v20m66 14l13-15" stroke="#647c90" stroke-width="10"/><rect x="28" y="76" width="264" height="248" rx="49" fill="#e8eff5" stroke="#adc1d1" stroke-width="3"/><rect x="45" y="125" width="230" height="149" rx="15" fill="#edf7ed" stroke="#b6ccc2" stroke-width="2"/>${label(160, 105, 'STOPKY', 12, 'middle', 'letter-spacing="3"')}${label(160, 154, 'DNY', 10)}${label(160, 184, days, 26, 'middle', 'data-part="days" font-weight="700"')}${label(82, 229, two(hours), 28, 'middle', 'data-part="hours" font-weight="700"')}${label(160, 229, two(minutes), 28, 'middle', 'data-part="minutes" font-weight="700"')}${label(238, 229, two(rest), 28, 'middle', 'data-part="seconds" font-weight="700"')}${label(121, 226, ':', 24)}${label(199, 226, ':', 24)}${label(82, 254, 'HODINY', 10)}${label(160, 254, 'MINUTY', 10)}${label(238, 254, 'SEKUNDY', 10)}<circle cx="160" cy="300" r="10" fill="var(--accent, #6b55cb)"/>${label(160, 355, 'UPLYNULÝ ČAS', 11, 'middle', 'letter-spacing="2"')}`;
    } else {
      const { capacity, divisions, tick } = instrument;
      const majorEvery = divisions / 10;
      accessible = `${names[task.quantity]}. Rozsah od nuly do ${Q.formatValue(task, capacity, task.sourceUnit)}, ${divisions} stejných dílků. Ukazatel je na ${tick}. dílku od nuly.`;
      let ticks = '';
      if (instrument.kind === 'ruler') {
        for (let i = 0; i <= divisions; i++) {
          const y = 70 + 260 * i / divisions, major = i % majorEvery === 0;
          ticks += `<path class="instrument-tick" d="M110 ${y}h${major ? 34 : 17}" stroke="#6c6b63" stroke-width="${major ? 1.6 : 1}"/>`;
          if (major) ticks += label(96, y + 4, Q.formatNumber(task.quantity, capacity * BigInt(i) / BigInt(divisions), task.sourceUnit), 12, 'end', 'class="instrument-label"');
        }
        const y = 70 + 260 * tick / divisions;
        zoomView = `0 ${Math.max(35, Math.min(146.25, y - 121.875))} 200 243.75`;
        content = `<rect x="110" y="55" width="86" height="291" rx="9" fill="#fff1d5" stroke="#d4be8e" stroke-width="2"/>${label(153, 43, task.sourceUnit, 15, 'middle', 'font-weight="700"')}<rect x="219" y="70" width="28" height="${y - 70}" rx="3" fill="#9ed7d2" stroke="#4c9c96" stroke-width="2"/><path d="M202 70h56" stroke="#719590" stroke-width="1.5"/><path class="instrument-pointer" data-position="${y}" d="M252 ${y}H148m7 -5l-7 5l7 5" fill="none" stroke="var(--accent, #6b55cb)" stroke-width="2"/>${ticks}${label(160, 374, 'ODEČTI KONEC BAREVNÉHO ÚSEKU', 10)}`;
      } else {
        const point = (angle, radius) => { const rad = angle * Math.PI / 180; return [160 + Math.cos(rad) * radius, 193 + Math.sin(rad) * radius]; };
        for (let i = 0; i <= divisions; i++) {
          const angle = 135 + 270 * i / divisions, major = i % majorEvery === 0;
          const [x1, y1] = point(angle, major ? 98 : 106), [x2, y2] = point(angle, 115);
          ticks += `<path class="instrument-tick" d="M${x1} ${y1}L${x2} ${y2}" stroke="#546d80" stroke-width="${major ? 2 : 1}"/>`;
          if (major) { const [x, y] = point(angle, 81); ticks += label(x, y + 4, Q.formatNumber(task.quantity, capacity * BigInt(i) / BigInt(divisions), task.sourceUnit), 11, 'middle', 'class="instrument-label"'); }
        }
        const angle = 135 + 270 * tick / divisions;
        const [x, y] = point(angle, 96);
        zoomView = `${Math.max(0, Math.min(160, x - 80))} ${Math.max(40, Math.min(155, y - 97.5))} 160 195`;
        const housing = task.quantity === 'mass' ? '<path d="M86 48h148l-17 24H103Z" fill="#d8e5ec" stroke="#91a9ba" stroke-width="2"/><rect x="91" y="336" width="138" height="14" rx="6" fill="#adc1d0"/>' : task.quantity === 'pressure' ? '<path d="M147 319v33h26v-33m-40 35h54" fill="#d8e5ec" stroke="#91a9ba" stroke-width="4"/>' : '<path d="M78 330h164" stroke="#b6c7d4" stroke-width="8" stroke-linecap="round"/>';
        content = `${housing}<circle cx="160" cy="193" r="132" fill="#e5edf3" stroke="#abc0cf" stroke-width="3"/><circle cx="160" cy="193" r="123" fill="#fff" stroke="#d6e2e9"/>${ticks}${label(160, 232, task.sourceUnit, 16, 'middle', 'font-weight="700"')}<path class="instrument-pointer" data-angle="${angle}" d="M160 193L${x} ${y}" stroke="var(--accent, #6b55cb)" stroke-width="4" stroke-linecap="round"/><circle cx="160" cy="193" r="8" fill="var(--accent, #6b55cb)"/><circle cx="160" cy="193" r="3" fill="#fff"/>${label(160, 374, names[task.quantity].toLocaleUpperCase('cs'), 11, 'middle', 'letter-spacing="2"')}`;
      }
    }
    return `<svg viewBox="0 0 320 390" data-zoom-view="${zoomView}" role="img" aria-label="${accessible}">${content}</svg>`;
  }
  root.Instruments = { render, names };
})(window);
