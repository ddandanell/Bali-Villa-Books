/**
 * Commercial comparison pages: one hub plus four decision pages.
 *
 * Claim discipline: every figure here is either an approved firm price (from
 * ./pricing) or an explicitly illustrative planning number. No named provider is
 * described, priced or ranked. Nothing here is a tax, legal or immigration
 * conclusion; those points route to a licensed adviser.
 */

export type CompareRow = { dimension: string; left: string; right: string };

export type CompareSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  links?: [string, string][];
};

export type ComparePage = {
  path: string;
  label: string;
  title: string;
  description: string;
  h1: string;
  deck: string;
  primaryKeyword: string;
  updated: string;
  answer: string[];
  audience: string;
  leftHeading: string;
  rightHeading: string;
  rows: CompareRow[];
  chooseLeft: string[];
  chooseRight: string[];
  verdictNote: string;
  sections: CompareSection[];
  table: { caption: string; columns: [string, string, string]; rows: [string, string, string][]; note: string };
  mistakes: { heading: string; body: string }[];
  checklist: string[];
  faqs: [string, string][];
  related: [string, string][];
  guides: [string, string][];
};

export const comparePages: ComparePage[] = [
  {
    path: "/compare/bali-firm-vs-offshore-bookkeeper",
    label: "Bali firm vs offshore bookkeeper",
    title: "Bali Accountant or Offshore Bookkeeper? Villa Owner Comparison",
    description:
      "Compare a Bali-based accountant with an offshore bookkeeping service: documents, OTA payouts, owner reporting and the pack a tax consultant needs.",
    h1: "Bali-Based Accountant or Offshore Bookkeeper for a Villa?",
    deck:
      "Both models can produce a tidy spreadsheet. They diverge on who reads the Indonesian documents, who chases platform payouts and who can explain the year to a licensed tax consultant.",
    primaryKeyword: "bali accountant vs offshore bookkeeper",
    updated: "2026-10-31",
    answer: [
      "Offshore bookkeeping usually wins on hourly price and on clean, English-language exports. A Bali-based firm usually wins when the source documents are Indonesian, when platform payouts have to be chased against the bank, and when the finished records must be handed to a licensed tax consultant in a form that person will accept.",
      "The decision is not about which model is better in general. It is about where your records actually break: if they break at the bank and the platform, a remote processor cannot see the gap; if they are already reconciled and merely need coding, remote work is efficient.",
    ],
    audience:
      "This comparison is for villa owners and operators who already have bookkeeping or are about to appoint someone, and who are weighing a cheaper remote service against a firm that works inside the Indonesian document set.",
    leftHeading: "Offshore bookkeeping service",
    rightHeading: "Bali-based accounting firm",
    rows: [
      { dimension: "Typical monthly fee", left: "Lower per hour; priced per transaction or per hour", right: "Fixed package from Rp 2.9m/month, scope per property" },
      { dimension: "Document language", left: "Works in English exports and bank CSVs", right: "Reads Indonesian invoices, BPJS records and regional tax documents" },
      { dimension: "Platform payouts", left: "Reconciles from the export you send", right: "Reconciles from the export and asks for the missing statement" },
      { dimension: "Bank access", left: "Read-only viewer or CSV you supply", right: "Agreed read-only access or statements you supply" },
      { dimension: "Who talks to the tax consultant", left: "You, relaying questions", right: "An agreed evidence pack, with scope stated in writing" },
      { dimension: "Time zone", left: "Questions answered overnight", right: "Same working day, Bali hours" },
      { dimension: "Turnaround promise", left: "Usually stated in days", right: "Report target the 15th after complete documents — a target, not a guarantee" },
      { dimension: "Tax advice", left: "Out of scope", right: "Out of scope: record-keeping only, filings referred to a licensed adviser" },
    ],
    chooseLeft: [
      "Every document already arrives in English, and the bank is fully matched.",
      "You only need coding, categorising and a periodic report.",
      "You have an Indonesian adviser who handles documents and only need processing capacity.",
      "Volume is steady and the format rarely changes.",
    ],
    chooseRight: [
      "Platform payouts, supplier invoices and BPJS records arrive in mixed formats and languages.",
      "You cannot tell whether last month's bank balance is explained by the bookings.",
      "Several properties or owners share one bank account and the split must be documented.",
      "You need the records to survive a handover to a licensed tax consultant.",
    ],
    verdictNote:
      "Some owners run both: a Bali firm for the reconciliation and the pack, a remote processor for volume coding. That only works when responsibilities are written down, because the same month cannot be booked twice.",
    sections: [
      {
        heading: "What actually changes between the two models",
        paragraphs: [
          "The fee is the smallest difference. The real difference is who holds the source records and who is allowed to ask a follow-up question. A remote service works from what you forward. A firm in Bali can ask the villa manager for the missing Booking.com statement, read an Indonesian supplier invoice without translation, and check whether a BPJS record matches the staff cost line it was booked to.",
          "That matters most at month end, when the gap appears: bookings say one thing, the bank says another, and someone has to decide which document closes the difference. If nobody in the process can read the document, the difference is parked as 'unexplained' and carries forward.",
        ],
      },
      {
        heading: "The arithmetic owners rarely do",
        paragraphs: [
          "A cheap processing fee plus paid adviser hours can cost more than a package that includes the reconciliation. The illustration below is arithmetic, not a quote from any provider, and the hourly figure is a planning assumption only.",
        ],
        bullets: [
          "Illustrative remote processing: Rp 1,800,000 per month.",
          "Illustrative Bali adviser review of the finished file: 2 hours × Rp 450,000 = Rp 900,000.",
          "Combined: Rp 2,700,000 per month, before the handover time you spend yourself.",
          "Starter package: Rp 2,900,000 per month for an agreed single-property scope, reconciliation included.",
        ],
        links: [
          ["What a monthly engagement actually delivers", "/blog/accounting-services-bali-monthly-deliverables"],
          ["Multi-currency records and exchange differences", "/blog/multi-currency-bookkeeping-bali-villa-exchange-differences"],
        ],
      },
      {
        heading: "How to combine two providers without paying twice",
        paragraphs: [
          "Split by task, not by month. Give the reconciliation and the report to one provider and the coding backlog to the other, and write down who closes the month, who holds the working file and what the handover format is. If both providers produce a monthly profit and loss, you are paying twice and you will eventually have two sets of numbers to explain.",
          "Keep one calendar. The report target, the document deadline and the bank statement date should all come from the same schedule, otherwise each provider waits for the other.",
        ],
      },
    ],
    table: {
      caption: "Illustrative monthly cost of two models for one villa (planning figures, not quotes)",
      columns: ["Cost line", "Two-provider arrangement", "Single Bali package"],
      rows: [
        ["Processing", "Rp 1,800,000", "Included in package"],
        ["Adviser review hours", "Rp 900,000 (2 × Rp 450,000)", "Included in reconciliation"],
        ["Your own assembly time", "3–5 hours", "1–2 hours"],
        ["Stated monthly total", "Rp 2,700,000", "Rp 2,900,000"],
      ],
      note:
        "The hourly rate and remote fee are illustrative planning assumptions, not published prices from any provider. Your own time is not costed here; value it yourself.",
    },
    mistakes: [
      {
        heading: "Assuming the platform export is the bookkeeping",
        body: "A payout export shows what the platform says it paid. It does not show what reached the bank, which fees were withheld, or which reservation the deposit belongs to. Someone has to tie the three records together.",
      },
      {
        heading: "Buying hours without a document owner",
        body: "An hourly arrangement with no named person responsible for collecting statements produces the same missing records each month, billed repeatedly.",
      },
      {
        heading: "Treating a foreign bookkeeper as a tax opinion",
        body: "Coding a transaction is not a tax conclusion. Indonesian treatment questions belong with a licensed adviser, whichever model you run.",
      },
    ],
    checklist: [
      "Ask who reads Indonesian source documents, by name and role.",
      "Ask what happens when a payout does not match the bank deposit.",
      "Confirm the handover format: a working file, a PDF pack, or both.",
      "Confirm who is allowed to contact your villa manager directly.",
      "Agree the document deadline and the report target in writing.",
      "State in writing that tax advice and filings sit elsewhere.",
    ],
    faqs: [
      [
        "Is an offshore bookkeeper cheaper for a Bali villa?",
        "Usually on the hourly line, yes. The comparison changes once adviser review, handover time and rework on unmatched payouts are counted. Our illustrative example lands within Rp 200,000 of the Starter package, but that is arithmetic, not a claim about any named provider.",
      ],
      [
        "Can a Bali firm work with documents sent from overseas?",
        "Yes. Most of our villa work starts from platform exports, bank statements and scanned invoices held by a manager or owner abroad. What we cannot do is invent a document that was never issued.",
      ],
      [
        "Does using an offshore bookkeeper breach any Indonesian rule?",
        "Bookkeeping location is not something we advise on. If your entity has filing obligations, confirm the arrangement with a licensed Indonesian adviser before you rely on it.",
      ],
      [
        "Will you take over records another provider prepared?",
        "Yes, with a documented handover: opening balances, the last reconciled month, and a list of unexplained balances. We will not silently restate another provider's work.",
      ],
      [
        "Do you file tax returns?",
        "No. Bookkeeping packages organise records. Tax advice and filings are excluded and handled by a licensed adviser under a separate engagement.",
      ],
    ],
    related: [
      ["Airbnb and OTA payout reconciliation", "/airbnb-ota-reconciliation-bali"],
      ["Monthly villa financial reporting", "/villa-financial-reporting-bali"],
      ["PT PMA villa bookkeeping", "/pt-pma-villa-bookkeeping"],
    ],
    guides: [
      ["English-speaking accountants in Bali: what bilingual service should cover", "/blog/english-speaking-accountant-bali-bilingual-service"],
      ["Preparing records for a Bali tax consultant", "/blog/preparing-records-bali-tax-consultant-evidence-pack"],
      ["Changing accountant in Bali: a practical handover", "/blog/changing-accountant-bali-bookkeeping-handover"],
    ],
  },
  {
    path: "/compare/villa-manager-vs-specialist-bookkeeping",
    label: "Manager bookkeeping vs specialist",
    title: "Villa Manager Bookkeeping vs a Specialist Accountant",
    description:
      "What a villa management statement gives an owner, what specialist bookkeeping adds, and how to test whether the statement ties to the bank.",
    h1: "Villa Manager Bookkeeping vs a Specialist Accountant",
    deck:
      "A manager reports on the operation. A specialist reconciles the money. Owners often pay for the second without checking whether the first already did the job.",
    primaryKeyword: "villa manager bookkeeping vs accountant",
    updated: "2026-10-31",
    answer: [
      "A management company produces an operating statement: what was booked, what it charged, what it retained. A specialist produces reconciled books: every booking traced to a payout, every payout to the bank, every property and owner separated, with the differences documented.",
      "If your manager's statement already ties gross bookings to bank receipts and separates owners, you may only need a review layer. If it is a summary built from the property system, the reconciliation work is real and should be scoped as such.",
    ],
    audience:
      "For owners with a management company or in-house team, and for operators deciding whether to build bookkeeping internally or appoint a firm outside the management relationship.",
    leftHeading: "Management company bookkeeping",
    rightHeading: "Independent specialist",
    rows: [
      { dimension: "What it is built for", left: "Operating decisions and owner distributions", right: "Reconciled books and an evidence pack" },
      { dimension: "Source of truth", left: "Property management system", right: "Platform statements plus bank" },
      { dimension: "Multiple owners", left: "Handled by agreed allocation", right: "Documented per-owner ledger" },
      { dimension: "Document custody", left: "Manager holds invoices and payroll records", right: "Agreed schedule of documents supplied to the firm" },
      { dimension: "Independence", left: "Reports on its own performance", right: "Reports outside the management fee" },
      { dimension: "Tax filing", left: "Usually referred out", right: "Out of scope; referred to a licensed adviser" },
    ],
    chooseLeft: [
      "One owner, one property, and the statement already ties to the bank.",
      "You mainly need distribution figures, not a filing pack.",
      "Documents are complete and you have no reason to test the numbers.",
    ],
    chooseRight: [
      "Several owners share costs and each needs a defensible split.",
      "Distribution figures differ from what the bank shows.",
      "A tax consultant has asked for records the manager does not produce.",
      "You are preparing to sell, refinance or change manager.",
    ],
    verdictNote:
      "The test is not who is more trustworthy. It is whether the statement you already receive can be tied, line by line, to a bank receipt and a platform statement. If it can, a review is enough.",
    sections: [
      {
        heading: "The twenty-minute test of a management statement",
        paragraphs: [
          "Take last month. Open the statement, the platform payout report and the bank statement side by side. Gross bookings, less platform fees and refunds, should equal payouts; payouts, adjusted for timing, should equal bank receipts. Then check one cost line — cleaning, for example — back to invoices.",
          "If all three tie, you have a usable statement. If the statement shows a net distribution with no bridge from gross bookings, you are looking at a summary, and a summary cannot be reconciled to anything.",
        ],
        links: [
          ["How to read your villa management statement", "/blog/how-to-read-villa-management-statement"],
          ["Why management and tax records need separate controls", "/blog/villa-management-accounting-conflict"],
        ],
      },
      {
        heading: "Why two sets of records are normal, and when they become a problem",
        paragraphs: [
          "A manager's statement and a firm's books answer different questions, so some overlap is expected. It becomes a problem when the two disagree and nobody owns the difference, or when the same month is prepared twice at full cost.",
          "Write down which record set is authoritative for tax, which is authoritative for owner distributions, and who reconciles the two at year end. That single sentence prevents most disputes we see in handover files.",
        ],
        links: [["Property management bookkeeping: owner liabilities", "/blog/property-management-bookkeeping-owner-liabilities"]],
      },
      {
        heading: "Costing the decision honestly",
        paragraphs: [
          "Specialist bookkeeping is an additional cost when a management fee already exists, and the illustration below shows that plainly. Whether it is worth it depends on how many owners share the property, whether a filing pack is needed, and what an unexplained difference would cost you.",
        ],
        bullets: [
          "Illustrative annual rental revenue: Rp 600,000,000.",
          "Illustrative management fee at 8%: Rp 48,000,000 per year.",
          "Starter package for twelve months: 12 × Rp 2,900,000 = Rp 34,800,000.",
          "Professional package for twelve months: 12 × Rp 4,900,000 = Rp 58,800,000.",
        ],
      },
    ],
    table: {
      caption: "Illustrative annual cost of adding a specialist layer (planning figures)",
      columns: ["Line", "Manager only", "Manager plus Starter"],
      rows: [
        ["Management fee (8% of Rp 600m)", "Rp 48,000,000", "Rp 48,000,000"],
        ["Bookkeeping", "Inside the management fee", "Rp 34,800,000"],
        ["Reconciliation evidence", "Statement only", "Documented bridge to bank"],
        ["Owner split", "Agreed allocation", "Per-owner ledger"],
      ],
      note:
        "Revenue, the 8% fee and the split between models are illustrative. Package prices are the firm's published prices; every engagement is scoped after a document review.",
    },
    mistakes: [
      {
        heading: "Accepting a net distribution as a P&L",
        body: "A single number tells you what arrived. It does not tell you gross bookings, platform fees, cost of sales or which owner bore which cost.",
      },
      {
        heading: "Assuming the manager's system is the ledger",
        body: "A property management system records operations. It is not a general ledger, and it usually cannot evidence a bank reconciliation.",
      },
      {
        heading: "Duplicating the whole month",
        body: "Paying a manager to prepare records and a firm to prepare the same records again is avoidable. Split by task and name the authoritative record set.",
      },
    ],
    checklist: [
      "Tie one month from gross bookings to bank receipts before you decide.",
      "Ask for a written list of documents the manager holds.",
      "Confirm who reconciles manager statements to the firm's books.",
      "Agree which record set is authoritative for tax.",
      "Check that shared costs have a stated allocation method.",
      "Confirm the notice period and handover format if you change manager.",
    ],
    faqs: [
      [
        "Can my villa manager's statement replace bookkeeping?",
        "Sometimes, if it bridges gross bookings to bank receipts and separates owners. If it shows a net distribution without that bridge, it is a summary and cannot support a filing pack or an owner dispute.",
      ],
      [
        "Will a specialist firm duplicate what the manager already does?",
        "It should not. The scope can be limited to reconciliation, owner separation and the evidence pack, leaving operations reporting with the manager.",
      ],
      [
        "Do you work alongside a management company?",
        "Yes. We agree a document schedule with the manager and keep the reconciliation independent of the management fee. We do not audit the manager, and we say so in the scope.",
      ],
      [
        "What if the manager refuses to share documents?",
        "Then the arrangement needs to be resolved contractually before bookkeeping starts. We record the gap as a missing-document item rather than guessing at figures.",
      ],
      [
        "Is this arrangement acceptable to a tax consultant?",
        "A consultant will want the underlying statements and invoices, not just our summary. The pack is built for that handover, but acceptance is their judgement, not ours.",
      ],
    ],
    related: [
      ["Monthly villa financial reporting", "/villa-financial-reporting-bali"],
      ["Airbnb and OTA payout reconciliation", "/airbnb-ota-reconciliation-bali"],
      ["Bookkeeping cleanup", "/villa-bookkeeping-cleanup-bali"],
    ],
    guides: [
      ["How to read your villa management statement", "/blog/how-to-read-villa-management-statement"],
      ["Multi-villa accounting: one entity or more?", "/blog/multi-villa-accounting-one-entity-or-more"],
      ["What a healthy Bali villa P&L shows", "/blog/healthy-villa-p-and-l-bali-benchmark-numbers"],
    ],
  },
  {
    path: "/compare/monthly-package-vs-hourly-accountant",
    label: "Monthly package vs hourly accountant",
    title: "Monthly Bookkeeping Package or Hourly Accountant in Bali?",
    description:
      "Compare a fixed monthly bookkeeping package with an hourly accountant in Bali: what each covers, the break-even point and the costs that hourly work hides.",
    h1: "Monthly Bookkeeping Package or Hourly Accountant?",
    deck:
      "Hourly work is right for a defined question. It is a poor fit for a repeating process, because the process itself — collecting, matching and explaining — is the cost.",
    primaryKeyword: "monthly bookkeeping package vs hourly accountant",
    updated: "2026-10-31",
    answer: [
      "An hourly accountant suits a one-off task: a specific question, a single reconciliation, a short review. A monthly package suits a repeating cycle, because the fee is fixed, the deliverables are named and the schedule is agreed in advance.",
      "At an illustrative Rp 450,000 per hour, our Starter fee of Rp 2,900,000 equals about 6.4 hours of ad-hoc work a month. If your records need more than six hours of attention, the package is the cheaper structure; if they need less, hourly may be.",
    ],
    audience:
      "Owners and operators deciding between an ad-hoc accountant, a freelance bookkeeper paid by the hour, and a fixed monthly package with a stated reporting deadline.",
    leftHeading: "Hourly or ad-hoc accountant",
    rightHeading: "Fixed monthly package",
    rows: [
      { dimension: "Price certainty", left: "Varies with the work each month", right: "Fixed monthly fee for an agreed scope" },
      { dimension: "What is included", left: "The task you asked for", right: "Named deliverables: reconciliation, report, document register" },
      { dimension: "Reconciliation", left: "Only if separately requested", right: "Part of the monthly cycle" },
      { dimension: "Document chasing", left: "Billed as it happens", right: "Within the agreed cycle, listed in the document register" },
      { dimension: "Reporting date", left: "When the work is done", right: "Target the 15th after complete documents" },
      { dimension: "Year-end handover", left: "Assembled on request", right: "Maintained as the year proceeds" },
      { dimension: "Scope creep", left: "Absorbed into the hourly bill", right: "Discussed and scoped before more work starts" },
    ],
    chooseLeft: [
      "You have one defined question or one month to repair.",
      "Your records are already reconciled and you need coding or a review.",
      "Volume is genuinely low: a handful of transactions a month.",
      "You already have a firm for the cycle and need a second opinion.",
    ],
    chooseRight: [
      "Records arrive every month from a manager, platform or staff team.",
      "You want the same deliverables on the same date each month.",
      "You need a document register that shows what is missing.",
      "You want a handover pack ready without a year-end scramble.",
    ],
    verdictNote:
      "The honest test is your own document count: if assembling and matching takes you more than six hours a month, the fixed structure is usually cheaper and certainly more predictable.",
    sections: [
      {
        heading: "What hourly work really charges for",
        paragraphs: [
          "Hourly billing charges for the reconstruction of context: opening the file, working out which records are missing, asking for them, then doing the task. In a repeating cycle that context is re-built every month. In a package, it is built once and then maintained.",
          "This is not an argument against hourly work. It is an argument against using it for a process that never ends, without agreeing what the process produces.",
        ],
        links: [
          ["Monthly bookkeeping cost: compare deliverables before fees", "/blog/monthly-bookkeeping-cost-villa-deliverables"],
          ["Monthly villa accounting checklist", "/blog/monthly-bali-villa-accounting-checklist"],
        ],
      },
      {
        heading: "Setting the scope so a package does not become hourly anyway",
        paragraphs: [
          "A fixed fee only holds if the scope defines the inputs: how many properties, how many bank accounts, which platforms, which suppliers and what happens when a document is missing. Out-of-scope work should be named before it is done, not billed after.",
          "Ask any provider for the boundary in writing: what is included, what is quoted separately, and which tasks belong to a licensed adviser rather than the bookkeeper.",
        ],
        bullets: [
          "Number of properties and bank accounts covered.",
          "Platforms reconciled and the reporting currency.",
          "Document deadline and the report target.",
          "Owner or company separation required in the report.",
          "Explicit exclusions: tax advice, filings, payroll execution.",
        ],
        links: [["The true cost of DIY villa accounting", "/blog/true-cost-diy-villa-accounting-bali"]],
      },
    ],
    table: {
      caption: "Illustrative hourly equivalents at an assumed Rp 450,000 per hour (arithmetic, not a quote)",
      columns: ["Hours needed each month", "Hourly equivalent", "Package comparison"],
      rows: [
        ["2 hours", "Rp 900,000", "Below Starter; hourly is cheaper"],
        ["4 hours", "Rp 1,800,000", "Below Starter; hourly is cheaper"],
        ["6 hours", "Rp 2,700,000", "Close to Starter"],
        ["7 hours", "Rp 3,150,000", "Above Starter"],
        ["10 hours", "Rp 4,500,000", "Above Starter; Professional may fit"],
      ],
      note:
        "The hourly rate is an illustrative planning assumption for comparison only. Our published fees are Starter Rp 2,900,000, Professional Rp 4,900,000 and Premium Rp 6,900,000 per month.",
    },
    mistakes: [
      {
        heading: "Comparing a fee with a scope",
        body: "An hourly rate and a package fee are not the same unit. Compare what is produced at month end, not the price of an hour.",
      },
      {
        heading: "Leaving reconciliation out of the hourly brief",
        body: "Coding transactions without tying the bank is a partial job. The difference surfaces later, usually at the worst time.",
      },
      {
        heading: "Assuming fixed means unlimited",
        body: "A fixed fee covers a defined scope. Records for extra properties, new platforms or two years of backlog change the scope and should change the conversation, not the invoice.",
      },
    ],
    checklist: [
      "Count the documents and transactions you send each month.",
      "Estimate the hours you personally spend assembling them.",
      "Ask what happens to a missing statement under each model.",
      "Confirm the report date and what 'complete documents' means.",
      "Get the exclusion list in writing before comparing totals.",
      "Decide who handles tax questions, and name them.",
    ],
    faqs: [
      [
        "Is a monthly package cheaper than an hourly accountant?",
        "It depends on the hours your records need. At an illustrative Rp 450,000 an hour, Starter equals about 6.4 hours; above that the package structure is usually cheaper, below it hourly may be.",
      ],
      [
        "Can I start hourly and move to a package?",
        "Yes, and it is a sensible sequence: an initial review establishes the document state, then a monthly scope can be priced against real volumes instead of guesses.",
      ],
      [
        "What is excluded from the monthly packages?",
        "Tax advice, tax filings, payroll execution, company formation, licensing and visa work. Those are separately scoped, and tax matters involve a licensed adviser.",
      ],
      [
        "Do you charge for asking questions?",
        "Within an agreed monthly scope, ordinary questions about your own report are part of the engagement. Substantial additional work, such as a new property or a restatement, is scoped before it starts.",
      ],
      [
        "How is the report delivered?",
        "As a monthly report with a document register listing what is missing or unresolved, plus the working file on request. The sample report on this site shows the structure with fictional figures.",
      ],
    ],
    related: [
      ["Pricing and packages", "/pricing"],
      ["Monthly villa financial reporting", "/villa-financial-reporting-bali"],
      ["Airbnb bookkeeping", "/airbnb-bookkeeping-bali"],
    ],
    guides: [
      ["Monthly bookkeeping cost: compare deliverables before fees", "/blog/monthly-bookkeeping-cost-villa-deliverables"],
      ["12 questions to ask before hiring an accountant in Bali", "/blog/questions-before-hiring-accountant-bali"],
      ["The true cost of DIY villa accounting", "/blog/true-cost-diy-villa-accounting-bali"],
    ],
  },
  {
    path: "/compare/cleanup-and-monthly-vs-monthly-only",
    label: "Cleanup first or monthly only",
    title: "Bookkeeping Cleanup First, or Straight to Monthly?",
    description:
      "Three tests that show whether your villa books need a cleanup before monthly bookkeeping, what a cleanup produces, and how the sequence and cost work.",
    h1: "Cleanup First, or Straight to Monthly Bookkeeping?",
    deck:
      "Monthly bookkeeping continues from an opening position. If that position is unexplained, every later month inherits the doubt.",
    primaryKeyword: "bookkeeping cleanup before monthly bookkeeping",
    updated: "2026-10-31",
    answer: [
      "Run three tests: does the last closed month tie to the bank, can you list the missing documents, and is owner or company money mixed with operating money. If the month ties and the gaps are counted, start monthly. If any test fails, a cleanup has to come first, because monthly work would otherwise carry unexplained balances forward.",
      "Cleanup starts from Rp 7,900,000 for up to 12 months of records, reviewed per file. It produces an opening position you can defend, a missing-document register and a list of items only a licensed adviser can resolve.",
    ],
    audience:
      "For owners with 12 to 24 months of incomplete records, a change of manager, or a first filing or sale approaching, who are deciding whether to book a cleanup or to start monthly and hope it settles.",
    leftHeading: "Monthly bookkeeping only",
    rightHeading: "Cleanup, then monthly",
    rows: [
      { dimension: "Starting point", left: "Accepts the existing opening balances", right: "Rebuilds and documents the opening position" },
      { dimension: "Unmatched transactions", left: "Carried forward as unexplained", right: "Investigated and listed with evidence" },
      { dimension: "Missing documents", left: "Noted when they surface", right: "Register built during the cleanup" },
      { dimension: "Bank tie-out", left: "Assumed from the first month", right: "Established for each month in scope" },
      { dimension: "Cost", left: "Package fee from month one", right: "Cleanup from Rp 7,900,000 plus the package once current" },
      { dimension: "Use for a filing or sale", left: "Risky: the history is unexplained", right: "Built for that handover, with limits stated" },
    ],
    chooseLeft: [
      "The last month reconciles to the bank and the differences are documented.",
      "You can produce platform statements and invoices for the period on request.",
      "Owner and operating money are already separated.",
      "Nothing significant depends on the older history — no filing, sale or dispute.",
    ],
    chooseRight: [
      "Cash balances have never been tied to the books.",
      "Two years of platform payouts are unmatched.",
      "Money moved between owner and company accounts without a record.",
      "A tax consultant, buyer or bank has asked for the history.",
    ],
    verdictNote:
      "A cleanup is not a punishment for past disorganisation. It is the only way to state an opening balance you can defend, and every later monthly report rests on it.",
    sections: [
      {
        heading: "The three tests, in order",
        paragraphs: [
          "First, tie the last closed month: bank closing balance against the books, with each difference explained by a document. Second, list what is missing: statements, invoices, payroll records, platform exports. Third, check separation: did owner withdrawals, company funding or another property's costs pass through the same account without a record?",
          "Two passes out of three is not enough. A missing-document list that nobody has counted becomes the same list twelve months later, with interest from whoever is waiting for the file.",
        ],
        links: [
          ["Catch-up bookkeeping and the missing-document register", "/blog/catch-up-bookkeeping-missing-document-register"],
          ["Building an evidence-based opening balance", "/blog/bookkeeping-cleanup-opening-balances-bali"],
        ],
      },
      {
        heading: "What a cleanup actually produces",
        paragraphs: [
          "Not a perfect history. It produces a documented opening position, a month-by-month reconciliation where evidence exists, a register of what is still missing, and a clear statement of which items cannot be resolved from records alone. Those items go to you, or to your licensed adviser, rather than being estimated.",
          "That distinction matters for a handover. A consultant can work with a documented gap. A consultant cannot work with a plausible guess.",
        ],
        links: [["Cleaning up two years of messy villa books", "/blog/bookkeeping-cleanup-bali-two-years-messy-villa-books"]],
      },
      {
        heading: "Sequencing and timing",
        paragraphs: [
          "Work backwards from the month you want to be current. A 12-month cleanup typically runs while the current months are held, so the monthly cycle should not start until the opening position is agreed.",
        ],
        bullets: [
          "Illustrative backlog: 18 months, averaging 45 transactions a month, about 810 lines.",
          "The cleanup starting fee covers up to 12 months of records, subject to review.",
          "Remaining months are reviewed and quoted separately, not assumed to fit the band.",
          "Monthly bookkeeping starts once the opening position is agreed and signed off.",
        ],
      },
    ],
    table: {
      caption: "Illustrative sequence and cost for an 18-month backlog (planning figures)",
      columns: ["Stage", "What happens", "Illustrative cost"],
      rows: [
        ["Review", "Document count, bank access, scope agreed", "No charge for the initial conversation"],
        ["Cleanup", "Up to 12 months rebuilt and reconciled", "From Rp 7,900,000"],
        ["Remaining months", "Reviewed and quoted on the same basis", "Quoted separately"],
        ["Monthly", "Reconciliation, report, document register", "Starter from Rp 2,900,000 per month"],
      ],
      note:
        "Cleanup is a reviewed starting fee, not a fixed quote: scope depends on document availability and the number of accounts and properties.",
    },
    mistakes: [
      {
        heading: "Starting monthly on top of an unexplained balance",
        body: "The opening difference does not disappear. It reappears in every comparison with the bank until someone sits down with the earlier records.",
      },
      {
        heading: "Waiting for perfect documents",
        body: "A cleanup can begin with what exists. Missing items become register entries, not reasons to delay the whole exercise.",
      },
      {
        heading: "Asking a bookkeeper to settle a tax question",
        body: "Some historical items are treatment questions, not record gaps. They belong with a licensed adviser; the cleanup documents them plainly instead of deciding them.",
      },
    ],
    checklist: [
      "Run the bank tie-out test on the last closed month.",
      "Count the missing documents rather than describing them.",
      "List any owner or company money that moved through operating accounts.",
      "Decide the month you need to be current by.",
      "Ask what the cleanup produces: opening position, register, unresolved list.",
      "Confirm what happens to items that need a licensed adviser.",
    ],
    faqs: [
      [
        "How do I know if I need a cleanup?",
        "Run the three tests: bank tie-out for the last closed month, a counted list of missing documents, and separation of owner and operating money. If any of them fails, start with a cleanup.",
      ],
      [
        "How much does a cleanup cost?",
        "Cleanup starts from Rp 7,900,000 for up to 12 months of records, reviewed per file. The starting figure is not a fixed quote: document availability, account count and property count change the scope.",
      ],
      [
        "Can you work from scanned documents only?",
        "Yes, where the scans are legible and complete. Illegible or partial documents are recorded as gaps rather than interpreted.",
      ],
      [
        "Will a cleanup fix my tax position?",
        "No. It produces records a licensed adviser can work from. Treatment, filing and any exposure are their conclusions, not ours.",
      ],
      [
        "How long does it take?",
        "It depends on document availability and how many months are in scope. We give a schedule after the review, and we do not promise a completion date before seeing the file.",
      ],
    ],
    related: [
      ["Bookkeeping cleanup and catch-up books", "/villa-bookkeeping-cleanup-bali"],
      ["Pricing and packages", "/pricing"],
      ["Monthly villa financial reporting", "/villa-financial-reporting-bali"],
    ],
    guides: [
      ["Catch-up bookkeeping: build a missing-document register", "/blog/catch-up-bookkeeping-missing-document-register"],
      ["Bookkeeping cleanup: opening balances", "/blog/bookkeeping-cleanup-opening-balances-bali"],
      ["12 questions to ask before hiring an accountant in Bali", "/blog/questions-before-hiring-accountant-bali"],
    ],
  },
];

