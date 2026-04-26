window.weightContext = {
  ibw: null,
  adjbw: null,
  isObese: false
};

const GA_DRUG_LIST = [
  'fentanyl',
  'propofol',
  'rocuronium',
  'atracurium_ga',
  'dexamethasone',
  'atropine',
  'sux_im',
  'sux_iv',
  'ondansetron',
  'cyclizine',
  'ibuprofeniv',
  'diclofenaciv',
  'ketorolac',
  'paracetamoliv'
];

const DRUGS = {
  // EMERGENCY DRUGS
fentanyl: {
  weight: 'AdjBW',
  dose: [1, 2],
  unit: 'mcg',
  conc: 50,
  outputId: ['fentanyl', 'fentanyl-ga'],
  extraId: ['fentanyl-vol-extra', 'fentanyl-ga-extra'],
  labelId: ['fentanyl-dose-text', 'fentanyl-ga-dose-text']
},
  ketamine: {
    weight: 'IBW',
    dose: [1, 2],
    unit: 'mg',
    conc: 10,
    outputId: 'ketamine',
    extraId: 'ketamine-vol-extra',
    labelId: 'ketamine-dose-text'
  },
  propofol_infusion: {
  type: 'infusion_range_split', // 🔥 new type
  weight: 'AdjBW',
  dose: [1, 4],
  unit: 'mg',
  conc: 10,
  per: 'hr',
  outputId: {
    mg: 'propofol-sed-mg',
    ml: 'propofol-sed-ml'
  }
  },
  midazolam_bag: {
  type: 'infusion_bag',
  weight: 'TBW',
  dosePerKgHr: 0.06, // ← example
  targetRate: 1,     // mL/hr you want
  bagVolume: 50,
  diluent: '0.9% sodium chloride',
  extraId: 'midaz-sed',
},
morphine_bag: {
  type: 'infusion_bag',
  weight: 'TBW',
  dosePerKgHr: 0.02, // ← example
  targetRate: 1,
  bagVolume: 50,
  diluent: '0.9% sodium chloride',
  extraId: 'morphine-sed',
},
  rocuronium: {
  weight: 'IBW',
  dose: [0.6, 1],
  unit: 'mg',
  conc: 10,
  outputId: ['rocuronium', 'rocuronium-ga'],
  extraId: ['rocuronium-vol-extra', 'rocuronium-ga-extra'],
  labelId: ['rocuronium-dose-text', 'rocuronium-ga-dose-text']
},
  atropine: {
  weight: 'TBW',
  dose: [20, 20],
  unit: 'mcg',
  conc: 600,
  cap: 600,
  outputId: ['atropine', 'atropine-ga'],
  extraId: ['atropine-vol-extra', 'atropine-ga-extra'],
  labelId: ['atropine-dose-text', 'atropine-ga-dose-text']
},
adrenaline_iv: {
  weight: 'TBW',
  dose: [10, 10],
  unit: 'mcg',
  conc: 100,
  concLabel: '1:10,000 (100 mcg/mL)', // ✅ add this
  outputId: 'adrenalineiv',
  extraId: 'adrenalineiv-vol-extra',
  labelId: 'adrenaline-dose-text'
},
 defib: {
  weight: 'TBW',
  dose: [4, 4],
  unit: 'J',
  outputId: 'defib',
  labelId: 'defib-dose-text'
},

fluid_bolus: {
  weight: 'TBW',
  dose: [10, 20],
  unit: 'mL',
  outputId: 'fluidbolus',
  labelId: 'fluidbolus-dose-text'
},

glucose10: {
  weight: 'TBW',
  dose: [2, 2],
  unit: 'mL',
  outputId: 'glucose10',
  labelId: 'glucose-dose-text'
},
  blood_volume: {
  weight: 'TBW'
},
    sux_im: {
  weight: 'TBW',
  dose: [4, 4],
  unit: 'mg',
  conc: 50,
  cap: 150,
  outputId: ['sux-im', 'sux-im-ga'],
  extraId: ['sux-im-vol-extra', 'sux-im-ga-extra'],
  labelId: ['sux-im-dose-text','sux-im-ga-dose-text']
},
  sux_iv: {
  weight: 'TBW',
  unit: 'mg',
  conc: 50,
  outputId: ['sux-iv', 'sux-iv-ga'],
  extraId: ['sux-iv-vol-extra', 'sux-iv-ga-extra'],
  labelId: ['sux-range', 'sux-ga-range'],

  getDose: (w, ageY) => {
    const perKg = ageY < 1 ? 2 : 1;
    const dose = perKg * w;

    return {
      min: dose,
      max: dose,
      perKg
    };
  }
},
  
  // GA DRUGS
  propofol: {
  weight: 'IBW',
  dose: [3, 5],
  unit: 'mg',
  conc: 10,
  outputId: 'propofol',
  extraId: 'propofol-ga-extra',
  labelId: 'propofol-dose-text'
},
atracurium_ga: {
  weight: 'IBW',
  dose: [0.5, 0.5],
  unit: 'mg',
  conc: 10,
  outputId: 'atracurium-ga',
  extraId: 'atracurium-ga-extra',
  labelId: 'atracurium-ga-dose-text'
},
  
 // ANTIEMETICS
ondansetron: {
  weight: 'TBW',
  unit: 'mg',
  conc: 2,
  outputId: 'ondansetron',
  extraId: 'ondansetron-ga-extra',
  labelId: 'ondansetron-dose-text',

  getDose: (w, ageY) => {
    if (w <= 0 || isNaN(w)) return null;

    // 🔥 <6 months → suppress calculation
    if (ageY < 0.5) {
      return {
        min: 0,
        max: 0,
        perKg: 0.15
      };
    }

    // ≥6 months
    const dose = Math.min(0.15 * w, 4);

    return {
      min: dose,
      max: dose,
      perKg: 0.15
    };
  },

  capLabel: (ageY) => {
    if (ageY < 0.5) return 'BNFC: ≥6 months';
    return 'Max 4 mg';
  }
},
  cyclizine: {
  weight: 'TBW',
  unit: 'mg',
  conc: 50,
  outputId: 'cyclizine',
  extraId: 'cyclizine-ga-extra',
  labelId: 'cyclizine-dose-text',

  capLabel: (ageY) => {
  if (ageY < 1/12) return '';
  return ageY < 12 ? 'Max 25 mg' : 'Max 50 mg';
},
    
  getDose: (w, ageY) => {
    if (w <= 0 || isNaN(w) || ageY < 1/12) return null;

    const cap = ageY < 12 ? 25 : 50;

    let min = 0.5 * w;
    let max = 1.0 * w;

    if (min > cap) min = cap;
    if (max > cap) max = cap;

    return {
  min,
  max,
  perKg: '0.5–1'
};
  }
},
dexamethasone: {
  weight: 'TBW',
  dose: [0.15, 0.15],
  unit: 'mg',
  conc: 3.3,
  cap: 6.6,
  outputId: 'dexamethasone',
  extraId: 'dexamethasone-ga-extra',
  labelId: 'dexamethasone-dose-text'
},
  // ANALGESIA - IV
 ibuprofeniv: {
  weight: 'AdjBW',

  getDose: (w, ageY) => {
    const ageMonths = ageY * 12;

    if (ageMonths < 3 || w < 5) {
      return {
        min: 0,
        max: 0,
        hideDose: true
      };
    }

    return {
      min: 5 * w,
      max: 10 * w,
      perKg: '5–10'
    };
  },

  unit: 'mg',
  outputId: 'ibuprofeniv',
  noteId: 'ibuprofeniv-note',
  labelId: 'ibuprofen-dose-text',

  cap: 400,

  notes: [
    {
      condition: ({ ageMonths, weight }) => ageMonths < 3 || weight < 5,
      text: 'Not recommended under 3 months or <5 kg'
    },
    {
      condition: () => true,
      text: 'Every 6–8 hours, max 30 mg/kg/day'
    }
  ]
},
diclofenaciv: {
  weight: 'AdjBW',
  unit: 'mg',
  conc: 25,
  outputId: 'diclofenaciv',
  labelId: 'diclofenac-dose-text',

  getDose: (w, ageY) => {
    if (w <= 0 || isNaN(w)) return null;

    // <2 years → zero dose (handled by renderer)
    if (ageY < 2) {
      return {
        min: 0,
        max: 0,
        perKg: 1
      };
    }

    const dose = Math.min(1 * w, 75);

    return {
      min: dose,
      max: dose,
      perKg: 1
    };
  },

  capLabel: (ageY) => {
    if (ageY < 2) return 'BNFC: ≥2 years';
    return 'Max 75 mg';
  }
},
 ketorolac: {
  weight: 'AdjBW',
  unit: 'mg',
  conc: 30,

  outputId: 'ketorolac',
  extraId: 'ketorolac-extra',
  labelId: 'ketorolac-dose-text',

  getDose: (w, ageY) => {
  if (w <= 0 || isNaN(w)) return null;

  // 🔥 NEW: <6 months → no calculated dose
  if (ageY < 0.5) {
    return {
      min: 0,
      max: 0,
      perKg: '0.5–1'
    };
  }

  // Paeds
  if (ageY < 16) {
    let min = 0.5 * w;
    let max = 1.0 * w;

    if (min > 15) min = 15;
    if (max > 15) max = 15;

    return {
      min,
      max,
      perKg: '0.5–1'
    };
  }

  // Adult
  return {
    min: 30,
    max: 30,
    perKg: '0.5–1'
  };
},

  capLabel: (ageY) => {
  if (ageY < 0.5) return 'BNFC: ≥6 months';
  return ageY < 16 ? 'Max 15 mg' : 'Max 30 mg';
}
},
  paracetamoliv: {
  weight: 'AdjBW',
  unit: 'mg',
  outputId: 'paracetamol-iv',
  labelId: 'paracetamol-iv-inline',
  noteId: 'paracetamol-iv-note',

  getDose: (w) => {
    if (!w || isNaN(w)) return null;

    if (w <= 10) {
      return {
        min: 10 * w,
        max: 10 * w,
        perKg: '10'
      };
    }

    if (w <= 50) {
      return {
        min: 15 * w,
        max: 15 * w,
        perKg: '15'
      };
    }

    return {
      min: 1000,
      max: 1000,
      perKg: null
    };
  },

  notes: [
    {
      condition: ({ weight }) => weight <= 10,
      text: 'Every 4–6 h, max 30 mg/kg/day'
    },
    {
      condition: ({ weight }) => weight > 10 && weight <= 50,
      text: 'Every 4–6 h, max 60 mg/kg/day'
    },
    {
      condition: ({ weight }) => weight > 50,
      text: 'Every 4–6 h, max 4 g/day'
    }
  ],

  capLabel: (ageY, weight) => {
    if (weight < 10) return '<10 kg';
    return '';
  }
}
};



