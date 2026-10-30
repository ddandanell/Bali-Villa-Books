import { prices, priceShort } from "./pricing";
import { expandedServices } from "./expanded-services";

export const SITE_ORIGIN = "https://bali-villa-accounting-service.com";
export const WHATSAPP_NUMBER = "6281237402292";
export const PHONE = "+62 812-3740-2292";
export const whatsapp = (message = "Hello Client Advisory, I would like a free consultation about your Bali accounting and business-support services.") => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

/** Panjer office coordinates on Jl. Tukad Barito Timur III (approximate street-level position). */
export const OFFICE_LATITUDE = -8.683;
export const OFFICE_LONGITUDE = 115.2324;
export const MAPS_QUERY = "Jl. Tukad Barito Timur III No.16, Panjer, Denpasar Selatan, Bali 80226";
export const mapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAPS_QUERY)}`;
export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(MAPS_QUERY)}&z=16&output=embed`;

export const sitePages: Record<string, { title: string; description: string; h1: string; service?: boolean }> = {
  ...Object.fromEntries(expandedServices.map(service => [service.path, service.meta])),
  "/": { title: "Villa Accounting Bali | Bookkeeping & Airbnb Reconciliation", description: `Bali villa accounting specialists. Monthly bookkeeping, Airbnb/OTA reconciliation and clear owner reports from ${priceShort(prices.starter)}. Free consultation.`, h1: "Bali Villa Accounting & Bookkeeping for Villa Owners" },
  "/services": { title: "Accounting Services Bali | Clear Monthly Books", description: "Compare accounting services in Bali: monthly bookkeeping, PT PMA setup, company records, tax and visa support. Clear deliverables and separately agreed scopes.", h1: "Accounting Services in Bali: Bookkeeping, Company, Tax and Visa Support" },
  "/airbnb-bookkeeping-bali": { title: "Airbnb Bookkeeping Bali | Payouts & Fees", description: "Airbnb bookkeeping for Bali villas: reconcile Booking.com and OTA payouts, cleaning fees, extra guest charges and refunds. Keep short-term rental records clear.", h1: "Airbnb Bookkeeping for Bali Villas", service: true },
  "/villa-financial-reporting-bali": { title: "Villa Financial Reporting Bali | P&L & Cash Flow", description: "Monthly villa financial reporting in Bali with profit and loss, rental income, expense tracking and cash-flow explanations. Explore a sample owner report.", h1: "Villa Financial Reporting in Bali: P&L and Cash Flow", service: true },
  "/villa-bookkeeping-cleanup-bali": { title: "Bookkeeping Cleanup Bali | Catch-Up Books", description: `Catch-up bookkeeping for Bali villas: resolve unmatched bank transactions, organize overdue records and document missing evidence. From ${priceShort(prices.cleanup)} after review.`, h1: "Bookkeeping Cleanup and Catch-Up Books for Bali Villas", service: true },
  "/pt-pma-villa-bookkeeping": { title: "PT PMA Accounting Bali | Villa Bookkeeping", description: "PT PMA bookkeeping in Bali for villa operators: reconcile company transactions, explain currency differences and separate owner funding from operating revenue.", h1: "PT PMA Bookkeeping in Bali for Villa Operators", service: true },
  "/villa-payroll-records-bali": { title: "Villa Payroll Records Bali | Staff Costs & BPJS", description: "Organize Bali villa payroll records, staff costs and BPJS documents within your monthly bookkeeping. Record tracking only, not payroll execution or filing.", h1: "Bali Villa Payroll Records and BPJS Document Tracking", service: true },
  "/pricing": { title: `Bali Bookkeeping Prices | From ${priceShort(prices.starter)}/Month`, description: `Compare monthly bookkeeping costs for Bali villas, from ${priceShort(prices.starter)}/month. Review owner reports, OTA reconciliation and payroll-record scope before choosing.`, h1: "Monthly Bookkeeping Costs and Packages for Bali Villas" },
  "/sample-report": { title: "Villa Financial Report Example | Bali Accounting", description: "See a fictional monthly villa financial report with P&L, occupancy, ADR, RevPAR, cash-flow forecast and OTA reconciliation. Download CSV or print the example.", h1: "Monthly Villa Financial Report: A Worked Example" },
  "/about": { title: "Bali Accounting in Denpasar | About Our Bookkeeping Firm", description: "Meet Bali Accounting, a Denpasar-based villa bookkeeping firm founded by Abel Yuniartini. Learn about monthly reporting, record review and our service scope.", h1: "About Bali Accounting: Our Denpasar Bookkeeping Firm" },
  "/get-started": { title: "Contact Bali Accounting | Free Bookkeeping Consultation", description: "Contact Bali Accounting in Denpasar for a free villa bookkeeping consultation. Discuss rental properties, Airbnb payouts, catch-up records and monthly reports.", h1: "Contact Bali Accounting for a Villa Bookkeeping Consultation" },
  "/faq": { title: "Bali Bookkeeping FAQ | Costs, Airbnb Payouts & Reports", description: "Bali villa bookkeeping questions answered: monthly costs, Airbnb reconciliation, cash flow, missing receipts and working with your manager or tax adviser.", h1: "Bali Villa Bookkeeping FAQ: Costs, Records and Reports" },
  "/privacy": { title: "Privacy Information | Bali Accounting", description: "How Bali Accounting handles website enquiries, WhatsApp contact, limited website measurement and bookkeeping document handover.", h1: "Privacy and Your Enquiry" },
  "/terms": { title: "Website Terms | Bali Accounting", description: "Read the website information terms, limits of illustrative financial examples, and how bookkeeping scope is agreed with Bali Accounting.", h1: "Website and Enquiry Terms" },
};
