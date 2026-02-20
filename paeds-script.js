function stripZeros(str) {
    return str
      .replace(/(\.\d*?[1-9])0+$/ , '$1')   // drop extra zeroes after a significant decimal
      .replace(/\.0+$/            , ''   );// drop ".0", ".00", etc.
  }
  
  let ageUnit = 'years';
  let autoEstimate = true;

  // grab your nodes once
  const ageInput = document.getElementById('age');
  const weightIn = document.getElementById('weight');
  const unitBtn  = document.getElementById('AgeUnitBtn');
  const estToggle = document.getElementById('EstimateToggle');
  const calcDiv  = document.getElementById('weight-calculations');

  // clear everything and hide all outputs
  function clearWeight() {
  // 1) remove any old small notes (EM, calc, analgesic)
  document
    .querySelectorAll('.airway-note')
    .forEach(el => el.remove());

    [
  'fentanyl-vol-extra',
  'ketamine-vol-extra',
  'rocuronium-vol-extra',
  'atropine-vol-extra',
  'adrenalineiv-vol-extra',
  'sux-iv-vol-extra',
  'sux-im-vol-extra'
].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.textContent = '';
});
    
  // 2) clear the weight-calculation formulas
  calcDiv.innerHTML = '';
    
    [
    'fentanyl-ga-extra',
    'propofol-ga-extra',
    'rocuronium-ga-extra',
    'ondansetron-ga-extra',
    'dexamethasone-ga-extra'
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });

  // 3) hide uncuffed/cuffed ETT
  ['ett-uncuffed', 'ett-cuffed']
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    
// 3a) hide old depth values
 ['ett-depth-lips'].forEach(id => {
  const el = document.getElementById(id);
   if (!el) return;
   el.textContent = '';
   el.style.display = 'none';
   const unit = el.nextElementSibling;
   if (unit && unit.classList.contains('unit')) {
     unit.style.display = 'none';
   }
  });    

  // 4) clear laryngoscope
  const laryngoscopeEl = document.getElementById('laryngoscope');
  laryngoscopeEl.textContent = '';
  laryngoscopeEl.style.display = 'none';

  // 5) clear normal/airway numeric spans (just text)
  [
    'sbp-5','sbp-50','sbp-95',
    'hr-5','hr-95','rr-5','rr-95',
    'ett-uncuffed','ett-cuffed',
    'lma','fentanyl','ketamine','rocuronium'
  ].forEach(id => {
    document.getElementById(id).textContent = '';
  });

  // 6) hide emergency drug values + units
  [
    'fentanyl','ketamine','rocuronium',
    'atropine','sux-iv','sux-im',
    'defib','adrenalineiv','fluidbolus','glucose10'
  ].forEach(id => {
    const el   = document.getElementById(id);
    const unit = el.nextElementSibling;
    el.textContent     = '';
    el.style.display   = 'none';
    if (unit && unit.classList.contains('unit')) {
      unit.style.display = 'none';
    }
  });

  // 7) hide GA drug values + units
  [
    'propofol','fentanyl-ga','rocuronium-ga',
    'dexamethasone','ondansetron','paracetamol-iv','paracetamol-po','ibuprofeniv','ibuprofenpo','ketorolac','morphineiv','morphinepo'
  ].forEach(id => {
    const el   = document.getElementById(id);
    const unit = el.nextElementSibling;
    el.textContent     = '';
    el.style.display   = 'none';
    if (unit && unit.classList.contains('unit')) {
      unit.style.display = 'none';
    }
  });
    
    const ketExtra = document.getElementById('ketorolac-extra');
if (ketExtra) ketExtra.textContent = '';
    
 const mIvNote = document.getElementById('morphine-iv-extra');
if (mIvNote) mIvNote.textContent = '';
    
    const mPoNote = document.getElementById('morphine-po-extra');
if (mPoNote) mPoNote.textContent = '';
    
['paracetamol-iv-note','paracetamol-po-note'].forEach(id => {
  const noteEl = document.getElementById(id);
  if (noteEl) {
    noteEl.textContent = '';
    noteEl.style.display = 'none';
   }
 });
    
    const midazEl   = document.getElementById('premed-midaz');
const midazUnit = midazEl.nextElementSibling; // the “ mg” span

midazEl.textContent   = '';
midazEl.style.display = 'none';

if (midazUnit && midazUnit.classList.contains('unit')) {
  midazUnit.style.display = 'none';
}
    
    // Clear Midazolam NAS
const nasEl   = document.getElementById('premed-midaz-intranasal');
const nasUnit = nasEl.nextElementSibling;
nasEl.textContent   = '';
nasEl.style.display = 'none';
if (nasUnit && nasUnit.classList.contains('unit')) {
  nasUnit.style.display = 'none';
}
      // Clear Dexmedetomidine NAS
  const dexEl   = document.getElementById('premed-dexmed');
  const dexUnit = dexEl.nextElementSibling;
  dexEl.textContent   = '';
  dexEl.style.display = 'none';
  if (dexUnit && dexUnit.classList.contains('unit')) {
    dexUnit.style.display = 'none';
  }
  // 8) hide i-gel & tidal-volume
  const igelEl = document.getElementById('igel');
  igelEl.innerHTML = '';
  igelEl.style.display = 'none';

  const tvEl = document.getElementById('tidalvolume');
  tvEl.textContent = '';
  tvEl.style.display = 'none';
    
    const tvArdsEl = document.getElementById('tv-neonates-ards');
if (tvArdsEl) {
  tvArdsEl.textContent = '';
  tvArdsEl.style.display = 'none';
}

  // 10) hide static text in normals
  document.querySelectorAll('.normal-values .static')
    .forEach(el => el.style.display = 'none');
    
    ['lma', 'igel'].forEach(id => {
    const span = document.getElementById(id);
    if (!span) return;
    span.parentElement.style.display = ''; // back to table-cell
  });

// hide the GA copies of emergency drugs (class-based spans and their units)
document.querySelectorAll('.atropine-dose, .sux-iv-dose, .sux-im-dose').forEach(el => {
  el.textContent   = '';
  el.style.display = 'none';
  const unit = el.nextElementSibling;
  if (unit && unit.classList.contains('unit')) {
    unit.style.display = 'none';
  }
});
    
  const cyclEl = document.getElementById('cyclizine');
  if (cyclEl) {
    cyclEl.textContent   = '';
    cyclEl.style.display = 'none';
    const unit = cyclEl.nextElementSibling;
    if (unit && unit.classList.contains('unit')) unit.style.display = 'none';
  }
  const cyclExtra = document.getElementById('cyclizine-ga-extra');
  if (cyclExtra) cyclExtra.textContent = '';    
    
document.querySelectorAll('.atropine-extra, .sux-iv-extra, .sux-im-extra')
  .forEach(el => el.textContent = '');

document.querySelectorAll(
  '.sug-2-dose, .sug-4-dose, .neos-dose'
).forEach(el => {
  el.textContent   = '';
  el.style.display = 'none';
  const unit = el.nextElementSibling;
  if (unit && unit.classList.contains('unit')) unit.style.display = 'none';
});
document.querySelectorAll(
  '.sug-2-extra, .sug-4-extra, .neos-extra'
).forEach(el => el.textContent = '');    
}

function updatePremedication(w) {
  // Midazolam PO…
  const midazEl   = document.getElementById('premed-midaz');
const midazUnit = midazEl.nextElementSibling; // the “ mg” span
if (w > 0) {
  let dose = 0.5 * w;
  if (dose > 20) dose = 20;
  midazEl.textContent   = stripZeros(dose.toFixed(2));
  midazEl.style.display = 'inline';
  if (midazUnit && midazUnit.classList.contains('unit')) {
    midazUnit.style.display = 'inline';
  }
} else {
  midazEl.textContent   = '';
  midazEl.style.display = 'none';
  if (midazUnit && midazUnit.classList.contains('unit')) {
    midazUnit.style.display = 'none';
  }
}
  
  // — Midazolam NAS (0.2–0.3 mg/kg; max 10 mg) —
const nasEl   = document.getElementById('premed-midaz-intranasal');
const nasUnit = nasEl.nextElementSibling; // the “ mg” span
if (w > 0) {
  // calculate 0.2–0.3 mg/kg and cap at 10 mg
  const minDose = Math.min(0.2 * w, 10);
  const maxDose = Math.min(0.3 * w, 10);
  const doseText = (Math.abs(minDose - maxDose) < 0.001)
    ? stripZeros(minDose.toFixed(2))
    : `${stripZeros(minDose.toFixed(2))}–${stripZeros(maxDose.toFixed(2))}`;
  nasEl.textContent   = doseText;
  nasEl.style.display = 'inline';
  if (nasUnit && nasUnit.classList.contains('unit')) {
    nasUnit.style.display = 'inline';
  }
} else {
  nasEl.textContent   = '';
  nasEl.style.display = 'none';
  if (nasUnit && nasUnit.classList.contains('unit')) {
    nasUnit.style.display = 'none';
  }
}
  
    // — Dexmedetomidine NAS (2–4 mcg/kg; max 200 mcg) —
  const dexEl   = document.getElementById('premed-dexmed');
  const dexUnit = dexEl.nextElementSibling; // the “ mcg” span
  if (w > 0) {
    // calculate 2–4 mcg/kg and cap at 200 mcg
    const minDose = Math.min(2 * w, 200);
    const maxDose = Math.min(4 * w, 200);
    const doseText = (Math.abs(minDose - maxDose) < 0.001)
      ? stripZeros(minDose.toFixed(2))
      : `${stripZeros(minDose.toFixed(2))}–${stripZeros(maxDose.toFixed(2))}`;
    dexEl.textContent   = doseText;
    dexEl.style.display = 'inline';
    if (dexUnit && dexUnit.classList.contains('unit')) {
      dexUnit.style.display = 'inline';
    }
  } else {
    dexEl.textContent   = '';
    dexEl.style.display = 'none';
    if (dexUnit && dexUnit.classList.contains('unit')) {
      dexUnit.style.display = 'none';
    }
  }
}  
  