export const compareHub = {
  path: "/compare",
  title: "Bali Villa Accounting Compared: Four Ways to Get the Books Done",
  description:
    "Compare four ways to run Bali villa bookkeeping — DIY, manager in-house, offshore service and a Bali firm — on documents, payouts, owner reporting and cost.",
  h1: "Four Ways to Run Bali Villa Bookkeeping, Compared",
  deck:
    "Every model produces numbers. They differ on who holds the documents, who ties platform payouts to the bank, and whether a licensed tax consultant will accept the result.",
  primaryKeyword: "bali villa accounting providers comparison",
  updated: "2026-10-31",
  answer: [
    "There are four realistic ways to keep villa books in Bali: a spreadsheet you maintain, bookkeeping inside the management company, an offshore bookkeeping service, and a Bali-based firm working from Indonesian source documents. They are not interchangeable, and the cheapest fee is rarely the lowest total cost.",
    "Choose by where the records break. If the break is at the bank and the platform, you need reconciliation inside the scope. If the break is only coding, a remote service is efficient. If the break is that two owners share one account, you need documented separation before anything else.",
  ],
  models: [
    {
      name: "Spreadsheet maintained by the owner",
      bestFor: "One villa, low volume, owner comfortable with reconciliation",
      produces: "A cash view you update yourself",
      watchOut: "Payouts are rarely matched to deposits; the history is one deleted row from being lost",
      cost: "No fee; the reconciliation is your own time each month",
    },
    {
      name: "Bookkeeping inside the management company",
      bestFor: "Owners who mainly need distributions",
      produces: "An operating statement built from the property system",
      watchOut: "The statement reports on the manager; it is not a bank-tied ledger",
      cost: "Inside the management fee you already pay",
    },
    {
      name: "Offshore bookkeeping service",
      bestFor: "Clean, English-language exports and steady volumes",
      produces: "Coded transactions and a periodic report",
      watchOut: "Indonesian documents and unmatched payouts return to you",
      cost: "Lower hourly rate; adviser review billed separately",
    },
    {
      name: "Bali-based specialist firm",
      bestFor: "Mixed documents, several owners, filings or a sale ahead",
      produces: "Reconciled books, per-owner reporting and an evidence pack",
      watchOut: "You must still supply documents; nothing is reconstructed from nothing",
      cost: "From Rp 2,900,000 per month, scope per property",
    },
  ],
  sections: [
    {
      heading: "Five dimensions that actually separate providers",
      paragraphs: [
        "Fee tables look comparable and usually are not. Ask about these five things instead, and ask what happens in the month something does not match.",
      ],
      bullets: [
        "Document custody: who holds the platform statements, invoices and payroll records, and how they reach the bookkeeper.",
        "Payout reconciliation: whether gross bookings are traced to bank receipts, and how differences are recorded.",
        "Property and owner separation: whether one bank account serving several owners produces separate ledgers.",
        "Reporting timetable: the date, and what 'complete documents' means for that date.",
        "Boundary: who answers tax questions, and whether that person is licensed to.",
      ],
      links: [
        ["12 questions to ask before hiring an accountant in Bali", "/blog/questions-before-hiring-accountant-bali"],
        ["Accounting services in Bali: monthly deliverables", "/blog/accounting-services-bali-monthly-deliverables"],
      ],
    },
    {
      heading: "How to score the answers",
      paragraphs: [
        "Give each dimension a score of 0, 1 or 2: 0 for no answer or a verbal one, 1 for a described process, 2 for a process with a document or sample attached. Nineteen or twenty questions is not the goal; a provider that scores 2 on custody and reconciliation and 0 on boundary is telling you where the risk sits.",
        "Then price the lowest-scoring dimension yourself. If a provider cannot tie payouts to the bank, someone will have to, and the hourly cost of that eventually appears somewhere.",
      ],
      links: [["How to read your villa management statement", "/blog/how-to-read-villa-management-statement"]],
    },
    {
      heading: "What we do, and what we do not",
      paragraphs: [
        "We are a Bali-based firm. Monthly packages from Rp 2,900,000 cover reconciliation, owner reporting and a document register for an agreed scope. Cleanup starts from Rp 7,900,000 for up to 12 months of records, reviewed per file.",
        "We do not provide tax advice, file tax returns, execute payroll or handle immigration. Those sit with a licensed adviser or a separately scoped engagement. We do not publish comparisons of named competitors, because a claim about another firm's process cannot be verified from outside it.",
      ],
      links: [
        ["Review a sample monthly report", "/sample-report"],
        ["Read the packages and prices", "/pricing"],
      ],
    },
  ],
  table: {
    caption: "Cost or billing basis by model for a single villa (no fee quoted by any other provider)",
    columns: ["Model", "Cost or billing basis", "What you still do yourself"],
    rows: [
      ["Owner spreadsheet", "Rp 0 in fees", "All reconciliation, your own time"],
      ["Manager in-house", "Inside your management fee", "Chase per-property detail and evidence"],
      ["Offshore bookkeeping", "Hourly or per transaction, billed outside Indonesia", "Forward documents, resolve Indonesian questions"],
      ["Bali specialist (our Starter)", "From Rp 2,900,000", "Supply documents by the agreed deadline"],
    ],
    note:
      "Bands are illustrative planning ranges, not published prices from any named provider. Our figures are the published package prices; engagements are scoped after a document review.",
  },
  mistakes: [
    {
      heading: "Choosing on the monthly fee alone",
      body: "The fee covers a scope. Two quotes at the same price can differ completely on whether reconciliation is included, and that is the expensive part.",
    },
    {
      heading: "Comparing a summary with a ledger",
      body: "A management statement, a platform dashboard and reconciled books answer three different questions. Decide which one your next decision actually needs.",
    },
    {
      heading: "Leaving the tax boundary vague",
      body: "Bookkeeping organises records. Tax advice and filings need a licensed adviser. A provider that blurs the two is selling something it may not be allowed to sell.",
    },
  ],
  checklist: [
    "Write down where your records currently break: documents, payouts, bank, owner split or reporting.",
    "Ask each provider who holds the source documents.",
    "Ask for a sample month showing gross bookings tied to bank receipts.",
    "Ask how several owners or properties are separated in the report.",
    "Ask for the report date and the definition of complete documents.",
    "Ask who answers tax questions, and confirm their licence to do so.",
    "Get the exclusion list in writing before comparing totals.",
    "Agree what happens when a document never arrives.",
  ],
  faqs: [
    [
      "Which bookkeeping option is cheapest for a Bali villa?",
      "A spreadsheet has no fee and the highest hidden cost in your own hours. Fixed packages are usually cheapest once reconciliation, chasing and reporting are all counted, but we cannot price another firm's scope, so we do not put numbers on one.",
    ],
    [
      "Do you compare yourselves with named competitors?",
      "No. We describe models and the questions to ask. Claims about a named firm's process or quality cannot be verified from outside that firm, so we do not publish them.",
    ],
    [
      "Can I move my books from a manager or another firm?",
      "Yes, with a documented handover: opening balances, the last reconciled month and a list of unexplained items. We do not silently restate another provider's work.",
    ],
    [
      "Is a Bali firm necessary if I live overseas?",
      "Not always. It becomes useful when documents are Indonesian, payouts need chasing, or a licensed adviser needs a pack they can use. Distance is normal; we work from shared documents either way.",
    ],
    [
      "What does a first conversation cost?",
      "Nothing. It is a scope discussion, not an engagement. Do not send bank statements or identity documents through the public form.",
    ],
  ],
  related: [
    ["Airbnb and OTA payout reconciliation", "/airbnb-ota-reconciliation-bali"],
    ["Monthly villa financial reporting", "/villa-financial-reporting-bali"],
    ["Bookkeeping cleanup and catch-up books", "/villa-bookkeeping-cleanup-bali"],
    ["PT PMA villa bookkeeping", "/pt-pma-villa-bookkeeping"],
  ],
  guides: [
    ["Monthly bookkeeping cost: compare deliverables before fees", "/blog/monthly-bookkeeping-cost-villa-deliverables"],
    ["12 questions to ask before hiring an accountant in Bali", "/blog/questions-before-hiring-accountant-bali"],
    ["How to read your villa management statement", "/blog/how-to-read-villa-management-statement"],
  ],
} as const;

export const comparePaths = comparePages.map(page => page.path);
export const allComparePaths = [...comparePaths, compareHub.path];