function clearText(id) {
  const el = document.getElementById(id);
  if (el) el.textContent = '';
}

function hideEl(id) {
  const el = document.getElementById(id);
  if (!el) return;

  el.textContent = '';
  el.style.display = 'none';

  const unit = el.nextElementSibling;
  if (unit && unit.classList.contains('unit')) {
    unit.style.display = 'none';
  }
}

function showEl(id, text) {
  const el = document.getElementById(id);
  if (!el) return;

  el.textContent = text;
  el.style.display = 'inline';

  const unit = el.nextElementSibling;
  if (unit && unit.classList.contains('unit')) {
    unit.style.display = 'inline';
  }
}

function clearGroup(ids) {
  ids.forEach(id => clearText(id));
}

function hideGroup(ids) {
  ids.forEach(id => hideEl(id));
}

// ===============================
// Paediatric Weight Estimate (LMS)
// Uses 50th centile (M)
// ===============================
function getGenderKey() {
  const genderContainer = document.getElementById("GenderBtn");

  const gender =
    genderContainer.dataset.gender ||
    genderContainer.querySelector("button.active")?.dataset.value ||
    "male";

  return gender === "female" ? "girls" : "boys";
}

// Get weight from LMS (nearest age)
function getWeightEstimateFromLMS(ageYears) {

  const lms = getWeightLMS(ageYears);
  if (!lms) return null;

  return lms.M;
}