function updateReversal(w) {
  // -- 1) clear all previous doses + extras --
  [
    '.sug-2-dose', '.sug-4-dose', '.neos-dose',
    '.sug-2-extra', '.sug-4-extra', '.neos-extra'
  ].forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.textContent = '';
      // hide dose spans (they share the same unit <span>)
      if (sel.endsWith('-dose')) el.style.display = 'none';
    });
  });

  if (w > 0 && !isNaN(w)) {
    // -- 2) Sugammadex 2 mg/kg @100 mg/mL --
    document.querySelectorAll('.sug-2-dose').forEach(el => {
      const dose = 2 * w;
      el.textContent   = stripZeros(dose.toFixed(2));
      el.style.display = 'inline';
      // show its unit
      const u = el.nextElementSibling;
      if (u && u.classList.contains('unit')) u.style.display = 'inline';
    });
    document.querySelectorAll('.sug-2-extra').forEach(el => {
      const vol = (2 * w) / 100;
      el.textContent = `${stripZeros(vol.toFixed(2))} mL of 100 mg/mL`;
    });

    // -- 3) Sugammadex 4 mg/kg @100 mg/mL --
    document.querySelectorAll('.sug-4-dose').forEach(el => {
      const dose = 4 * w;
      el.textContent   = stripZeros(dose.toFixed(2));
      el.style.display = 'inline';
      const u = el.nextElementSibling;
      if (u && u.classList.contains('unit')) u.style.display = 'inline';
    });
    document.querySelectorAll('.sug-4-extra').forEach(el => {
      const vol = (4 * w) / 100;
      el.textContent = `${stripZeros(vol.toFixed(2))} mL of 100 mg/mL`;
    });

    // -- 4) Neostigmine/Glycopyrulate 0.02 mL/kg (2.5 + 0.5 mg/mL) --
    document.querySelectorAll('.neos-dose').forEach(el => {
      const vol = 0.02 * w;
      el.textContent   = stripZeros(vol.toFixed(2));
      el.style.display = 'inline';
      const u = el.nextElementSibling;
      if (u && u.classList.contains('unit')) u.style.display = 'inline';
    });
    document.querySelectorAll('.neos-extra').forEach(el => {
      const vol   = 0.02 * w;
      const neo   = vol * 2.5;
      const gly   = vol * 0.5;
      el.textContent =
        `${stripZeros(vol.toFixed(2))} mL ` +
        `(contains ${stripZeros(neo.toFixed(2))} mg neostigmine + ` +
         `${stripZeros(gly.toFixed(2))} mg glycopyrulate)`;
    });
  }
}
  
  function updateAnalgesics(w) {
  // 2) Clear out the “-note” cells for Paracetamol & Ibuprofen
  [
    'paracetamol-po-note',
    'paracetamol-iv-note',
    'ibuprofeniv-note',
    'ibuprofenpo-note',
    'ketorolac-extra'
  ].forEach(extraId => {
    const el = document.getElementById(extraId);
    if (el) el.textContent = '';
  });

// — PARACETAMOL dosing & note —

  // 1) Calculate IV dose & note
  let paraIVDose, paraIVNote;
  if (w > 0 && w <= 10) {
    paraIVDose = 10 * w;
    const maxDailyLowIV = stripZeros((30 * w).toFixed(2));
    paraIVNote = `10 mg/kg every 4–6 h; max 30 mg/kg/day = ${maxDailyLowIV} mg`;
  } else if (w <= 50) {
    paraIVDose = 15 * w;
    const maxDailyHighIV = stripZeros((60 * w).toFixed(2));
    paraIVNote = `15 mg/kg every 4–6 h; max 60 mg/kg/day = ${maxDailyHighIV} mg`;
  } else if (w > 50) {
    paraIVDose = 1000;
    paraIVNote = `1 g every 4–6 h; max 4 g/day`;
  } else {
    paraIVDose = 0;
    paraIVNote = '';
  }

  // 2) Calculate PO dose & note
  let paraPODose, paraPONote;
  if (w > 0 && w <= 10) {
    paraPODose = 10 * w;
    const maxDailyLowPO = stripZeros((30 * w).toFixed(2));
    paraPONote = `10 mg/kg every 4–6 h; max 30 mg/kg/day = ${maxDailyLowPO} mg`;
  } else if (w <= 50) {
    paraPODose = 15 * w;
    const maxDailyHighPO = stripZeros((60 * w).toFixed(2));
    paraPONote = `15 mg/kg every 4–6 h; max 60 mg/kg/day = ${maxDailyHighPO} mg`;
  } else if (w > 50) {
    paraPODose = 1000;
    paraPONote = `1 g every 4–6 h; max 4 g/day`;
  } else {
    paraPODose = 0;
    paraPONote = '';
  }

  // 3) Update IV span & note for Paracetamol
  const pIvEl     = document.getElementById('paracetamol-iv');
  const pIvUnit   = pIvEl.nextElementSibling; // the “ mg” span
  const pIvNoteEl = document.getElementById('paracetamol-iv-note');

  if (paraIVDose > 0) {
    pIvEl.textContent   = stripZeros(paraIVDose.toFixed(2));
    pIvEl.style.display = 'inline';
    if (pIvUnit) pIvUnit.style.display = 'inline';

    pIvNoteEl.innerHTML     = `${paraIVNote}`;
    pIvNoteEl.style.display = 'inline';
  } else {
    pIvEl.textContent     = '';
    pIvEl.style.display   = 'none';
    if (pIvUnit) pIvUnit.style.display = 'none';

    pIvNoteEl.textContent     = '';
    pIvNoteEl.style.display   = 'none';
  }

  // 4) Update PO span & note for Paracetamol
  const pPoEl     = document.getElementById('paracetamol-po');
  const pPoUnit   = pPoEl.nextElementSibling; // the “ mg” span
  const pPoNoteEl = document.getElementById('paracetamol-po-note');

  if (paraPODose > 0) {
    pPoEl.textContent   = stripZeros(paraPODose.toFixed(2));
    pPoEl.style.display = 'inline';
    if (pPoUnit) pPoUnit.style.display = 'inline';

    pPoNoteEl.innerHTML     = `${paraPONote}`;
    pPoNoteEl.style.display = 'inline';
  } else {
    pPoEl.textContent     = '';
    pPoEl.style.display   = 'none';
    if (pPoUnit) pPoUnit.style.display = 'none';

    pPoNoteEl.textContent     = '';
    pPoNoteEl.style.display   = 'none';
  }
  
  // — IBUPROFEN IV dosing & note —
  const iEl   = document.getElementById('ibuprofeniv');
  const iUnit = iEl.nextElementSibling; // “ mg”
  let ibuText = '', ibuNote = '';

  const rawAge = parseFloat(ageInput.value) || 0;
  const ageY   = ageUnit === 'months' ? rawAge/12 : rawAge;

  if (ageY < 6 || w < 20) {
    // Not recommended under 20 kg or below 6 years
    ibuNote = 'Not recommended for children under 20 kg or below 6 years of age.';
    ibuText = ''; 
  } else if (ageY < 18) {
    if (w <= 29) {
      ibuText = '200';
      ibuNote = '200 mg TDS, 6–8 h; max 600 mg/day';
    } else if (w <= 39) {
      ibuText = '200';
      ibuNote = '200 mg QDS, 6 h; max 800 mg/day';
    } else {
      ibuText = '200–400';
      ibuNote = '200–400 mg TDS, 6–8 h; max 1200 mg/day';
    }
  }

  if (ibuText) {
    iEl.textContent   = ibuText;
    iEl.style.display = 'inline';
    if (iUnit) iUnit.style.display = 'inline';
  } else {
    iEl.textContent   = '';
    iEl.style.display = 'none';
    if (iUnit) iUnit.style.display = 'none';
  }

  // Write the Ibuprofen IV note into its colspan cell:
  const ibuivCell = document.getElementById('ibuprofeniv-note');
  ibuivCell.innerHTML = ibuNote ? `${ibuNote}` : '';

  // — IBUPROFEN PO dosing & note —
  const poEl   = document.getElementById('ibuprofenpo');
  const poUnit = poEl.nextElementSibling; // “ mg”
  let poText = '', poNote = '';

  const ageMonths = ageUnit === 'months' ? rawAge : rawAge * 12;
  if (ageMonths > 3 && w > 0) {
    const dMin = Math.min(5 * w, 400);
    const dMax = Math.min(10 * w, 400);
    poText = `${dMin.toFixed(0)}–${dMax.toFixed(0)}`;
    poNote = 'Maximum 30 mg/kg/day in 3–4 divided doses';
  }

  if (poText) {
    poEl.textContent   = poText;
    poEl.style.display = 'inline';
    if (poUnit) poUnit.style.display = 'inline';
  } else {
    poEl.textContent   = '';
    poEl.style.display = 'none';
    if (poUnit) poUnit.style.display = 'none';
  }

  // Write the Ibuprofen PO note into its colspan cell:
  const ibupopc = document.getElementById('ibuprofenpo-note');
  ibupopc.innerHTML = poNote ? `${poNote}` : '';
    
// — KETOROLAC dosing & volume (30 mg/mL) —
  //
  const kEl      = document.getElementById('ketorolac');
  const kUnit    = kEl.nextElementSibling;     // “ mg”
  const extraEl  = document.getElementById('ketorolac-extra');

  // If age < 0.5 yrs → “Not licensed”
  if (ageY < 0.5) {
    kEl.textContent   = 'Not licensed';
    kEl.style.display = 'inline';
    if (kUnit) kUnit.style.display = 'none';
    extraEl.textContent = '';
    return;
  }

  // If age ≥ 16 yrs → flat 30 mg (adults)
  if (ageY >= 16) {
    kEl.textContent   = '30';
    kEl.style.display = 'inline';
    if (kUnit) kUnit.style.display = 'inline';

    // 30 mg at 30 mg/mL = 1 mL
    extraEl.innerHTML = `1.00 mL of 30 mg/mL`;
    return;
  }

  // Otherwise (age 0.5 – 15 yrs): calculate 0.5–1 mg/kg, cap at 15 mg
  if (w > 0 && !isNaN(w)) {
    let kDoseMin = 0.5 * w;
    let kDoseMax = 1.0 * w;

    // Cap both min/max at 15 mg
    if (kDoseMin > 15) {
      kDoseMin = 15;
      kDoseMax = 15;
    } else if (kDoseMax > 15) {
      kDoseMax = 15;
    }

    // Build dose text (if min === max, show “15 (max)”)
    let doseText;
    if (Math.abs(kDoseMin - kDoseMax) < 0.001) {
  // capped exactly at 15 mg → show "15" in kEl and "mg (max)" in kUnit
  kEl.textContent = stripZeros(kDoseMin.toFixed(2));
  kEl.style.display = 'inline';
  if (kUnit) {
    kUnit.textContent = ' mg (max)';
    kUnit.style.display = 'inline';
  }
} else {
  // normal 0.5–1 mg/kg without cap
  kEl.textContent   = `${stripZeros(kDoseMin.toFixed(2))}–${stripZeros(kDoseMax.toFixed(2))}`;
  kEl.style.display = 'inline';
  if (kUnit) {
    kUnit.textContent = ' mg';
    kUnit.style.display = 'inline';
  }
}

    // Compute volume at 30 mg/mL
    const vMin = (Math.min(kDoseMin, 15) / 30).toFixed(2);
    const vMax = (Math.min(kDoseMax, 15) / 30).toFixed(2);

    let volText;
    if (Math.abs(kDoseMin - kDoseMax) < 0.001) {
      // capped: show “0.50 mL (max) of 30 mg/mL”
      volText = `${stripZeros(vMin)}`;
    } else {
      volText = `${stripZeros(vMin)}–${stripZeros(vMax)}`;
    }

    extraEl.innerHTML = `${volText} mL of 30 mg/mL`;
  } else {
    // If weight is invalid or zero: hide everything
    kEl.textContent   = '';
    kEl.style.display = 'none';
    if (kUnit) kUnit.style.display = 'none';
    extraEl.textContent = '';
  }
   // — MORPHINE IV (0.05–0.1 mg/kg up to 12 y; ≥12 y → 5 mg) —
  const mIvEl   = document.getElementById('morphineiv');
  const mIvUnit = mIvEl.nextElementSibling; // “ mg”
  const mNoteEl = document.getElementById('morphine-iv-extra');

  if (w > 0 && !isNaN(w)) {
    // calculate age in years
    const rawAge = parseFloat(ageInput.value) || 0;
    const ageY   = (ageUnit === 'months') ? (rawAge / 12) : rawAge;

    let doseText;
    if (ageY < 12) {
      // 0.05–0.1 mg/kg
      const minDose = 0.05 * w;
      const maxDose = 0.10 * w;
      doseText = `${stripZeros(minDose.toFixed(2))}–${stripZeros(maxDose.toFixed(2))}`;
    } else {
      // ≥ 12 years → flat 5 mg
      doseText = '5';
    }

    // Write dose into the span and show its unit
    mIvEl.textContent   = doseText;
    mIvEl.style.display = 'inline';
    if (mIvUnit && mIvUnit.classList.contains('unit')) {
      mIvUnit.style.display = 'inline';
    }

    // Put the note into the <small id="morphine-iv-extra"> cell:
    mNoteEl.innerHTML = `Every 4 hours, adjusted according to response`;
  } else {
    // hide Morphine IV span & unit, clear note
    mIvEl.textContent   = '';
    mIvEl.style.display = 'none';
    if (mIvUnit && mIvUnit.classList.contains('unit')) {
      mIvUnit.style.display = 'none';
    }
    mNoteEl.textContent = '';
  }
// — MORPHINE PO (age-stratified µg/kg → mg) —
  const mPoEl    = document.getElementById('morphinepo');
  const mPoUnit  = mPoEl.nextElementSibling; // “ mg”
  const mPoNote  = document.getElementById('morphine-po-extra');

  if (w > 0 && !isNaN(w)) {
    const rawAge = parseFloat(ageInput.value) || 0;
    // convert age to months
    const ageMonths = ageUnit === 'months' ? rawAge : rawAge * 12;
    // convert age to years (decimal)
    const ageY = ageMonths / 12;

    let doseMinMg = 0, doseMaxMg = 0;
    let noteText = '';

    if (ageMonths >= 1 && ageMonths <= 2) {
      // 50–100 µg/kg → (50/1000)–(100/1000) mg/kg
      doseMinMg  = (50  * w) / 1000;
      doseMaxMg  = (100 * w) / 1000;
      noteText   = 'Initially 50–100 µg/kg every 4 hours, adjust per response';
    }
    else if (ageMonths > 2 && ageMonths <= 5) {
      // 100–150 µg/kg
      doseMinMg  = (100 * w) / 1000;
      doseMaxMg  = (150 * w) / 1000;
      noteText   = '100–150 µg/kg every 4 hours, adjust per response';
    }
    else if (ageMonths > 5 && ageMonths < 12) {
      // 200 µg/kg exactly
      doseMinMg  = (200 * w) / 1000;
      doseMaxMg  = doseMinMg;
      noteText   = '200 µg/kg every 4 hours, adjust per response';
    }
    else if (Math.floor(ageY) === 1) {
      // exactly 1 year → 200–300 µg/kg
      doseMinMg  = (200 * w) / 1000;
      doseMaxMg  = (300 * w) / 1000;
      noteText   = '200–300 µg/kg every 4 hours, adjust per response';
    }
    else if (ageY >= 2 && ageY < 12) {
      // 2–11 years → 200–300 µg/kg, max per dose 10 mg
      const rawMin = (200 * w) / 1000;
      const rawMax = (300 * w) / 1000;
      doseMinMg    = Math.min(rawMin, 10);
      doseMaxMg    = Math.min(rawMax, 10);
      noteText     = '200–300 µg/kg every 4 hours (max 10 mg/dose), adjust per response';
    }
    else if (ageY >= 12 && ageY < 18) {
      // 12–17 years → 5–10 mg every 4 hours
      doseMinMg  = 5;
      doseMaxMg  = 10;
      noteText   = '5–10 mg every 4 hours, adjust per response';
    }
    else {
      // if <1 month or ≥18 years, hide
      doseMinMg = doseMaxMg = 0;
      noteText = '';
    }

    if (doseMinMg > 0) {
      // Format “min–max” or single value
      const doseText = Math.abs(doseMaxMg - doseMinMg) < 0.01
        ? stripZeros(doseMinMg.toFixed(2))
        : `${stripZeros(doseMinMg.toFixed(2))}–${stripZeros(doseMaxMg.toFixed(2))}`;

      mPoEl.textContent   = doseText;
      mPoEl.style.display = 'inline';
      if (mPoUnit && mPoUnit.classList.contains('unit')) {
        mPoUnit.style.display = 'inline';
      }
      mPoNote.innerHTML = `${noteText}`;
    } else {
      mPoEl.textContent   = '';
      mPoEl.style.display = 'none';
      if (mPoUnit && mPoUnit.classList.contains('unit')) {
        mPoUnit.style.display = 'none';
      }
      mPoNote.textContent = '';
    }
  } else {
    // no weight → hide Morphine PO entirely
    mPoEl.textContent   = '';
    mPoEl.style.display = 'none';
    if (mPoUnit && mPoUnit.classList.contains('unit')) {
      mPoUnit.style.display = 'none';
    }
    mPoNote.textContent = '';
  }    
}

  function toggleAgeUnit() {
  // 1) clear everything
  clearWeight();

  // 2) flip the button and convert the value
  const raw = ageInput.value.trim();
  const n   = parseFloat(raw);

  if (ageUnit === 'years') {
    ageUnit = 'months';
    unitBtn.textContent = 'months';
    ageInput.value = (raw !== '' && !isNaN(n)) ? Math.round(n * 12) : '';
  } else {
    ageUnit = 'years';
    unitBtn.textContent = 'years';
    ageInput.value = (raw !== '' && !isNaN(n)) ? Math.round((n / 12) * 10) / 10 : '';
  }

  // 3) trigger your existing listeners to recalc everything
  //    - the age-input listener will either re-estimate (if autoEstimate)
  //      or clearWeight()/updateAirwayCalculations/updateNormalCentiles
  ageInput.dispatchEvent(new Event('input'));

  // if you want to make extra sure weight-based bits also rerun:
  weightIn.dispatchEvent(new Event('input'));
}

