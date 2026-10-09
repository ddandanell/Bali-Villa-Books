export type ServiceInfo = {
  intro: string; audience: string; problem: string; included: string[]; inputs: string[];
  exampleTitle: string; example: string; steps: string[]; timing: string; price: string;
  excludes: string[]; faqs: [string, string][]; guide: string;
  sources?: { label: string; url: string }[];
};
type ExpandedService = {
  path: string; label: string; summary: string;
  meta: { title: string; description: string; h1: string; service: true };
  details: ServiceInfo;
};
const quote = "This is a separately scoped service, not an automatic inclusion in a monthly bookkeeping package. We provide a written quotation after reviewing the entity, requested work and document condition. Professional fees, applicable government charges, notarial work and other third-party costs are identified separately; no price or fee waiver is assumed here.";
const timing = "We confirm the preparation schedule after reviewing the case and documents. Authority processing, requests for clarification, client responses and changes in requirements can affect completion. No fixed processing time or approval is promised.";
const oss = { label: "Official OSS business licensing portal", url: "https://oss.go.id/" };
const tax = { label: "Directorate General of Taxes information and services", url: "https://www.pajak.go.id/en" };
const visa = { label: "Official Indonesian e-Visa application portal", url: "https://evisa.imigrasi.go.id/" };

export const relatedServicePaths: Record<string, string[]> = {
  "/company-formation-bali": ["/business-licensing-bali", "/tax-registration-bali", "/pt-pma-villa-bookkeeping"],
  "/business-licensing-bali": ["/company-formation-bali", "/company-compliance-bali"],
  "/tax-registration-bali": ["/tax-compliance-bali", "/pt-pma-villa-bookkeeping"],
  "/tax-compliance-bali": ["/tax-planning-bali", "/company-compliance-bali", "/pt-pma-villa-bookkeeping"],
  "/tax-planning-bali": ["/tax-compliance-bali", "/company-formation-bali"],
  "/business-visa-bali": ["/investor-kitas-bali", "/company-formation-bali"],
  "/investor-kitas-bali": ["/company-formation-bali", "/business-visa-bali", "/tax-planning-bali"],
  "/company-compliance-bali": ["/business-licensing-bali", "/tax-compliance-bali", "/pt-pma-villa-bookkeeping"],
};