// ===============================
// Z → Centile
// ===============================
// Error function approximation
function erf(x) {
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);

  const a1 = 0.254829592,
        a2 = -0.284496736,
        a3 = 1.421413741,
        a4 = -1.453152027,
        a5 = 1.061405429,
        p  = 0.3275911;

  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}

// ===============================
// Get LMS for age
// ===============================
function getWeightLMS(ageYears) {

  const genderKey = getGenderKey();

  if (!paedsWeightData || !paedsWeightData[genderKey]) return null;

  const dataset = paedsWeightData[genderKey];

  return interpolateLMS(dataset, ageYears); // ✅ smooth interpolation
}

// ===============================
// Get centile from weight
// ===============================
function getWeightCentile(weight, ageYears) {

  const lms = getWeightLMS(ageYears);
  if (!lms) return null;

  const z = lmsZ(weight, lms.L, lms.M, lms.S);
  const centile = zToCentile(z);

  return centile;
}

// ===============================
// Format centile nicely
// ===============================
function formatCentile(c) {
  if (c < 0.4) return "<0.4th";
  if (c > 99.6) return ">99.6th";

  const rounded = Math.round(c);

  const suffix =
    rounded % 10 === 1 && rounded % 100 !== 11 ? "st" :
    rounded % 10 === 2 && rounded % 100 !== 12 ? "nd" :
    rounded % 10 === 3 && rounded % 100 !== 13 ? "rd" :
    "th";

  return `${rounded}${suffix}`;
}

function updateWeightCentileDisplay() {
  const ageVal = parseFloat(ageInput.value);
  const weightVal = parseFloat(weightIn.value);

  if (!isNaN(ageVal) && !isNaN(weightVal)) {
    const ageY = ageUnit === 'months' ? ageVal / 12 : ageVal;
    const centile = getWeightCentile(weightVal, ageY);

    if (centile !== null) {
      calcDiv.innerHTML =
  `<small class="centile-text">${formatCentile(centile)} centile</small>`;
    }
  }
}

function interpolateLMS(data, age) {
  if (!data || data.length === 0) return null;

  if (age <= data[0].age) return data[0];
  if (age >= data[data.length - 1].age) return data[data.length - 1];

  for (let i = 0; i < data.length - 1; i++) {
    const a = data[i];
    const b = data[i + 1];

    if (age >= a.age && age <= b.age) {
      const t = (age - a.age) / (b.age - a.age);

      return {
        L: a.L + t * (b.L - a.L),
        M: a.M + t * (b.M - a.M),
        S: a.S + t * (b.S - a.S)
      };
    }
  }

  return null;
}

function lmsZ(bmi, L, M, S) {
  if (L === 0) return Math.log(bmi / M) / S;
  return (Math.pow(bmi / M, L) - 1) / (L * S);
}

function zToCentile(z) {
  return 0.5 * (1 + erf(z / Math.sqrt(2))) * 100;
}

function classifyBMI(centile) {

  if (centile < 0.4) return "Severely underweight";
  if (centile < 2) return "Underweight";
  if (centile < 91) return "Healthy weight";
  if (centile < 98) return "Overweight";
  if (centile < 99.6) return "Obese";

  return "Severely obese";
}

function getBMILMS(ageYears, gender) {

  if (ageYears < (1/12)) return null;

  const dataset =
    gender === "female"
      ? paedsBMIData.girls
      : paedsBMIData.boys;

  return interpolateLMS(dataset, ageYears);
}

function getHeightLMS(ageYears) {
  const genderKey = getGenderKey();

  if (!paedsHeightData || !paedsHeightData[genderKey]) return null;

  const dataset = paedsHeightData[genderKey];

  return interpolateLMS(dataset, ageYears);
}

function getHeightCentile(height, ageYears) {

  const lms = getHeightLMS(ageYears);
  if (!lms) return null;

  const z = lmsZ(height, lms.L, lms.M, lms.S);
  return zToCentile(z);
}

function estimateHeight() {
  
  const heightInput = document.getElementById("height");

  const a = parseFloat(ageInput.value);

  if (isNaN(a) || a < 0) return;

  const ageY = (ageUnit === 'months') ? (a / 12) : a;

  // Optional upper limit (match weight logic)
  if (ageY > 20) return;

  const lms = getHeightLMS(ageY);
  if (!lms) return;

  const estimatedHeight = lms.M;

  heightInput.value = stripZeros(estimatedHeight.toFixed(1));

  // Optional display (you can style this later)
  const heightCentileDisplay = document.getElementById("height-calculations");
  if (heightCentileDisplay) {
  }
  updateHeightCentileDisplay();
}

function updateHeightCentileDisplay() {
  const heightInput = document.getElementById("height");
  const heightVal = parseFloat(heightInput.value);
  const ageVal = parseFloat(ageInput.value);

  const el = document.getElementById("height-calculations");

  if (!el || isNaN(heightVal) || isNaN(ageVal)) {
    if (el) el.innerHTML = '';
    return;
  }

  const ageY = ageUnit === 'months' ? ageVal / 12 : ageVal;
  const centile = getHeightCentile(heightVal, ageY);

  el.innerHTML = centile !== null
    ? `<small class="centile-text">${formatCentile(centile)} centile</small>`
    : '';
}

// MAIN FUNCTIONS //

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
  const heightIn = document.getElementById('height');
  const unitBtn  = document.getElementById('AgeUnitBtn');
  const estToggle = document.getElementById('EstimateToggle');
  const calcDiv  = document.getElementById('weight-calculations');
  const hCalc = document.getElementById('height-calculations');
  if (hCalc) hCalc.innerHTML = '';

function updateEstimateLock() {
  weightIn.disabled = autoEstimate;
  heightIn.disabled = autoEstimate;
}

