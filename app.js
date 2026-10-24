/* Rozhraní: kreslení a stav rozehrané hry. Matematika je ve volume.js. */
(() => {
  'use strict';
  const V = window.Volume;
  const Q = window.Quantities;
  const $ = id => document.getElementById(id);
  let level = 'easy', task, answered = false, correct = 0, attempts = 0, streak = 0, round = 0, limit = 10, bestStreak = 0;
  let mistakes = [], retryQueue = null;
  let selectedQuantities = ['volume'], nextQuantity = Q.createPicker(selectedQuantities);
  function quantityIcon(quantity) {
    const drawings = {
      area: '<rect x="10" y="10" width="44" height="44" rx="3"/><path d="M10 25h44M10 40h44M25 10v44M40 10v44"/>',
      current: '<circle cx="32" cy="32" r="23"/><path d="M21 43l11-24 11 24m-18-8h14M3 32h6m46 0h6"/>',
      voltage: '<circle cx="32" cy="32" r="23"/><path d="M21 21l11 24 11-24M3 32h6m46 0h6"/>',
      resistance: '<path d="M4 32h10m36 0h10"/><rect x="14" y="21" width="36" height="22" rx="2"/><path d="M23 21v22m18-22v22"/>',
      energy: '<path d="M37 6L14 36h16l-3 22 23-31H34Z"/>',
      power: '<circle cx="32" cy="32" r="25"/><path d="M15 23l7 20 10-16 10 16 7-20"/>',
      volume: '<path d="M32 8C27 18 16 30 16 41a16 16 0 0032 0C48 30 37 18 32 8Z"/><path d="M23 40a9 9 0 009 9"/>',
      length: '<rect x="8" y="20" width="48" height="25" rx="4"/><path d="M16 20v12m8-12v7m8-7v12m8-12v7m8-7v12"/>',
      mass: '<path d="M32 10v43M12 53h40M10 20h44M16 20L7 37h18ZM48 20l-9 17h18Z"/><circle cx="32" cy="15" r="4"/>',
      density: '<path d="M12 23l20-12 20 12v25L32 59 12 48Zm0 0l20 12 20-12M32 35v24"/><circle cx="22" cy="39" r="2"/><circle cx="22" cy="47" r="2"/><circle cx="41" cy="39" r="2"/><circle cx="45" cy="47" r="2"/>',
      time: '<circle cx="32" cy="34" r="23"/><path d="M32 19v16l11 6M26 5h12M32 5v6M48 14l4-4"/>',
      speed: '<path d="M9 48a26 26 0 1146 0Z"/><path d="M32 39l14-16M12 35h6m28 0h6M32 14v6M17 20l4 5"/><circle cx="32" cy="39" r="4"/>',
      pressure: '<circle cx="32" cy="27" r="20"/><path d="M25 46v11h14V46M32 27l9-10M18 27h4m20 0h4M32 12v5M10 57h44"/>'
    };
    return `<svg class="quantity-icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${drawings[quantity]}</svg>`;
  }
  const quantityOrder = ['length', 'area', 'volume', 'mass', 'density', 'time', 'speed', 'pressure', 'voltage', 'current', 'resistance', 'energy', 'power'];
  $('quantity-choices').innerHTML = quantityOrder.map(key => {
    const config = Q.QUANTITIES[key];
    return `<label class="quantity-choice" data-quantity="${key}"><input type="checkbox" name="quantity" value="${key}" ${key === 'volume' ? 'checked' : ''}><span class="quantity-choice-content">${quantityIcon(key)}<strong>${config.name}</strong><small>${Object.keys(config.units).join(' · ')}</small></span></label>`;
  }).join('');
  function updateHints(keys) {
    $('hint-relations').innerHTML = keys.map(key => `<div class="hint-group"><strong>${Q.QUANTITIES[key].name}</strong><div class="relations">${Q.QUANTITIES[key].hints.map(hint => `<span>${hint}</span>`).join('')}</div></div>`).join('');
  }
  const checkedQuantities = () => [...document.querySelectorAll('input[name="quantity"]:checked')].map(input => input.value);
  $('quantity-choices').addEventListener('change', () => { $('quantity-error').textContent = ''; updateHints(checkedQuantities()); });
  updateHints(selectedQuantities);
  const shapeNames = { bottle: 'Lahev', aquarium: 'Akvárium', pool: 'Bazén', barrel: 'Sud', flask: 'Baňka', watering: 'Konev' };
  function vessel(shape, index) {
    const [edge, light, dark] = [['#b5acef', '#ded9fc', '#9385d9'], ['#8accc0', '#d0eee7', '#57ad9c'], ['#8ebbe9', '#d4e6fa', '#6195d1'], ['#efbc82', '#fae5c9', '#d49c5c']][index];
    const drawings = {
      bottle: `<path d="M110 24h30v27q0 9 13 17q10 6 10 18v42q0 10-12 10H99q-12 0-12-10V86q0-12 10-18q13-8 13-17Z" fill="${light}"/><path d="M88 89h74v39q0 9-11 9H99q-11 0-11-9Z" fill="${edge}"/><rect x="107" y="16" width="36" height="13" rx="4" fill="${dark}"/><rect x="92" y="97" width="66" height="24" rx="4" fill="white" opacity=".75" stroke="none"/><path d="M103 68q-8 7-8 18" stroke="white" stroke-width="5"/>`,
      aquarium: `<path d="M38 51l35-23h139v84l-35 25H38Z" fill="${light}"/><path d="M38 75h139l35-23v60l-35 25H38Z" fill="${edge}" opacity=".65"/><path d="M177 51v86M38 51h139l35-23" fill="none"/><path d="M46 132q50-13 123 0" stroke="#c7b692" stroke-width="7"/><path d="M62 127q-14-27 2-38m0 38q14-16 7-29" fill="none" stroke="#49967b" stroke-width="4"/><path d="M104 96q12-17 29 0q-17 17-29 0l-11-8v16Z" fill="#f2b267" stroke="#d58b43"/><circle cx="126" cy="94" r="2" fill="#25304a" stroke="none"/><path d="M49 60v44" stroke="white" stroke-width="4"/><path d="M37 49h141l35-23M37 49l35-23h141" fill="none" stroke-width="5"/>`,
      pool: `<path d="M31 84l53-44h136v49l-53 44H31Z" fill="${edge}"/><path d="M31 84h136v49H31Z" fill="${light}"/><path d="M31 84l53-44h136l-53 44Z" fill="#bceef4" stroke-width="7"/><path d="M57 74h100m-85-11h100m-40 27v36m-48-36v36m-36-36v36" opacity=".5"/><path d="M185 66V35q0-12 10-12q9 0 9 10v16M172 77V46q0-12 10-12" fill="none" stroke="#718597" stroke-width="4"/><path d="M173 52l13-10m-13 22l13-10" stroke="#718597" stroke-width="3"/>`,
      barrel: `<path d="M85 32q-21 51 0 96q40 17 80 0q21-47 0-96Z" fill="${light}"/><ellipse cx="125" cy="32" rx="40" ry="11" fill="${edge}"/><path d="M85 49q40 15 80 0M80 108q45 18 90 0" fill="none" stroke-width="8"/><path d="M105 48q-8 37 0 76m40-76q8 37 0 76" fill="none" opacity=".5"/><ellipse cx="144" cy="31" rx="7" ry="3" fill="${dark}"/>`,
      flask: `<path d="M110 23v39l-35 59q-9 16 9 17h82q18-1 9-17l-35-59V23Z" fill="${light}"/><path d="M92 96h66l17 25q9 16-9 17H84q-18-1-9-17Z" fill="${edge}"/><path d="M106 23h38" stroke-width="6"/><path d="M104 86l-17 35" stroke="white" stroke-width="5"/><path d="M139 107h14m-19 11h19" fill="none"/><circle cx="121" cy="112" r="4" fill="white" stroke="none"/>`,
      watering: `<path d="M154 65q58-41 58 6q0 39-50 35" fill="none" stroke="${dark}" stroke-width="12"/><path d="M87 73L48 47l-8 11l45 62" fill="${edge}"/><path d="M85 62h80l7 64q-42 22-92 0Z" fill="${light}"/><ellipse cx="125" cy="62" rx="40" ry="12" fill="${edge}"/><ellipse cx="125" cy="61" rx="19" ry="5" fill="${dark}"/><path d="M98 80v34" stroke="white" stroke-width="5"/><path d="M37 42l-8 22l15 3l12-23Z" fill="${dark}"/>`
    };
    return `<svg viewBox="0 0 250 155" aria-hidden="true" focusable="false"><ellipse cx="128" cy="143" rx="82" ry="6" fill="${edge}" opacity=".13"/><g stroke="${dark}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">${drawings[shape]}</g></svg>`;
  }
  function renderCylinder() {
    const bottom = 330, height = 260;
    const waterY = bottom - Number(task.amount * 1000000n / task.capacity) / 1000000 * height;
    const expert = level === 'hard' || level === 'sigma';
    const accessibleReading = expert ? `Kapacita ${V.formatVolume(task.capacity, task.sourceUnit)}, ${task.divisions} stejných dílků, hladina na ${task.amount / task.step}. dílku od nuly.` : V.formatVolume(task.amount, task.sourceUnit);
    let ticks = '';
    for (let i = 0; i <= task.divisions; i++) {
      const y = bottom - i / task.divisions * height;
      const major = i % (task.divisions / 10) === 0;
      ticks += `<path d="M${major ? 100 : 108} ${y}H122" stroke="#456278" stroke-width="${major ? 1.6 : 1}"/>`;
      if (major) ticks += `<text x="87" y="${y + 4}" text-anchor="end" fill="#456278" font-size="12" font-weight="600">${V.formatNumber(task.step * BigInt(i), task.sourceUnit)}</text>`;
    }
    $('cylinder').innerHTML = `<svg viewBox="0 0 320 390" role="img" aria-label="Odměrný válec: ${accessibleReading}"><defs><linearGradient id="water" x1="0" x2="1"><stop stop-color="#4fbdce"/><stop offset="1" stop-color="#9ce4e5"/></linearGradient><linearGradient id="glass"><stop stop-color="#e4f0f4" stop-opacity=".6"/><stop offset=".5" stop-color="#fff" stop-opacity=".3"/><stop offset="1" stop-color="#dbeaf0" stop-opacity=".65"/></linearGradient><clipPath id="inside"><path d="M124 56H224V330Q174 350 124 330Z"/></clipPath></defs><ellipse cx="177" cy="365" rx="91" ry="10" fill="#dce5ee" opacity=".65"/><path d="M157 339v12l-40 10q-6 7 10 8h96q16-1 10-8l-40-10v-12" fill="#e9f1f5" stroke="#adc5d2" stroke-width="2"/><path d="M122 55v275q52 23 104 0V55" fill="url(#glass)" stroke="#adc5d2" stroke-width="2"/><g clip-path="url(#inside)"><path d="M124 ${waterY}H224V347H124Z" fill="url(#water)" opacity=".85"/><ellipse cx="174" cy="${waterY}" rx="50" ry="8" fill="#b1eded" stroke="#42b1c3" stroke-width="1.5"/><path d="M137 70V326" stroke="white" stroke-width="6" opacity=".65" stroke-linecap="round"/></g><ellipse cx="174" cy="55" rx="52" ry="9" fill="#f8fbfd" stroke="#adc5d2" stroke-width="2"/>${ticks}<text x="110" y="35" text-anchor="middle" font-size="13" font-weight="700" fill="#456278">${task.sourceUnit}</text><path d="M235 ${waterY}h16" stroke="#339aab" stroke-width="2"/><circle cx="251" cy="${waterY}" r="4" fill="#339aab"/></svg>`;
    // Stejný obrázek i stupnice, pouze užší výřez kolem hladiny.
    const svg = $('cylinder').querySelector('svg');
    svg.dataset.zoomView = `0 ${Math.max(40, Math.min(155, waterY - 97.5))} 160 195`;
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    marker.setAttribute('d', `M153 ${waterY}H130m5 -4l-5 4l5 4`);
    marker.setAttribute('class', 'zoom-marker');
    marker.setAttribute('fill', 'none');
    marker.setAttribute('stroke', '#237d8c');
    marker.setAttribute('stroke-width', '1.5');
    svg.append(marker);
    $('zoom-badge').textContent = 'Detail · ' + task.sourceUnit;
    setCylinderZoom(false);
    $('reading').hidden = expert;
    $('tick-note').hidden = expert;
    $('expert-note').hidden = !expert;
    $('amount').textContent = expert ? '' : V.formatVolume(task.amount, task.sourceUnit);
    $('tick-size').textContent = V.formatVolume(task.step, task.sourceUnit);
  }
  function setCylinderZoom(enabled) {
    const svg = $('cylinder').querySelector('svg');
    if (!svg) return;
    svg.setAttribute('viewBox', enabled ? svg.dataset.zoomView : '0 0 320 390');
    $('cylinder-toggle').classList.toggle('zoomed', enabled);
    $('cylinder-toggle').setAttribute('aria-pressed', String(enabled));
    $('cylinder-toggle').setAttribute('aria-label', enabled ? 'Zrušit zvětšení hladiny a stupnice' : 'Zvětšit hladinu a stupnici');
    $('zoom-badge').hidden = !enabled;
  }
  $('cylinder-toggle').addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') setCylinderZoom(true); });
  $('cylinder-toggle').addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') setCylinderZoom(false); });
  $('cylinder-toggle').addEventListener('click', () => setCylinderZoom($('cylinder-toggle').getAttribute('aria-pressed') !== 'true'));
  $('cylinder-toggle').addEventListener('blur', () => setCylinderZoom(false));
  document.addEventListener('pointerdown', event => { if (!$('cylinder-toggle').contains(event.target)) setCylinderZoom(false); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setCylinderZoom(false); });
  function setInstrumentZoom(enabled) {
    const svg = $('instrument').querySelector('svg');
    if (!svg) return;
    svg.setAttribute('viewBox', enabled ? svg.dataset.zoomView : '0 0 320 390');
    $('instrument-toggle').classList.toggle('zoomed', enabled);
    $('instrument-toggle').setAttribute('aria-pressed', String(enabled));
    $('instrument-toggle').setAttribute('aria-label', enabled ? 'Zrušit zvětšení přístroje' : 'Zvětšit detail přístroje');
    $('instrument-zoom-badge').hidden = !enabled;
  }
  $('instrument-toggle').addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') setInstrumentZoom(true); });
  $('instrument-toggle').addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') setInstrumentZoom(false); });
  $('instrument-toggle').addEventListener('click', () => setInstrumentZoom($('instrument-toggle').getAttribute('aria-pressed') !== 'true'));
  $('instrument-toggle').addEventListener('blur', () => setInstrumentZoom(false));
  document.addEventListener('pointerdown', event => { if (!$('instrument-toggle').contains(event.target)) setInstrumentZoom(false); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setInstrumentZoom(false); });
  function newTask() {
    task = retryQueue ? retryQueue[attempts] : Q.generateTask(nextQuantity(), level); answered = false; round = limit === null ? round + 1 : attempts + 1;
    $('round-number').textContent = 'ÚLOHA ' + String(round).padStart(2, '0') + (limit === null ? '' : ' / ' + limit);
    $('next').disabled = limit !== null;
    $('next').textContent = limit === null ? 'Nová úloha →' : 'Další příklad →';
    $('game').dataset.quantity = task.quantity;
    const isVolume = task.quantity === 'volume';
    const measured = !!task.instrument;
    const quantityName = Q.QUANTITIES[task.quantity].name;
    $('level-description').textContent = quantityName + ' · ' + Q.LEVELS[level].description;
    $('volume-reading').hidden = !isVolume;
    $('quantity-reading').hidden = isVolume || measured;
    $('instrument-reading').hidden = !measured;
    $('measure-title').textContent = isVolume ? 'Přečti hladinu' : measured ? 'Odečti přístroj' : 'Přečti zadání';
    $('source-value').textContent = '';
    if (isVolume) renderCylinder();
    else if (measured) {
      $('instrument').innerHTML = Instruments.render(task);
      setInstrumentZoom(false);
      $('instrument-note').textContent = task.instrument.kind === 'multimeter' ? 'Odečti displej i předponu jednotky. Výukový model používá také rozsahy mimo možnosti běžného multimetru.' : task.quantity === 'time' ? 'Na stopkách je uplynulý čas. Čti dny, hodiny, minuty a sekundy.' : task.quantity === 'length' ? 'Měření začíná na nule. Odečti konec barevného úseku.' : 'Odečti hodnotu na stupnici. Ručička ukazuje přesně na rysku.';
    }
    else {
      $('quantity-art').innerHTML = quantityIcon(task.quantity);
      $('quantity-name').textContent = quantityName;
      $('source-value').textContent = Q.formatValue(task, task.amount, task.sourceUnit);
    }
    updateHints([task.quantity]);
    const sigma = level === 'sigma';
    $('options').hidden = sigma;
    $('numeric-form').hidden = !sigma;
    $('illustration-note').hidden = sigma || !isVolume;
    $('selection-title').textContent = sigma ? 'Zapiš převedenou hodnotu' : isVolume ? 'Vyber stejný objem' : 'Vyber správný převod';
    $('selection-note').textContent = sigma ? (isVolume ? 'Odečti hladinu a převeď ji na jednotku u políčka.' : measured ? 'Odečti přístroj a převeď hodnotu na jednotku u políčka.' : 'Převeď zadanou hodnotu na jednotku u políčka.') : isVolume ? 'Jen jedna nádoba pojme přesně tolik vody.' : measured ? 'Odečti přístroj. Jen jedna odpověď má stejnou hodnotu.' : 'Jen jedna odpověď odpovídá zadané hodnotě.';
    $('numeric-label').textContent = isVolume ? 'Jaký objem ukazuje odměrka?' : measured ? 'Jakou hodnotu ukazuje přístroj?' : 'Jaká je převedená hodnota?';
    $('numeric-answer').value = '';
    $('numeric-answer').disabled = false;
    $('numeric-answer').removeAttribute('aria-invalid');
    $('numeric-error').textContent = '';
    $('check-answer').disabled = false;
    $('target-unit').textContent = task.targetUnit;
    $('numeric-answer').setAttribute('aria-label', quantityName + ' v jednotce ' + task.targetUnit);
    $('options').innerHTML = task.options.map((option, index) => `<button class="option color-${index}" data-index="${index}" aria-label="${String.fromCharCode(65 + index)}: ${isVolume ? shapeNames[option.shape] : quantityName}, ${Q.formatValue(task, option.volume, option.unit)}"><span class="option-top"><span class="option-letter">${String.fromCharCode(65 + index)}</span><span>${isVolume ? shapeNames[option.shape] : quantityName}</span><span class="option-result" aria-hidden="true"></span></span>${isVolume ? vessel(option.shape, index) : quantityIcon(task.quantity)}<strong class="option-value">${Q.formatValue(task, option.volume, option.unit)}</strong><span class="option-caption">${isVolume ? 'objem nádoby' : 'převedená hodnota'}</span></button>`).join('');
    $('feedback').className = 'feedback';
    $('feedback').textContent = sigma ? 'Napiš výsledek a potvrď ho klávesou Enter nebo tlačítkem.' : 'Porovnej hodnoty a klikni na svou odpověď.';
  }
  function answer(index, numericResult) {
    if (answered) return;
    answered = true; attempts++;
    const success = level === 'sigma' ? numericResult : Q.isCorrect(task, index);
    $('numeric-answer').disabled = true; $('check-answer').disabled = true;
    if (success) { correct++; streak++; } else { streak = 0; mistakes.push(task); }
    $('finish-practice').disabled = false;
    bestStreak = Math.max(bestStreak, streak);
    $('next').disabled = false;
    if (limit !== null && attempts === limit) { $('next').textContent = 'Zobrazit výsledek →'; }
    $('score').textContent = correct + ' / ' + attempts;
    $('streak').textContent = streak;
    const rightIndex = task.options.findIndex(option => option.volume === task.amount);
    document.querySelectorAll('.option').forEach((button, i) => {
      button.setAttribute('aria-disabled', 'true');
      if (i === rightIndex) { button.classList.add('correct'); button.querySelector('.option-result').textContent = '✓'; button.querySelector('.option-caption').textContent = 'správná odpověď'; }
      else if (i === index) { button.classList.add('incorrect'); button.querySelector('.option-result').textContent = '×'; button.querySelector('.option-caption').textContent = 'tvá odpověď'; }
      else button.classList.add('muted');
    });
    $('feedback').className = 'feedback ' + (success ? 'success' : 'error');
    const heading = success ? 'Přesně tak! Převod se povedl.' : level === 'sigma' ? 'Ještě to není ono. Správně je ' + Q.formatValue(task, task.amount, task.targetUnit) + '.' : 'Ještě to není ono. Správně je ' + String.fromCharCode(65 + rightIndex) + '.';
    $('feedback').replaceChildren();
    const symbol = document.createElement('span'); symbol.className = 'feedback-symbol'; symbol.textContent = success ? '✓' : '↔'; symbol.setAttribute('aria-hidden', 'true');
    const message = document.createElement('div');
    const title = document.createElement('strong'); title.textContent = heading;
    const detail = document.createElement('p'); detail.textContent = Q.explanation(task, index);
    message.append(title, detail); $('feedback').append(symbol, message);
  }
  function focusAnswer() {
    (level === 'sigma' ? $('numeric-answer') : $('options').querySelector('button')).focus({ preventScroll: true });
  }
  function showResults() {
    if (!attempts) return;
    const percent = Math.round(correct / attempts * 100);
    $('game').hidden = true; $('results').hidden = false;
    $('results-eyebrow').textContent = retryQueue ? 'OPAKOVÁNÍ DOKONČENO' : 'TRÉNINK DOKONČEN';
    $('results-title').textContent = correct === attempts ? 'Všechno správně!' : percent >= 80 ? 'Skvělá práce!' : percent >= 50 ? 'Dobrý základ. Pokračuj!' : 'První krok máš za sebou!';
    $('results-encouragement').textContent = correct === attempts ? 'Převody máš v malíku. Co zkusit další výzvu?' : 'Každý další pokus pomáhá. Vrať se k tomu, co ještě potřebuje procvičit.';
    $('result-percent').textContent = percent + ' %';
    $('result-ring').style.setProperty('--result-progress', percent + '%');
    $('results-level').textContent = Q.LEVELS[level].name + ' · ' + [...new Set((retryQueue || selectedQuantities).map(item => typeof item === 'string' ? item : item.quantity))].map(key => Q.QUANTITIES[key].name).join(', ');
    $('result-correct').textContent = correct + ' / ' + attempts;
    $('result-wrong').textContent = mistakes.length;
    $('result-streak').textContent = bestStreak;
    $('results-summary').textContent = `Správně ${correct} z ${attempts} příkladů (${percent} %). Nejdelší série: ${bestStreak}.`;
    $('retry-title').textContent = mistakes.length ? 'Dej chybám druhou šanci' : 'Tahle série je zvládnutá';
    $('retry-description').textContent = mistakes.length ? `Znovu dostaneš pouze příklady, ve kterých jsi chyboval/a. Počet: ${mistakes.length}. Nové kolo má vlastní skóre.` : 'Žádné chybné příklady k opakování. Můžeš si vybrat další hru.';
    $('retry-mistakes').hidden = mistakes.length === 0;
    $('results-title').focus();
  }
  function startSession(queue = null) {
    retryQueue = queue;
    if (!queue) nextQuantity = Q.createPicker(selectedQuantities);
    mistakes = [];
    if (queue) limit = queue.length;
    correct = 0; attempts = 0; streak = 0; round = 0; bestStreak = 0;
    $('score').textContent = '0 / 0'; $('streak').textContent = '0';
    $('active-level').textContent = 'Obtížnost: ' + V.LEVELS[level].name;
    $('mode-status').textContent = queue ? `Opakování chybných příkladů · počet: ${limit}` : limit === null ? 'Nekonečné procvičování · můžeš přeskakovat úlohy' : `Série ${limit} příkladů · každý příklad zodpověz`;
    $('finish-practice').hidden = limit !== null;
    $('finish-practice').disabled = true;
    $('welcome').hidden = true; $('results').hidden = true; $('game').hidden = false;
    newTask(); focusAnswer();
  }
  $('retry-mistakes').addEventListener('click', () => { if (!$('results').hidden && mistakes.length) startSession(mistakes.slice()); });
  $('finish-practice').addEventListener('click', () => { if (limit === null) showResults(); });
  $('numeric-form').addEventListener('submit', event => {
    event.preventDefault();
    if (answered || level !== 'sigma') return;
    const result = Q.checkNumericAnswer(task, $('numeric-answer').value);
    if (!result.valid) {
      $('numeric-error').textContent = 'Zadej nezáporné číslo bez jednotky, například 0,6.';
      $('numeric-answer').setAttribute('aria-invalid', 'true'); $('numeric-answer').focus(); return;
    }
    $('numeric-error').textContent = ''; $('numeric-answer').removeAttribute('aria-invalid');
    answer(null, result.correct);
  });
  $('numeric-answer').addEventListener('input', () => { $('numeric-error').textContent = ''; $('numeric-answer').removeAttribute('aria-invalid'); });
  $('options').addEventListener('click', event => { const button = event.target.closest('button[data-index]'); if (button) answer(Number(button.dataset.index)); });
  $('next').addEventListener('click', () => {
    if (limit !== null && !answered) return;
    if (limit !== null && attempts >= limit) {
      showResults();
      return;
    }
    newTask(); focusAnswer();
  });
  document.querySelectorAll('input[name="level"]').forEach(input => input.addEventListener('change', () => { $('setup-level-description').textContent = Q.LEVELS[input.value].description; }));
  $('hint-toggle').addEventListener('click', () => { const open = $('hint').hidden; $('hint').hidden = !open; $('hint-toggle').setAttribute('aria-expanded', String(open)); });
  function menu() {
    $('game').hidden = true; $('results').hidden = true; $('welcome').hidden = false;
    updateHints(checkedQuantities());
    $('welcome-title').focus();
  }
  $('back-menu').addEventListener('click', menu);
  $('play-again').addEventListener('click', menu);
  document.querySelector('.brand').addEventListener('click', event => { event.preventDefault(); menu(); });
  document.querySelectorAll('input[name="mode"]').forEach(input => input.addEventListener('change', () => {
    const custom = input.value === 'custom';
    $('custom-count-field').hidden = !custom; $('custom-count').disabled = !custom;
  }));
  $('custom-count').addEventListener('input', () => $('custom-count').setCustomValidity(''));
  $('start-form').addEventListener('submit', event => {
    event.preventDefault();
    const chosen = checkedQuantities();
    if (!chosen.length) {
      $('quantity-error').textContent = 'Vyber alespoň jednu veličinu.';
      document.querySelector('input[name="quantity"]').focus(); return;
    }
    const mode = document.querySelector('input[name="mode"]:checked').value;
    const count = Number($('custom-count').value);
    if (mode === 'custom' && (!Number.isSafeInteger(count) || count < 1)) {
      $('custom-count').setCustomValidity('Zadej kladný celý počet příkladů.'); $('custom-count').reportValidity(); return;
    }
    limit = mode === 'infinite' ? null : mode === 'ten' ? 10 : count;
    level = document.querySelector('input[name="level"]:checked').value;
    selectedQuantities = chosen;
    startSession();
  });
})();