function estimateWeight() {
  clearWeight();
  const a = parseFloat(ageInput.value);

  const ageY = (ageUnit === 'months') ? (a / 12) : a;

  // ── Stop auto-estimating above 16 years ──
  if (ageY > 14) {
    estToggle.checked    = false;
    autoEstimate         = false;
    weightIn.disabled    = false;
    weightIn.value       = '';
    weightIn.placeholder = '0';
    clearWeight();
    return;
  }

  if (isNaN(a) || a < 0) {
    alert('Please enter a valid age.');
    return;
  }

  // ────────────────────────────────────────────────
  // 0) NEWBORN
  // ────────────────────────────────────────────────
  if (a === 0) {
    const w = 3.5;
    weightIn.value = w;
    calcDiv.innerHTML =
      `<p>Estimated weight for a neonate = ${w} <span class="unit">kg</span></p>`;

    if (autoEstimate) {
      const normals = getNormalValues(a, ageUnit);
      if (normals) updateNormalCentiles(normals);
      updateAirwayCalculations(0);
      expandOpenAccordion();
    }
    return;
  }

  // Convert to months if needed
  const m = ageUnit === 'months' ? a : a * 12;

  // ────────────────────────────────────────────────
  // 1) INFANTS <12 MONTHS
  // ────────────────────────────────────────────────
  if (m < 12) {
    const w = 0.5 * m + 4;
    const wDisp = stripZeros(w.toFixed(2));

    weightIn.value = wDisp;
    calcDiv.innerHTML =
      `<p>(0.5 × Age in months) + 4 = ${wDisp} <span class="unit">kg</span></p>`;

    if (autoEstimate) {
      const y = m / 12;
      const normals = getNormalValues(a, ageUnit);
      if (normals) updateNormalCentiles(normals);
      updateAirwayCalculations(y);
      expandOpenAccordion();
    }
    return;
  }

  // ────────────────────────────────────────────────
  // ≥1 year
  // ────────────────────────────────────────────────
  const y = m / 12;

  const w2 = Math.round((2 * y + 8) * 10) / 10; // 2A+8
  const w3 = Math.round((3 * y + 7) * 10) / 10; // 3A+7

  let mainW, mainFormula, noteFormula, noteW;

  if (y >= 1 && y <= 5) {
    // Primary: 2A+8
    mainW = w2;
    mainFormula = `(2 × Age) + 8 = ${w2} kg`;
    noteFormula = `(3 × Age) + 7 = ${w3} kg`;
    noteW = w3;
  } else if (y > 5 && y <= 14) {
    // Primary: 3A+7
    mainW = w3;
    mainFormula = `(3 × Age) + 7 = ${w3} kg`;
    noteFormula = `(2 × Age) + 8 = ${w2} kg`;
    noteW = w2;
  }

  weightIn.value = mainW;

  // Output main + small note
  calcDiv.innerHTML = `
    <p><small>${mainFormula}</small></p>
    <p><small>${noteFormula}</small></p>
  `;

  // Auto-update linked systems
  if (autoEstimate) {
    const normals = getNormalValues(a, ageUnit);
    if (normals) updateNormalCentiles(normals);
    updateAirwayCalculations(y);
    expandOpenAccordion();
  }
}

  // paediatric normals table
  const paediatricNormals = {
    0:   { respRate:[25,50], heartRate:[120,170], bp:{p5:65, p50:[80,90], p95:105} },
    1:   { respRate:[25,50], heartRate:[120,170], bp:{p5:65, p50:[80,90], p95:105} },
    3:   { respRate:[25,45], heartRate:[115,160], bp:{p5:65, p50:[80,90], p95:105} },
    6:   { respRate:[20,40], heartRate:[110,160], bp:{p5:65, p50:[80,90], p95:105} },
    12:  { respRate:[20,40], heartRate:[110,160], bp:{p5:70, p50:[85,95], p95:105} },
    18:  { respRate:[20,35], heartRate:[100,155], bp:{p5:70, p50:[85,95], p95:105} },
    24:  { respRate:[20,30], heartRate:[100,150], bp:{p5:70, p50:[85,100], p95:110} },
    36:  { respRate:[20,30], heartRate:[90,140],  bp:{p5:70, p50:[85,100], p95:110} },
    48:  { respRate:[20,30], heartRate:[80,135],  bp:{p5:70, p50:[85,100], p95:110} },
    60:  { respRate:[20,30], heartRate:[80,135],  bp:{p5:80, p50:[90,110], p95:120} },
    72:  { respRate:[20,30], heartRate:[80,130],  bp:{p5:80, p50:[90,110], p95:120} },
    84:  { respRate:[20,30], heartRate:[80,130],  bp:{p5:80, p50:[90,110], p95:120} },
    96:  { respRate:[15,25], heartRate:[70,120],  bp:{p5:80, p50:[90,110], p95:120} },
    108: { respRate:[15,25], heartRate:[70,120],  bp:{p5:80, p50:[90,110], p95:120} },
    120: { respRate:[15,25], heartRate:[70,120],  bp:{p5:80, p50:[90,110], p95:120} },
    132: { respRate:[15,25], heartRate:[70,120],  bp:{p5:80, p50:[90,110], p95:120} },
    144: { respRate:[12,24], heartRate:[65,115],  bp:{p5:90, p50:[100,120],p95:140} },
    168: { respRate:[12,24], heartRate:[60,110],  bp:{p5:90, p50:[100,120],p95:140} }
  };

  // pick the nearest key
  function getNormalValues(age, unit) {
    const months = unit==='months'? age : age*12;
    const keys = Object.keys(paediatricNormals).map(k=>+k).sort((a,b)=>a-b);
    if (months < 12) {
      const mks = keys.filter(k=>k<12);
      return paediatricNormals[mks.reduce((a,b)=>Math.abs(b-months)<Math.abs(a-months)?b:a, mks[0])];
    } else {
      const ideal = Math.floor(months/12)*12;
      const below = keys.filter(k=>k<=ideal);
      const key   = below.length? below.pop() : keys.find(k=>k>=12);
      return paediatricNormals[key];
    }
  }

  // show centiles
  function updateNormalCentiles(n) {
    document.getElementById('sbp-5').textContent   = n.bp.p5;
    document.getElementById('sbp-50').textContent =
  Array.isArray(n.bp.p50) ? `${n.bp.p50[0]}–${n.bp.p50[1]}` : n.bp.p50;
    document.getElementById('sbp-95').textContent  = n.bp.p95;
    document.getElementById('hr-5').textContent    = n.heartRate[0];
    document.getElementById('hr-95').textContent   = n.heartRate[1];
    document.getElementById('rr-5').textContent    = n.respRate[0];
    document.getElementById('rr-95').textContent   = n.respRate[1];
    document.querySelectorAll('.normal-values .static')
      .forEach(el => el.style.display='inline');
  }