function clearWeight() {
  clearGroup([
    'fentanyl-vol-extra','ketamine-vol-extra','rocuronium-vol-extra',
    'atropine-vol-extra','adrenalineiv-vol-extra','sux-iv-vol-extra','sux-im-vol-extra',
    'fentanyl-ga-extra','propofol-ga-extra','rocuronium-ga-extra','atracurium-ga-extra',
    'ondansetron-ga-extra','dexamethasone-ga-extra',
    'ketorolac-extra','ketorolac-note','morphine-iv-extra','morphine-po-extra','morphine-po-inline',
    'paracetamol-iv-note','paracetamol-po-note',
    'cyclizine-ga-extra',
    'blood-volume-range'
  ]);

  // =========================
  // Calculations display
  // =========================
  calcDiv.innerHTML = '';
  if (hCalc) hCalc.innerHTML = '';

  // =========================
  // Airway
  // =========================
  hideGroup(['ett-uncuffed','ett-cuffed','ett-depth-lips']);
  clearText('laryngoscope');
  document.getElementById('laryngoscope').style.display = 'none';

  // =========================
  // Emergency drugs
  // =========================
  hideGroup([
    'fentanyl','ketamine','rocuronium',
    'atropine','sux-iv','sux-im',
    'defib','adrenalineiv','fluidbolus','glucose10'
  ]);

  // =========================
  // GA drugs
  // =========================
  hideGroup([
    'propofol','fentanyl-ga','rocuronium-ga','atracurium-ga',
    'dexamethasone','ondansetron',
    'paracetamol-iv','paracetamol-po',
    'ibuprofeniv','ibuprofenpo',
    'ketorolac','morphineiv','morphinepo','diclofenaciv'
  ]);

  // =========================
  // Premed
  // =========================
  hideGroup([
    'premed-midaz','premed-midaz-intranasal','premed-dexmed'
  ]);

  // =========================
  // Reversal
  // =========================
  document.querySelectorAll(
    '.sug-2-dose, .sug-4-dose, .neos-dose'
  ).forEach(el => {
    el.textContent = '';
    el.style.display = 'none';
    const unit = el.nextElementSibling;
    if (unit && unit.classList.contains('unit')) {
      unit.style.display = 'none';
    }
  });

  clearGroup(['.sug-2-extra', '.sug-4-extra', '.neos-extra']);

  // =========================
  // Airway adjuncts
  // =========================
  hideEl('igel');
  hideEl('tidalvolume');
  hideEl('tv-neonates-ards');

  // =========================
  // Normals
  // =========================
  clearGroup([
    'sbp-5','sbp-50','sbp-95',
    'hr-5','hr-95','rr-5','rr-95'
  ]);

  document.querySelectorAll('.normal-values .static')
    .forEach(el => el.style.display = 'none');

  // =========================
  // Blood volume
  // =========================
  hideEl('blood-volume');

  // =========================
  // Misc
  // =========================
  hideEl('cyclizine');

}

function updatePremedication(w) {

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
         `${stripZeros(neo.toFixed(2))} mg neostigmine + ` +
         `${stripZeros(gly.toFixed(2))} mg glycopyrulate`;
    });
  }
}
  
  function updateAnalgesics(w) {

const rawAge = parseFloat(ageInput.value) || 0;
const ageMonths = ageUnit === 'months' ? rawAge : rawAge * 12;
const ageY = ageMonths / 12;
    
[
  'paracetamol-po-note',
  'ibuprofenpo-note',
  'morphine-iv-extra',
  'morphine-po-extra',
  'paracetamol-po-inline'
].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.textContent = '';
});
    
if (!w || isNaN(w)) {
  // hide all outputs and STOP
  return;
}

  // 2) Calculate PO dose & note
let paraPODose, paraPONote, paraPOInline;

if (w > 0 && w <= 10) {
  paraPODose = 10 * w;
  const maxDailyLowPO = stripZeros((30 * w).toFixed(2));
  paraPOInline = '10 mg/kg';
  paraPONote = `Every 4–6 h, max 30 mg/kg/day = ${maxDailyLowPO} mg`;

} else if (w <= 50) {
  paraPODose = 15 * w;
  const maxDailyHighPO = stripZeros((60 * w).toFixed(2));
  paraPOInline = '15 mg/kg';
  paraPONote = `Every 4–6 h, max 60 mg/kg/day = ${maxDailyHighPO} mg`;

} else if (w > 50) {
  paraPODose = 1000;
  paraPOInline = '1 g';
  paraPONote = `Every 4–6 h, max 4 g/day`;

} else {
  paraPODose = 0;
  paraPOInline = '';
  paraPONote = '';
}

  // 4) Update PO span & note for Paracetamol
 const pPoEl       = document.getElementById('paracetamol-po');
const pPoUnit     = pPoEl.nextElementSibling;
const pPoNoteEl   = document.getElementById('paracetamol-po-note');
const pPoInlineEl = document.getElementById('paracetamol-po-inline');

if (paraPODose > 0) {
  pPoEl.textContent   = stripZeros(paraPODose.toFixed(2));
  pPoEl.style.display = 'inline';
  if (pPoUnit) pPoUnit.style.display = 'inline';

  // ✅ NEW inline dose (middle cell)
  pPoInlineEl.textContent = paraPOInline;
  pPoInlineEl.style.display = 'inline';

  // ✅ cleaned note (no mg/kg repetition)
  pPoNoteEl.innerHTML = paraPONote;
  pPoNoteEl.style.display = 'inline';

} else {
  pPoEl.textContent   = '';
  pPoEl.style.display = 'none';
  if (pPoUnit) pPoUnit.style.display = 'none';

  pPoInlineEl.textContent = '';
  pPoInlineEl.style.display = 'none';

  pPoNoteEl.textContent = '';
  pPoNoteEl.style.display = 'none';
}
    
   // — MORPHINE IV (0.05–0.1 mg/kg up to 12 y; ≥12 y → 5 mg) —
  const mIvEl   = document.getElementById('morphineiv');
  const mIvUnit = mIvEl.nextElementSibling; // “ mg”
  const mNoteEl = document.getElementById('morphine-iv-extra');

  if (w > 0 && !isNaN(w)) {

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
    mNoteEl.innerHTML = `Every 4 hours, adjusted to response`;
  } else {
    // hide Morphine IV span & unit, clear note
    mIvEl.textContent   = '';
    mIvEl.style.display = 'none';
    if (mIvUnit && mIvUnit.classList.contains('unit')) {
      mIvUnit.style.display = 'none';
    }
    mNoteEl.textContent = '';
  }
