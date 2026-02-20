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
  if (centile >= 98) return "Obese";
  if (centile >= 91) return "Overweight";
  return "Healthy weight";
}