function updateAirwayCalculations(ageYears) {
  // 1) clear old notes
  document.querySelectorAll('.airway-note, .depth-note-row').forEach(el => el.remove());

  const w = parseFloat(weightIn.value) || 0;  
    
  // normalize age to years
  const y = ageUnit === 'months'
          ? parseFloat(ageInput.value) / 12
          : ageYears;

  if (isNaN(y) || y < 0) {
    // hide all if invalid
    ['ett-uncuffed','ett-cuffed','ett-depth-lips'].forEach(id => {
      const el = document.getElementById(id);
      el.textContent = '';
      el.style.display = 'none';
      const u = el.nextElementSibling;
      if (u && u.classList.contains('unit')) u.style.display = 'none';
    });
    return;
  }

  // ==========================
// NRP 2025 Neonatal ETT tables
// ==========================

const neonatalETTSizeTable = [
  { max: 0.799,  size: '2.0–2.5' },
  { max: 1.2,  size: '2.5' },
  { max: 2.2,  size: '3.0' },
  { max: Infinity, size: '3.5' }
];

const neonatalDepthTable = [
  { max: 0.499,  depth: '5–5.5' },
  { max: 0.6,  depth: '5.5' },
  { max: 0.8,  depth: '6' },
  { max: 1.0,  depth: '6.5' },
  { max: 1.4,  depth: '7' },
  { max: 1.8,  depth: '7.5' },
  { max: 2.4,  depth: '8' },
  { max: 3.1,  depth: '8.5' },
  { max: Infinity,  depth: '9' }
];

function lookupByWeight(weight, table) {
  const row = table.find(r => weight <= r.max);
  return row ? (row.size || row.depth) : '';
}
  
 // ==========================
// NEONATAL (NRP 2025) — Age 0
// ==========================
if (y === 0 && w > 0) {

  const uncEl  = document.getElementById('ett-uncuffed');
  const cuffEl = document.getElementById('ett-cuffed');

  const size = lookupByWeight(w, neonatalETTSizeTable);
  const depth = lookupByWeight(w, neonatalDepthTable);

  // Neonates: uncuffed only
  uncEl.textContent = size;
  uncEl.style.display = 'inline';

  cuffEl.textContent = '';
  cuffEl.style.display = 'none';

  const depthEl   = document.getElementById('ett-depth-lips');
  const depthUnit = depthEl.nextElementSibling;

  depthEl.textContent = depth;
  depthEl.style.display = 'inline';
  depthUnit.style.display = 'inline';

}
  else {
    // ================================
    // NEW ETT SELECTION LOGIC
    // ================================

    let uncuffed = '';
    let cuffed   = '';

    // --- AGE 0–12 MONTHS → Use your existing lookup table ---
    if (y < 1) {
      const table = [
        { maxAge: 0.0833, unc: '3.0–3.5',  cuff: '2.5–3.0' },
        { maxAge: 1/12,   unc: '3.5',  cuff: '3.0' },
        { maxAge: 2/12,   unc: '3.5',  cuff: '3.0' },
        { maxAge: 4/12,   unc: '3.5',  cuff: '3.0' },
        { maxAge: 5/12,   unc: '4.0',  cuff: '3.5' },
        { maxAge: 6/12,   unc: '4.0',  cuff: '3.5' },
        { maxAge: 1,      unc: '4.0–4.5', cuff: '3.5–4.0' }
      ];
      const row = table.find(r => y <= r.maxAge);
      uncuffed = row.unc;
      cuffed   = row.cuff;
    }

    // --- AGE ≥1 YEAR ---
    else {

      // Uncuffed: 1–8 years → age/4 + 4
      if (y >= 1 && y <= 8) {
        const size = (y/4 + 4).toFixed(2);
        uncuffed = stripZeros(size);
      }

      // Cuffed: 1–14 years → age/4 + 3.5
      if (y >= 1 && y <= 14) {
        const size = (y/4 + 3.5).toFixed(2);
        cuffed = stripZeros(size);
      }

      // Cuffed: >14 years → "7.0–8.0"
      if (y > 14) {
        cuffed = '7.0–8.0';
      }
    }

    // Inject into DOM
    const uncEl = document.getElementById('ett-uncuffed');
    if (uncuffed) {
      uncEl.textContent = uncuffed;
      uncEl.style.display = 'inline';
    } else {
      uncEl.textContent = '';
      uncEl.style.display = 'none';
    }

    const cuffEl = document.getElementById('ett-cuffed');
    if (cuffed && w >= 3.0) {
      cuffEl.textContent = cuffed;
      cuffEl.style.display = 'inline';
    } else {
      cuffEl.textContent = '';
      cuffEl.style.display = 'none';
    }

    // ============================
    // DEPTH RULES
    // ============================
    let depth = '';

if (y >= 14) {
  // Teens / adolescents
  depth = 20;
} else if (y >= 1) {
  // 1–13 years
  depth = y / 2 + 12;
  depth = stripZeros(depth.toFixed(2));
} else if (y > 0 && y <= 3/12) {
  // 1–3 months
  depth = '9–10';
} else if (y > 3/12 && y <= 6/12) {
  // 4–6 months
  depth = '10–11';
} else if (y > 6/12 && y < 1) {
  // 7–11 months
  depth = '12';
}

// Inject depth into DOM
const depthEl = document.getElementById('ett-depth-lips');
const depthUnit = depthEl.nextElementSibling;
if (depth) {
  depthEl.textContent = depth;
  depthEl.style.display = 'inline';
  depthUnit.style.display = 'inline';
} else {
  depthEl.textContent = '';
  depthEl.style.display = 'none';
  depthUnit.style.display = 'none';
}
  }

  // ==========================
  // I-GEL (unchanged)
  // ==========================
  const igelEl = document.getElementById('igel');
  let igelSize = '';
  if (w >= 2) {
    if      (w <= 5)  igelSize = '1.0 <small>(2–5 kg)</small>';
    else if (w <= 10) igelSize = '1.5 <small>(5–12 kg)</small>';
    else if (w <= 25) igelSize = '2.0 <small>(10–25 kg)</small>';
    else if (w <= 35) igelSize = '2.5 <small>(25–35 kg)</small>';
    else if (w <= 60) igelSize = '3.0 <small>(30–60 kg)</small>';
    else if (w <= 90) igelSize = '4.0 <small>(50–90 kg)</small>';
    else              igelSize = '5.0 <small>(≥90 kg)</small>';
  }
  igelEl.innerHTML          = igelSize;
  igelEl.style.display      = igelSize ? 'inline' : 'none';

  // ==========================
  // LMA (unchanged)
  // ==========================
  const lmaEl = document.getElementById('lma');
  let lmaSize = '';
  if (w > 0) {
    if      (w <= 5)   lmaSize = '1.0 <small>(&lt;5 kg)</small>';
    else if (w <= 10)  lmaSize = '1.5 <small>(5–10 kg)</small>';
    else if (w <= 20)  lmaSize = '2.0 <small>(10–20 kg)</small>';
    else if (w <= 30)  lmaSize = '2.5 <small>(20–30 kg)</small>';
    else if (w <= 50)  lmaSize = '3.0 <small>(30–50 kg)</small>';
    else if (w <= 70)  lmaSize = '4.0 <small>(50–70 kg)</small>';
    else if (w <= 100) lmaSize = '5.0 <small>(70–100 kg)</small>';
  }
  lmaEl.innerHTML = lmaSize;
  lmaEl.style.display = lmaSize ? 'inline-block' : 'none';

  // ==========================
  // TIDAL VOLUME (unchanged)
  // ==========================
  const tvEl = document.getElementById('tidalvolume');
  if (w > 0) {
    const tvMin = Math.round(6 * w),
          tvMax = Math.round(8 * w);
    tvEl.textContent   = `${tvMin}–${tvMax} mL`;
    tvEl.style.display = 'inline';
  } else {
    tvEl.style.display = 'none';
  }

  // ARDS TV (unchanged)
  const tvArdsEl = document.getElementById('tv-neonates-ards');
  if (tvArdsEl) {
    if (w > 0) {
      const tvArdsMin = Math.round(4 * w),
            tvArdsMax = Math.round(6 * w);
      tvArdsEl.textContent   = `${tvArdsMin}–${tvArdsMax} mL`;
      tvArdsEl.style.display = 'inline';
    } else {
      tvArdsEl.textContent   = '';
      tvArdsEl.style.display = 'none';
    }
  }

  // ==========================
  // LARYNGOSCOPE BLADE (YOUR MISSING BLOCK)
  // ==========================
  const laryEl = document.getElementById('laryngoscope');
  laryEl.innerHTML = '';

  if (w > 0) {
    let mainText = '';
    let noteText = '';

    if      (w < 1.5) { mainText = 'Miller 00 or 0';       noteText = '(Extremely preterm)'; }
    else if (w < 2.5) { mainText = 'Mac 0 / Miller 0';     noteText = '(Preterm)'; }
    else if (w < 4)   { mainText = 'Mac 0–1 / Miller 0–1'; }
    else if (w < 6)   { mainText = 'Mac 1 / Miller 1';     noteText = '(1–6 m)'; }
    else if (w < 12)  { mainText = 'Mac 1–2 / Miller 1–2'; noteText = '(6 m–2 y)'; }
    else if (w < 30)  { mainText = 'Mac 2';    noteText = '(2–10 y)'; }
    else if (w <= 60) { mainText = 'Mac 3';    noteText = '(>10 y)'; }
    else              { mainText = 'Mac 3–4';  noteText = '(adult)'; }

    laryEl.style.display = 'inline-block';
    laryEl.appendChild(document.createTextNode(mainText));

    if (noteText) {
      laryEl.appendChild(document.createElement('br'));
      const small = document.createElement('small');
      small.textContent = noteText;
      small.style.display   = 'block';
      small.style.marginTop = '2px';
      small.style.fontSize  = '0.8em';
      small.style.color     = '#000000';
      laryEl.appendChild(small);
    }
  } else {
    laryEl.style.display = 'none';
  }

  // ==========================
  // DRUG TABLE UPDATES (unchanged)
  // ==========================
  updateEmergencyDrugs(w);
  updateSedation(w);
  updateGADrugs(w);
  updateAnalgesics(w);
  updatePremedication(w);
  updateReversal(w);
  updateAntibiotics(w);
}
  