export const expandedServices: ExpandedService[] = [
  {
    path: "/company-formation-bali", label: "Company formation & PT PMA setup",
    summary: "Plan the company, prepare registration documents and connect setup with ongoing accounting responsibilities.",
    meta: { title: "PT PMA Company Formation Bali | Bali Accounting", description: "Company formation and PT PMA setup support in Bali: review activities, prepare documents and plan tax registration, licensing and ongoing bookkeeping.", h1: "Company Formation in Bali: PT PMA Setup Support", service: true },
    details: {
      intro: "Bali Accounting's qualified in-house team supports company formation planning and PT PMA setup administration. We start with the proposed business activities, owners and operating arrangements—not a promise that one company structure suits every foreign investor. The aim is a documented setup process connected to the records you will need once the business begins operating.",
      audience: "Foreign investors, villa operators and business owners establishing an Indonesian company or reviewing how an existing operation should be organised. We assess the proposed activities before recommending the next administrative steps.",
      problem: "A company deed, business licence, tax registration and immigration permission answer different questions. Treating a formation package as permission to carry out every planned activity can leave important obligations unexamined.",
      included: ["Initial review of proposed activities, ownership information and company roles", "A case-specific registration document checklist and preparation support", "Coordination of registration stages and required professional execution, as agreed", "A handover covering licensing, tax registration and the opening bookkeeping workflow"],
      inputs: ["A plain-language description of the business and proposed locations", "Ownership, director and commissioner information through an agreed private channel", "Existing registration or licence documents, if any", "A summary of planned staffing, funding and operational arrangements"],
      exampleTitle: "Illustrative setup discussion — not a legal determination",
      example: "An investor planning villa operations and a separate consulting activity should describe both activities at intake. The team can then identify which classifications, documents and professional reviews need checking. Registering one activity is not treated as evidence that the other activity is authorised, and personal residency is considered separately from company registration.",
      steps: ["Review the intended activities and identify questions requiring professional assessment.", "Agree the proposed registration work, responsible people, quotation and document handover.", "Prepare and coordinate the approved steps, including notarial execution where required.", "Record issued documents and transfer outstanding licensing, tax and record-keeping tasks into an operating checklist."],
      timing, price: quote,
      excludes: ["No blanket promise of unrestricted foreign ownership or eligibility across all sectors.", "A company registration does not itself establish land rights, visa eligibility or permission to work.", "Documents requiring a notary or other authorised professional must be executed by the appropriate professional; no unnamed credential is claimed."],
      faqs: [["Is PT PMA the right structure for every foreign owner?", "No single structure is assumed to fit every activity. Ownership, activities, intended use and current requirements need a case-specific review."], ["Does setup include tax registration and licences?", "We can scope connected services, but the quotation identifies each workstream. Company formation, NPWP registration and business licensing are not treated as interchangeable documents."], ["Can you guarantee registration or a completion date?", "No. Our team supports preparation and coordination; the relevant authorities decide applications and may request further information."]],
      guide: "Start with a clear business description. Our licensing, tax registration and PT PMA bookkeeping pages explain the next connected workstreams.", sources: [oss, tax],
    },
  },
  {
    path: "/business-licensing-bali", label: "OSS, NIB & business licensing",
    summary: "Review business activities and prepare licensing records through a case-specific OSS workflow.",
    meta: { title: "OSS & NIB Business Licensing Bali | Bali Accounting", description: "Business licensing support in Bali: organise OSS and NIB records, review activities and identify licence questions for a documented application workflow.", h1: "OSS, NIB and Business Licensing Support in Bali", service: true },
    details: {
      intro: "Our in-house team helps business owners organise OSS and NIB application records and review the relationship between their stated activities and licensing documents. The official OSS portal describes risk-based licensing: requirements depend on the activity and applicable risk category. We do not treat an NIB alone as proof that every operating permission is complete.",
      audience: "New companies preparing their operating records and established villa businesses adding, changing or checking business activities. Existing documents are reviewed against what the business actually intends to do.",
      problem: "An activity described informally as 'villa business' can conceal different operations, locations and responsibilities. A document checklist needs to reflect those facts, rather than copy a generic agency package.",
      included: ["Organise existing NIB, OSS and company information for review", "Prepare an activity and location summary for classification assessment", "Identify application records, missing information and questions for the responsible professional", "Support agreed submissions, clarification tracking and issued-document organisation"],
      inputs: ["Existing company registration, NIB and licensing documents", "Proposed activities, locations and changes to operations", "Property or premises documents where requested for the agreed review", "Access arrangements approved by the account holder; never passwords in the public form"],
      exampleTitle: "A location or activity change",
      example: "A company that adds a new operating location should not assume its old folder describes the new site. A review compares the company information, proposed activity and supporting location records, then lists the updates or further assessments to be confirmed. A completed checklist is an administrative deliverable, not an independent certificate that all operations are lawful.",
      steps: ["Review current documents and describe the intended operational change.", "Confirm the activities and risk-based requirements that need professional assessment.", "Prepare and support the agreed application or update workflow.", "Keep issued documents, open questions and follow-up responsibilities in a dated register."],
      timing, price: quote,
      excludes: ["No guarantee that a selected activity is open to the proposed ownership structure.", "No claim that an NIB replaces sector-specific, premises or other applicable requirements.", "No bypass, unofficial acceleration payment or guaranteed approval is offered."],
      faqs: [["Is an NIB the same as every licence my business needs?", "No. The OSS portal distinguishes business identification from risk-based requirements. The applicable documents must be assessed for the actual activities."], ["Can you help with existing OSS records?", "Yes, we can agree an administrative review or update scope after checking the account-holder authorisation and existing records."], ["Should I send my OSS password through the enquiry form?", "No. Start with a high-level description. Access and document handling are agreed through an appropriate private process."]],
      guide: "Read company formation and company compliance alongside this page to separate setup, permission records and ongoing reporting.", sources: [oss],
    },
  },
  {
    path: "/tax-registration-bali", label: "NPWP & Coretax registration",
    summary: "Prepare tax-registration documents and organise the transition into an agreed compliance process.",
    meta: { title: "NPWP & Coretax Registration Bali | Bali Accounting", description: "NPWP and Coretax registration support in Bali for businesses and owners. Prepare documents, confirm responsibilities and connect registration to bookkeeping.", h1: "NPWP and Coretax Registration Support in Bali", service: true },
    details: {
      intro: "Bali Accounting supports tax-registration preparation and Coretax administration through its in-house team. The first review distinguishes the company from its owners and considers the requested registration work. Having a tax number or portal account does not, by itself, determine tax residency, a tax rate or whether a particular return is required.",
      audience: "Business owners preparing a new tax registration, companies checking their existing registration records, and clients connecting a registration project with recurring accounting and tax-compliance support.",
      problem: "Registration, account activation, bookkeeping and return submission can be confused as one completed task. Clear responsibilities are needed so the business knows which records exist, who can act and what remains outstanding.",
      included: ["Review the requested entity or individual registration scope", "Prepare an appropriate identity and supporting-document checklist", "Support agreed registration or account-administration steps with the required authority", "Record issued details and agree the next compliance and bookkeeping handover"],
      inputs: ["Company or applicant details supplied through a private agreed process", "Existing NPWP and relevant registration notices, if available", "Company formation and address records relevant to the review", "A description of the requested account or registration issue; no login credentials in the public form"],
      exampleTitle: "Company registration and owner questions",
      example: "A foreign owner may ask about a company's NPWP and their own tax position at the same time. We separate those questions at intake. A company-registration checklist is not presented as a personal tax-residency conclusion, and any personal assessment is scoped separately with the responsible qualified professional.",
      steps: ["Identify who or which entity needs support and review existing records.", "Confirm the documents, authority and agreed registration tasks.", "Prepare and support the authorised administration process.", "Document the result and next steps rather than assume registration completes every obligation."],
      timing, price: quote,
      excludes: ["No automatic tax-residency determination or entitlement to a favourable tax regime.", "No publication of client NPWP details, passports or account credentials.", "No claim that portal activation replaces an agreed tax-compliance engagement."],
      faqs: [["Does an NPWP settle my personal tax residency?", "No. Registration and tax residency are different questions. Your actual circumstances need an appropriate individual review."], ["Can this be combined with company setup?", "Yes, the team can discuss connected workstreams and quote each agreed responsibility rather than assume all steps are included."], ["Is registration covered by monthly bookkeeping prices?", "Not automatically. Registration and Coretax work are separately scoped and quoted."]],
      guide: "Connect registration to a recurring records process and a clearly scoped tax-compliance engagement, not an assumed filing guarantee.", sources: [tax],
    },
  },
  {
    path: "/tax-compliance-bali", label: "Tax compliance & filing support",
    summary: "Connect financial evidence with an agreed tax-review and authorised submission workflow.",
    meta: { title: "Tax Compliance & Filing Support Bali | Bali Accounting", description: "Bali tax compliance and filing support: organise accounting evidence, review responsibilities and agree authorised preparation and submission scope.", h1: "Tax Compliance and Filing Support in Bali", service: true },
    details: {
      intro: "Our qualified in-house team supports tax-compliance engagements alongside bookkeeping. We agree which entity, period, obligations and preparation or submission tasks are included, and who is professionally responsible and authorised to act. A monthly management report is not represented as a filed return or a conclusion that every tax obligation has been satisfied.",
      audience: "Villa operators, PT PMA companies and business owners who need a documented connection between their accounting records and an agreed tax-compliance process.",
      problem: "The existence of a ledger does not prove the correct tax treatment, and a draft return does not prove submission. Different entities and activities can require different assessments, evidence and approvals.",
      included: ["Review the requested periods, entities and compliance responsibilities", "Organise reconciled ledger schedules and source evidence for professional assessment", "Support agreed preparation and authorised submission tasks identified in the engagement", "Track review questions, client approvals and submission acknowledgements where applicable"],
      inputs: ["Entity registration and prior compliance information where available", "Ledger, bank reconciliations, invoices and booking records", "Prior returns, notices and supporting correspondence relevant to the scope", "Authorisation and client approval arrangements agreed privately before action"],
      exampleTitle: "Evidence is not the same as submission",
      example: "A reconciled ledger can support the review of booking receipts and expenses. The compliance workflow separately records the professional assessment, any draft requiring client approval and the acknowledgement for an authorised submission. An unresolved source document remains an open issue; it is not converted into an invented figure to make a return appear complete.",
      steps: ["Identify the requested obligations and confirm the responsible professional and authority.", "Review records and list missing evidence or classification questions.", "Prepare and review the agreed work; obtain the required client approval.", "Support authorised submission where included and retain the resulting evidence and follow-up list."],
      timing: "The applicable obligations and dates are confirmed for the actual case. Preparation timing depends on usable records, professional review and approvals. This page does not publish a universal filing calendar or promise penalty-free outcomes.",
      price: quote,
      excludes: ["Tax compliance is not automatically included in the advertised bookkeeping package prices.", "No guarantee of zero liability, penalty avoidance, audit clearance or an authority's acceptance.", "Tax advice and representation requiring professional authorisation must be handled by the appropriate authorised person confirmed in the engagement."],
      faqs: [["Do you support tax work in-house?", "Yes. Tax-compliance support is available through our in-house team, with the exact work and professionally responsible person confirmed before engagement."], ["Does a monthly owner report count as a filed tax return?", "No. Reporting, tax assessment, client approval and submission are separate stages with separate evidence."], ["Can you quote without seeing the records?", "We can discuss the requested scope, but a reliable quotation depends on the entity, periods, records and tasks requiring review."]],
      guide: "Use bookkeeping and tax-compliance workstreams together while keeping their deliverables, approvals and fees distinct.", sources: [tax],
    },
  },
  {
    path: "/tax-planning-bali", label: "Tax planning & benefits review",
    summary: "Review lawful treatment and possible relief with evidence, eligibility checks and no promised savings.",
    meta: { title: "Bali Tax Planning & Benefits Review | Bali Accounting", description: "Tax planning and tax-benefit eligibility reviews in Bali. Review business evidence, costs and potential relief without promised savings or blanket tax claims.", h1: "Tax Planning and Tax-Benefit Eligibility Reviews in Bali", service: true },
    details: {
      intro: "Tax planning begins with the actual business, taxpayer and supporting evidence—not a promised percentage saving. Our in-house team can scope a professional review of treatment, documented costs and possible relief that may be relevant to your circumstances. Eligibility and lawful treatment must be checked before a potential benefit is described as an available result.",
      audience: "Owners and companies reviewing operating arrangements, documented expenses, new investment decisions or questions about how a proposed change could affect their tax position.",
      problem: "A competitor's advertised 'tax benefit' may depend on an entity type, residency, activity, documentation or conditions that do not fit your business. Personal spending also cannot simply be relabelled as a business expense to reduce a reported result.",
      included: ["Review the question, entities and intended business arrangements", "Organise the evidence needed to assess documented costs and relevant treatment", "Identify questions about eligibility, conditions and potentially available relief", "Provide the agreed professional review and document assumptions or further evidence needed"],
      inputs: ["Entity and ownership information relevant to the review", "Source invoices, contracts and records explaining business purpose", "Current reporting and tax information for the periods in scope", "A description of proposed changes and any relief you want assessed"],
      exampleTitle: "A cost review without assumed savings",
      example: "An owner asks whether a large refurbishment and several personal purchases can reduce a company's tax liability. The review separates the transactions, checks invoices and business purpose, and assesses the relevant treatment. It does not assume every payment is deductible or calculate a saving before the circumstances and applicable rules have been reviewed.",
      steps: ["Define the decision or treatment question and responsible professional.", "Review the underlying evidence and distinguish business, owner and capital movements.", "Assess lawful treatment and any relevant relief conditions for the case.", "Explain the documented result, assumptions, limitations and follow-up actions."],
      timing, price: quote,
      excludes: ["No guaranteed tax savings, refunds, incentive approval or universally applicable special tax rate.", "No sham expenses, nominee shortcuts, concealment or illegal avoidance arrangements.", "Website examples and general articles are not individual tax advice or confirmation of eligibility."],
      faqs: [["Does forming a PT PMA automatically create a tax benefit?", "No benefit is assumed from company formation alone. The activity, taxpayer, circumstances and current conditions must be reviewed."], ["Can every villa expense be deducted?", "No blanket conclusion is offered. Evidence, business purpose and the applicable treatment need professional assessment."], ["Can you promise a saving before the review?", "No. We can scope the assessment; a financial result cannot be guaranteed in advance."]],
      guide: "Keep genuine evidence behind each proposed treatment. Tax planning and tax-compliance support are separate from recurring bookkeeping package inclusions.", sources: [tax],
    },
  },
  {
    path: "/business-visa-bali", label: "Business visa application support",
    summary: "Start with the purpose of travel and prepare the appropriate application evidence.",
    meta: { title: "Business Visa Support Bali | Bali Accounting", description: "Business visa application support in Bali: review travel purpose, prepare documents and track the agreed application steps without guaranteed approval.", h1: "Business Visa Application Support in Bali", service: true },
    details: {
      intro: "Our in-house team supports visa-application preparation connected to business and investment enquiries. We start with the intended activities and purpose of travel, then assess the appropriate application workflow. A visa label, company shareholding or a planned visit is not treated as automatic permission to work, manage day-to-day operations or undertake every business activity.",
      audience: "Business visitors, investors and owners arranging a visit to Indonesia who need to understand the documents and scope of application assistance before travel.",
      problem: "Meetings, investment discussions, employment and operating a business are not interchangeable purposes. Choosing a visa from an advertisement without reviewing the intended activities can create a mismatch.",
      included: ["Initial purpose and document review for the requested application support", "A case-specific checklist and preparation assistance", "Support for the agreed authorised application and clarification workflow", "Status tracking and an explanation of the documents received and remaining questions"],
      inputs: ["A high-level description of travel purpose, activities and intended dates", "Existing visa or stay-permit information where relevant", "Applicant and sponsor documents through an agreed private process", "Any previous immigration correspondence relevant to the scope"],
      exampleTitle: "Business meetings versus working",
      example: "A prospective investor describes a visit for meetings but also plans to carry out daily operational duties. The team separates those intended activities during the initial review. We do not assume that a business-visit permission authorises the operational work, and any employment or stay-permit questions are considered separately before an application is recommended.",
      steps: ["Describe the genuine purpose and activities before selecting an application route.", "Confirm eligibility questions, documents, responsibilities and quotation.", "Prepare and support the agreed application process with the required authority.", "Track decisions or clarification requests and explain the resulting document's scope."],
      timing, price: quote,
      excludes: ["No visa approval, entry, extension or permission-to-work guarantee.", "No assumption that a tourist or business visit permits employment or unrestricted business operations.", "Do not submit passport scans, passwords or sensitive documents through the public enquiry form."],
      faqs: [["Does a business visa automatically allow work?", "Do not assume that it does. The intended activities and the conditions of the actual permission must be assessed."], ["Do you issue the visa yourselves?", "No. Our team assists with preparation and the agreed application workflow; Indonesian authorities decide applications."], ["Can we discuss investor residency instead?", "Yes. The Investor KITAS support page explains the separate company, applicant and stay-permit review."]],
      guide: "Check the official e-Visa portal and discuss your actual activities before relying on a visa description in any provider's marketing.", sources: [visa],
    },
  },
  {
    path: "/investor-kitas-bali", label: "Investor KITAS application support",
    summary: "Review company and applicant evidence for an investor stay-permit application.",
    meta: { title: "Investor KITAS Support Bali | Bali Accounting", description: "Investor KITAS application support in Bali: review company and applicant records, prepare documents and distinguish residency from business permissions.", h1: "Investor KITAS Application Support in Bali", service: true },
    details: {
      intro: "Investor KITAS support connects applicant information with the relevant company and investment records for a case-specific stay-permit review. Our in-house team assists with document preparation and the agreed application process. Company formation and an investor stay permission remain separate workstreams; neither is presented as a shortcut around operating or employment requirements.",
      audience: "Foreign investors and company owners exploring an investor-related stay permission or reviewing the evidence needed for a new application or further administrative support.",
      problem: "Marketing can make company incorporation and residency sound like one automatic outcome. Eligibility, sponsorship, company information and the applicant's intended activities need their own assessment.",
      included: ["Review the relationship between the applicant and the relevant company records", "Prepare an applicant, sponsor and supporting-evidence checklist", "Support the agreed application and clarification process with the required authority", "Organise issued documents and identify further review or follow-up tasks"],
      inputs: ["A description of the company, investment relationship and intended activities", "Existing company and investment records relevant to assessment", "Current visa or stay-permit details where applicable", "Applicant and sponsor documents through the private process agreed with the team"],
      exampleTitle: "A company owner considering residency",
      example: "An owner has company documents but has not confirmed whether their personal circumstances meet the requirements of the requested stay permission. The review lists the applicant and company evidence separately, rather than promise that a share certificate automatically produces an Investor KITAS. Intended work and business activities remain part of the assessment.",
      steps: ["Review the applicant's purpose and the relevant company relationship.", "Confirm the eligibility questions, evidence, authorisation and quoted work.", "Prepare and support the agreed application process.", "Record the authority's decision and any next steps without overstating permitted activities."],
      timing, price: quote,
      excludes: ["No published universal investment threshold, visa duration or extension entitlement for every applicant.", "No automatic permission to undertake all work or business activities.", "No claim that a visa or company structure establishes property ownership rights or guaranteed tax benefits."],
      faqs: [["Is Investor KITAS guaranteed after company formation?", "No. Company formation and the applicant's immigration eligibility are assessed separately; the relevant authority decides the application."], ["Can my company documents support the review?", "Yes. The team can identify which existing records are relevant and what further applicant or sponsor information needs checking."], ["Are visa fees included in bookkeeping?", "No automatic inclusion is offered. Application support, official charges and any other agreed costs are identified in a separate quotation."]],
      guide: "Read company formation, business visa support and tax planning together, but do not treat their permissions or financial outcomes as interchangeable.", sources: [visa, oss],
    },
  },
  {
    path: "/company-compliance-bali", label: "Company compliance & reporting",
    summary: "Keep corporate records, reporting responsibilities and follow-up tasks connected after setup.",
    meta: { title: "Company Compliance Reporting Bali | Bali Accounting", description: "Ongoing company compliance support in Bali: organise corporate records, confirm reporting responsibilities and connect accounting with agreed submissions.", h1: "Ongoing Company Compliance and Reporting Support in Bali", service: true },
    details: {
      intro: "Company compliance continues after registration. Our in-house team supports an agreed register of company records, reporting tasks and responsible people alongside the accounting workflow. Investment reporting, tax returns, licence updates and management reports are assessed separately; this page does not describe them as one universal annual filing.",
      audience: "PT PMA companies, villa operators and business owners who want clear responsibility for ongoing records, changes and reporting tasks after the initial setup project.",
      problem: "A formation folder can become outdated as activities, locations, officers or reporting needs change. Tasks can be missed when a bookkeeper, owner and administrator each assume someone else is handling them.",
      included: ["Review the company's existing records and the requested ongoing support", "Maintain an agreed responsibility and follow-up register", "Prepare relevant accounting and operating evidence for scoped reporting tasks", "Support agreed reporting or update processes and retain acknowledgement records where applicable"],
      inputs: ["Formation, ownership, licence and registration records", "Prior reporting notices, acknowledgements and outstanding questions", "Operating and investment information relevant to the agreed assessment", "A list of responsible people and changes that need review"],
      exampleTitle: "Separating recurring responsibilities",
      example: "A company needs monthly management information and also asks about an investment report. The team records these as separate tasks: one produces an owner report, while the other requires a case-specific review of the applicable obligation and submission evidence. Completing the owner report is not marked as completing the investment report.",
      steps: ["Review existing documents and agree the requested recurring or project-based responsibilities.", "Identify relevant reporting questions and the professionally responsible people.", "Prepare the agreed records and support authorised reporting or updates where included.", "Retain evidence of completion, list open matters and review changes to the business."],
      timing: "Applicable reporting frequency and dates are confirmed for the actual company and obligation. The engagement defines the support calendar; no universal annual, quarterly or monthly requirement is assumed.",
      price: quote,
      excludes: ["No guarantee that an administrative register proves complete regulatory compliance.", "No assumption that every company has the same investment, sector, tax or employment reporting duties.", "No automatic inclusion of every future corporate amendment or filing in monthly bookkeeping fees."],
      faqs: [["Is LKPM the same as a tax return?", "No. Investment reporting and tax compliance are different workstreams. The applicable requirements are assessed for the company."], ["Can you coordinate with our existing advisers?", "Yes, responsibilities and authorised tasks can be agreed alongside an existing adviser, so overlapping work and evidence requirements are clear."], ["Does company compliance end when the NIB is issued?", "No. Existing documents, operating changes and applicable ongoing obligations still need review."]],
      guide: "Connect the company responsibility register with licensing, tax compliance and recurring bookkeeping, retaining evidence for each separate task.", sources: [oss, tax],
    },
  },
];
