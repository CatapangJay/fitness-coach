export const currencySymbolFor = (currency: string) => {
  switch (currency) {
    case 'PHP':
      return '₱';
    case 'USD':
      return '$';
    default:
      return '';
  }
};

export const formatCurrency = (value: number, locale = 'en-PH', currency = 'PHP') => {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
  } catch {
    // Fallback: manual symbol + fixed
    const symbol = currencySymbolFor(currency);
    return `${symbol}${value.toFixed(2)}`;
  }
};

export const formatNumber = (value: number, locale = 'en-PH', digits = 0) => {
  try {
    return new Intl.NumberFormat(locale, { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
  } catch {
    return value.toFixed(digits);
  }
};

export const formatDateShort = (date: Date, locale = 'en-PH') => {
  try {
    return date.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric' });
  } catch {
    return date.toDateString();
  }
};