function updateEmergencyDrugs(w) {
  // Helper that removes any old <em>…</em> from previous runs
  function clearOldLine(id) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = '';
    }
  }

  // 1) Clear out all “-vol-extra” <small> cells first
  [
    'fentanyl-vol-extra',
    'ketamine-vol-extra',
    'rocuronium-vol-extra',
    'atropine-vol-extra',
    'adrenalineiv-vol-extra',
    'sux-iv-vol-extra',
    'sux-im-vol-extra'
  ].forEach(clearOldLine);

  // 2) Grab all the numeric <span> elements for the emergency drugs
  const fentanylEl   = document.getElementById('fentanyl'),
        ketamineEl   = document.getElementById('ketamine'),
        rocuroniumEl = document.getElementById('rocuronium'),
        atropineEl   = document.getElementById('atropine'),
        suxIvEl      = document.getElementById('sux-iv'),
        suxImEl      = document.getElementById('sux-im'),
        defibEl      = document.getElementById('defib'),
        adrenalineEl = document.getElementById('adrenalineiv');

  // 3) Grab each “vol-extra” <small> placeholder
  const fentanylExtra   = document.getElementById('fentanyl-vol-extra'),
        ketamineExtra   = document.getElementById('ketamine-vol-extra'),
        rocuroniumExtra = document.getElementById('rocuronium-vol-extra'),
        atropineExtra   = document.getElementById('atropine-vol-extra'),
        adrenalineExtra = document.getElementById('adrenalineiv-vol-extra'),
        suxIvExtra      = document.getElementById('sux-iv-vol-extra'),
        suxImExtra      = document.getElementById('sux-im-vol-extra');

  if (w > 0 && !isNaN(w)) {
    // — FENTANYL: 1–2 mcg/kg @ 50 mcg/mL —
    const fMin     = 1   * w,                  // in mcg
          fMax     = 2   * w,                  // in mcg
          fVolMin  = (fMin   / 50).toFixed(2),  // in mL
          fVolMax  = (fMax   / 50).toFixed(2);  // in mL

    // Write the numeric dose (mcg) + unit
    fentanylEl.textContent   = `${stripZeros(fMin.toFixed(1))}–${stripZeros(fMax.toFixed(1))}`;
    fentanylEl.style.display = 'inline';
    fentanylEl.nextElementSibling.style.display = 'inline'; // “ mcg”

    // Put the “(X–Y mL of 50 mcg/mL)” inside <small id="fentanyl-vol-extra">
    fentanylExtra.innerHTML = `${stripZeros(fVolMin)}–${stripZeros(fVolMax)} mL of 50 mcg/mL`;

    // — KETAMINE: 1–2 mg/kg @ 10 mg/mL —
    const kMin     = 1   * w,                 // mg
          kMax     = 2   * w,                 // mg
          kVolMin  = (kMin   / 10).toFixed(2), // mL
          kVolMax  = (kMax   / 10).toFixed(2); // mL

    ketamineEl.textContent   = `${stripZeros(kMin.toFixed(1))}–${stripZeros(kMax.toFixed(1))}`;
    ketamineEl.style.display = 'inline';
    ketamineEl.nextElementSibling.style.display = 'inline'; // “ mg”

    ketamineExtra.innerHTML = `${stripZeros(kVolMin)}–${stripZeros(kVolMax)} mL of 10 mg/mL`;

    // — ROCURONIUM: 1 mg/kg @ 10 mg/mL —
    const rDose    = 1   * w,                 // mg
          rVol     = (rDose / 10).toFixed(2);  // mL

    rocuroniumEl.textContent   = stripZeros(rDose.toFixed(1));
    rocuroniumEl.style.display = 'inline';
    rocuroniumEl.nextElementSibling.style.display = 'inline'; // “ mg”

    rocuroniumExtra.innerHTML = `${stripZeros(rVol)} mL of 10 mg/mL`;

    // — ATROPINE: 20 mcg/kg @ 600 mcg/mL —
    const aDose    = 20  * w,                   // mcg
          aVol     = (aDose / 600).toFixed(2);    // mL

    atropineEl.textContent   = stripZeros(aDose.toFixed(1));
    atropineEl.style.display = 'inline';
    atropineEl.nextElementSibling.style.display = 'inline'; // “ mcg”

    atropineExtra.innerHTML = `${stripZeros(aVol)} mL of 600 mcg/mL`;

// — SUXAMETHONIUM IV: age-tailored dose @ 50 mg/mL —
const rawAge = parseFloat(ageInput.value) || 0;
const ageY   = ageUnit === 'months' ? rawAge/12 : rawAge;

// neonates & infants (<1yr) get 2 mg/kg, older get 1 mg/kg
const suxDose = (ageY < 1 ? 2 : 1) * w;

// write dose
suxIvEl.textContent   = stripZeros(suxDose.toFixed(1));
suxIvEl.style.display = 'inline';
suxIvEl.nextElementSibling.style.display = 'inline'; // “ mg”

// and volume
const suxVol = stripZeros((suxDose/50).toFixed(2));
suxIvExtra.innerHTML  = `${suxVol} mL of 50 mg/mL`;
    
    // grab the new span
const suxRange = document.getElementById('sux-range');

// your age-based rule: for example,
//  -- under 1 year → 2 mg/kg
//  -- 1 year and over → 1 mg/kg
if (ageY < 1) {
  suxRange.textContent = '2';
} else {
  suxRange.textContent = '1';
}

    // — SUXAMETHONIUM IM: 4 mg/kg (max 150 mg) @ 50 mg/mL —
    let imDose = 4 * w;
    if (imDose > 150) imDose = 150;
    const imVol = (imDose / 50).toFixed(2); // mL

    suxImEl.textContent   = stripZeros(imDose.toFixed(1));
    suxImEl.style.display = 'inline';
    suxImEl.nextElementSibling.style.display = 'inline'; // “ mg”

    suxImExtra.innerHTML = `${stripZeros(imVol)} mL of 50 mg/mL`;

    // — DEFIBRILLATION ENERGY 4 J/kg — (no “of X” needed; it’s joules)
    const defibDose = 4 * w; // J
    defibEl.textContent     = stripZeros(defibDose.toFixed(1));
    defibEl.style.display   = 'inline';
    defibEl.nextElementSibling.style.display = 'inline'; // “ J”

    // — ADRENALINE IV 1:10,000 is 0.1 mg/mL; dose = 0.1 mL/kg × w —
    const adrVol = (0.1 * w).toFixed(2), // mL
          adrMg  = (adrVol * 0.1).toFixed(2); // mg

    adrenalineEl.textContent   = stripZeros(adrVol); 
    adrenalineEl.style.display = 'inline';
    adrenalineEl.nextElementSibling.style.display = 'inline'; // “ mL”

    adrenalineExtra.innerHTML = `${stripZeros(adrVol)} mL of 0.1 mg/mL`;

// — FLUID BOLUS 10–20 mL/kg —
    const bolusEl   = document.getElementById('fluidbolus'),
          bolusUnit = bolusEl.nextElementSibling; // “ mL”
    const bolusMin  = Math.round(10 * w),
          bolusMax  = Math.round(20 * w);

    bolusEl.textContent    = `${bolusMin}–${bolusMax}`;
    bolusEl.style.display  = 'inline';
    if (bolusUnit && bolusUnit.classList.contains('unit')) {
      bolusUnit.style.display = 'inline';
    }

    // — GLUCOSE 10% 2 mL/kg —
    const glucoseEl   = document.getElementById('glucose10'),
          glucoseUnit = glucoseEl.nextElementSibling; // “ mL”
    const gluDose     = stripZeros((2 * w).toFixed(1));

    glucoseEl.textContent    = gluDose;
    glucoseEl.style.display  = 'inline';
    if (glucoseUnit && glucoseUnit.classList.contains('unit')) {
      glucoseUnit.style.display = 'inline';
    }
  }
  else {
    // hide fentanyl/ketamine/etc.
    [fentanylEl, ketamineEl, rocuroniumEl,
     atropineEl, suxIvEl, suxImEl,
     defibEl, adrenalineEl].forEach(el => {
      el.style.display = 'none';
      const unitSpan = el.nextElementSibling;
      if (unitSpan && unitSpan.classList.contains('unit')) {
        unitSpan.style.display = 'none';
      }
    });
    // clear all “-vol-extra” text
    [fentanylExtra, ketamineExtra, rocuroniumExtra,
     atropineExtra, adrenalineExtra, suxIvExtra, suxImExtra]
      .forEach(clearOldLine);

    // hide bolus/glucose
    const bolusEl   = document.getElementById('fluidbolus'),
          bolusUnit = bolusEl.nextElementSibling;
    bolusEl.style.display = 'none';
    if (bolusUnit && bolusUnit.classList.contains('unit')) {
      bolusUnit.style.display = 'none';
    }

    const glucoseEl   = document.getElementById('glucose10'),
          glucoseUnit = glucoseEl.nextElementSibling;
    glucoseEl.style.display = 'none';
    if (glucoseUnit && glucoseUnit.classList.contains('unit')) {
      glucoseUnit.style.display = 'none';
    }
  }
}
  
