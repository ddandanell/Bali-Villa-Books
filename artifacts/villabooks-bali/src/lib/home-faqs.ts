import { prices, priceText } from "./pricing";

/**
 * The same questions power the visible home FAQ and its initial-HTML FAQPage
 * structured data. Keep the text identical in both places: Google can ignore
 * FAQ markup that does not match the visible content.
 */
export const homeFaqs: [string, string][] = [
  ["What is the monthly price?", `Starter is ${priceText(prices.starter)}, Professional ${priceText(prices.professional)} and Premium ${priceText(prices.premium)} per month. Confirm price basis and applicable limits before agreement.`],
  ["Do you provide tax and company support?", "Yes. Our in-house team supports company setup, tax registration, tax-compliance and planning engagements, plus visa application administration. These services are separately scoped and quoted; they are not automatically included in monthly bookkeeping prices."],
  ["Can you reconcile Airbnb and other OTA payouts?", "Yes, from records and exports supplied and within the agreed package scope. Direct integrations are not promised."],
  ["When will I receive my report?", "The 15th is a target after complete and timely source documents are received—not a guaranteed date."],
  ["What should I do if my books are behind?", `A cleanup starts at ${priceText(prices.cleanup)} for up to 12 months, subject to records review and a scoped agreement.`],
];
