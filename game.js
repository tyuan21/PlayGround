(() => {
  'use strict';
  const TOTAL_MILES = 3056;
  const PEOPLE = [
    { id: 'mara', name: 'Mara', role: 'Mechanic', skill: 'mechanic', icon: 'M', bio: 'Keeps the wheels turning' },
    { id: 'eli', name: 'Eli', role: 'Medic', skill: 'medic', icon: 'E', bio: 'First aid & steady hands' },
    { id: 'june', name: 'June', role: 'Scout', skill: 'scout', icon: 'J', bio: 'Finds the back roads' },
    { id: 'sol', name: 'Sol', role: 'Cook', skill: 'cook', icon: 'S', bio: 'Makes a meal from anything' },
    { id: 'frankie', name: 'Frankie', role: 'Talker', skill: 'talker', icon: 'F', bio: 'Can charm a locked door' }
  ];
  const INITIAL_RESOURCES = { fuel: 78, food: 82, water: 78, van: 88, morale: 76, cash: 64, medicine: 3, parts: 2 };
  const resourceMeta = {
    fuel: { name: 'GASOLINE', icon: '◉', max: 100 }, food: { name: 'FOOD', icon: '◇', max: 100 },
    water: { name: 'WATER', icon: '⌁', max: 100 }, van: { name: 'VAN CONDITION', icon: '⚙', max: 100 },
    morale: { name: 'MORALE', icon: '✳', max: 100 }, cash: { name: 'CASH', icon: '$', max: 100 }
  };
  const stops = [
    { mile: 0, name: 'SAN FRANCISCO' }, { mile: 218, name: 'SIERRA NEVADA' }, { mile: 548, name: 'NEVADA' },
    { mile: 876, name: 'UTAH' }, { mile: 1205, name: 'COLORADO' }, { mile: 1534, name: 'KANSAS' },
    { mile: 1863, name: 'MISSOURI' }, { mile: 2192, name: 'ILLINOIS' }, { mile: 2521, name: 'PENNSYLVANIA' }, { mile: 2850, name: 'APPALACHIANS' }, { mile: 3056, name: 'ATLANTIC CITY' }
  ];
  const events = [
    { place: 'SIERRA NEVADA', title: 'The pass is closed.', copy: 'A rockslide has buried the highway. The line of cars ahead disappears into a wall of dust. A ranger points toward a narrow service road.', note: 'The van has a worrying new rattle.', choices: [
      { icon: '⚒', title: 'Take the rough service road', sub: 'Let Mara guide the van through.', skill: 'mechanic', deltas: { van: -8, fuel: -5, morale: -2 }, success: 'Mara finds the cleanest line through the rubble. The van shudders, but holds together.', fail: 'The rocks win. A hard knock underneath costs you a part and precious daylight.', failDeltas: { van: -13, parts: -1, morale: -4 } },
      { icon: '⌁', title: 'Wait for the highway to clear', sub: 'Safe enough, but it burns daylight.', deltas: { food: -7, water: -6, morale: -4 }, success: 'By late afternoon the graders break through. The road is rough, but passable.', fail: 'The wait drags on. A long day in the dust makes everyone short-tempered.' },
      { icon: '↗', title: 'Follow a local’s shortcut', sub: 'A little faith, a lot of dirt.', skill: 'scout', deltas: { fuel: -4, van: -5, cash: -6 }, success: 'June spots the right fork. You slip past the jam and rejoin the road ahead.', fail: 'The shortcut loops back to the same road. You pay for the tip and lose some fuel.', failDeltas: { fuel: -7, cash: -8, morale: -3 } }
    ] },
    { place: 'NEVADA', title: 'A town with one pump.', copy: 'The gas station has a hand-lettered sign: CASH ONLY. The next one is a long, empty stretch away.', note: 'Someone at the counter says the pump is temperamental.', choices: [
      { icon: '$', title: 'Fill the tank while you can', sub: 'Spend $24 · gain fuel, food, and clean water.', deltas: { cash: -24, fuel: 30, food: 12, water: 12, morale: 2 }, success: 'The pump coughs, then runs. You stock up on fuel and supplies before the long empty stretch.', fail: 'The old pump sputters out early. At least you get some fuel and a few provisions.', failDeltas: { cash: -14, fuel: 16, food: 6, water: 6 } },
      { icon: '⚒', title: 'Mara coaxes the pump to work', sub: 'Try a repair before paying.', skill: 'mechanic', deltas: { parts: -1, fuel: 29, food: 8, water: 8, cash: -12 }, success: 'A loose belt was all it took. Mara gets the pump running, and the owner gives you a break.', fail: 'The pump’s innards are beyond saving. You pay for a small amount and move on.', failDeltas: { fuel: 10, food: 4, water: 4, cash: -12 } },
      { icon: '→', title: 'Keep driving', sub: 'Save the cash. Hope the gauge is wrong.', deltas: { morale: -4 }, success: 'You roll out of town with the needle hovering over empty.', fail: 'Everyone watches the fuel gauge in silence.' }
    ] },
    { place: 'UTAH', title: 'The river’s up.', copy: 'The bridge is gone. A rough crossing is possible, but the current is fast and the far bank is steep.', note: 'The afternoon sky is turning the color of a bruise.', choices: [
      { icon: '⌁', title: 'Cross at the shallow bend', sub: 'June scouts a safe route and fills the water jugs.', skill: 'scout', deltas: { water: -2, time: -1 }, success: 'June finds a shallow shelf. You refill the jugs, and the van climbs out intact.', successDeltas: { water: 12 }, fail: 'A hidden rut catches a wheel. You lose a part pulling free.', failDeltas: { van: -12, parts: -1, morale: -4 } },
      { icon: '⚒', title: 'Reinforce the van and ford it', sub: 'Use a spare part and take it slowly.', skill: 'mechanic', deltas: { parts: -1, van: -3, morale: 1 }, success: 'Mara checks every seal twice. The engine never takes a drop.', fail: 'Water sloshes into the engine bay. It coughs back to life, but not happily.', failDeltas: { van: -16, fuel: -7, morale: -5 } },
      { icon: '⌛', title: 'Make camp and wait it out', sub: 'Spend supplies, avoid the risk.', deltas: { food: -8, water: -7, morale: -2 }, success: 'Morning brings a gentler current. The crossing is still cold, but manageable.', fail: 'A night of rain turns the bank into mud. Everyone wakes damp and grumpy.' }
    ] },
    { place: 'COLORADO', title: 'A bad night’s cough.', copy: 'Eli has been listening to Sam’s chest for an hour. It could be the altitude. It could be something worse.', note: 'The clinic in the next town closes at five.', choices: [
      { icon: '✚', title: 'Use the medicine kit', sub: 'Let Eli make the call.', skill: 'medic', deltas: { medicine: -1, morale: 2 }, success: 'Eli catches it early. Rest and the right dose bring the fever down.', fail: 'The medicine helps, but the cough hangs on. A little more rest is needed.', failDeltas: { food: -4, morale: -3 } },
      { icon: '→', title: 'Push on to the clinic', sub: 'Pay for care when you arrive.', deltas: { cash: -20, fuel: -4 }, success: 'The doctor says it’s treatable. Everyone breathes easier on the drive out.', fail: 'The clinic is closed. You pay for supplies and try to keep the fever down.', failDeltas: { cash: -10, morale: -5 } },
      { icon: '☼', title: 'Stop and let them sleep', sub: 'Take a day. Spend food and water.', deltas: { food: -10, water: -9, morale: 3 }, success: 'A full night’s sleep works wonders. The color comes back to Sam’s face.', fail: 'Sleep helps, but the altitude keeps the cough close.' }
    ] },
    { place: 'KANSAS', title: 'The sky goes green.', copy: 'A wall of storm clouds rolls over the plains. A farmhouse light blinks from the horizon; the next town is still miles away.', note: 'The van’s tires are bald on the inside edge.', choices: [
      { icon: '⌂', title: 'Ask to shelter in the barn', sub: 'Frankie makes the introduction.', skill: 'talker', deltas: { food: -3, morale: 5 }, success: 'The farmer opens the barn and shares hot coffee. For one evening, you feel like guests.', successDeltas: { food: 8, water: 8 }, fail: 'The farmer says no, but points to a culvert that may keep the worst of the wind off.', failDeltas: { food: -2, water: -2, morale: -2 } },
      { icon: '⚒', title: 'Brace the van and ride it out', sub: 'Mara checks the tires and tie-downs.', skill: 'mechanic', deltas: { parts: -1, van: -4, food: -6 }, success: 'Mara gets the van anchored before the first hail. You sleep fitfully, but safely.', fail: 'The wind shifts. Hail dents a panel and cracks a mirror.', failDeltas: { van: -12, morale: -5 } },
      { icon: '→', title: 'Drive for the town', sub: 'Fast is the only way through.', deltas: { fuel: -9, van: -7, morale: -5 }, success: 'You make it under the diner awning just as the first hail falls.', fail: 'Visibility vanishes. A roadside ditch gives the van an ugly scrape.', failDeltas: { van: -15, parts: -1 } }
    ] },
    { place: 'MISSOURI', title: 'The last bridge is toll-only.', copy: 'A small crowd is arguing at the barrier. The old bridge is closed to traffic without a local pass. A ferry runs further downstream.', note: 'You can see the other side. You just can’t get there.', choices: [
      { icon: '$', title: 'Pay the toll collector', sub: 'It’s $18 for the van and everyone in it.', deltas: { cash: -18 }, success: 'The barrier lifts. The bridge groans as the van rolls across.', fail: 'The collector adds a surprise fee. You pay it, but the delay costs you daylight.', failDeltas: { cash: -8, morale: -2 } },
      { icon: '✳', title: 'Talk your way through', sub: 'Frankie makes a case for the crew.', skill: 'talker', deltas: { morale: 2 }, success: 'Frankie tells the story of your trip. The collector waves you through with a grin.', fail: 'The collector likes the story, but the rules are the rules. You pay a reduced toll.', failDeltas: { cash: -10 } },
      { icon: '⌁', title: 'Take the ferry downstream', sub: 'A longer way around, but no bridge.', deltas: { fuel: -8, food: -4, morale: -2 }, success: 'The ferry is slow and noisy. The far bank is solid ground.', fail: 'A long queue at the landing leaves everyone hungry and a little carsick.', failDeltas: { water: -5, morale: -4 } }
    ] },
    { place: 'ILLINOIS', title: 'A deal in the parking lot.', copy: 'A traveler with a busted radiator offers you a box of canned food and water for a spare part. You’re not sure the cans are worth it.', note: 'The roadside diner smells better than the van.', choices: [
      { icon: '◇', title: 'Trade a part for supplies', sub: 'Get food and water. Lose 1 spare part.', deltas: { parts: -1, food: 14, water: 12, morale: 2 }, success: 'The cans are dented, not spoiled. A fair trade, and a good dinner.', fail: 'Half the cans are rusted through. The rest will do.', failDeltas: { food: 7, water: 6, morale: -1 } },
      { icon: '$', title: 'Buy dinner at the diner', sub: 'Spend $16 · gain 15 morale.', deltas: { cash: -16, morale: 15, food: -2 }, success: 'Greasy fries, pie, and clean plates. For an hour, the road can wait.', fail: 'The diner is pricier than it looked. The pie is still excellent.', failDeltas: { cash: -6, morale: 8 } },
      { icon: '✳', title: 'Ask the traveler for a story instead', sub: 'Let Sol stretch what you have.', skill: 'cook', deltas: { food: -4, morale: 8 }, success: 'Sol turns a few scraps into a meal worth sharing. The traveler tells you a better route east.', fail: 'A simple meal, but a good conversation. The road feels less lonely.' }
    ] },
    { place: 'PENNSYLVANIA', title: 'The van won’t start.', copy: 'It clicks once, then goes quiet. The sun is setting and the nearest garage is a long walk away.', note: 'Mara has been keeping an eye on that starter.', choices: [
      { icon: '⚒', title: 'Mara fixes the starter', sub: 'Use a part and give her time.', skill: 'mechanic', deltas: { parts: -1, morale: 2 }, success: 'A stripped connection was all it was. The engine turns over on the first try.', fail: 'The starter is worse than Mara thought. She gets it working—barely.', failDeltas: { parts: -1, van: -12, morale: -4 } },
      { icon: '$', title: 'Call a tow truck', sub: 'Spend $28 and keep the van safe.', deltas: { cash: -28, van: 2, morale: -1 }, success: 'The tow truck arrives before dark. The mechanic gets you rolling again.', fail: 'It takes all night and most of your cash. At least you’re back on the road.', failDeltas: { cash: -12, food: -5, morale: -5 } },
      { icon: '→', title: 'Try the hill-start trick', sub: 'A risky push and a prayer.', deltas: { van: -5, morale: 1 }, success: 'The van catches halfway down the slope. Everybody cheers like it’s a miracle.', fail: 'The engine catches, then dies. The battery is more drained than before.', failDeltas: { van: -9, fuel: -3, morale: -4 } }
    ] },
    { place: 'APPALACHIANS', title: 'One last mountain.', copy: 'The old road climbs into fog. Your map marks a tunnel, but a handwritten note says it’s been closed for repairs.', note: 'Atlantic City is closer than it has ever been.', choices: [
      { icon: '↗', title: 'Find a route around the closure', sub: 'June reads the old map.', skill: 'scout', deltas: { fuel: -7, food: -4, van: -3 }, success: 'June finds a passable county road. The view from the summit is worth the detour.', fail: 'The road dead-ends at a washed-out culvert. You backtrack, low on fuel.', failDeltas: { fuel: -12, van: -6, morale: -4 } },
      { icon: '⚒', title: 'Take the steep service track', sub: 'Mara checks the brakes first.', skill: 'mechanic', deltas: { parts: -1, van: -7, fuel: -4 }, success: 'The brakes hold, the engine holds, and then the trees open up below you.', fail: 'The van overheats on the climb. You stop to cool it down and sacrifice a part.', failDeltas: { van: -16, parts: -1, morale: -5 } },
      { icon: '⌛', title: 'Push through the fog', sub: 'No supplies required; the van takes the risk.', deltas: {}, success: 'You inch through the fog at walking pace. The road opens up below the summit.', successDeltas: { van: -4, morale: -3 }, fail: 'Visibility vanishes. You crawl forward, scraping the van against the rock wall.', failDeltas: { van: -12, morale: -8 } }
    ] }
  ];
  const el = (id) => document.getElementById(id);
  let state = null;
  let toastTimer;
  let soundOn = false;
  function freshState(crew, pace) { return { crew, pace, resources: { ...INITIAL_RESOURCES }, mile: 0, day: 1, eventIndex: -1, currentEvent: null, stage: 'setup', alive: crew.slice(), log: [], seed: Math.floor(Math.random() * 999999), hasResult: false }; }
  function clampResources() { Object.keys(resourceMeta).forEach(k => { state.resources[k] = Math.max(0, Math.min(resourceMeta[k].max, Math.round(state.resources[k]))); }); state.resources.medicine = Math.max(0, Math.min(5, Math.round(state.resources.medicine))); state.resources.parts = Math.max(0, Math.min(5, Math.round(state.resources.parts))); }
  function roll() { state.seed = (state.seed * 9301 + 49297) % 233280; return state.seed / 233280; }
  function crewHas(skill) { return state.alive.some(id => PEOPLE.find(p => p.id === id)?.skill === skill); }
  function save() { try { localStorage.setItem('longWayHomeSave', JSON.stringify(state)); } catch (_) {} }
  function load() { try { const s = JSON.parse(localStorage.getItem('longWayHomeSave')); if (s && s.resources && Array.isArray(s.crew) && s.stage !== 'setup') { state = s; return true; } } catch (_) {} return false; }
  function renderCrew() {
    const list = el('crew-list'); list.innerHTML = '';
    const crew = state ? state.crew : PEOPLE.slice(0, 4).map(p => p.id);
    const alive = state ? state.alive : crew;
    crew.forEach(id => { const p = PEOPLE.find(x => x.id === id); if (!p) return; const div = document.createElement('div'); div.className = 'crew-chip' + (alive.includes(id) ? '' : ' lost'); div.innerHTML = `<span class="avatar">${p.icon}</span><span><b>${p.name}</b><small>${alive.includes(id) ? p.role : 'Lost on the road'}</small></span>`; list.appendChild(div); });
    el('crew-count').textContent = `${alive.length} RIDING`;
  }
  function renderResources() {
    const grid = el('resource-grid'); grid.innerHTML = '';
    Object.entries(resourceMeta).forEach(([key, meta]) => { const val = state ? state.resources[key] : INITIAL_RESOURCES[key]; const pct = Math.max(0, Math.min(100, val / meta.max * 100)); const mood = pct < 20 ? 'danger' : pct < 40 ? 'warn' : ''; const r = document.createElement('div'); r.className = 'resource'; r.innerHTML = `<div class="resource-top"><span class="resource-name"><span class="resource-icon">${meta.icon}</span>${meta.name}</span><span class="resource-value">${key === 'cash' ? '$' : ''}${val}${key === 'cash' ? '' : '%'}</span></div><div class="resource-bar"><div class="resource-fill ${mood}" style="width:${pct}%"></div></div>`; grid.appendChild(r); });
    el('inventory-extra').innerHTML = `<b>Spare parts</b> ${state ? state.resources.parts : INITIAL_RESOURCES.parts} &nbsp;·&nbsp; <b>Medicine</b> ${state ? state.resources.medicine : INITIAL_RESOURCES.medicine}<br>One part can turn a breakdown into a bad afternoon. One medicine can make a bad fever survivable.`;
  }
  function renderRoute() {
    const list = el('route-stops'); list.innerHTML = ''; const progress = state ? state.mile / TOTAL_MILES : 0;
    stops.forEach((s, i) => { const d = document.createElement('span'); d.className = 'route-dot' + (s.mile < (state?.mile || 0) ? ' passed' : '') + (i === 0 && !state ? ' current' : ''); if (state && s.mile <= state.mile && s.mile === stops.reduce((a, x) => x.mile <= state.mile ? x.mile : a, 0)) d.classList.add('current'); list.appendChild(d); });
    el('route-progress').style.width = `${Math.max(0, Math.min(100, progress * 100))}%`; el('route-van').style.left = `${Math.max(0, Math.min(100, progress * 100))}%`; el('mile-count').textContent = (state?.mile || 0).toLocaleString();
  }
  function updateTop() { el('chapter-tag').innerHTML = `DAY ${String(state?.day || 1).padStart(2, '0')} <i>·</i> ${state?.mile >= TOTAL_MILES ? 'THE ARRIVAL' : state?.stage === 'setup' ? 'THE DEPARTURE' : state?.stage === 'ended' ? 'THE ROAD ENDS' : (state?.currentEvent?.place || 'ON THE ROAD')}`; el('restart-btn').hidden = !(state && state.stage !== 'setup'); }
  function render() { if (!state) return; renderCrew(); renderResources(); renderRoute(); updateTop(); el('supplies').classList.remove('hidden'); if (state.stage === 'event') showEvent(); else if (state.stage === 'result') showResult(); else if (state.stage === 'ended') showEnd(); save(); }
  function startSetup() {
    el('page-title').innerHTML = 'The long<br /><em>way home.</em>'; el('page-intro').textContent = 'One van. Five friends. Three thousand miles between here and somewhere new.';
    const checked = PEOPLE.slice(0, 4).map(x => x.id);
    el('side-content').innerHTML = `<div class="setup-card"><div class="event-kicker">EVERY MILE IS EARNED</div><h2>Pick your people.</h2><p class="setup-description">Four seats, five friends. Leave one behind. Each skill can change what happens out there.</p><span class="field-label">CHOOSE 4 FOR THE VAN</span><div class="crew-select">${PEOPLE.map(p => `<div class="person-option"><input type="checkbox" id="pick-${p.id}" value="${p.id}" ${checked.includes(p.id) ? 'checked' : ''}><label for="pick-${p.id}"><b>${p.name} · ${p.role}</b><small>${p.bio}</small></label></div>`).join('')}</div><span class="field-label">PICK YOUR PACE</span><div class="pace-options"><div class="pace-option"><input type="radio" name="pace" id="pace-steady" value="steady" checked><label for="pace-steady">STEADY<small>less wear</small></label></div><div class="pace-option"><input type="radio" name="pace" id="pace-fast" value="fast"><label for="pace-fast">PUSH IT<small>more miles, more risk</small></label></div></div><button class="primary-button" id="depart-button">LOAD UP & LEAVE <span style="float:right">→</span></button></div>`;
    el('depart-button').addEventListener('click', depart); el('restart-btn').hidden = true; el('chapter-tag').innerHTML = 'DAY 01 <i>·</i> THE DEPARTURE'; el('inventory-extra').hidden = true; el('supplies').classList.remove('hidden'); renderResources(); renderRoute(); renderCrew();
  }
  function depart() {
    const selected = [...document.querySelectorAll('.person-option input:checked')].map(x => x.value);
    if (selected.length !== 4) { toast('Four friends. No more, no less.'); return; }
    const pace = document.querySelector('input[name="pace"]:checked')?.value || 'steady'; state = freshState(selected, pace); state.stage = 'event'; state.currentEvent = { place: 'THE OPEN ROAD', title: 'The coast is in the rearview.', copy: 'The city thins behind you. Four friends, one rattling van, and a map with a lot of blank space. The Sierra pass is your first real test.', note: 'You have enough to get started. Not enough to make mistakes forever.', choices: [
      { icon: '⌁', title: 'Take the coastal highway', sub: 'Longer, but gentler on the van.', deltas: { fuel: -5, food: -4, water: -4, morale: 4 }, success: 'The ocean stays beside you for an hour. Then the road turns inland.', fail: 'Traffic crawls along the coast. At least the view is good.', failDeltas: { fuel: -2, food: -3, morale: -1 } },
      { icon: '↗', title: 'Cut inland before the traffic', sub: 'June can find a quieter route.', skill: 'scout', deltas: { fuel: -3, food: -5, water: -4, van: -3, morale: 2 }, success: 'June finds a two-lane road through the hills. The city vanishes behind you.', fail: 'The back road is slow going. You make it out before dark.', failDeltas: { fuel: -6, van: -4, morale: -2 } },
      { icon: '✳', title: 'Say goodbye properly', sub: 'One last meal together in the city.', deltas: { cash: -10, food: -3, morale: 12 }, success: 'You split a last meal and make one promise: nobody gets left behind.', fail: 'The goodbyes take longer than expected. The road will still be there tomorrow.', failDeltas: { food: -4, morale: 4 } }
    ] }; state.hasResult = false; el('page-title').innerHTML = 'The road<br /><em>is calling.</em>'; el('page-intro').textContent = 'Pick the way you face it. The miles will take what they take.'; el('eyebrow-text').textContent = 'DAY ONE · MILE ZERO'; el('journey-stamp').innerHTML = '<span>DAY</span><strong>01</strong><small>LET’S GO</small>'; el('scene-kicker').textContent = 'THE CITY IN THE REARVIEW'; render(); }
  function tripToNext() {
    if (!state || state.stage === 'ended') return;
    if (state.mile >= TOTAL_MILES) { win(); return; }
    const nextIndex = state.eventIndex + 1; if (nextIndex >= events.length) { state.mile = TOTAL_MILES; win(); return; }
    const nextMile = stops[nextIndex + 1]?.mile || TOTAL_MILES; const distance = nextMile - state.mile; const paceMult = state.pace === 'fast' ? 1.3 : 1;
    state.day += Math.max(1, Math.round(distance / 175)); state.mile = nextMile;
    state.resources.fuel -= Math.ceil(distance / 38 * paceMult); state.resources.food -= Math.ceil(distance / 70 * 2.8); state.resources.water -= Math.ceil(distance / 70 * 2.8); state.resources.van -= Math.ceil(distance / 100 * (state.pace === 'fast' ? 1.5 : 1)); state.resources.morale -= state.pace === 'fast' ? 6 : 3;
    if (state.alive.length > 4) state.resources.food -= 2;
    const shortage = [];
    if (state.resources.food <= 0) { state.resources.morale -= 7; if (roll() < .18) shortage.push('food'); }
    if (state.resources.water <= 0) { state.resources.morale -= 9; if (roll() < .22) shortage.push('water'); }
    if (state.resources.fuel <= 0) { state.resources.mile = Math.max(0, state.mile - 70); state.resources.morale -= 8; state.resources.cash -= 8; toast('You ran out of gas. A costly tow gets you moving.'); }
    if (state.resources.van <= 0) { state.resources.van = 4; state.resources.parts -= 1; state.resources.cash -= 10; toast('A roadside fix costs you a spare part and $10.'); }
    if (shortage.length) { const id = state.alive[Math.floor(roll() * state.alive.length)]; state.alive = state.alive.filter(x => x !== id); toast(`${PEOPLE.find(p => p.id === id)?.name} got too sick to continue.`); }
    state.eventIndex = nextIndex; state.currentEvent = events[nextIndex]; state.stage = 'event'; state.hasResult = false;
    el('scene-kicker').textContent = state.currentEvent.place + ' · MILE ' + state.mile; el('scene-label').innerHTML = `<rect x="29" y="27" width="230" height="29" rx="3" fill="#fbf2df" opacity=".93"/><text x="43" y="46" fill="#594f3e" font-family="Space Grotesk, sans-serif" font-size="11" font-weight="700" letter-spacing="2">${state.currentEvent.place} · MILE ${state.mile}</text>`;
    clampResources(); checkFailure(); render();
  }
  function canAffordChoice(choice) {
    return Object.entries(choice.deltas || {}).every(([key, value]) => value >= 0 || state.resources[key] === undefined || state.resources[key] >= Math.abs(value));
  }
  function renderChoices() {
    const event = state.currentEvent; return `<div class="choice-list">${event.choices.map((c, i) => { const affordable = canAffordChoice(c); return `<button class="choice-button" data-choice="${i}" ${affordable ? '' : 'disabled'}><span class="choice-icon">${c.icon}</span><span><b>${c.title}${c.skill && crewHas(c.skill) ? ' <span style="color:var(--green);font-size:9px">✦ SKILL</span>' : ''}</b><small>${affordable ? c.sub : 'Not enough supplies for this option.'}</small></span><span class="choice-arrow">${affordable ? '→' : '×'}</span></button>`; }).join('')}</div>`;
  }
  function showEvent() {
    const ev = state.currentEvent; el('side-content').innerHTML = `<div class="event-kicker">${state.stage === 'event' && state.eventIndex < 0 ? 'THE FIRST MILES' : `MILE ${state.mile} · ${ev.place}`}</div><h2>${ev.title}</h2><p class="event-copy">${ev.copy}</p><div class="event-note">“${ev.note}”</div>${renderChoices()}`;
    document.querySelectorAll('[data-choice]').forEach(btn => btn.addEventListener('click', () => makeChoice(Number(btn.dataset.choice))));
  }
  function applyDeltas(deltas) { if (!deltas) return; for (const [k,v] of Object.entries(deltas)) { if (state.resources[k] !== undefined) state.resources[k] += v; } clampResources(); }
  function makeChoice(i) {
    const c = state.currentEvent.choices[i]; if (!c || !canAffordChoice(c)) return;
    let success = roll() < .7;
    if (c.skill && crewHas(c.skill)) success = roll() < .88;
    applyDeltas(c.deltas);
    if (success) applyDeltas(c.successDeltas); else applyDeltas(c.failDeltas);
    const outcomeDeltas = { ...c.deltas, ...(success ? c.successDeltas : c.failDeltas) };
    const story = success ? c.success : c.fail; state.stage = 'result'; state.hasResult = true; state.lastResult = { success, story, title: success ? 'A little luck.' : 'It could’ve been worse.', changes: outcomeDeltas };
    state.log.push({ day: state.day, event: state.currentEvent.title, success }); checkFailure(); render(); playTone(success ? 660 : 240);
  }
  function formatChanges(changes) {
    const labels = { fuel: 'fuel', food: 'food', water: 'water', van: 'van', morale: 'morale', cash: 'cash', medicine: 'medicine', parts: 'parts' };
    return Object.entries(changes || {}).filter(([,v]) => v).map(([k,v]) => `<span class="change-chip ${v < 0 ? 'bad' : ''}">${v > 0 ? '+' : ''}${k === 'cash' && v > 0 ? '$' : ''}${v}${k === 'cash' && v < 0 ? ' cash' : ` ${labels[k] || k}`}</span>`).join('');
  }
  function showResult() {
    const r = state.lastResult; const ev = state.currentEvent;
    el('side-content').innerHTML = `<div class="event-kicker">${r.success ? 'A SMALL WIN' : 'THE ROAD TAKES ITS CUT'}</div><h2>${ev.title}</h2><p class="event-copy">${ev.copy}</p><div class="event-result"><div class="result-top">${r.success ? '✳ GOOD CALL' : '⚠ NOT HOW YOU HOPED'}</div><h3>${r.title}</h3><p>${r.story}</p><div class="change-chips">${formatChanges(r.changes)}</div></div><button class="continue-button" id="continue-button">${state.mile >= TOTAL_MILES ? 'SEE WHAT’S LEFT' : 'KEEP THE VAN MOVING'} <span>→</span></button>`;
    el('continue-button').addEventListener('click', tripToNext);
  }
  function checkFailure() {
    if (!state || state.stage === 'ended') return;
    let reason = '';
    if (!state.alive.length) reason = 'There is nobody left to keep going.';
    else if (state.resources.morale <= 0) reason = 'The crew has nothing left to give.';
    else if (state.resources.food <= 0 && state.resources.water <= 0) reason = 'There is no food or water left.';
    else if (state.resources.van <= 0) reason = 'The van can’t go another mile.';
    if (reason) { state.stage = 'ended'; state.endReason = reason; state.endWin = false; }
  }
  function win() { state.mile = TOTAL_MILES; state.stage = 'ended'; state.endWin = true; state.endReason = 'You brought the van and your people all the way to the Atlantic.'; render(); }
  function showEnd() {
    const won = state.endWin; const remaining = Object.values(state.resources).reduce((a,b) => a+b, 0); const survived = state.alive.length;
    el('page-title').innerHTML = won ? 'Somewhere<br /><em>new.</em>' : 'The road<br /><em>ends here.</em>'; el('page-intro').textContent = won ? 'Some stories make it all the way to the water.' : 'Not every road lets you get where you’re going.';
    el('side-content').innerHTML = `<div class="event-kicker">${won ? 'ATLANTIC CITY · ARRIVAL' : 'JOURNEY OVER · DAY ' + state.day}</div><h2>${won ? 'You made it.' : 'The van is quiet.'}</h2><p class="event-copy">${state.endReason}</p><div class="event-note">${won ? 'The ocean looks different when you’ve crossed a continent to reach it.' : 'You made it ' + state.mile.toLocaleString() + ' miles. The road keeps going, even when your story doesn’t.'}</div><div class="event-result"><div class="result-top">THE TRIP, IN NUMBERS</div><h3>${state.mile.toLocaleString()} miles · ${state.day} days</h3><p>${survived} of ${state.crew.length} friends made it. ${state.log.filter(x=>x.success).length} good calls. ${remaining} resource points left.</p></div><button class="primary-button" id="again-button">${won ? 'TAKE THE LONG WAY AGAIN' : 'TRY ANOTHER ROUTE'} <span style="float:right">↻</span></button>`;
    el('again-button').addEventListener('click', () => { localStorage.removeItem('longWayHomeSave'); state = null; startSetup(); el('page-title').innerHTML = 'The long<br /><em>way home.</em>'; el('page-intro').textContent = 'One van. Five friends. Three thousand miles between here and somewhere new.'; el('eyebrow-text').textContent = 'A CROSS-COUNTRY SURVIVAL GAME'; el('journey-stamp').innerHTML = '<span>ROUTE</span><strong>01</strong><small>SF → AC</small>'; el('scene-kicker').textContent = 'CALIFORNIA, HERE WE COME'; el('scene-label').innerHTML = '<rect x="29" y="27" width="190" height="29" rx="3" fill="#fbf2df" opacity=".93"/><text x="43" y="46" fill="#594f3e" font-family="Space Grotesk, sans-serif" font-size="11" font-weight="700" letter-spacing="2">SIERRA NEVADA · MILE 218</text>'; renderResources(); renderRoute(); });
    el('restart-btn').hidden = false;
  }
  function toast(msg) { const t = el('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600); }
  function playTone(freq) { if (!soundOn) return; try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'triangle'; o.frequency.value = freq; g.gain.setValueAtTime(.035, ctx.currentTime); g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .12); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + .12); } catch (_) {} }
  el('sound-toggle').addEventListener('click', () => { soundOn = !soundOn; el('sound-toggle').textContent = soundOn ? '♫' : '♪'; el('sound-toggle').style.color = soundOn ? 'var(--red)' : ''; if (soundOn) playTone(440); });
  el('inventory-toggle').addEventListener('click', () => { const extra = el('inventory-extra'); extra.hidden = !extra.hidden; el('inventory-toggle').innerHTML = extra.hidden ? 'DETAILS <span>↗</span>' : 'LESS <span>↙</span>'; });
  el('restart-btn').addEventListener('click', () => { if (!confirm('Leave this trip behind and start again?')) return; localStorage.removeItem('longWayHomeSave'); state = null; startSetup(); el('page-title').innerHTML = 'The long<br /><em>way home.</em>'; el('page-intro').textContent = 'One van. Five friends. Three thousand miles between here and somewhere new.'; });
  const hasSave = load();
  if (hasSave) { el('page-title').innerHTML = 'The road<br /><em>is calling.</em>'; el('page-intro').textContent = 'Pick the way you face it. The miles will take what they take.'; render(); }
  else { state = null; startSetup(); renderRoute(); }
})();
