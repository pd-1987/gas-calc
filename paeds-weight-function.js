console.log("weight functions loaded");
// ===============================
// Paediatric Weight Estimate (LMS)
// Uses 50th centile (M)
// ===============================

// Map UI gender → data keys
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

  const genderKey = getGenderKey();

  if (!paedsWeightData || !paedsWeightData[genderKey]) return null;

  const dataset = paedsWeightData[genderKey];

  let closest = dataset[0];

  for (let i = 1; i < dataset.length; i++) {
    if (Math.abs(dataset[i].age - ageYears) < Math.abs(closest.age - ageYears)) {
      closest = dataset[i];
    }
  }

  return closest.M; // 50th centile
}

// ===============================
// LMS Z-score
// ===============================
function lmsZ(x, L, M, S) {
  if (L === 0) {
    return Math.log(x / M) / S;
  }
  return (Math.pow(x / M, L) - 1) / (L * S);
}

// ===============================
// Z → Centile
// ===============================
function zToCentile(z) {
  return 100 * (0.5 * (1 + erf(z / Math.sqrt(2))));
}

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
  const dataset = paedsWeightData[genderKey];

  let closest = dataset[0];

  for (let i = 1; i < dataset.length; i++) {
    if (Math.abs(dataset[i].age - ageYears) < Math.abs(closest.age - ageYears)) {
      closest = dataset[i];
    }
  }

  return closest;
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
    rounded % 10 === 1 && rounded !== 11 ? "st" :
    rounded % 10 === 2 && rounded !== 12 ? "nd" :
    rounded % 10 === 3 && rounded !== 13 ? "rd" : "th";

  return `${rounded}${suffix}`;
}
