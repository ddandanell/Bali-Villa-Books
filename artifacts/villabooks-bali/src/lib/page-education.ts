export type EducationSection = {
  heading: string;
  paragraphs: string[];
  links?: [string, string][];
};

/** Distinct search intents, informed by the saved DataForSEO research—not keyword-density targets. */
export const pageEducation: Record<string, EducationSection[]> = {
  "/": [
    {
      heading: "Bali villa bookkeeping for owners living overseas",
      paragraphs: [
        "A busy booking calendar does not tell an overseas owner whether a villa has earned a profit or collected its expected cash. Rental property bookkeeping brings the booking records, channel statements, bank transactions and supplier invoices into one reviewable monthly process. It gives you a basis for questions about costs, outstanding payouts and owner withdrawals, without relying on a single spreadsheet total.",
        "The practical starting point is your operation: a privately owned villa, several rental properties or a management company acting for different owners. Agree which properties and accounts the books cover, who supplies each document and how unresolved items are recorded. A shared operating team does not mean every property's income and costs should be combined without explanation.",
      ],
      links: [["Compare bookkeeping services in Bali", "/services"], ["Read the monthly villa bookkeeping checklist", "/blog/monthly-bali-villa-bookkeeping-checklist"]],
    },
    {
      heading: "Rental income, operating profit and cash flow answer different questions",
      paragraphs: [
        "Booking revenue describes rental activity. A management P&L compares that activity with agreed costs. Cash flow explains what arrived in or left the accounts. Platform settlement delays, supplier payment dates, owner funding and withdrawals can make these views differ. A useful owner report explains the differences rather than presenting a bank balance as profit.",
        "Our service pages explain the source records, review process and limits for each type of work. Start with Airbnb and OTA reconciliation if settlements are unclear, historical cleanup if older records are incomplete, or monthly financial reporting if the numbers exist but are difficult to interpret.",
      ],
      links: [["Airbnb bookkeeping and payout reconciliation", "/airbnb-bookkeeping-bali"], ["Review a monthly financial report example", "/sample-report"]],
    },
  ],
  "/services": [
    {
      heading: "Choose bookkeeping support by the record problem",
      paragraphs: [
        "For a short-term rental, the first question is often whether all reservations and settlements can be traced to the bank. Airbnb bookkeeping and OTA reconciliation address the booking-to-payout trail. Monthly villa financial reporting then organizes the documented income, expenses and owner movements into an agreed report. These are connected jobs, but a report cannot resolve a missing platform statement by itself.",
        "If the records are several months behind, assess a bookkeeping cleanup before assuming a recurring package will include the backlog. If a PT PMA operates the villas, agree the entity and account boundaries and the schedules your licensed tax adviser needs. Staff-cost tracking concerns the payroll documents supplied; it does not transfer payroll execution or statutory filing responsibilities to us.",
      ],
      links: [["Catch-up bookkeeping for Bali villas", "/villa-bookkeeping-cleanup-bali"], ["PT PMA villa bookkeeping scope", "/pt-pma-villa-bookkeeping"]],
    },
    {
      heading: "Property management bookkeeping is not the same as property management",
      paragraphs: [
        "A villa manager may coordinate guests, reservations, housekeeping and maintenance. Bookkeeping checks the financial records those activities create. Agree how the manager sends invoices, settlement exports and approved cost schedules, and who answers questions. A manager's statement can be a useful input, but it should not replace the supporting documents needed for an agreed reconciliation.",
        "For several owner-owned villas, define the owner report separately from the management company's report. Identify each property's receipts, costs and management fees, and document the basis for shared allocations. The appropriate accounting treatment depends on the arrangements and qualified review—not simply on which account received the money.",
      ],
      links: [["Villa payroll and BPJS record tracking", "/villa-payroll-records-bali"], ["Compare package costs and inclusions", "/pricing"]],
    },
  ],
  "/airbnb-bookkeeping-bali": [
    {
      heading: "A practical Airbnb and Booking.com reconciliation checklist",
      paragraphs: [
        "Supply the reservation detail, platform transaction or payout report, and bank evidence for the agreed period. Keep the booking reference, property, stay dates, payout reference, currency and gross amount identifiable. Show the platform fee, refund or adjustment separately rather than only sending the final net deposit. A settlement covering more than one reservation needs a schedule explaining its components.",
        "Next, check the reporting cutoff. A stay in one month may settle in the next; a cancellation can produce a later adjustment; and a payout may reach the bank after the platform marks it released. Keep outstanding items in a dated reconciliation list so the following month's review can check what cleared. An unresolved difference is a question to investigate, not an automatic accounting correction.",
      ],
      links: [["Airbnb and Booking.com payout reconciliation guide", "/blog/reconciling-airbnb-booking-payouts"]],
    },
    {
      heading: "Direct bookings and multi-channel vacation rental records",
      paragraphs: [
        "For direct reservations, retain the booking schedule, deposit evidence and any refund approval. Distinguish a bank transfer between your own accounts from a guest receipt. For multiple villas, use a consistent property reference across booking exports and expenses so the owner report remains traceable even when one manager handles all channels.",
        "Agree how foreign-currency transactions and bank charges will be documented before the monthly close. Do not assume a missing amount is an exchange-rate difference without supporting evidence. We use the statements and exports supplied; no direct platform integration, account control or automatic detection of every booking is promised.",
      ],
      links: [["Understand rental cash-flow timing", "/blog/bali-villa-cash-flow-forecast"], ["Compare monthly bookkeeping packages", "/pricing"]],
    },
  ],
  "/villa-financial-reporting-bali": [
    {
      heading: "Read the monthly P&L alongside the cash movement schedule",
      paragraphs: [
        "Check the report's period and property coverage before comparing income or costs. Then review rental activity and channel fees, followed by supplier and staff expenses. Read the cash movement schedule separately: owner contributions, withdrawals, transfers and settlement timing can change the bank balance without describing the villa's operating performance.",
        "An unusual expense deserves a source-document review before a conclusion. A larger maintenance line could reflect several invoices arriving together, a one-off repair or work requiring separate assessment. Ask which invoice and property each item belongs to. For professional accounting or tax treatment, refer the underlying facts to the qualified adviser responsible for that decision.",
      ],
      links: [["Monthly villa owner report checklist", "/blog/bali-villa-owner-monthly-report"]],
    },
    {
      heading: "Property-by-property reporting and useful variance questions",
      paragraphs: [
        "When several villas share a team, compare each property's activity using consistently labelled revenue and cost categories. Document how shared invoices are allocated and keep the management company's overhead separate where the agreed structure requires it. A combined total may be useful, but it should not prevent an owner from understanding their own villa.",
        "Budget comparisons, channel analysis and forecasts are useful only when their inputs and assumptions are explained. Confirm which views your selected package includes. Occupancy, ADR and RevPAR in the sample are illustrative measures, not evidence of a particular client's returns or a forecast of Bali market performance.",
      ],
      links: [["Build a monthly villa management pack", "/blog/bali-villa-monthly-management-reporting-pack"], ["Inspect the worked financial report", "/sample-report"]],
    },
  ],
  "/villa-bookkeeping-cleanup-bali": [
    {
      heading: "What affects a catch-up bookkeeping quote?",
      paragraphs: [
        "The number of overdue months is only part of the scope. Count the properties, bank accounts and active booking channels, then identify which statements and invoices are available. A spreadsheet may summarize transactions without retaining enough evidence to reconcile them. Owner funding, reimbursements and transfers also need explanation so they are not mistaken for guest income.",
        "Prepare a period-by-period inventory before the review: available bank statements, platform settlements, direct bookings, supplier records and prior closing balances. List missing periods explicitly. We can then discuss what can be reconstructed, which questions need your manager's help and which unsupported items must remain flagged. The starting cleanup price is not a promise to resolve any backlog for a fixed fee.",
      ],
      links: [["See the current bookkeeping cleanup starting price", "/pricing"]],
    },
    {
      heading: "Move from historical cleanup to an orderly monthly close",
      paragraphs: [
        "Agree the opening position, unresolved-item register and document cutoff before recurring work begins. Keep the historical corrections and their supporting explanations identifiable. That gives the next monthly review a starting point and prevents the same missing evidence from being repeatedly treated as a new issue.",
        "Choose an owner or operator contact for follow-up and establish a repeatable handover of booking exports and invoices. Retain copies of your records and reports. Cleanup supports clearer books; it is not a statutory audit, a tax return, a guarantee of compliance or a way to manufacture unavailable evidence.",
      ],
      links: [["Set up a villa expense tracking system", "/blog/bali-villa-expense-tracking-system"], ["Discuss your backlog with Client Advisory", "/get-started"]],
    },
  ],
  "/pt-pma-villa-bookkeeping": [
    {
      heading: "Keep company, owner and property transactions identifiable",
      paragraphs: [
        "A PT PMA bookkeeping file should identify the company, accounts and reporting period it covers. Record owner advances, reimbursements and transfers with their supporting explanations rather than assuming every incoming bank payment is sales. If one owner has several businesses, keep their source records distinct and flag a transaction whose purpose cannot yet be established.",
        "For a villa portfolio, agree which reporting views are needed at company and property level. A manager acting for separate owners may need different schedules from a company operating its own rental property. The bookkeeping engagement should record those boundaries; legal structure, revenue recognition and tax treatment require a qualified review of the actual arrangements.",
      ],
      links: [["See the owner-by-owner report illustration", "/sample-report"]],
    },
    {
      heading: "Prepare a traceable handover for your Indonesian tax consultant",
      paragraphs: [
        "Ask the licensed adviser for their requested period and schedules. An agreed handover may include the transaction ledger, bank and OTA reconciliations, supplier register and owner-funding notes. Use consistent references and keep a list of missing documents so the reviewer understands the evidence behind each total.",
        "Bookkeeping supports that review but does not decide filing requirements, register a company, submit LKPM or provide tax advice. Confirm who is responsible for each professional service instead of assuming a bookkeeping package covers everything a foreign-owned entity may need.",
      ],
      links: [["Prepare records for a Konsultan Pajak", "/blog/preparing-villa-records-indonesian-tax-consultant"], ["Review PT PMA record-handover package inclusions", "/pricing"]],
    },
  ],
  "/villa-payroll-records-bali": [
    {
      heading: "Connect approved payroll schedules with payment evidence",
      paragraphs: [
        "For each period, retain the authorized staff-cost schedule and the evidence supplied for salaries, reimbursements and documented changes. Use consistent dates and references across the schedule, bank record and monthly bookkeeping. Where a manager records a payment in cash, request the agreed supporting evidence rather than silently treating the schedule as proof that payment occurred.",
        "If staff work across several villas, document the allocation method agreed by the responsible operator. Shared staffing should remain visible in property reports rather than being assigned to whichever villa happens to have enough rental receipts that month. Keep company-level staff costs distinct where appropriate to the agreed reporting structure.",
      ],
      links: [["Villa invoice, payroll and BPJS control calendar", "/blog/bali-villa-supplier-invoice-payroll-bpjs-control-calendar"]],
    },
    {
      heading: "BPJS document tracking and responsibility for official submissions",
      paragraphs: [
        "A record checklist can identify documents received, the period they cover and questions awaiting an owner or manager's response. It cannot establish from missing evidence that a contribution was paid or that an employee is correctly registered. Keep follow-up notes factual and route professional questions to the responsible provider.",
        "This service does not execute payroll, determine employee-tax treatment, register staff for BPJS or make statutory submissions. Confirm the record-tracking scope and staff limits during intake. Do not send employee identifiers, salary files or contribution documents through the public enquiry form.",
      ],
      links: [["Compare staff-record package coverage", "/pricing"], ["Arrange a scope discussion", "/get-started"]],
    },
  ],
  "/pricing": [
    {
      heading: "How to compare monthly bookkeeping costs for a Bali villa",
      paragraphs: [
        "Compare the work included rather than the headline price alone. A rental property's transaction volume, booking channels, accounts and record condition affect the reconciliation workload. Ask whether the quoted scope includes your property count, the report views you need and historical periods. Starter states one villa and up to two booking channels; limits for other packages must be confirmed.",
        "The monthly price should be read alongside responsibilities: who supplies exports, who answers questions and what happens when invoices arrive late. A bookkeeping package is not automatically a tax-filing, payroll-execution or company-compliance service. Our published prices cover the stated bookkeeping offering, with the actual basis and additional work agreed before engagement.",
      ],
      links: [["Review Airbnb reconciliation deliverables", "/airbnb-bookkeeping-bali"], ["Compare report detail with the sample", "/sample-report"]],
    },
    {
      heading: "Separate a recurring package from one-time bookkeeping cleanup",
      paragraphs: [
        "A catch-up project addresses historical records; a recurring service maintains the agreed monthly process. If your books are incomplete, discuss the backlog independently so neither side assumes it is included in a monthly retainer. Cleanup starts at the published amount for up to twelve months, subject to review of the actual periods, volume and evidence.",
        "A useful first enquiry describes the properties, channels and main reporting problem. Do not upload financial documents before an appropriate handover has been agreed. Client Advisory can discuss fit and clarify the price basis without treating an initial enquiry as a signed engagement.",
      ],
      links: [["Read the catch-up bookkeeping scope", "/villa-bookkeeping-cleanup-bali"], ["Ask about package fit", "/get-started"]],
    },
  ],
  "/sample-report": [
    {
      heading: "Use this villa financial report example to evaluate reporting scope",
      paragraphs: [
        "Read the assumptions and period first, then inspect the rental income, channel reconciliation and operating-cost views. The example deliberately distinguishes a profit measure from cash movement. A payout schedule connects reservations and settlements to the bank, while the cash forecast depends on separately stated timing assumptions.",
        "Use the CSV export or print view to discuss the information you would need from a real report. The demonstration is not a client's financial statement, an investment forecast or a promise that every package includes the entire analysis. Agree the reports, supporting schedules and export formats for your own operation before starting.",
      ],
      links: [["Monthly villa financial reporting scope", "/villa-financial-reporting-bali"], ["What to include in an owner report", "/blog/bali-villa-owner-monthly-report"]],
    },
    {
      heading: "Questions to ask about occupancy, ADR, RevPAR and cash flow",
      paragraphs: [
        "Check that the definition of available nights and occupied nights is consistent before comparing occupancy. Ask which revenue inputs are used for ADR and RevPAR and whether cancelled or adjusted stays have been reflected. Do not infer profitability from a booking-performance ratio alone: fees, operating costs and payment timing are separate questions.",
        "When reviewing a variance or cash scenario, identify the assumption that changed and the document supporting it. A forecast should distinguish expected collections from confirmed receipts and known commitments from optional spending. Its purpose is to make timing and uncertainty visible, not to guarantee how the villa will perform.",
      ],
      links: [["Read the villa cash-flow forecast guide", "/blog/bali-villa-cash-flow-forecast"], ["Compare monthly bookkeeping costs", "/pricing"]],
    },
  ],
  "/about": [
    {
      heading: "A bookkeeping workflow built around villa source records",
      paragraphs: [
        "Bali Accounting's Denpasar base supports conversations about the records produced by a rental operation: reservations, platform settlements, supplier invoices and owner movements. The agreed bookkeeping process connects those records to the monthly reports, with questions made visible rather than hidden inside a miscellaneous total.",
        "Owners living outside Bali can discuss a document workflow with their local manager. Agree who supplies statements, approves explanations and reviews open items. We do not assume authority to operate a bank account or make business decisions simply because we prepare the books.",
      ],
      links: [["Explore our villa bookkeeping services", "/services"], ["Read the monthly close checklist", "/blog/monthly-bali-villa-bookkeeping-checklist"]],
    },
    {
      heading: "Understand the difference between our clients and our examples",
      paragraphs: [
        "The named operators on this page are clients the owner has approved for public identification. Their listed collection sizes describe their businesses; they do not establish that Bali Accounting manages or services every property in those collections. Their descriptions are not client-authored testimonial quotes.",
        "The six-villa scenario and sample financial report are explicitly fictional educational examples. They explain reporting questions without disclosing a client's records or suggesting that the illustrated spreadsheet problems occurred at a named business. Ask Client Advisory about your own reporting needs rather than treating an illustration as a case study.",
      ],
      links: [["Inspect the clearly labelled report example", "/sample-report"], ["Contact Client Advisory", "/get-started"]],
    },
  ],
  "/get-started": [
    {
      heading: "Prepare for a Bali villa bookkeeping consultation",
      paragraphs: [
        "Describe the number of rental properties, their locations, the booking channels you use and whether your current records are up to date. Tell us the question you need answered: unexplained payouts, mixed owner transactions, overdue books or an owner report that does not show cash clearly. This helps the team discuss the relevant service instead of guessing from a package name.",
        "An overseas owner can identify the local manager who supplies documents and the licensed tax adviser who receives the agreed schedules. If you are comparing providers, ask about source records, reconciliation responsibilities, report views and practical limits as well as price. The initial discussion is about service fit, not a tax or legal determination.",
      ],
      links: [["Compare bookkeeping services before enquiring", "/services"], ["Review monthly prices and cleanup scope", "/pricing"]],
    },
    {
      heading: "What happens after you submit the enquiry form?",
      paragraphs: [
        "Submission saves an initial enquiry. It does not book a calendar appointment, execute an engagement or send your financial records to a third party. Use the verified WhatsApp contact to continue the conversation. No response-time promise is published, so use the contact details on this page rather than relying on an assumed deadline.",
        "Keep the first message high level. Do not attach bank statements, guest information, employee files or account credentials. Scope, pricing and the appropriate document handover are agreed separately before work begins. The website's privacy page explains the handling of public enquiries and website events.",
      ],
      links: [["Read enquiry privacy information", "/privacy"], ["See the bookkeeping FAQ", "/faq"]],
    },
  ],
  "/faq": [
    {
      heading: "Ask questions about evidence, not only report appearance",
      paragraphs: [
        "A report can look polished while leaving its property coverage or source records unclear. Ask which bank accounts and booking channels are included, how fees and refunds are reconciled, and where missing invoices are listed. A useful answer should explain the workflow and responsibility for follow-up, not simply promise clean books regardless of the evidence.",
        "For several villas, ask how direct costs and shared invoices are assigned. For a PT PMA, confirm the entity covered and the schedules needed by the licensed tax adviser. For staff costs, distinguish record tracking from payroll execution and statutory submissions. Those differences affect service fit and should be settled before selecting a package.",
      ],
      links: [["Read the Airbnb bookkeeping scope", "/airbnb-bookkeeping-bali"], ["Review PT PMA record-handover boundaries", "/pt-pma-villa-bookkeeping"]],
    },
    {
      heading: "Use the guides to prepare a more specific question",
      paragraphs: [
        "If cash and profit seem inconsistent, compare the owner report with the cash-flow guide. If the books are behind, make a period-by-period list of the statements available. If supplier expenses are hard to allocate, review the expense-tracking workflow. A specific example of the record problem helps Client Advisory discuss the work more accurately than a request to fix everything without seeing the scope.",
        "The journal is general educational information. It does not replace an engagement review or advice about tax, employment, immigration or legal status. Dated news articles retain their sources and limitations, and should not be treated as confirmation of current rules for your own circumstances.",
      ],
      links: [["Browse the bookkeeping journal", "/blog"], ["Prepare a villa expense tracking system", "/blog/bali-villa-expense-tracking-system"]],
    },
  ],
  "/privacy": [
    {
      heading: "Keep the public enquiry separate from financial-document handover",
      paragraphs: [
        "The website form is for an initial description of your bookkeeping needs. A property count, general location and a short explanation of the issue are enough to start that discussion. Bank statements, receipts, guest records and staff information should not be pasted into the message field or included in the first public enquiry.",
        "An actual bookkeeping engagement needs separately agreed document arrangements. This page describes website enquiries and measurement, not every aspect of a future client relationship. Confirm the handover process and responsibilities before transmitting financial information.",
      ],
      links: [["Review the enquiry form", "/get-started"]],
    },
    {
      heading: "Privacy questions about enquiries and website contact",
      paragraphs: [
        "If you contact us about a privacy concern, describe the request without sending new sensitive financial material. Public enquiry submissions are retained for ninety days as described above. Contact through WhatsApp uses a separate provider, so its policies and practices also apply to that conversation.",
        "The website event records described here do not contain enquiry names, contact details or message content. They record the page and type of interaction, such as a consultation-link click. Operational infrastructure logs are distinct from those event records. Use the verified contact details to ask about the website's stated handling arrangements.",
        "When hosted analytics is enabled for the published website, it also measures pageviews and actions such as form starts, package selections and saved enquiries. Our custom-event payloads contain the public page, interface placement and approved service or package labels, not your form text, contact details or enquiry reference. Hosted pageview measurement is separate from the application's own event records.",
      ],
      links: [["Read website terms and service boundaries", "/terms"]],
    },
  ],
  "/terms": [
    {
      heading: "Read bookkeeping prices together with the agreed scope",
      paragraphs: [
        "Published packages help explain the offering, but a price alone does not define every property, account, period or transaction covered. Confirm the basis, reporting views, document responsibilities and applicable limits before an engagement. Historical cleanup is separate unless expressly agreed, and its published starting price remains subject to review.",
        "Information on this website does not grant authority to make payments, access accounts or act for an owner. Any actual service and responsibilities are agreed separately. Bookkeeping and record preparation should not be interpreted as an offer of tax advice, legal representation or official filing services.",
      ],
      links: [["See package inclusions and limitations", "/pricing"], ["Review the service descriptions", "/services"]],
    },
    {
      heading: "Educational reports, news sources and external websites",
      paragraphs: [
        "The report demonstration and six-villa spreadsheet scenario use fictional assumptions. Do not treat their arithmetic as a client's results or a forecast for your property. Business descriptions on the client list are not quoted endorsements and do not establish the extent of work performed for every listed property.",
        "Journal articles and linked sources provide general context. A dated article cannot establish the current requirements for a particular entity, investment or stay permit. Check the responsible authority and qualified advisers for those questions. External links open independently of this website and their content may change.",
      ],
      links: [["Read the clearly labelled sample report", "/sample-report"], ["Review public enquiry privacy", "/privacy"]],
    },
  ],
  "/blog": [
    {
      heading: "Start with the monthly villa bookkeeping workflow",
      paragraphs: [
        "The monthly checklist explains how to collect bank exports, platform settlements, supplier invoices and owner notes before preparing a report. Use the Airbnb reconciliation guide when a booking total does not match the bank receipt. Read the owner-report guide when you need to distinguish operating profit, cash timing and owner movements.",
        "These articles support practical rental property bookkeeping. They do not promise platform integrations, tax savings or guaranteed business results. Choose the guide closest to your current record question, then use the service pages to confirm what can be included in an engagement.",
      ],
      links: [["Monthly bookkeeping checklist", "/blog/monthly-bali-villa-bookkeeping-checklist"], ["Reconcile Airbnb and Booking.com payouts", "/blog/reconciling-airbnb-booking-payouts"], ["Monthly owner report guide", "/blog/bali-villa-owner-monthly-report"]],
    },
    {
      heading: "Keep expense controls and cash planning connected",
      paragraphs: [
        "Expense tracking starts with the document behind a cost, the property it belongs to and the person responsible for clarification. A management pack brings those records together with booking and cash views. A forecast then makes future receipt and payment assumptions visible; it is not evidence that the projected amount will be received.",
        "Dated Indonesia news is published separately from the practical guides. Articles are general information, not individual tax, legal or immigration advice. Our in-house team offers separately scoped company, tax and visa support; a news headline is not an eligibility assessment or permission to operate or work.",
      ],
      links: [["Villa expense tracking guide", "/blog/bali-villa-expense-tracking-system"], ["Villa cash-flow forecast guide", "/blog/bali-villa-cash-flow-forecast"], ["Explore monthly bookkeeping services", "/services"]],
    },
  ],
};
