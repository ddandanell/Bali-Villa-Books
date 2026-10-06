export const TIMEZONE = "Asia/Makassar";
export const SCHEDULED_HOUR = 9;
export const MIN_WORDS = 1000;
export const DAILY_POSTS = 2;

export const imageLibrary = [
  { url: "/images/bali-villa-bookkeeping-reconciliation.jpg", alt: "Bali villa bookkeeping professional comparing receipts and reconciliation records" },
  { url: "/images/bali-accountant-consultation.jpg", alt: "Bali accountant discussing financial reporting with a villa owner" },
  { url: "/images/bali-account-management-team.jpg", alt: "Bali account management team reviewing financial controls" },
  { url: "/images/bali-villa-accounting-services-hero.jpg", alt: "Bali accounting professional reviewing villa financial records" },
];

export const keywordClusters = [
  { keyword: "bookkeeping cleanup Bali", focus: "catch-up bookkeeping, overdue villa records, missing evidence and the transition to a monthly close", page: "/villa-bookkeeping-cleanup-bali" },
  { keyword: "Airbnb bookkeeping Bali", focus: "Airbnb, Booking.com, Agoda, VRBO, direct booking and OTA payout reconciliation", page: "/airbnb-bookkeeping-bali" },
  { keyword: "villa financial reporting Bali", focus: "owner reporting, cash flow, management packs and monthly variance review", page: "/villa-financial-reporting-bali" },
  { keyword: "Bali villa payroll records", focus: "supplier invoices, rental property expense controls, approved staff schedules and BPJS documents; not payroll execution", page: "/villa-payroll-records-bali" },
  { keyword: "rental property bookkeeping Bali", focus: "remote owners, property management bookkeeping, shared-cost allocations and multi-property record workflows", page: "/services" },
  { keyword: "PT PMA bookkeeping Bali", focus: "company records and owner funding; documentation handover to a licensed Konsultan Pajak; never tax advice or filing", page: "/pt-pma-villa-bookkeeping" },
];

/** Bali has UTC+8 year-round. The schedule is independent of the server timezone. */
export function baliClock(at = new Date()) {
  const local = new Date(at.getTime() + 8 * 3600000);
  const dateKey = local.toISOString().slice(0, 10);
  const day = local.getUTCDay();
  const monday = new Date(local);
  monday.setUTCDate(local.getUTCDate() - ((day + 6) % 7));
  return {
    dateKey, weekKey: monday.toISOString().slice(0, 10),
    eligible: day >= 1 && day <= 5 && local.getUTCHours() >= SCHEDULED_HOUR,
  };
}

export function nextPublication(at: Date, todayFinished: boolean): Date {
  const local = new Date(at.getTime() + 8 * 3600000);
  const candidate = new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), SCHEDULED_HOUR - 8));
  if (todayFinished || candidate < at) candidate.setUTCDate(candidate.getUTCDate() + 1);
  while ([0, 6].includes(new Date(candidate.getTime() + 8 * 3600000).getUTCDay())) {
    candidate.setUTCDate(candidate.getUTCDate() + 1);
  }
  return candidate;
}

export function countWords(html: string): number {
  return (html.replace(/<[^>]*>/g, " ").replace(/&(?:#\d+|#x[\da-f]+|\w+);/gi, " ").match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu) ?? []).length;
}

export function similarTitle(a: string, b: string): boolean {
  const normalize = (s: string) => new Set(s.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/).filter(w => w.length > 3));
  const left = normalize(a), right = normalize(b);
  const intersection = [...left].filter(word => right.has(word)).length;
  return intersection / Math.max(1, new Set([...left, ...right]).size) >= 0.75;
}