function updateSedation(w) {
  const midazEl = document.getElementById('midaz-sed');
  const morphEl = document.getElementById('morphine-sed');
  const propEl  = document.getElementById('propofol-sed');

  if (w > 0 && !isNaN(w)) {
    // Midazolam sedation: 3 mg/kg in 50 mL bag → 1 mL/h = 1 mcg/kg/min
    const midazTotal = 3 * w;
    midazEl.textContent = 
      `${stripZeros(midazTotal.toFixed(2))} mg in 50 mL 0.9% sodium chloride`;

    // Morphine sedation: 1 mg/kg in 50 mL bag → 1 mL/h = 20 mcg/kg/h
    const morphTotal = 1 * w;
    morphEl.textContent = 
      `${stripZeros(morphTotal.toFixed(2))} mg in 50 mL 0.9% sodium chloride`;

    // Propofol sedation: 1–4 mg/kg/h at 10 mg/mL
    const propMin = 1 * w;
    const propMax = 4 * w;
    const mlMin   = propMin / 10;
    const mlMax   = propMax / 10;
    propEl.textContent =
      `${stripZeros(propMin.toFixed(2))}–${stripZeros(propMax.toFixed(2))} mg/hr; ` +
      `${stripZeros(mlMin.toFixed(2))}–${stripZeros(mlMax.toFixed(2))} mL/h`;
  } else {
    midazEl.textContent = '';
    morphEl.textContent = '';
    propEl.textContent  = '';
  }
}
  
    function updateGADrugs(w) {
  // 1) first, clear out any old “extra” notes
  [
    'fentanyl-ga-extra',
    'propofol-ga-extra',
    'rocuronium-ga-extra',
    'ondansetron-ga-extra',
    'dexamethasone-ga-extra'
  ].forEach(extraId => {
    const el = document.getElementById(extraId);
    if (el) el.textContent = '';
  });
      
       const rawAge = parseFloat(ageInput.value) || 0;
  const ageY = ageUnit === 'months' ? rawAge/12 : rawAge;

// 2) list of GA drugs + their dosing/concentration info
  const drugs = [
    { 
      id:           'fentanyl-ga',
      minDose:      1,    // mcg/kg
      maxDose:      2,    // mcg/kg
      conc:         50,   // mcg per mL
      unitLabel:    'mcg',
      extraId:      'fentanyl-ga-extra'
    },
    {
      id:           'propofol',
      minDose:      3,    // mg/kg
      maxDose:      5,    // mg/kg
      conc:         10,   // mg per mL
      unitLabel:    'mg',
      extraId:      'propofol-ga-extra'
    },
    {
      id:           'rocuronium-ga',
      minDose:      0.6,  // mg/kg  (single‐value)
      maxDose:      0.6,  // same
      conc:         10,   // mg per mL
      unitLabel:    'mg',
      extraId:      'rocuronium-ga-extra'
    },
    {
      id:           'ondansetron',
      minDose:      0.15, // mg/kg
      maxDose:      0.15, // same
      conc:         2,    // mg per mL
      unitLabel:    'mg',
      extraId:      'ondansetron-ga-extra',
      cap:          4
    },
    {
      id:           'dexamethasone',
      minDose:      0.15, // mg/kg
      maxDose:      0.15, // same
      conc:         3.3,  // mg per mL
      unitLabel:    'mg',
      extraId:      'dexamethasone-ga-extra',
      cap:          6.6
    }
  ];      
      
// if <6 months, don’t even include ondansetron in the list
  const filteredDrugs = drugs.filter(d => !(d.id === 'ondansetron' && ageY < 0.5));      
      
 // ATROPINE
document.querySelectorAll('.atropine-dose').forEach(el => {
  // 20 mcg/kg @ 600 mcg/mL
  const doseMcg = 20 * w;                 // in mcg
  const doseText = stripZeros(doseMcg.toFixed(1));
  el.textContent   = doseText;
  el.style.display = 'inline';
  const unit = el.nextElementSibling;
  if (unit && unit.classList.contains('unit')) {
    unit.style.display = 'inline';
  }
});
document.querySelectorAll('.atropine-extra').forEach(el => {
  // volume in mL
  const vol = stripZeros(((20 * w) / 600).toFixed(2));
  el.textContent = `${vol} mL of 600 mcg/mL`;
});

// SUXAMETHONIUM IV: age-tailored dose @ 50 mg/mL
document.querySelectorAll('.sux-iv-dose').forEach(el => {
  const suxDose = (ageY < 1 ? 2 : 1) * w;
  el.textContent   = stripZeros(suxDose.toFixed(1));
  el.style.display = 'inline';
  const unit = el.nextElementSibling;
  if (unit && unit.classList.contains('unit')) {
    unit.style.display = 'inline';
  }
});
document.querySelectorAll('.sux-iv-extra').forEach(el => {
  const suxDose = (ageY < 1 ? 2 : 1) * w;
  const vol     = stripZeros((suxDose/50).toFixed(2));
  el.textContent = `${vol} mL of 50 mg/mL`;
});

// SUXAMETHONIUM IM (4 mg/kg, capped at 150 mg @ 50 mg/mL)
document.querySelectorAll('.sux-im-dose').forEach(el => {
  let dose = 4 * w;
  if (dose > 150) dose = 150;
  const doseText = stripZeros(dose.toFixed(1));
  el.textContent   = doseText;
  el.style.display = 'inline';
  const unit = el.nextElementSibling;
  if (unit && unit.classList.contains('unit')) {
    unit.style.display = 'inline';
  }
});
document.querySelectorAll('.sux-im-extra').forEach(el => {
  let dose = 4 * w;
  if (dose > 150) dose = 150;
  const vol = stripZeros((dose / 50).toFixed(2));
  el.textContent = `${vol} mL of 50 mg/mL`;
});

// --- at top of updateGADrugs, after ageY is known ---
const suxGaRange = document.getElementById('sux-ga-range');

// decide your rule, e.g. under 1 year → 2 mg/kg, otherwise 1–2
if (ageY < 1) {
  suxGaRange.textContent = '2';
} else {
  suxGaRange.textContent = '1';
}      
      
       // — Cyclizine (0.5–1 mg/kg; max 25 mg <12 y; 50 mg ≥12 y; 50 mg/mL) —
  const cylEl    = document.getElementById('cyclizine');
  const cylUnit  = cylEl.nextElementSibling;     // “mg”
  const cylNote  = document.getElementById('cyclizine-ga-extra');
  if (w > 0 && !isNaN(w)) {
    // compute uncapped range
    let minD = 0.5 * w;
    let maxD = 1.0 * w;
    // apply the caps
    const cap = ageY < 12 ? 25 : 50;
    if (minD > cap) minD = cap;
    if (maxD > cap) maxD = cap;
    // render dose text
    const doseText = (Math.abs(minD - maxD) < 0.01)
      ? stripZeros(minD.toFixed(2))
      : `${stripZeros(minD.toFixed(2))}–${stripZeros(maxD.toFixed(2))}`;
    cylEl.textContent   = doseText;
    cylEl.style.display = 'inline';
    if (cylUnit && cylUnit.classList.contains('unit')) {
      cylUnit.style.display = 'inline';
    }
    // volume at 50 mg/mL
    const vMin = (minD / 50).toFixed(2);
    const vMax = (maxD / 50).toFixed(2);
    const volText = (minD === maxD)
      ? `${stripZeros(vMin)} mL of 50 mg/mL`
      : `${stripZeros(vMin)}–${stripZeros(vMax)} mL of 50 mg/mL`;
    cylNote.textContent = volText;
  } else {
    // hide if no weight
    cylEl.textContent   = '';
    cylEl.style.display = 'none';
    if (cylUnit && cylUnit.classList.contains('unit')) {
      cylUnit.style.display = 'none';
    }
    cylNote.textContent = '';
  }

if (w > 0 && !isNaN(w)) {
  filteredDrugs.forEach(({ id, minDose, maxDose, conc, unitLabel, extraId, cap }) => {
    // 1) raw doses
    let rawMin = minDose * w;
    let rawMax = maxDose * w;

    // 2) clamp to cap if provided
    if (typeof cap === 'number') {
      rawMin = Math.min(rawMin, cap);
      rawMax = Math.min(rawMax, cap);
    }

    // 3) format with your stripZeros util
    const dMin     = stripZeros(rawMin.toFixed(1));
    const dMax     = stripZeros(rawMax.toFixed(1));
    const doseText = (rawMin === rawMax) ? dMin : `${dMin}–${dMax}`;

    // 4) inject into the DOM exactly as you did before
    const spanEl  = document.getElementById(id);
    spanEl.textContent = doseText;
    spanEl.style.display = 'inline';
    const unitSpan = spanEl.nextElementSibling;
    if (unitSpan && unitSpan.classList.contains('unit')) {
      unitSpan.style.display = 'inline';
    }

    // 5) compute & inject the “extra” volume note
    const extraEl = document.getElementById(extraId);
    const vMin    = stripZeros((rawMin / conc).toFixed(2));
    const vMax    = stripZeros((rawMax / conc).toFixed(2));
    const volText = (rawMin === rawMax) ? `${vMin}` : `${vMin}–${vMax}`;
    extraEl.innerHTML = `${volText} mL of ${conc}${unitLabel}/mL`;
  });
}
  else {
    // 4) if no valid weight, hide all dose spans + units, leave extras blank
    drugs.forEach(({ id, extraId }) => {
      const spanEl = document.getElementById(id);
      spanEl.style.display = 'none';
      const unitSpan = spanEl.nextElementSibling;
      if (unitSpan && unitSpan.classList.contains('unit')) {
        unitSpan.style.display = 'none';
      }
      // extra cell was already cleared at top
    });
  }
}

