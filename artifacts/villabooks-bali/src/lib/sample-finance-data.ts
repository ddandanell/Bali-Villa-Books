/** Fictional demonstration model. Values are raw IDR; no client, market benchmark or live integration. */
export const financeDemo = {
  property: "Illustrative Bali Villa",
  period: "September 2026",
  availableNights: 30, occupiedNights: 24,
  grossBookings: 100_000_000, refunds: 2_000_000, channelFees: 15_000_000,
  budget: { grossBookings: 96_000_000, refunds: 2_000_000, channelFees: 14_000_000, occupiedNights: 22 },
  costs: [
    { category: "Staff records", actual: 25_000_000, budget: 25_000_000 },
    { category: "Utilities", actual: 8_000_000, budget: 6_000_000 },
    { category: "Cleaning & supplies", actual: 7_000_000, budget: 7_000_000 },
    { category: "Maintenance", actual: 7_000_000, budget: 6_000_000 },
    { category: "Administration", actual: 5_000_000, budget: 5_000_000 },
  ],
  channels: [
    { channel: "Airbnb", gross: 55_000_000, refunds: 1_000_000, fees: 9_000_000, received: 43_000_000 },
    { channel: "Booking.com", gross: 30_000_000, refunds: 1_000_000, fees: 5_000_000, received: 23_000_000 },
    { channel: "Direct", gross: 15_000_000, refunds: 0, fees: 1_000_000, received: 14_000_000 },
  ],
  cash: { opening: 20_000_000, receipts: 80_000_000, ownerFunding: 5_000_000, operatingPayments: 50_000_000, ownerDrawings: 10_000_000, capitalSpend: 6_000_000 },
  history: [
    { month: "April", date: "2026-04-01", revenue: 78_000_000, fees: 12_000_000, costs: 43_000_000 },
    { month: "May", date: "2026-05-01", revenue: 82_000_000, fees: 12_000_000, costs: 45_000_000 },
    { month: "June", date: "2026-06-01", revenue: 88_000_000, fees: 13_000_000, costs: 47_000_000 },
    { month: "July", date: "2026-07-01", revenue: 96_000_000, fees: 14_000_000, costs: 49_000_000 },
    { month: "August", date: "2026-08-01", revenue: 89_000_000, fees: 13_000_000, costs: 47_000_000 },
    { month: "September", date: "2026-09-01", revenue: 98_000_000, fees: 15_000_000, costs: 52_000_000 },
  ],
  forecast: [
    { month: "October", receipts: 75_000_000, operatingPayments: 53_000_000, capitalSpend: 4_000_000, drawings: 10_000_000 },
    { month: "November", receipts: 70_000_000, operatingPayments: 54_000_000, capitalSpend: 6_000_000, drawings: 12_000_000 },
    { month: "December", receipts: 90_000_000, operatingPayments: 58_000_000, capitalSpend: 5_000_000, drawings: 15_000_000 },
  ],
};
export const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);
export function calculateDemo() {
  const revenue = financeDemo.grossBookings - financeDemo.refunds;
  const operatingCosts = sum(financeDemo.costs.map(c => c.actual));
  const budgetRevenue = financeDemo.budget.grossBookings - financeDemo.budget.refunds;
  const budgetCosts = sum(financeDemo.costs.map(c => c.budget));
  const result = revenue - financeDemo.channelFees - operatingCosts;
  const budgetResult = budgetRevenue - financeDemo.budget.channelFees - budgetCosts;
  const c = financeDemo.cash;
  const closingCash = c.opening + c.receipts + c.ownerFunding - c.operatingPayments - c.ownerDrawings - c.capitalSpend;
  let rollingCash = closingCash;
  const forecast = financeDemo.forecast.map(month => {
    const openingCash = rollingCash;
    rollingCash += month.receipts - month.operatingPayments - month.capitalSpend - month.drawings;
    return { ...month, openingCash, closingCash: rollingCash };
  });
  return {
    revenue, operatingCosts, budgetRevenue, budgetCosts, result, budgetResult, closingCash, forecast,
    occupancy: financeDemo.occupiedNights / financeDemo.availableNights,
    adr: revenue / financeDemo.occupiedNights,
    revpan: revenue / financeDemo.availableNights,
    margin: result / revenue,
    costPerOccupiedNight: operatingCosts / financeDemo.occupiedNights,
    payoutDue: revenue - financeDemo.channelFees,
    outstandingPayouts: revenue - financeDemo.channelFees - c.receipts,
    unpaidOperatingCosts: operatingCosts - c.operatingPayments,
  };
}
