import { useEffect } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CircleAlert,
  Download,
  FileCheck2,
  FileText,
  Printer,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { Link } from "wouter";
import { calculateDemo, financeDemo, sum } from "@/lib/sample-finance-data";
import { trackEvent } from "@/lib/analytics";

const report = calculateDemo();
const rupiah = (amount: number) => `Rp ${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(amount)}`;
const signedRupiah = (amount: number) => `${amount > 0 ? "+" : amount < 0 ? "−" : ""}${rupiah(Math.abs(amount))}`;
const percentage = (value: number) => `${new Intl.NumberFormat("en", { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(value * 100)}%`;
const compact = (amount: number) => `${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(amount / 1_000_000)}m`;

const actualGross = sum(financeDemo.channels.map((channel) => channel.gross));
const actualRefunds = sum(financeDemo.channels.map((channel) => channel.refunds));
const actualFees = sum(financeDemo.channels.map((channel) => channel.fees));
const actualReceived = sum(financeDemo.channels.map((channel) => channel.received));
const payoutDue = sum(financeDemo.channels.map((channel) => channel.gross - channel.refunds - channel.fees));
const actualOccupancy = financeDemo.occupiedNights / financeDemo.availableNights;
const budgetOccupancy = financeDemo.budget.occupiedNights / financeDemo.availableNights;
const costVariance = report.operatingCosts - report.budgetCosts;
const cash = financeDemo.cash;

const label = "text-[11px] font-bold uppercase tracking-[.17em] text-foreground/50";
const sectionTitle = "font-serif text-3xl leading-tight text-primary sm:text-[2.15rem]";
const tableClass = "w-full min-w-[680px] border-collapse text-left text-sm";
const headCell = "border-b border-primary/15 px-4 py-3 text-[10px] font-bold uppercase tracking-[.14em] text-foreground/50";
const bodyCell = "border-b border-primary/[.08] px-4 py-3.5 align-top text-foreground/75";
const moneyCell = `${bodyCell} text-right font-mono tabular-nums`;

function TrendChart() {
  const series = [
    { name: "Net booking revenue", color: "#174f43", values: financeDemo.history.map((month) => month.revenue) },
    { name: "Channel fees", color: "#d5855b", values: financeDemo.history.map((month) => month.fees) },
    { name: "Operating costs", color: "#9caa80", values: financeDemo.history.map((month) => month.costs) },
  ];
  const maxValue = Math.max(...series.flatMap((item) => item.values));
  const chartHeight = 176;
  const chartTop = 18;
  const chartBottom = chartTop + chartHeight;
  const groupWidth = (592 - 48) / financeDemo.history.length;
  const barWidth = 8;
  const gap = 3;
  const clusterWidth = series.length * barWidth + (series.length - 1) * gap;
  return (
    <div>
      <div className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Chart legend">
        {series.map((item) => <span key={item.name} className="inline-flex items-center gap-2 text-xs text-foreground/65"><span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />{item.name}</span>)}
      </div>
      <div className="mt-5 overflow-hidden rounded-xl bg-[#f5f4ec] px-2 pt-3">
        <svg viewBox="0 0 600 220" className="h-auto w-full" role="img" aria-labelledby="trend-title trend-description">
          <title id="trend-title">Six-month financial trend, zero-based columns</title>
          <desc id="trend-description">Grouped columns for net booking revenue, channel fees, and operating costs from April through September. The vertical scale starts at zero.</desc>
          {[0, 0.5, 1].map((fraction) => {
            const y = chartBottom - chartHeight * fraction;
            return <g key={fraction}>
              <line x1="40" y1={y} x2="592" y2={y} stroke="#d8dbce" strokeWidth="1" />
              <text x="34" y={y + 4} textAnchor="end" fill="#7b8177" fontSize="9">{compact(maxValue * fraction)}</text>
            </g>;
          })}
          {financeDemo.history.map((month, monthIndex) => {
            const center = 48 + groupWidth * (monthIndex + 0.5);
            return <g key={month.date}>
              {series.map((item, seriesIndex) => {
                const height = item.values[monthIndex] / maxValue * chartHeight;
                const x = center - clusterWidth / 2 + seriesIndex * (barWidth + gap);
                return <rect key={item.name} x={x} y={chartBottom - height} width={barWidth} height={height} rx="2" fill={item.color}>
                  <title>{`${month.month}: ${item.name}, ${rupiah(item.values[monthIndex])}`}</title>
                </rect>;
              })}
              <text x={center} y="211" textAnchor="middle" fill="#616a60" fontSize="9">{month.month.slice(0, 3)}</text>
            </g>;
          })}
        </svg>
      </div>
      <p className="mt-3 text-xs leading-5 text-foreground/50">IDR millions. Column heights share a zero baseline; the small fee series is not magnified to imply a larger movement.</p>
    </div>
  );
}