function updateAntibiotics(w) {
 // ── Teicoplanin ─────────────────────────────────────────────
  const dosingEl    = document.getElementById('teicoplanin-dosing');
  const teiEl       = document.getElementById('teicoplanin');
  const teiUnitSpan = teiEl.nextElementSibling;    // the “mg” span
  const noteEl      = document.getElementById('teicoplanin-note');
  const rawAge      = parseFloat(ageInput.value) || 0;
  const ageMonths   = ageUnit === 'months' ? rawAge : rawAge * 12;
  const ageYears    = ageMonths / 12;

  // prepare outputs
  let doseText   = '';
  let noteText   = '';
  let numericMg  = 0;

  if (w > 0 && ageMonths >= 2) {
    if (ageYears < 11) {
      doseText  = '10 mg/kg (Max 400 mg)';
      noteText  = 'Children aged 2 months – 11 years';
      numericMg = Math.min(10 * w, 400);
    } else if (ageYears < 18) {
      doseText  = '6 mg/kg (Max 400 mg)';
      noteText  = 'Children aged 12 – 17 years';
      numericMg = Math.min(6 * w, 400);
    }
  }

  // always keep the cell but toggle its contents
  dosingEl.textContent      = doseText;
  dosingEl.style.display    = 'table-cell';         // leave empty cell when blank

  // show or hide the number + unit
  teiEl.textContent         = numericMg ? stripZeros(numericMg.toFixed(2)) : '';
  teiEl.style.display       = numericMg ? 'inline' : 'none';
  teiUnitSpan.style.display = numericMg ? 'inline' : 'none';

  // note below
  noteEl.textContent        = noteText;

  // show or hide
  if (doseText) {
    dosingEl.textContent    = doseText;
    dosingEl.style.display  = 'table-cell';

    teiEl.textContent       = stripZeros(numericMg.toFixed(2));
    teiEl.style.display     = 'inline';
    teiUnitSpan.style.display = 'inline';

    noteEl.textContent      = noteText;
 } else {
  // clear everything and hide the number + unit
  dosingEl.textContent       = '';
  dosingEl.style.display     = 'table-cell';

  teiEl.textContent          = '';
  teiEl.style.display        = 'none';
  teiUnitSpan.style.display  = 'none';

  noteEl.textContent         = '';
}
  
  const meds = [
    { id: 'amoxicillin',    dosePerKg: 30, max: 1000 },
    { id: 'cefuroxime',     dosePerKg: 50, max: 1500 },
    { id: 'co-amoxiclav',   dosePerKg: 30, max: 1200 },
    { id: 'flucloxacillin', dosePerKg: 25, max: 1000 },
    { id: 'flucloxacillin-bone', dosePerKg: 50, max: 2000 },
    { id: 'gentamicin',     dosePerKg: 2.5,  max: 160 },
    { id: 'gentamicin-high',     dosePerKg: 5,  max: 480 },
    { id: 'metronidazole',  dosePerKg: 30,   max: 500 }
  ];

  meds.forEach(m => {
    const el       = document.getElementById(m.id);
    const unitSpan = el.nextElementSibling; // the “mg” span
    let text        = '';

    if (w > 0 && !isNaN(w)) {
      if (m.dosePerKg) {
        let dose = m.dosePerKg * w;
        if (m.max) dose = Math.min(dose, m.max);
        text = stripZeros(dose.toFixed(2));
      } else {
        // flucloxacillin range
        const min = m.dosePerKgMin * w;
        const max = m.dosePerKgMax * w;
        let txt = `${stripZeros(min.toFixed(2))}–${stripZeros(max.toFixed(2))}`;
        if (m.max && max > m.max) {
          txt = `${stripZeros(Math.min(min, m.max).toFixed(2))}–${stripZeros(m.max.toFixed(2))}`;
        }
        text = txt;
      }
    }

    if (text) {
      el.textContent       = text;
      el.style.display     = 'inline';
      if (unitSpan) unitSpan.style.display = 'inline';
    } else {
      el.textContent       = '';
      el.style.display     = 'none';
      if (unitSpan) unitSpan.style.display = 'none';
    }
  });
}  
  
  // event wiring
  unitBtn.addEventListener('click', toggleAgeUnit);
  
 estToggle.addEventListener('change', () => {
   autoEstimate = estToggle.checked;

  if (autoEstimate) {
  weightIn.disabled = true;

  const n = parseFloat(ageInput.value);
  if (!isNaN(n) && n >= 0) {
    estimateWeight();
  }

  calculateBMI();   // ← ADD THIS LINE
} else {
  weightIn.disabled = false;
}
 });

 ageInput.addEventListener('input', () => {
  const rawAge = ageInput.value.trim();
  const rawW   = weightIn.value.trim();
   const n      = parseFloat(rawAge);
  const ageY   = (ageUnit === 'months') ? (n / 12) : n;

  // — IF age > 14: disable auto-estimate, clear weight, and bail out —
  if (!isNaN(ageY) && ageY > 14) {
    estToggle.checked    = false;
    autoEstimate         = false;
    weightIn.disabled    = false;
    weightIn.value       = '';
    weightIn.placeholder = '0';
    clearWeight();
    return;
  }

    if (autoEstimate) {                            // ← ADD this entire if‐block
    const n = parseFloat(rawAge);
    if (!isNaN(n) && n >= 0) {
      estimateWeight();
    } else {
      clearWeight();
    }
    return;
  }
   
  // ── If age is entered but weight is blank → clear everything and stop ──
  if (rawAge !== '' && rawW === '') {
    return clearWeight();
  }

  // ── If both age and weight are blank → clear everything and stop ──
  if (rawAge === '' && rawW === '') {
    return clearWeight();
  }

  // At this point: either both age & weight exist, or weight exists and age blank.

  // Parse age
  const a = parseFloat(rawAge);
  if (isNaN(a)) {
    return clearWeight();
  }

  // Convert age to “years” for airway/centiles
  const y = (ageUnit === 'months') ? (a / 12) : a;

  updateAirwayCalculations(y);

  const normals = getNormalValues(a, ageUnit);
  if (normals) {
    updateNormalCentiles(normals);
  }

  expandOpenAccordion();
});

  weightIn.addEventListener('input', () => {
     if (autoEstimate) {                            // ← ADD this line
    return;                                      // ← ADD: do nothing if Auto is ON
  }
    
    // 1) if no age has been entered, treat it as zero
  // ── NEW: if no age entered, assume age = 0 only if weight < 5kg ──
  const rawAge = ageInput.value.trim();
  const rawW   = weightIn.value.trim();

  if (rawW === '') {
    // if weight is blank, nothing to show
    return clearWeight();
  }

  // parse weight now that we know it's non‐blank
  const w = parseFloat(rawW);
  if (isNaN(w)) {
    return clearWeight();
  }

  if (rawAge === '') {
    // age was blank: only proceed if weight < 5 kg
    if (w < 5) {
      ageInput.value = '0';      // ← assume neonate
    } else {
      // if weight ≥ 5kg and no age → show nothing
      return clearWeight();
    }
  }
    const a    = parseFloat(ageInput.value),
      wnum = parseFloat(weightIn.value);
    if(isNaN(a)||isNaN(w)) return clearWeight();
    const y = ageUnit==='months'? a/12 : a;
    updateAirwayCalculations(y);
    const normals = getNormalValues(a, ageUnit);
    if(normals) updateNormalCentiles(normals);

    let disp = '', m = ageUnit==='months'? a : a*12;
    if(m<12) {
      const e = 0.5*m+4;
      if(Math.abs(e-w)<0.2) disp = `<p>(0.5 × Age in months) + 4 = ${stripZeros(w.toFixed(1))} <span class="unit">kg</span></p>`;
    } else {
      const e1 = 2*y+8;
      if(Math.abs(e1-w)<0.2) disp = `<p>(2 × Age) + 8 = ${stripZeros(w.toFixed(1))} <span class="unit">kg</span></p>`;
      else if(y>=6) {
        const e2 = 3*y+7;
        if(Math.abs(e2-w)<0.2) disp = `<p>(3 × Age) + 7 = ${stripZeros(w.toFixed(1))} <span class="unit">kg</span></p>`;
      }
    }
    calcDiv.innerHTML = disp;
     expandOpenAccordion();
  });