// — MORPHINE PO (age-stratified mcg/kg → mg) —
  const mPoEl    = document.getElementById('morphinepo');
  const mPoUnit  = mPoEl.nextElementSibling; // “ mg”
  const mPoNote  = document.getElementById('morphine-po-extra');

  if (w > 0 && !isNaN(w)) {

    let doseMinMg = 0, doseMaxMg = 0;
    let noteText = '';

    if (ageMonths >= 1 && ageMonths <= 2) {
      // 50–100 mcg/kg → (50/1000)–(100/1000) mg/kg
      doseMinMg  = (50  * w) / 1000;
      doseMaxMg  = (100 * w) / 1000;
      noteText   = 'Initially 50–100 mcg/kg every 4 hours, adjusted to response';
    }
    else if (ageMonths > 2 && ageMonths <= 5) {
      // 100–150 mcg/kg
      doseMinMg  = (100 * w) / 1000;
      doseMaxMg  = (150 * w) / 1000;
      noteText   = '100–150 mcg/kg every 4 hours, adjusted to response';
    }
    else if (ageMonths > 5 && ageMonths < 12) {
      // 200 mcg/kg exactly
      doseMinMg  = (200 * w) / 1000;
      doseMaxMg  = doseMinMg;
      noteText   = '200 mcg/kg every 4 hours, adjusted to response';
    }
    else if (Math.floor(ageY) === 1) {
      // exactly 1 year → 200–300 mcg/kg
      doseMinMg  = (200 * w) / 1000;
      doseMaxMg  = (300 * w) / 1000;
      noteText   = '200–300 mcg/kg, every 4 hours, adjusted to response';
    }
    else if (ageY >= 2 && ageY < 12) {
      // 2–11 years → 200–300 mcg/kg, max per dose 10 mg
      const rawMin = (200 * w) / 1000;
      const rawMax = (300 * w) / 1000;
      doseMinMg    = Math.min(rawMin, 10);
      doseMaxMg    = Math.min(rawMax, 10);
      noteText     = '200–300 mcg/kg, every 4 hours (max 10 mg/dose), adjusted to response';
    }
    else if (ageY >= 12 && ageY < 18) {
      // 12–17 years → 5–10 mg every 4 hours
      doseMinMg  = 5;
      doseMaxMg  = 10;
      noteText   = '5–10 mg every 4 hours, adjusted to response';
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
      // middle cell = mg/kg range (or flat dose)
const mPoInline = document.getElementById('morphine-po-inline');

// Extract just the dose part (before "every...")
let inlineText = '';
if (ageMonths >= 1 && ageMonths <= 2) {
  inlineText = '50–100 mcg/kg';
}
else if (ageMonths > 2 && ageMonths <= 5) {
  inlineText = '100–150 mcg/kg';
}
else if (ageMonths > 5 && ageMonths < 12) {
  inlineText = '200 mcg/kg';
}
else if (Math.floor(ageY) === 1) {
  inlineText = '200–300 mcg/kg';
}
else if (ageY >= 2 && ageY < 12) {
  inlineText = '200–300 mcg/kg';
}
else if (ageY >= 12 && ageY < 18) {
  inlineText = '5–10 mg';
}

// set middle cell
mPoInline.textContent = inlineText;

// sub row = frequency etc
mPoNote.innerHTML = `Every 4 hours, adjusted to response`;
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
    updateAll();
}

function estimateWeight() {
  if (!autoEstimate) return;
  
  const a = parseFloat(ageInput.value);

  if (isNaN(a) || a < 0) {
    return;
  }

  const ageY = (ageUnit === 'months') ? (a / 12) : a;

  // Stop above your existing cutoff
  if (ageY > 20) {
    estToggle.checked = false;
    weightIn.disabled = false;
    weightIn.value = '';
    weightIn.placeholder = '0';
    clearWeight();
    return;
  }

  // 🔥 LMS-based estimate
  const estimatedWeight = getWeightEstimateFromLMS(ageY);

  if (!estimatedWeight) {
    clearWeight();
    return;
  }

  const w = stripZeros(estimatedWeight.toFixed(2));
  weightIn.value = w;
  
updateWeightCentileDisplay();  
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

function updateAirwayCalculations(ageYears, w) {
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
      laryEl.appendChild(small);
    }
  } else {
    laryEl.style.display = 'none';
  }

  // ==========================
  // DRUG TABLE UPDATES
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
  
  function clearOldLine(id) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = '';
    }
  }

  [
    'fentanyl-vol-extra',
    'ketamine-vol-extra',
    'rocuronium-vol-extra',
    'atropine-vol-extra',
    'adrenalineiv-vol-extra',
    'sux-iv-vol-extra',
    'sux-im-vol-extra'
  ].forEach(clearOldLine);

  const fentanylEl   = document.getElementById('fentanyl'),
        ketamineEl   = document.getElementById('ketamine'),
        rocuroniumEl = document.getElementById('rocuronium'),
        atropineEl   = document.getElementById('atropine'),
        suxIvEl      = document.getElementById('sux-iv'),
        suxImEl      = document.getElementById('sux-im'),
        defibEl      = document.getElementById('defib'),
        adrenalineEl = document.getElementById('adrenalineiv');
  
  const fentanylExtra   = document.getElementById('fentanyl-vol-extra'),
        ketamineExtra   = document.getElementById('ketamine-vol-extra'),
        rocuroniumExtra = document.getElementById('rocuronium-vol-extra'),
        atropineExtra   = document.getElementById('atropine-vol-extra'),
        adrenalineExtra = document.getElementById('adrenalineiv-vol-extra'),
        suxIvExtra      = document.getElementById('sux-iv-vol-extra'),
        suxImExtra      = document.getElementById('sux-im-vol-extra');

  if (w > 0 && !isNaN(w)) {

  // UNIVERSAL DRUGS
[
  'fentanyl',
  'ketamine',
  'rocuronium',
  'atropine',
  'adrenaline_iv',
  'sux_im',
  'sux_iv',
  'defib',
  'fluid_bolus',
  'glucose10',
].forEach(d => renderDrug(d, w));

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
  // — BLOOD VOLUME (age-based mL/kg) —
const rawAge = parseFloat(ageInput.value) || 0;
const ageMonths = ageUnit === 'months' ? rawAge : rawAge * 12;

const bvEl    = document.getElementById('blood-volume');
const bvUnit  = bvEl.nextElementSibling; // " mL"
const bvRange = document.getElementById('blood-volume-range');

const { weight, label } = getDrugWeight('blood_volume', w);

if (weight > 0 && !isNaN(weight)) {

  let minPerKg, maxPerKg;

if (ageMonths < 3) {
  minPerKg = 80;
  maxPerKg = 90;
} else {
  minPerKg = 70;
  maxPerKg = 70;
}

  // middle cell
 let rangeText =
  (minPerKg === maxPerKg)
    ? `${minPerKg} mL/kg`
    : `${minPerKg}–${maxPerKg} mL/kg`;

if (label) {
  rangeText += `<br><small class="drug-weight-label">${label}</small>`;
}

bvRange.innerHTML = rangeText;

  // calculated volume
  const bvMin = minPerKg * weight;
  const bvMax = maxPerKg * weight;

  const bvText =
    Math.abs(bvMin - bvMax) < 0.001
      ? stripZeros(bvMin.toFixed(0))
      : `${stripZeros(bvMin.toFixed(0))}–${stripZeros(bvMax.toFixed(0))}`;

  bvEl.textContent   = bvText;
  bvEl.style.display = 'inline';

  if (bvUnit && bvUnit.classList.contains('unit')) {
    bvUnit.style.display = 'inline';
  }

} else {
  bvEl.textContent   = '';
  bvEl.style.display = 'none';

  if (bvUnit && bvUnit.classList.contains('unit')) {
    bvUnit.style.display = 'none';
  }

  bvRange.textContent = '';
}
}
  
