export const DEFAULT_USD_TO_RWF_RATE = Number(process.env.NEXT_PUBLIC_USD_TO_RWF_RATE ?? 1300);

function parseMoneyToNumber(value: string): { amount: number | null; isUsd: boolean } {
  if (!value) return { amount: null, isUsd: false };
  const isUsd = /\$|usd/i.test(value);
  const numeric = value.replace(/[^0-9.]/g, '');
  if (!numeric) return { amount: null, isUsd };
  const amount = Number(numeric);
  if (Number.isNaN(amount)) return { amount: null, isUsd };
  return { amount, isUsd };
}

export function formatPriceRwf(input: string | number): string {
  const raw = typeof input === 'number' ? String(input) : input;
  const { amount, isUsd } = parseMoneyToNumber(raw);
  if (amount === null) return raw;

  const rwf = isUsd ? amount * DEFAULT_USD_TO_RWF_RATE : amount;
  // Force "RWF" label explicitly (avoid locale outputs like "RF")
  return `RWF ${Math.round(rwf).toLocaleString('en-US')}`;
}

export function normalizeListingLabel(value?: string): 'Rent' | 'Sale' | '' {
  const v = (value || '').toLowerCase();
  if (!v) return '';
  if (v.includes('rent')) return 'Rent';
  if (v.includes('sale') || v.includes('sell') || v.includes('buy')) return 'Sale';
  return '';
}