document.addEventListener('DOMContentLoaded', () => {
  clearWeight();
  weightIn.disabled = true;
  estToggle.checked = true;
  updateAntibiotics(0);    // ← this will hide all antibiotics on load
});
  
  // Reset everything back to the initial state
function resetForm() {
  // 1) clear the inputs
  ageInput.value = '';
  weightIn.value = '';
  // 2) reset the toggle back to years
  ageUnit = 'years';
  unitBtn.textContent = 'years';
  // 3) hide all existing outputs
  clearWeight();
  
   updateAntibiotics(0);
  updateSedation(0);
  
// 4) collapse any open accordion panels
  document.querySelectorAll('.accordion-header.active').forEach(header => {
    header.classList.remove('active');
    const content = header.nextElementSibling; // the .accordion-content
    content.classList.remove('show');
    content.style.maxHeight = null;
  });
  
}

// Optional: home button handler if you want
function goHome() {
  window.location.href = '/'; // or 'index.html'
}
  
  document.querySelectorAll('.accordion-header').forEach(header => {

    header.addEventListener('click', () => {

      const content = header.nextElementSibling;

      const isOpen = content.classList.contains('show');

      header.classList.toggle('active');

      content.classList.toggle('show');

      // Remove inline max-height after animation for better reset

      if (!isOpen) {

        content.style.maxHeight = content.scrollHeight + "px";

      } else {

        content.style.maxHeight = null;

      }

    });

  });

function expandOpenAccordion() {
  document.querySelectorAll('.accordion-content.show').forEach(content => {
    // clear any old inline height so the browser can re-measure
    content.style.maxHeight = null;
    // then set to its new scrollHeight
    content.style.maxHeight = content.scrollHeight + 'px';
  });
}

// =========================
// Gender Toggle Button
// =========================

const genderBtn = document.getElementById("GenderBtn");

let gender = "male"; // default

genderBtn.addEventListener("click", () => {

  if (gender === "male") {
    gender = "female";
    genderBtn.textContent = "Female";
    genderBtn.dataset.gender = "female";
  } else {
    gender = "male";
    genderBtn.textContent = "Male";
    genderBtn.dataset.gender = "male";
  }

  calculateBMI(); // recalc if needed later for centiles
});


// =========================
// BMI Calculation
// =========================

const weightInput = document.getElementById("weight");
const heightInput = document.getElementById("height");
const bmiOutput = document.getElementById("bmi-value");
const ibwOutput = document.getElementById("ibw-value");
const adjbwOutput = document.getElementById("adjbw-value");

function calculateBMI() {

  const weight = parseFloat(weightInput.value);
  const heightCm = parseFloat(heightInput.value);

  const rawAge = parseFloat(ageInput.value) || 0;
  const ageYears = ageUnit === 'months' ? rawAge / 12 : rawAge;

  // ── Do not show BMI / IBW under 2 years ──
  if (ageYears < 2) {
    bmiOutput.textContent = "—";
    ibwOutput.textContent = "Not applicable <2y";
    adjbwOutput.textContent = "";
    return;
  }

  if (!weight || !heightCm) {
    bmiOutput.textContent = "";
    ibwOutput.textContent = "";
    adjbwOutput.textContent = "";
    return;
  }

  const heightM = heightCm / 100;

  // BMI
  const bmi = weight / (heightM * heightM);
  const bmiRounded = bmi.toFixed(1);

   const result = getBMICentile(bmi, ageYears, gender);

  if (result) {

   const centileText = formatCentile(result.centile);

   bmiOutput.textContent =
  `${bmiRounded} kg/m² (${centileText} centile – ${result.category})`;

  } else {

    bmiOutput.textContent = `${bmiRounded} kg/m²`;

  }

// =========================
// IDEAL BODY WEIGHT
// =========================

const lms = getBMILMS(ageYears, gender);

let ibw = null;

if (lms) {
  const bmi50 = lms.M;   // 50th centile BMI from LMS
  ibw = bmi50 * heightM * heightM;

  const ibwRounded = ibw.toFixed(1);
  ibwOutput.textContent = `${ibwRounded} kg`;
} else {
  ibwOutput.textContent = "";
}

  // =========================
  // ADJUSTED BODY WEIGHT
  // =========================

  const adjbw = ibw + 0.35 * (weight - ibw);
  const adjbwRounded = adjbw.toFixed(1);

  adjbwOutput.textContent = `${adjbwRounded} kg`;
}

// ===============================
// UK-WHO BMI 50th centile (median)
// Age in years 2–18
// 2-decimal precision
// ===============================

function getBMICentile(bmi, ageYears, gender) {

  const lms = getBMILMS(ageYears, gender);
  if (!lms) return null;

  const z = lmsZ(bmi, lms.L, lms.M, lms.S);
  const centile = zToCentile(z);

  return {
    centile,
    category: classifyBMI(centile),
    z
  };
}

// =========================
// Event Listeners
// =========================

weightInput.addEventListener("input", calculateBMI);
heightInput.addEventListener("input", calculateBMI);
ageInput.addEventListener("input", calculateBMI);
