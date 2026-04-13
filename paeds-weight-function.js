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
