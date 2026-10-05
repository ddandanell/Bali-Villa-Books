/** Public IDR prices; cleanup is a reviewed starting fee, not a fixed quote. */
export const prices = {
  starter: 2_900_000,
  professional: 4_900_000,
  premium: 6_900_000,
  cleanup: 7_900_000,
} as const;
export const priceText = (amount: number) => `Rp ${new Intl.NumberFormat("id-ID").format(amount)}`;
export const priceShort = (amount: number) => `Rp ${(amount / 1_000_000).toFixed(1)}m`;