function updateSedation(w) {
  if (w > 0 && !isNaN(w)) {
    renderDrug('midazolam_bag', w);
    renderDrug('morphine_bag', w);
    renderDrug('propofol_infusion', w);
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
      
if (w > 0 && !isNaN(w)) {
  GA_DRUG_LIST.forEach(d => renderDrug(d, w));
}

  const rawAge = parseFloat(ageInput.value) || 0;
  const ageY = ageUnit === 'months' ? rawAge/12 : rawAge;      
  const cylMaxEl = document.getElementById('cyclizine-max');
      
if (cylMaxEl) {
  if (w > 0 && !isNaN(w)) {
    cylMaxEl.textContent = ageY < 12 ? 'Max 25 mg' : 'Max 50 mg';
  } else {
    cylMaxEl.textContent = '';
  }
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
 doseText = `
  <span class="small-dose">
    <span>10 mg/kg</span>
    <span>Max 400 mg</span>
  </span>
`;
      noteText  = 'Children aged 2 months – 11 years';
      numericMg = Math.min(10 * w, 400);
    } else if (ageYears < 18) {
      doseText = `
  <span class="small-dose">
    <span>6 mg/kg</span>
    <span>Max 400 mg</span>
  </span>
`;
      noteText  = 'Children aged 12 – 17 years';
      numericMg = Math.min(6 * w, 400);
    }
  }

  // always keep the cell but toggle its contents
  dosingEl.style.display    = 'table-cell';         // leave empty cell when blank

  // show or hide the number + unit
  teiEl.textContent         = numericMg ? stripZeros(numericMg.toFixed(2)) : '';
  teiEl.style.display       = numericMg ? 'inline' : 'none';
  teiUnitSpan.style.display = numericMg ? 'inline' : 'none';

  // note below
  noteEl.textContent        = noteText;

  // show or hide
  if (doseText) {
    dosingEl.innerHTML   = doseText;
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

  updateEstimateLock();
  
  if (autoEstimate) {
  clearWeight();
  updateAll();
}
});

ageInput.addEventListener('input', () => {
  const val = parseFloat(ageInput.value);

  if (!isNaN(val) && val >= 0 && !autoEstimate) {
    autoEstimate = true;
    estToggle.checked = true;
    updateEstimateLock();
  }

  updateAll();
});

weightIn.addEventListener('input', () => {

  if (autoEstimate) return;

  const rawAge = ageInput.value.trim();
  const rawW   = weightIn.value.trim();

  if (rawW === '') return clearWeight();

  const w = parseFloat(rawW);

  if (isNaN(w)) return clearWeight();

if (rawAge === '') {
  return;
}

  updateAll();
});

heightIn.addEventListener('input', () => {

  // If auto mode is on → do nothing
  if (autoEstimate) return;

  const rawH = heightIn.value.trim();

  // Empty → just update dependent displays
  if (rawH === '') {
    updateHeightCentileDisplay();
    calculateBMI();
    return;
  }

  const h = parseFloat(rawH);

  // Invalid → same behaviour
  if (isNaN(h)) {
    updateHeightCentileDisplay();
    calculateBMI();
    return;
  }

  updateAll();
});

document.addEventListener('DOMContentLoaded', () => {
  clearWeight();
  estToggle.checked = true;
  autoEstimate = true;
  updateEstimateLock();
  updateAntibiotics(0);    // ← this will hide all antibiotics on load
});

function closeAllAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    const content = header.nextElementSibling;

    header.classList.remove('active');

    if (content) {
      content.classList.remove('show');
      content.style.maxHeight = null;
    }
  });
}

function resetForm() {
  // Clear inputs only
  ageInput.value = '';
  weightIn.value = '';
  heightIn.value = '';

  // Reset UI controls
  ageUnit = 'years';
  unitBtn.textContent = 'years';

  autoEstimate = true;
  estToggle.checked = true;
  updateEstimateLock();

  // Reset gender (optional)
  const genderContainer = document.getElementById("GenderBtn");
  genderContainer.dataset.gender = "male";
  genderContainer.querySelectorAll("button").forEach(b => b.classList.remove("active"));
  const defaultGender = genderContainer.querySelector('[data-value="male"]');
  if (defaultGender) defaultGender.classList.add("active");

  // Let your existing logic clear everything properly
  updateAll();
  closeAllAccordions(); 
}

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