function csvCell(value: string | number) {
  const text = String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function downloadCsv() {
  const rows: (string | number)[][] = [
    ["Section", "Period", "Line item", "Amount / value", "Unit", "Reading note"],
    ["Report", financeDemo.period, "Property", financeDemo.property, "", "Fictional demonstration data"],
    ["Operating summary", financeDemo.period, "Gross bookings", actualGross, "IDR", "Channel gross before refunds and fees"],
    ["Operating summary", financeDemo.period, "Refunds", -actualRefunds, "IDR", "Shown separately from gross"],
    ["Operating summary", financeDemo.period, "Revenue after refunds", report.revenue, "IDR", "Before channel fees"],
    ["Operating summary", financeDemo.period, "Channel fees", -actualFees, "IDR", "Booking-channel charges"],
    ["Operating summary", financeDemo.period, "Operating costs", -report.operatingCosts, "IDR", "Cost categories in the model"],
    ["Operating summary", financeDemo.period, "Operating result", report.result, "IDR", "Management result; not tax profit"],
    ["Operating summary", financeDemo.period, "Operating margin", report.margin, "ratio", "Operating result divided by revenue after refunds"],
    ["Operating summary", financeDemo.period, "Occupancy", actualOccupancy, "ratio", "Whole-villa occupied nights / available nights"],
    ["Operating summary", financeDemo.period, "ADR", report.adr, "IDR / occupied night", "After refunds, before fees"],
    ["Operating summary", financeDemo.period, "RevPAN", report.revpan, "IDR / available night", "Revenue after refunds / available villa nights"],
    ["Budget comparison", financeDemo.period, "Budget revenue after refunds", report.budgetRevenue, "IDR", "Budget gross less budget refunds"],
    ["Budget comparison", financeDemo.period, "Actual revenue variance", report.revenue - report.budgetRevenue, "IDR", "Actual less budget"],
    ["Budget comparison", financeDemo.period, "Budget channel fees", financeDemo.budget.channelFees, "IDR", "Budget channel fees"],
    ["Budget comparison", financeDemo.period, "Budget operating costs", report.budgetCosts, "IDR", "Sum of category budgets"],
    ["Budget comparison", financeDemo.period, "Operating cost variance", costVariance, "IDR", "Positive means over budget"],
    ...financeDemo.costs.map((cost) => ["Cost detail", financeDemo.period, cost.category, cost.actual, "IDR", `Budget ${cost.budget}; actual less budget ${cost.actual - cost.budget}`]),
    ...financeDemo.channels.map((channel) => ["Channel reconciliation", financeDemo.period, channel.channel, channel.gross, "IDR gross", `Refunds ${channel.refunds}; fees ${channel.fees}; net due ${channel.gross - channel.refunds - channel.fees}; received ${channel.received}; unmatched ${channel.gross - channel.refunds - channel.fees - channel.received}`]),
    ...financeDemo.history.map((month) => ["Six-month trend", month.month, "Revenue after refunds", month.revenue, "IDR", `Fees ${month.fees}; operating costs ${month.costs}`]),
    ...financeDemo.forecast.map((month, index) => ["Cash forecast", month.month, "Closing cash", report.forecast[index].closingCash, "IDR", `Receipts ${month.receipts}; operating payments ${month.operatingPayments}; capex ${month.capitalSpend}; drawings ${month.drawings}`]),
    ["Cash bridge", financeDemo.period, "Opening cash", cash.opening, "IDR", "Modelled opening balance"],
    ["Cash bridge", financeDemo.period, "Receipts", cash.receipts, "IDR", "Bank receipts in period"],
    ["Cash bridge", financeDemo.period, "Owner funding", cash.ownerFunding, "IDR", "Cash movement; not operating revenue"],
    ["Cash bridge", financeDemo.period, "Operating payments", -cash.operatingPayments, "IDR", "Cash paid; not the same as costs incurred"],
    ["Cash bridge", financeDemo.period, "Owner drawings", -cash.ownerDrawings, "IDR", "Owner movement; not an operating expense"],
    ["Cash bridge", financeDemo.period, "Capital spend", -cash.capitalSpend, "IDR", "Capital cash movement; not included in operating costs"],
    ["Cash bridge", financeDemo.period, "Closing cash", report.closingCash, "IDR", "Opening + receipts + funding − payments − drawings − capex"],
    ["Payout bridge", financeDemo.period, "Channel payout due", payoutDue, "IDR", "Gross less refunds and channel fees"],
    ["Payout bridge", financeDemo.period, "Cash received", actualReceived, "IDR", "Sum of modeled channel receipts"],
    ["Payout bridge", financeDemo.period, "Outstanding / unmatched", report.outstandingPayouts, "IDR", "Requires transaction-level evidence and human review"],
    ["Payout bridge", financeDemo.period, "Unpaid operating costs", report.unpaidOperatingCosts, "IDR", "Operating costs less operating cash payments"],
  ];
  const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `bali-accounting-monthly-villa-report-${financeDemo.period.toLowerCase().replaceAll(" ", "-")}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
  trackEvent("sample_report_download", { page: "/sample-report", placement: "csv_export" });
}

function Metric({ title, value, definition, detail }: { title: string; value: string; definition: string; detail: string }) {
  return <article className="border-l-2 border-secondary/60 py-1 pl-4">
    <p className={label}>{title}</p>
    <p className="mt-2 font-mono text-[1.65rem] leading-none tracking-tight text-primary tabular-nums sm:text-3xl">{value}</p>
    <p className="mt-2 text-xs font-semibold leading-5 text-foreground/65">{definition}</p>
    <p className="mt-1 text-[11px] leading-5 text-foreground/45">{detail}</p>
  </article>;
}

export function MonthlyVillaReport() {
  useEffect(() => {
    const onPrint = () => trackEvent("sample_report_download", { page: "/sample-report", placement: "browser_print" });
    window.addEventListener("beforeprint", onPrint);
    return () => window.removeEventListener("beforeprint", onPrint);
  }, []);

  return <article className="finance-report mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-14">
    <div className="mb-9 flex flex-col justify-between gap-5 border-b border-primary/15 pb-7 sm:flex-row sm:items-end">
      <div>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.19em] text-secondary"><span className="h-2 w-2 rounded-full bg-secondary" /> Illustrative owner pack <span className="text-foreground/35">/</span> IDR</div>
        <h2 className="mt-3 font-serif text-3xl leading-tight text-primary sm:text-5xl">Monthly Villa Finance<br className="hidden sm:block" /> &amp; Performance Report</h2>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-foreground/60">{financeDemo.property} <span className="mx-2 text-secondary">·</span> {financeDemo.period} <span className="mx-2 text-secondary">·</span> Fictional demonstration data, not a client account</p>
      </div>
      <div className="flex flex-wrap gap-2 print:hidden">
        <button type="button" onClick={downloadCsv} data-testid="button-download-report-csv" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-primary/20 bg-background px-4 text-sm font-semibold text-primary transition-colors hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"><Download className="h-4 w-4" /> Download CSV</button>
        <button type="button" onClick={() => window.print()} data-testid="button-print-report" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"><Printer className="h-4 w-4" /> Print / save PDF</button>
      </div>
    </div>

    <div className="mb-8 grid gap-5 rounded-2xl border border-secondary/25 bg-accent/35 p-5 sm:grid-cols-[auto_1fr] sm:items-center sm:p-6">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-background text-secondary"><FileCheck2 className="h-5 w-5" /></div>
      <p className="text-sm leading-6 text-foreground/70"><strong className="text-primary">A review, not a bank total.</strong> This example follows booking activity through refunds, channel charges, operating costs, cash timing and open items. Figures come from the supplied fictional model; no source documents are attached or verified in this sample.</p>
    </div>

    <section aria-labelledby="performance-heading" className="border-y border-primary/15 py-8 sm:py-10">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div><p className={label}>01 / Performance snapshot</p><h3 id="performance-heading" className={`${sectionTitle} mt-2`}>What the villa produced</h3></div>
        <p className="text-xs text-foreground/50">{financeDemo.occupiedNights} occupied of {financeDemo.availableNights} whole-villa nights</p>
      </div>
      <div className="mt-8 grid gap-x-7 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
        <Metric title="Occupancy" value={percentage(report.occupancy)} definition="Whole-villa nights sold ÷ available nights" detail={`${financeDemo.occupiedNights} / ${financeDemo.availableNights} nights · whole villa, not room inventory`} />
        <Metric title="ADR" value={rupiah(report.adr)} definition="Revenue after refunds ÷ occupied nights" detail="After refunds, before channel fees; not gross booking value" />
        <Metric title="RevPAN" value={rupiah(report.revpan)} definition="Revenue after refunds ÷ available nights" detail="Revenue per available night; this is not room RevPAR" />
        <Metric title="Operating margin" value={percentage(report.margin)} definition="Operating result ÷ revenue after refunds" detail="Management measure after channel fees and operating costs; not tax profit" />
      </div>
      <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3 border-t border-primary/10 pt-5 text-sm">
        <div><span className="text-foreground/50">Revenue after refunds</span><strong className="ml-3 font-mono font-semibold text-primary">{rupiah(report.revenue)}</strong></div>
        <div><span className="text-foreground/50">Operating result</span><strong className="ml-3 font-mono font-semibold text-primary">{rupiah(report.result)}</strong></div>
        <div><span className="text-foreground/50">Per occupied night cost</span><strong className="ml-3 font-mono font-semibold text-primary">{rupiah(report.costPerOccupiedNight)}</strong></div>
      </div>
    </section>

    <section aria-labelledby="budget-heading" className="grid gap-8 py-10 lg:grid-cols-[.75fr_1.25fr] lg:py-14">
      <div>
        <p className={label}>02 / Plan against actual</p>
        <h3 id="budget-heading" className={`${sectionTitle} mt-2`}>Variance tells you where to look</h3>
        <p className="mt-4 max-w-md text-sm leading-6 text-foreground/65">Positive cost variance means over budget. This period's modeled operating result is level with budget, but the path there has shifted: revenue is ahead while channel fees and operating spend are also higher.</p>
        <div className="mt-6 rounded-xl bg-primary p-5 text-primary-foreground">
          <p className="text-[10px] font-bold uppercase tracking-[.15em] text-secondary">Operating result · actual vs budget</p>
          <p className="mt-3 font-mono text-2xl">{rupiah(report.result)} <span className="font-sans text-sm text-primary-foreground/55">vs</span> {rupiah(report.budgetResult)}</p>
          <p className="mt-2 text-xs leading-5 text-primary-foreground/60">Same result in this illustration; review revenue quality, fees and cost drivers before drawing conclusions.</p>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-primary/10 bg-background">
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <caption className="sr-only">September 2026 actual compared with budget, in Indonesian rupiah</caption>
            <thead><tr><th className={`${headCell} pl-5`}>Measure</th><th className={headCell}>Actual</th><th className={headCell}>Budget</th><th className={headCell}>Variance</th><th className={`${headCell} pr-5`}>Reading</th></tr></thead>
            <tbody>
              <tr><th scope="row" className={`${bodyCell} pl-5 font-semibold text-primary`}>Gross bookings</th><td className={moneyCell}>{rupiah(actualGross)}</td><td className={moneyCell}>{rupiah(financeDemo.budget.grossBookings)}</td><td className={moneyCell}>{signedRupiah(actualGross - financeDemo.budget.grossBookings)}</td><td className={`${bodyCell} pr-5 text-xs`}>Before refunds and fees</td></tr>
              <tr><th scope="row" className={`${bodyCell} pl-5 font-semibold text-primary`}>Revenue after refunds</th><td className={moneyCell}>{rupiah(report.revenue)}</td><td className={moneyCell}>{rupiah(report.budgetRevenue)}</td><td className={moneyCell}>{signedRupiah(report.revenue - report.budgetRevenue)}</td><td className={`${bodyCell} pr-5 text-xs`}>Gross less refunds</td></tr>
              <tr><th scope="row" className={`${bodyCell} pl-5 font-semibold text-primary`}>Channel fees</th><td className={moneyCell}>{rupiah(actualFees)}</td><td className={moneyCell}>{rupiah(financeDemo.budget.channelFees)}</td><td className={`${moneyCell} text-[#9b583f]`}>{signedRupiah(actualFees - financeDemo.budget.channelFees)}</td><td className={`${bodyCell} pr-5 text-xs`}>Positive variance increases cost</td></tr>
              <tr><th scope="row" className={`${bodyCell} pl-5 font-semibold text-primary`}>Operating costs</th><td className={moneyCell}>{rupiah(report.operatingCosts)}</td><td className={moneyCell}>{rupiah(report.budgetCosts)}</td><td className={`${moneyCell} text-[#9b583f]`}>{signedRupiah(costVariance)}</td><td className={`${bodyCell} pr-5 text-xs`}>Positive variance is adverse</td></tr>
              <tr className="bg-accent/35"><th scope="row" className={`${bodyCell} pl-5 font-semibold text-primary`}>Operating result</th><td className={`${moneyCell} font-semibold text-primary`}>{rupiah(report.result)}</td><td className={`${moneyCell} font-semibold text-primary`}>{rupiah(report.budgetResult)}</td><td className={`${moneyCell} font-semibold text-primary`}>{signedRupiah(report.result - report.budgetResult)}</td><td className={`${bodyCell} pr-5 text-xs`}>Not tax profit</td></tr>
              <tr><th scope="row" className={`${bodyCell} pl-5 font-semibold text-primary`}>Occupancy</th><td className={moneyCell}>{percentage(actualOccupancy)}</td><td className={moneyCell}>{percentage(budgetOccupancy)}</td><td className={moneyCell}>{`${(actualOccupancy - budgetOccupancy) * 100 > 0 ? "+" : ""}${new Intl.NumberFormat("en", { maximumFractionDigits: 1 }).format((actualOccupancy - budgetOccupancy) * 100)} pp`}</td><td className={`${bodyCell} pr-5 text-xs`}>Whole-villa nights</td></tr>
              {financeDemo.costs.map((cost) => <tr key={cost.category}><th scope="row" className={`${bodyCell} pl-5 text-foreground/65`}>{cost.category}</th><td className={moneyCell}>{rupiah(cost.actual)}</td><td className={moneyCell}>{rupiah(cost.budget)}</td><td className={`${moneyCell} ${cost.actual > cost.budget ? "text-[#9b583f]" : ""}`}>{signedRupiah(cost.actual - cost.budget)}</td><td className={`${bodyCell} pr-5 text-xs`}>{cost.actual > cost.budget ? "Review variance" : cost.actual === cost.budget ? "On budget" : "Under budget"}</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section aria-labelledby="trend-heading" className="border-y border-primary/15 bg-[#f8f8f2] py-9 sm:py-12">
      <div className="grid gap-8 lg:grid-cols-[.78fr_1.22fr]">
        <div>
          <p className={label}>03 / Six-month view</p>
          <h3 id="trend-heading" className={`${sectionTitle} mt-2`}>Direction, with the data beneath it</h3>
          <p className="mt-4 text-sm leading-6 text-foreground/65">The model tracks revenue after refunds, channel fees and operating costs from April through September. Each month remains inspectable in the table; the graphic uses a common zero baseline rather than a cropped axis.</p>
          <div className="mt-5 border-l border-secondary/50 pl-4 text-sm leading-6 text-foreground/70"><strong className="text-primary">September:</strong> {rupiah(financeDemo.history[financeDemo.history.length - 1].revenue)} revenue after refunds, {rupiah(financeDemo.history[financeDemo.history.length - 1].fees)} channel fees and {rupiah(financeDemo.history[financeDemo.history.length - 1].costs)} operating costs.</div>
        </div>
        <div className="rounded-2xl border border-primary/10 bg-background p-4 sm:p-6"><TrendChart /></div>
      </div>
      <details className="group mt-7 rounded-xl border border-primary/10 bg-background">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-5 text-sm font-semibold text-primary marker:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary"><span>Open the six-month source table</span><span aria-hidden="true" className="text-secondary">+</span></summary>
        <div className="overflow-x-auto px-2 pb-3">
          <table className={tableClass}>
            <caption className="sr-only">Six months of fictional net revenue, channel fees and operating costs</caption>
            <thead><tr><th className={headCell}>Month</th><th className={headCell}>Revenue after refunds</th><th className={headCell}>Channel fees</th><th className={headCell}>Operating costs</th><th className={headCell}>Operating result</th></tr></thead>
            <tbody>{financeDemo.history.map((month) => <tr key={month.date}><th scope="row" className={`${bodyCell} font-semibold text-primary`}>{month.month} 2026</th><td className={moneyCell}>{rupiah(month.revenue)}</td><td className={moneyCell}>{rupiah(month.fees)}</td><td className={moneyCell}>{rupiah(month.costs)}</td><td className={moneyCell}>{rupiah(month.revenue - month.fees - month.costs)}</td></tr>)}</tbody>
          </table>
        </div>
      </details>
    </section>

    <section aria-labelledby="channels-heading" className="py-10 sm:py-14">
      <div className="grid gap-8 lg:grid-cols-[.65fr_1.35fr]">
        <div>
          <p className={label}>04 / Booking-to-bank trace</p>
          <h3 id="channels-heading" className={`${sectionTitle} mt-2`}>Gross is not the payout</h3>
          <p className="mt-4 text-sm leading-6 text-foreground/65">Each channel is bridged from gross activity to refund-adjusted, fee-net proceeds, then compared with receipts modeled in the bank. A difference is an exception to investigate—not an assumed loss or a confirmed receivable.</p>
          <div className="mt-6 rounded-xl border border-secondary/30 bg-accent/35 p-5">
            <p className={label}>Portfolio bridge</p>
            <p className="mt-3 font-mono text-xl font-semibold text-primary">{rupiah(payoutDue)} due <span className="font-sans text-sm font-normal text-foreground/45">→</span> {rupiah(actualReceived)} received</p>
            <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-foreground/70"><CircleAlert className="mt-1 h-4 w-4 shrink-0 text-[#9b583f]" /><span><strong className="text-primary">{rupiah(report.outstandingPayouts)} unmatched / outstanding.</strong> Timing and transaction-level bank matching require human review.</span></p>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-primary/10">
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <caption className="sr-only">Per-channel gross, refunds, fees, net due, received and unmatched payout figures</caption>
              <thead><tr><th className={`${headCell} pl-5`}>Channel</th><th className={headCell}>Gross</th><th className={headCell}>Refunds</th><th className={headCell}>Fees</th><th className={headCell}>Net due</th><th className={headCell}>Received</th><th className={`${headCell} pr-5`}>Unmatched</th></tr></thead>
              <tbody>{financeDemo.channels.map((channel) => {
                const netDue = channel.gross - channel.refunds - channel.fees;
                const unmatched = netDue - channel.received;
                return <tr key={channel.channel}>
                  <th scope="row" className={`${bodyCell} pl-5 font-semibold text-primary`}>{channel.channel}</th>
                  <td className={moneyCell}>{rupiah(channel.gross)}</td><td className={moneyCell}>{rupiah(channel.refunds)}</td><td className={moneyCell}>{rupiah(channel.fees)}</td><td className={moneyCell}>{rupiah(netDue)}</td><td className={moneyCell}>{rupiah(channel.received)}</td>
                  <td className={`${bodyCell} pr-5 text-right font-mono tabular-nums ${unmatched ? "font-semibold text-[#9b583f]" : ""}`}>{rupiah(unmatched)}</td>
                </tr>;
              })}
              <tr className="bg-accent/35"><th scope="row" className={`${bodyCell} pl-5 font-semibold text-primary`}>Total</th><td className={moneyCell}>{rupiah(actualGross)}</td><td className={moneyCell}>{rupiah(actualRefunds)}</td><td className={moneyCell}>{rupiah(actualFees)}</td><td className={moneyCell}>{rupiah(payoutDue)}</td><td className={moneyCell}>{rupiah(actualReceived)}</td><td className={`${moneyCell} pr-5 font-semibold text-[#9b583f]`}>{rupiah(report.outstandingPayouts)}</td></tr>
              </tbody>
            </table>
          </div>
          <p className="px-5 py-4 text-xs leading-5 text-foreground/50">The model gives channel-level totals only; no reservation IDs or bank transaction lines are supplied, so this is not a completed transaction-level match.</p>
        </div>
      </div>
    </section>

    <section aria-labelledby="cash-heading" className="grid gap-8 border-y border-primary/15 bg-[#f8f8f2] py-10 sm:py-14 lg:grid-cols-2">
      <div className="px-1">
        <p className={label}>05 / Profit &amp; cash are different views</p>
        <h3 id="cash-heading" className={`${sectionTitle} mt-2`}>One period, two bridges</h3>
        <div className="mt-6 rounded-2xl border border-primary/10 bg-background p-5 sm:p-6">
          <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-secondary" /><h4 className="font-semibold text-primary">Management P&amp;L</h4></div>
          <p className="mt-1 text-xs text-foreground/50">Accrual-style illustration from booking activity and modeled operating costs</p>
          <div className="mt-4 divide-y divide-primary/10">
            {[
              ["Gross booking value", actualGross],
              ["Refunds", -actualRefunds],
              ["Revenue after refunds", report.revenue],
              ["Channel fees", -actualFees],
              ["Operating costs incurred", -report.operatingCosts],
              ["Operating result · not tax profit", report.result],
            ].map(([name, amount], index) => <div key={String(name)} className={`flex items-center justify-between gap-4 py-3 text-sm ${index === 2 || index === 5 ? "font-semibold text-primary" : "text-foreground/65"}`}><span>{name}</span><span className="font-mono tabular-nums">{signedRupiah(Number(amount))}</span></div>)}
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-primary/10 bg-background p-5 sm:p-6">
          <div className="flex items-center gap-2"><Wallet className="h-4 w-4 text-secondary" /><h4 className="font-semibold text-primary">Cash bridge</h4></div>
          <div className="mt-4 divide-y divide-primary/10">
            {[
              ["Opening cash", cash.opening],
              ["Bank receipts", cash.receipts],
              ["Owner funding · not income", cash.ownerFunding],
              ["Operating payments", -cash.operatingPayments],
              ["Owner drawings · not expense", -cash.ownerDrawings],
              ["Capital spend · capex", -cash.capitalSpend],
              ["Closing cash", report.closingCash],
            ].map(([name, amount], index) => <div key={String(name)} className={`flex items-center justify-between gap-4 py-3 text-sm ${index === 6 ? "font-semibold text-primary" : "text-foreground/65"}`}><span>{name}</span><span className="font-mono tabular-nums">{signedRupiah(Number(amount))}</span></div>)}
          </div>
        </div>
      </div>
      <div className="px-1">
        <p className={label}>Balance of timing items</p>
        <h3 className={`${sectionTitle} mt-2`}>Keep the open end visible</h3>
        <div className="mt-6 overflow-hidden rounded-2xl border border-primary/10 bg-background">
          <div className="overflow-x-auto"><table className="w-full min-w-[420px] text-left text-sm">
            <caption className="sr-only">Cash bridge, payout timing, unpaid operating costs, owner movements and capital spend</caption>
            <thead><tr><th className={headCell}>Item</th><th className={headCell}>Amount</th><th className={headCell}>Treatment</th></tr></thead>
            <tbody>
              <tr><th scope="row" className={`${bodyCell} font-semibold text-primary`}>Closing cash</th><td className={moneyCell}>{rupiah(report.closingCash)}</td><td className={`${bodyCell} text-xs`}>Calculated from the cash bridge</td></tr>
              <tr><th scope="row" className={`${bodyCell} font-semibold text-primary`}>Outstanding payout</th><td className={`${moneyCell} text-[#9b583f]`}>{rupiah(report.outstandingPayouts)}</td><td className={`${bodyCell} text-xs`}>Open until bank receipt is matched</td></tr>
              <tr><th scope="row" className={`${bodyCell} font-semibold text-primary`}>Unpaid operating costs</th><td className={moneyCell}>{rupiah(report.unpaidOperatingCosts)}</td><td className={`${bodyCell} text-xs`}>Costs incurred less cash paid</td></tr>
              <tr><th scope="row" className={`${bodyCell} font-semibold text-primary`}>Owner funding</th><td className={moneyCell}>{rupiah(cash.ownerFunding)}</td><td className={`${bodyCell} text-xs`}>Cash movement, not revenue</td></tr>
              <tr><th scope="row" className={`${bodyCell} font-semibold text-primary`}>Owner drawings</th><td className={moneyCell}>{rupiah(cash.ownerDrawings)}</td><td className={`${bodyCell} text-xs`}>Cash movement, not operating expense</td></tr>
              <tr><th scope="row" className={`${bodyCell} font-semibold text-primary`}>Capital spend</th><td className={moneyCell}>{rupiah(cash.capitalSpend)}</td><td className={`${bodyCell} text-xs`}>Capex is outside this operating result</td></tr>
            </tbody>
          </table></div>
        </div>
        <p className="mt-4 text-xs leading-5 text-foreground/55">A closing bank balance is not the same measure as operating result. Classification and period cut-off depend on evidence and agreed bookkeeping treatment.</p>
      </div>
    </section>

    <section aria-labelledby="forecast-heading" className="py-10 sm:py-14">
      <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr]">
        <div>
          <p className={label}>06 / Three-month cash outlook</p>
          <h3 id="forecast-heading" className={`${sectionTitle} mt-2`}>A scenario to question, not a promise</h3>
          <p className="mt-4 text-sm leading-6 text-foreground/65">This is the model's assumption-led cash roll-forward. It carries modeled receipts, operating payments, capital spend and drawings forward; it does not estimate occupancy, ADR, bookings, tax, or market conditions.</p>
          <div className="mt-5 rounded-xl bg-accent/40 p-4 text-xs leading-5 text-foreground/65"><strong className="text-primary">Inputs are fixed example assumptions.</strong> Confirm dates, committed costs and owner plans before using any cash outlook for a decision. No price changes or bank actions are automated.</div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-primary/10">
          <div className="overflow-x-auto"><table className={tableClass}>
            <caption className="sr-only">Three-month illustrative cash forecast with assumptions and calculated closing balances</caption>
            <thead><tr><th className={`${headCell} pl-5`}>Month</th><th className={headCell}>Receipts</th><th className={headCell}>Operating payments</th><th className={headCell}>Capex</th><th className={headCell}>Drawings</th><th className={headCell}>Closing cash</th></tr></thead>
            <tbody>{report.forecast.map((month) => <tr key={month.month}>
              <th scope="row" className={`${bodyCell} pl-5 font-semibold text-primary`}>{month.month} 2026</th>
              <td className={moneyCell}>{rupiah(month.receipts)}</td><td className={moneyCell}>{rupiah(month.operatingPayments)}</td><td className={moneyCell}>{rupiah(month.capitalSpend)}</td><td className={moneyCell}>{rupiah(month.drawings)}</td><td className={`${moneyCell} font-semibold text-primary`}>{rupiah(month.closingCash)}</td>
            </tr>)}</tbody>
          </table></div>
          <div className="border-t border-primary/10 px-5 py-4 text-xs leading-5 text-foreground/55">Opening cash for the first modeled month is {rupiah(report.closingCash)}. Each subsequent month rolls forward the prior modeled closing cash.</div>
        </div>
      </div>
    </section>

    <section aria-labelledby="actions-heading" className="border-y border-primary/15 bg-primary py-10 text-primary-foreground sm:py-14">
      <div className="grid gap-8 lg:grid-cols-[.65fr_1.35fr]">
        <div className="px-1">
          <p className="text-[11px] font-bold uppercase tracking-[.17em] text-secondary">07 / Next-month actions</p>
          <h3 id="actions-heading" className="mt-2 font-serif text-3xl leading-tight sm:text-[2.15rem]">Three questions worth carrying forward</h3>
          <p className="mt-4 text-sm leading-6 text-primary-foreground/65">Actions are triggered by this fictional period's exact variances and reconciliation gap. They do not presume a cause or an outcome.</p>
        </div>
        <ol className="divide-y divide-primary-foreground/15">
          <li className="grid gap-3 py-5 first:pt-0 sm:grid-cols-[1fr_auto]">
            <div><p className="text-sm font-semibold">Trace the channel payout difference</p><p className="mt-2 text-sm leading-6 text-primary-foreground/65">{rupiah(report.outstandingPayouts)} is due in the channel bridge but not in modeled receipts. Compare payout references, bank value dates and statement lines; keep timing items open until supported.</p><p className="mt-2 text-xs text-secondary">Next measure: unresolved difference after bank-to-payout matching, by channel.</p></div>
            <span className="self-start rounded-full border border-primary-foreground/20 px-3 py-1 text-[11px] font-semibold">Owner + reviewer</span>
          </li>
          <li className="grid gap-3 py-5 sm:grid-cols-[1fr_auto]">
            <div><p className="text-sm font-semibold">Explain the utilities variance</p><p className="mt-2 text-sm leading-6 text-primary-foreground/65">Utilities are {rupiah(financeDemo.costs.find((cost) => cost.category === "Utilities")!.actual)} against {rupiah(financeDemo.costs.find((cost) => cost.category === "Utilities")!.budget)} budget, a {rupiah(financeDemo.costs.find((cost) => cost.category === "Utilities")!.actual - financeDemo.costs.find((cost) => cost.category === "Utilities")!.budget)} overrun. Review bills, meter periods, occupancy context and any one-off usage with the manager before changing the budget.</p><p className="mt-2 text-xs text-secondary">Next measure: evidenced utilities spend against the next approved budget and occupancy.</p></div>
            <span className="self-start rounded-full border border-primary-foreground/20 px-3 py-1 text-[11px] font-semibold">Villa manager</span>
          </li>
          <li className="grid gap-3 py-5 sm:grid-cols-[1fr_auto]">
            <div><p className="text-sm font-semibold">Review maintenance and channel economics</p><p className="mt-2 text-sm leading-6 text-primary-foreground/65">Maintenance is {rupiah(financeDemo.costs.find((cost) => cost.category === "Maintenance")!.actual)} vs {rupiah(financeDemo.costs.find((cost) => cost.category === "Maintenance")!.budget)}, {rupiah(financeDemo.costs.find((cost) => cost.category === "Maintenance")!.actual - financeDemo.costs.find((cost) => cost.category === "Maintenance")!.budget)} above budget. Separately, {rupiah(actualGross)} gross becomes {rupiah(payoutDue)} net due after {rupiah(actualRefunds)} refunds and {rupiah(actualFees)} channel fees. Check job receipts and channel statements; compare like-for-like fee terms without assuming a cause.</p><p className="mt-2 text-xs text-secondary">Next measure: supported maintenance variance and fees / gross by channel.</p></div>
            <span className="self-start rounded-full border border-primary-foreground/20 px-3 py-1 text-[11px] font-semibold">Manager + owner</span>
          </li>
        </ol>
      </div>
    </section>

    <section aria-labelledby="evidence-heading" className="grid gap-8 py-10 sm:py-14 lg:grid-cols-[.75fr_1.25fr]">
      <div>
        <p className={label}>08 / Sources, evidence &amp; exceptions</p>
        <h3 id="evidence-heading" className={`${sectionTitle} mt-2`}>A traceable close shows its gaps</h3>
        <p className="mt-4 text-sm leading-6 text-foreground/65">The figures here are generated from the fictional model, not imported documents. A real monthly pack should identify the supplied file, period, source owner, matching status and review note for each material figure.</p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#bd805c]/30 bg-[#fbf2eb] px-3 py-2 text-xs font-semibold text-[#8d5439]"><CircleAlert className="h-4 w-4" /> Demonstration exception · payout {rupiah(report.outstandingPayouts)} unresolved</div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-primary/10">
        <div className="overflow-x-auto"><table className={tableClass}>
          <caption className="sr-only">Illustrative source evidence expected and exception status for this demonstration report</caption>
          <thead><tr><th className={`${headCell} pl-5`}>Evidence / control</th><th className={headCell}>Status in this sample</th><th className={`${headCell} pr-5`}>Review treatment</th></tr></thead>
          <tbody>
            <tr><th scope="row" className={`${bodyCell} pl-5 font-semibold text-primary`}>Channel statements &amp; booking detail</th><td className={bodyCell}>Model totals only</td><td className={`${bodyCell} pr-5 text-xs`}>No document or reservation-level match supplied</td></tr>
            <tr><th scope="row" className={`${bodyCell} pl-5 font-semibold text-primary`}>Bank statement / transaction export</th><td className={bodyCell}>Receipt total modeled</td><td className={`${bodyCell} pr-5 text-xs`}>Match payout IDs, amount and bank value date</td></tr>
            <tr><th scope="row" className={`${bodyCell} pl-5 font-semibold text-primary`}>Invoices &amp; receipt evidence</th><td className={bodyCell}>Cost categories modeled</td><td className={`${bodyCell} pr-5 text-xs`}>No actual bills or receipts verified</td></tr>
            <tr><th scope="row" className={`${bodyCell} pl-5 font-semibold text-primary`}>Payout difference</th><td className={`${bodyCell} font-semibold text-[#9b583f]`}>{rupiah(report.outstandingPayouts)} open</td><td className={`${bodyCell} pr-5 text-xs`}>Exception review; human clearance required</td></tr>
            <tr><th scope="row" className={`${bodyCell} pl-5 font-semibold text-primary`}>Operating costs not yet paid</th><td className={bodyCell}>{rupiah(report.unpaidOperatingCosts)} modeled</td><td className={`${bodyCell} pr-5 text-xs`}>Owner / manager confirms period and settlement</td></tr>
          </tbody>
        </table></div>
      </div>
    </section>

    <section aria-labelledby="delivery-heading" className="border-t border-primary/15 py-10 sm:py-14">
      <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr]">
        <div>
          <p className={label}>09 / Recurring monthly delivery</p>
          <h3 id="delivery-heading" className={`${sectionTitle} mt-2`}>A digitized workflow, with human checkpoints</h3>
          <p className="mt-4 text-sm leading-6 text-foreground/65">Templates, imports, capture and review can make a repeatable monthly close easier to trace. Any automated steps are proposed workflow design—not a currently live integration or a promise of fully autonomous bookkeeping. Chosen tools, setup and package scope must first be agreed.</p>
        </div>
        <div className="grid gap-x-7 gap-y-6 sm:grid-cols-2">
          {[
            ["01", "Agree the close kit", "Set report template, entities, accounts, channels, budget, owners and document checklist for the chosen tools and agreed scope."],
            ["02", "Collect and import", "Use agreed client document folders for digital bank and platform statement imports; capture receipts with a reviewer checking legibility and period."],
            ["03", "Apply visible rules", "Use agreed category mappings and duplicate checks. Match amount, reference and date windows; retain a link to the source record rather than silently forcing a match."],
            ["04", "Review exceptions", "Route unmatched payouts, missing evidence, sensitive classifications and unusual movements to a person for explanation and approval."],
            ["05", "Close the month", "Compare actuals to budget, reconcile schedules and cash, resolve or carry open items, and prepare a review-ready draft."],
            ["06", "Approve, deliver, archive", "Human approval is required for sensitive classifications and report release. Deliver the agreed monthly owner pack, archive its source trail, then review actions with the owner."],
          ].map(([number, title, copy]) => <div key={number} className="border-t border-secondary/50 pt-4">
            <div className="flex items-baseline gap-3"><span className="font-mono text-xs text-secondary">{number}</span><h4 className="font-semibold text-primary">{title}</h4></div>
            <p className="mt-2 pl-8 text-sm leading-6 text-foreground/65">{copy}</p>
          </div>)}
        </div>
      </div>
      <div className="mt-8 grid gap-4 rounded-2xl bg-accent/40 p-5 sm:grid-cols-3 sm:p-6">
        <div><p className="text-xs font-bold uppercase tracking-wider text-primary">Human approval stays</p><p className="mt-2 text-sm leading-6 text-foreground/65">Unmatched transactions, sensitive classifications and report release require human approval. Every bank payment needs the account owner's explicit authorization; Bali Accounting has no payment authority.</p></div>
        <div><p className="text-xs font-bold uppercase tracking-wider text-primary">15th is a target</p><p className="mt-2 text-sm leading-6 text-foreground/65">Delivery by the 15th is targeted only after complete, usable documents arrive on time and open questions are addressed. It is not guaranteed.</p></div>
        <div><p className="text-xs font-bold uppercase tracking-wider text-primary">Scope comes first</p><p className="mt-2 text-sm leading-6 text-foreground/65">Templates, digital imports, receipt capture and automation depend on selected tools, integrations and agreed package scope—not assumed live features.</p></div>
      </div>
    </section>

    <section aria-labelledby="methodology-heading" className="border-t border-primary/15 py-9 sm:py-12">
      <div className="grid gap-7 md:grid-cols-[.7fr_1.3fr]">
        <div><p className={label}>Methodology references · checked 5 Oct 2026</p><h3 id="methodology-heading" className={`${sectionTitle} mt-2`}>Methods worth examining</h3></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <a href="https://www.fathomhq.com/features" target="_blank" rel="noreferrer" className="group rounded-xl border border-primary/10 p-5 transition-colors hover:bg-accent/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary">
            <p className="text-sm font-semibold text-primary">Fathom · reporting features <ArrowUpRight className="inline h-3.5 w-3.5" /></p>
            <p className="mt-2 text-xs leading-5 text-foreground/60">Publicly describes variance and trend analysis, driver-based forecasts, scheduled report templates, CSV/PDF reporting and approval drafts.</p>
          </a>
          <a href="https://baliestatemanager.com/villa-owner-reporting-bali" target="_blank" rel="noreferrer" className="group rounded-xl border border-primary/10 p-5 transition-colors hover:bg-accent/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary">
            <p className="text-sm font-semibold text-primary">Bali Estate Manager · owner reporting <ArrowUpRight className="inline h-3.5 w-3.5" /></p>
            <p className="mt-2 text-xs leading-5 text-foreground/60">Documents gross/net channels, operating expenses, owner movements, occupancy, ADR, RevPAN and reconciliation for villa-owner reporting.</p>
          </a>
        </div>
      </div>
      <p className="mt-5 text-xs leading-5 text-foreground/45">These are public methodology references, not Bali Accounting partners, integrations, endorsements or a best-in-market ranking.</p>
    </section>

    <section className="mt-2 rounded-2xl border border-primary/10 bg-[#f8f8f2] p-5 sm:p-7">
      <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-secondary" /><div><h3 className="font-serif text-2xl text-primary">Scope and reliance</h3><p className="mt-3 text-sm leading-6 text-foreground/65">Fictional figures demonstrate a possible report structure and guarantee no outcomes. This is management reporting, not an audit, tax advice, tax filing, visa advice or bank payment authorization. Forecasts are assumptions, not promises. Advanced reporting, digital delivery and automation depend on agreed package scope, selected tools and integrations.</p></div></div>
      <div className="mt-6 flex flex-col gap-4 border-t border-primary/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-foreground/60">A real report would preserve source references, reviewer notes and the status of items still awaiting evidence.</p>
        <div className="flex flex-wrap gap-x-6 gap-y-3 print:hidden">
          <Link href="/villa-financial-reporting-bali" className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline decoration-secondary/50 underline-offset-4 hover:text-secondary">Reporting scope <ArrowUpRight className="h-4 w-4" /></Link>
          <Link href="/pricing" className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline decoration-secondary/50 underline-offset-4 hover:text-secondary">Compare packages <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
    <div className="mt-8 flex items-center gap-2 text-[11px] text-foreground/40"><ArrowDownRight className="h-3.5 w-3.5" /> Example close: {financeDemo.period} · figures are calculated from the demonstration model</div>
    <style>{`@media print { .finance-report { max-width: none; padding: 0; } .finance-report section { break-inside: avoid; } .finance-report button { display: none; } .finance-report a { color: #174f43; } }`}</style>
  </article>;
}
