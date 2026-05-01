import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/Motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "What exactly is bookkeeping vs. accounting vs. tax advice — and what does VillaBooks Bali do?",
    a: "Bookkeeping is the daily and monthly organization of your financial transactions. Accounting involves higher-level financial strategy and official tax filing. VillaBooks Bali specializes exclusively in bookkeeping and financial reporting. We organize your raw data into clear, professional Owner Financial Statements so you understand your villa's performance. We do not provide tax advice or official tax filings."
  },
  {
    q: "Do you file our Indonesian taxes for us?",
    a: "No — we prepare your records and coordinate with licensed Indonesian Konsultan Pajak. We are not a licensed tax firm. We act as the bridge, ensuring your data is perfectly clean and tax-ready so the Konsultan Pajak can file accurately and efficiently."
  },
  {
    q: "What is a PT PMA and why does it matter for my villa's finances?",
    a: "A PT PMA (Perseroan Terbatas Penanaman Modal Asing) is a foreign-owned Indonesian limited liability company. If your villa is operated under a PT PMA, it is subject to specific corporate tax and reporting requirements in Indonesia. Proper bookkeeping is legally essential to maintain your PT PMA status in good standing."
  },
  {
    q: "What is an OTA and how do you reconcile my payouts?",
    a: "OTA stands for Online Travel Agency (like Airbnb, Booking.com, VRBO). Reconciling payouts is complex because OTAs deduct their commissions before sending you money, and payouts often cross over month-ends. We cross-reference every payout against your booking calendar to ensure you received exactly what you were owed, accounting for all commissions and fees."
  },
  {
    q: "Do I need to be physically in Bali for this service?",
    a: "No — 100% remote. Our entire process is digital. We are built specifically for remote foreign owners who need visibility from afar."
  },
  {
    q: "How do you receive my receipts and invoices?",
    a: "We set up a secure, shared Google Drive folder for you. Your local manager simply snaps photos of physical receipts and uploads them, while you can forward digital invoices and OTA reports. We handle the rest."
  },
  {
    q: "Is my financial data secure?",
    a: "Yes. We use secure cloud storage (Google Workspace) with restricted access controls. Your data is never shared with third parties without your explicit permission (such as your chosen Konsultan Pajak)."
  },
  {
    q: "What if my villa records are completely disorganized?",
    a: "That's exactly why we're here. We offer a One-Time Financial Cleanup service where we can reconstruct up to 12 months of historical data, categorizing every transaction to give you a clean starting point."
  },
  {
    q: "How is this different from what my villa manager already does?",
    a: "Your villa manager focuses on operations — guest experience, maintenance, and staff management. While they handle petty cash, they are rarely trained bookkeepers. We provide independent, third-party financial oversight. We verify the manager's reports, categorize the expenses properly, and present you with professional financial statements."
  },
  {
    q: "When will I receive my monthly Owner Financial Statement?",
    a: "By the 15th of every month, provided all raw data (receipts, OTA reports) is submitted by the 5th."
  },
  {
    q: "Can you work with my existing accountant in my home country?",
    a: "Absolutely. Our reports are delivered in plain English and follow standard accounting principles, making it easy for your home-country accountant to understand your Bali income for your personal tax returns."
  },
  {
    q: "What currency are the reports in?",
    a: "Our standard reports present transactions in their native currency (usually IDR for expenses) and are consolidated into your preferred reporting currency (e.g., USD, AUD, EUR) based on standardized monthly exchange rates for a clear net position."
  },
  {
    q: "Do you work with leasehold/nominee-owned villas as well as PT PMAs?",
    a: "Yes. We organize the financial reality of your villa regardless of the legal structure, though the compliance requirements will differ."
  },
  {
    q: "What are Indonesian tax obligations for foreign villa rental income?",
    a: "As a general awareness note: income generated from property in Indonesia is generally subject to Indonesian tax, regardless of where the money is paid or where the owner lives. However, we do not provide tax advice. We strongly recommend speaking to a licensed Konsultan Pajak to understand your specific obligations based on your ownership structure."
  }
];

export default function FAQ() {
  return (
    <Layout>
      <div className="bg-muted/30 py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <FadeIn className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">Frequently Asked Questions</h1>
            <p className="text-lg text-foreground/70">
              Clear answers to the most common concerns from remote villa owners.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="container mx-auto px-4 py-24 max-w-3xl">
        <FadeIn delay={0.1}>
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-6 md:p-8">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-serif font-bold text-lg hover:text-primary hover:no-underline">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/80 leading-relaxed text-base">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </Layout>
  );
}
