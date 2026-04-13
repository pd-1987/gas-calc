console.log("BMI centile functions loaded. Fixed.");

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

function erf(x) {
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1 / (1 + p * x);
  const y =
    1 -
    (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) *
      t *
      Math.exp(-x * x));

  return sign * y;
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

  if (!ageYears || ageYears < 2) return null;

  const dataset =
    gender === "female"
      ? paedsBMIData.girls
      : paedsBMIData.boys;

  return interpolateLMS(dataset, ageYears);
}

function formatCentile(c) {
  const rounded = Math.round(c);

  const suffix =
    rounded % 10 === 1 && rounded % 100 !== 11 ? "st" :
    rounded % 10 === 2 && rounded % 100 !== 12 ? "nd" :
    rounded % 10 === 3 && rounded % 100 !== 13 ? "rd" :
    "th";

  return `${rounded}${suffix}`;
}
