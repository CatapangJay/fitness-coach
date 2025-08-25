export const KG_PER_LB = 0.45359237;
export const CM_PER_IN = 2.54;

export function kgToLb(kg: number): number {
  return kg / KG_PER_LB;
}

export function lbToKg(lb: number): number {
  return lb * KG_PER_LB;
}

export function cmToFeetInches(cm: number): { ft: number; in: number } {
  const totalIn = cm / CM_PER_IN;
  const ft = Math.floor(totalIn / 12);
  const inches = Math.round(totalIn - ft * 12);
  return { ft, in: inches };
}

export function feetInchesToCm(ft: number, inches: number): number {
  const totalIn = ft * 12 + inches;
  return totalIn * CM_PER_IN;
}

// Convert centimeters to a decimal feet representation used by the onboarding form
// Example: 5 feet 6 inches => 5.6
export function cmToFeetDecimal(cm: number): number {
  if (!isFinite(cm)) return NaN;
  const { ft, in: inches } = cmToFeetInches(cm);
  // Clamp inches between 0-11 and keep one decimal place convention
  const clampedIn = Math.max(0, Math.min(11, inches));
  const value = ft + clampedIn / 10;
  return Math.round(value * 10) / 10; // one decimal place
}

// Convert decimal feet (e.g., 5.6 meaning 5 feet 6 inches) to centimeters
export function feetDecimalToCm(feetDecimal: number): number {
  if (!isFinite(feetDecimal)) return NaN;
  const ft = Math.floor(feetDecimal);
  // Fractional part * 10 interpreted as inches (0-9/10 approximates 0-9 inches; cap at 11)
  let inches = Math.round((feetDecimal - ft) * 10);
  inches = Math.max(0, Math.min(11, inches));
  return feetInchesToCm(ft, inches);
}

export function formatWeightFromKg(valueKg: number, unitSystem: 'metric' | 'imperial', locale = 'en-PH') {
  if (unitSystem === 'imperial') {
    const lb = kgToLb(valueKg);
    return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(lb) + ' lb';
  }
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(valueKg) + ' kg';
}

export function formatHeightFromCm(valueCm: number, unitSystem: 'metric' | 'imperial', locale = 'en-PH') {
  if (unitSystem === 'imperial') {
    const { ft, in: inches } = cmToFeetInches(valueCm);
    return `${ft}'${inches}\"`;
  }
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(valueCm) + ' cm';
}