const genderContainer = document.getElementById("GenderBtn");

genderContainer.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  genderContainer.querySelectorAll("button").forEach(b =>
    b.classList.remove("active")
  );

  btn.classList.add("active");

  genderContainer.dataset.gender = btn.dataset.value;

  updateAll();   // ✅ clean + centralised
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

  const genderContainer = document.getElementById("GenderBtn");

  const gender =
  genderContainer.dataset.gender ||
  genderContainer.querySelector("button.active")?.dataset.value ||
  "male";
  
// ── Allow BMI from 1 month, but flag under 2 years ──
if (ageYears < (1/12)) {
  bmiOutput.textContent = "";
  ibwOutput.textContent = "";
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
  const cssClass = getBMIClass(result.centile);

  bmiOutput.innerHTML =
  `${bmiRounded} kg/m²<br>
   <span class="${cssClass}">
     ${centileText} centile – ${result.category}
   </span>${ageYears < 2 ? '*' : ''}`;

if (result.centile >= 98) {
  openAccordionById('bmi-accordion-header');
}

} else {
  bmiOutput.textContent = `${bmiRounded} kg/m²`;
}
  
  function getBMIClass(centile) {
  if (centile < 2) return 'bmi-underweight';
  if (centile < 91) return 'bmi-healthy';
  if (centile < 98) return 'bmi-overweight';
  if (centile < 99.6) return 'bmi-obese';
  return 'bmi-severe';
}

// =========================
// IDEAL BODY WEIGHT
// =========================

const lms = getBMILMS(ageYears, gender);

let ibw = null;
let adjbw = null;

if (lms) {
  const bmi50 = lms.M;
  ibw = bmi50 * heightM * heightM;

  adjbw = ibw + 0.35 * (weight - ibw);

  if (ageYears < 2) {
    ibwOutput.textContent = `${ibw.toFixed(1)} kg*`;
    adjbwOutput.textContent = `${adjbw.toFixed(1)} kg*`;
  } else {
    ibwOutput.textContent = `${ibw.toFixed(1)} kg`;
    adjbwOutput.textContent = `${adjbw.toFixed(1)} kg`;
  }

} else {
  ibwOutput.textContent = "";
  adjbwOutput.textContent = "";
}
 
  window.weightContext.ibw = ibw;
  window.weightContext.adjbw = adjbw;
  window.weightContext.isObese = result.centile >= 98;
  
  const warning = document.getElementById("bmi-warning");

if (ageYears < 2) {
  warning.textContent = "*BMI centiles not validated <2 years";
} else {
  warning.textContent = "";
}
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

function openAccordionById(headerId) {
  const header = document.getElementById(headerId);
  if (!header) return;

  const content = header.nextElementSibling;

  if (!content.classList.contains('show')) {
    header.classList.add('active');
    content.classList.add('show');
    content.style.maxHeight = content.scrollHeight + 'px';
  }
}

function getDrugWeight(drugKey, tbw) {
  const config = DRUGS[drugKey];
  const { ibw, adjbw, isObese } = window.weightContext;

  switch (config.weight) {
case 'IBW':
  const useIBW = isObese && ibw;
  return {
    weight: useIBW ? ibw : tbw,
    label: useIBW ? 'IBW' : (isObese ? 'TBW' : null)
  };

case 'AdjBW':
  const useAdjBW = isObese && adjbw;
  return {
    weight: useAdjBW ? adjbw : tbw,
    label: useAdjBW ? 'AdjBW' : (isObese ? 'TBW' : null)
  };

case 'TBW':
default:
  return {
    weight: tbw,
    label: isObese ? 'TBW' : null
  };
  }
}

function setDoseLabel(drugKey, text) {
  const ids = DRUGS[drugKey].labelId;
  if (!ids) return; // 🔥 add this

  if (Array.isArray(ids)) {
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = text;
    });
  } else {
    const el = document.getElementById(ids);
    if (el) el.innerHTML = text;
  }
}

