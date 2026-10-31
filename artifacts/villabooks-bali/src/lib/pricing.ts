/** Public IDR prices; cleanup is a reviewed starting fee, not a fixed quote. */
export const prices = {
  starter: 2_900_000,
  professional: 4_900_000,
  premium: 6_900_000,
  cleanup: 7_900_000,
} as const;
/** One rupiah format site-wide: comma thousands ("Rp 2,900,000"), matching the published copy.
 *  Do not reintroduce id-ID dots here; they produce two formats on the same page. */
export const priceText = (amount: number) => `Rp ${new Intl.NumberFormat("en-GB").format(amount)}`;
export const priceShort = (amount: number) => `Rp ${(amount / 1_000_000).toFixed(1)}m`;