function toArray(val) {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

function renderDrug(drugKey, tbw) {
  const config = DRUGS[drugKey];
  if (!config) return;

  const { weight, label } = getDrugWeight(drugKey, tbw);
  const type = config.type || 'bolus';

   renderDrugNotes(config, weight, drugKey);
  
  switch (type) {
    case 'infusion_bag':
      return renderInfusionBag(config, weight, label, drugKey);

    case 'infusion_range_split':
      return renderInfusionRangeSplit(config, weight, label, drugKey);

    case 'bolus':
      return renderBolusDrug(config, weight, label, drugKey);

    case 'paracetamol':
  return renderParacetamol(config, weight, drugKey);  
      
    default:
      console.warn(`Unknown drug type: ${type}`, drugKey);
      return;
  }
}

function renderBolusDrug(config, weight, label, drugKey) {
  if (!config.dose && !config.getDose) return;

  let dMin, dMax, perKgLabel;

  // --- GET DOSE ---
  if (config.getDose) {
    const rawAge = parseFloat(ageInput.value) || 0;
    const ageY = ageUnit === 'months' ? rawAge / 12 : rawAge;

    const result = config.getDose(weight, ageY);

    if (!result || result.hideDose) {
      hideGroup(toArray(config.outputId));
      clearGroup(toArray(config.extraId));
      setDoseLabel(drugKey, '');
      renderDrugNotes(config, weight, drugKey);
      return;
    }

    dMin = result.min;
    dMax = result.max;
    perKgLabel = result.perKg;

  } else {
    const [minDose, maxDose] = config.dose;
    dMin = minDose * weight;
    dMax = maxDose * weight;
  }

  // --- CAP ---
  if (config.cap) {
    dMin = Math.min(dMin, config.cap);
    dMax = Math.min(dMax, config.cap);
  }

  const outputIds = toArray(config.outputId);
  const extraIds  = toArray(config.extraId);

if (dMin === 0 && dMax === 0) {
  hideGroup(outputIds);
  clearGroup(extraIds);

  if (config.labelId) {
    let labelText = `${perKgLabel || '0.5–1'} ${config.unit}/kg`;
    setDoseLabel(drugKey, labelText);
  }

  if (config.capLabel) {
    const rawAge = parseFloat(ageInput.value) || 0;
    const ageY = ageUnit === 'months' ? rawAge / 12 : rawAge;

    const capEl = document.getElementById(`${drugKey}-max`);
    if (capEl) capEl.textContent = config.capLabel(ageY);
  }

  return;
}
  
  const sameDose = Math.abs(dMin - dMax) < 0.0001;

  const doseText = sameDose
    ? stripZeros(dMin.toFixed(1))
    : `${stripZeros(dMin.toFixed(1))}–${stripZeros(dMax.toFixed(1))}`;

  // --- OUTPUT ---
  outputIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    el.textContent = doseText;
    el.style.display = 'inline';

    const unit = el.nextElementSibling;
    if (unit && unit.classList.contains('unit')) {
      unit.style.display = 'inline';
    }
  });

  // --- VOLUME ---
  if (config.conc && extraIds.length) {
    const vMin = dMin / config.conc;
    const vMax = dMax / config.conc;

    const sameVol = Math.abs(vMin - vMax) < 0.0001;

    const volText = sameVol
      ? stripZeros(vMin.toFixed(2))
      : `${stripZeros(vMin.toFixed(2))}–${stripZeros(vMax.toFixed(2))}`;

    extraIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;

      const concText = config.concLabel || `${config.conc} ${config.unit}/mL`;
      el.innerHTML = `${volText} mL of ${concText}`;
    });
  }

  // --- LABEL ---
  if (config.labelId) {
    let finalLabel = '';

   if (perKgLabel) {
  finalLabel = `${perKgLabel} ${config.unit}/kg`;
} else if (config.dose) {
      const [minDose, maxDose] = config.dose;
      finalLabel = (minDose === maxDose)
        ? `${minDose} ${config.unit}/kg`
        : `${minDose}–${maxDose} ${config.unit}/kg`;
    }

    if (label) {
      finalLabel += `<br><small class="drug-weight-label">${label}</small>`;
    }

    setDoseLabel(drugKey, finalLabel);
  }

  // --- CAP LABEL (e.g. cyclizine) ---
  if (config.capLabel) {
    const rawAge = parseFloat(ageInput.value) || 0;
    const ageY = ageUnit === 'months' ? rawAge / 12 : rawAge;

    const capEl = document.getElementById(`${drugKey}-max`);
    if (capEl) {
      capEl.textContent = config.capLabel(ageY, weight) || '';
    }
  }
}

function renderInfusionBag(config, weight, label, drugKey) {
  const mgPerHr = config.dosePerKgHr * weight;

  const conc = mgPerHr / config.targetRate; // mg/mL
  const bagMg = conc * config.bagVolume;

  const labelText = label
  ? ` <small class="drug-weight-label">(${label})</small>`
  : '';

const text =
  `${stripZeros(bagMg.toFixed(2))} mg in ${config.bagVolume} mL ${config.diluent}${labelText}`;

  toArray(config.extraId).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    el.innerHTML = text;
    el.style.display = 'inline';
  });

  if (config.dosePerKgHr) {
    const labelText = `${config.dosePerKgHr} mg/kg/hr`;

    setDoseLabel(
      drugKey,
      label
        ? `${labelText} <small class="drug-weight-label">(${label})</small>`
        : labelText
    );
  }
}
function renderInfusionRangeSplit(config, weight, label, drugKey) {
  if (!config.dose) return;

  const [minDose, maxDose] = config.dose;

  let rateMin = minDose * weight;
  let rateMax = maxDose * weight;

  // per min → per hour
  if (config.per === 'min') {
    rateMin *= 60;
    rateMax *= 60;
  }

  const mgMin = rateMin;
  const mgMax = rateMax;

  const mlMin = config.conc ? mgMin / config.conc : null;
  const mlMax = config.conc ? mgMax / config.conc : null;

  // 🔹 MG/HR OUTPUT (with label here)
  const mgText = (mgMin === mgMax)
    ? `${stripZeros(mgMin.toFixed(2))}`
    : `${stripZeros(mgMin.toFixed(2))}–${stripZeros(mgMax.toFixed(2))}`;

  const mgEl = document.getElementById(config.outputId.mg);
  if (mgEl) {
    mgEl.innerHTML = label
  ? `${mgText} mg/hr <small class="drug-weight-label">(${label})</small>`
  : `${mgText} mg/hr`;
  }

  // 🔹 ML/HR OUTPUT (separate line/location)
  if (mlMin !== null) {
    const mlText = (mlMin === mlMax)
      ? `${stripZeros(mlMin.toFixed(2))}`
      : `${stripZeros(mlMin.toFixed(2))}–${stripZeros(mlMax.toFixed(2))}`;

    const mlEl = document.getElementById(config.outputId.ml);
    if (mlEl) {
      mlEl.textContent = `${mlText} mL/hr`;
    }
  }
}

function renderDrugNotes(config, weight, drugKey) {
  if (!config.notes || !config.noteId) return;

  const rawAge = parseFloat(ageInput.value) || 0;
  const ageMonths = ageUnit === 'months' ? rawAge : rawAge * 12;

  const note = config.notes.find(n =>
    n.condition({ ageMonths, weight })
  );

  toArray(config.noteId).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    if (note) {
      el.textContent = note.text;
      el.style.display = 'inline';
    } else {
      el.textContent = '';
      el.style.display = 'none';
    }
  });
}

function updateAll() {
  const rawAge = ageInput.value.trim();
  const a = parseFloat(rawAge);

  if (isNaN(a) || a < 0) {
    clearWeight();
    return;
  }

  const y = ageUnit === 'months' ? a / 12 : a;

  if (y > 20) {
  estToggle.checked = false;
  autoEstimate = false;
  updateEstimateLock();
  clearWeight();
  return;
}

  if (autoEstimate) {
    estimateWeight();
    estimateHeight();
  }
  calculateBMI();
 const w = parseFloat(weightIn.value);
updateAirwayCalculations(y, w);

  const normals = getNormalValues(a, ageUnit);
  if (normals) updateNormalCentiles(normals);

 
  updateWeightCentileDisplay();
  updateHeightCentileDisplay();

  expandOpenAccordion();
}
