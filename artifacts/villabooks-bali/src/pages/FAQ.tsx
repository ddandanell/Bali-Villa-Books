import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/Motion";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageCircle } from "lucide-react";

const WA = "https://wa.me/6281237402292";
const wa = (msg: string) => `${WA}?text=${encodeURIComponent(msg)}`;

function WAButton({ label, message }: { label: string; message: string }) {
  return (
    <a
      href={wa(message)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-full sm:w-auto items-center justify-center gap-2 h-14 px-8 rounded-xl bg-[#25D366] text-white font-bold text-base shadow-lg hover:bg-[#1ebe5e] active:scale-[0.98] transition-all"
    >
      <MessageCircle className="w-5 h-5" />
      {label}
    </a>
  );
}

const faqs = [
  {
    q: "What do you actually do?",
    a: "We do your villa's monthly bookkeeping. Every month we collect your receipts, match your Airbnb and Booking.com payouts, and send you one clear report showing what came in, what went out, and what you actually made."
  },
  {
    q: "How much does it cost?",
    a: "Three packages — Rp 2.500.000, Rp 5.000.000, or Rp 8.500.000 per month. All in Indonesian Rupiah. No setup fee. Cancel anytime."
  },
  {
    q: "Do you file my Indonesian taxes?",
    a: "No. We organize your records and prepare a clean document pack. Then a licensed Indonesian Konsultan Pajak (registered with DJP) handles your actual filings. We work with their team or yours."
  },
  {
    q: "I don't live in Bali. Can you still help?",
    a: "Yes. 100% remote. Most of our clients live in Australia, Europe, Singapore, or the US. Everything happens by WhatsApp, email, and Google Drive."
  },
  {
    q: "How do I send you my receipts?",
    a: "We set up a private Google Drive folder. Your villa manager snaps photos of paper receipts. You forward digital invoices. Done."
  },
  {
    q: "What if my books are a total mess right now?",
    a: "Very normal. We do a one-time cleanup (from Rp 8.500.000) — rebuild up to 12 months of records, then start your monthly service with clean books."
  },
  {
    q: "What's the difference between you and my villa manager?",
    a: "Your manager runs the villa — guests, cleaning, staff. We do the books — independent, third-party financial oversight. We check the manager's spending, sort everything correctly, and send the report straight to you."
  },
  {
    q: "When do I get my monthly report?",
    a: "By the 15th of every month. As long as your data is in by the 5th."
  },
  {
    q: "What currency are reports in?",
    a: "Indonesian Rupiah (IDR) only. Same currency you use to pay staff and vendors. Same currency your Konsultan Pajak expects."
  },
  {
    q: "Do you work with PT PMA villas? Leasehold? Nominee?",
    a: "Yes — all of them. The legal structure changes the compliance details, not our bookkeeping work."
  },
  {
    q: "Is my data safe?",
    a: "Yes. Secure Google Workspace storage with locked-down access. We never share your data with anyone without your permission."
  },
  {
    q: "Can my home-country accountant use your reports?",
    a: "Yes. Reports are in plain English and follow standard accounting format. Easy to drop into your home tax return."
  },
];

export default function FAQ() {
  return (
    <Layout>
      <section className="bg-primary text-primary-foreground py-16 sm:py-20">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <FadeIn>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4">Quick Answers.</h1>
            <p className="text-lg sm:text-xl text-primary-foreground/85 mb-8">
              Real questions from real Bali villa owners. Plain English answers.
            </p>
            <div className="flex justify-center">
              <WAButton label="Don't see your question? Ask Abel" message="Hi Abel, I have a question about your villa accounting service." />
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 sm:py-20 max-w-3xl">
        <FadeIn>
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-4 sm:p-8">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-serif font-bold text-base sm:text-lg hover:text-primary hover:no-underline">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/80 leading-relaxed text-sm sm:text-base">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </FadeIn>
      </section>

      <section className="py-12 sm:py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-3">Still Got Questions?</h2>
            <p className="text-primary-foreground/85 mb-6 text-base sm:text-lg">
              Send Abel a message on WhatsApp. Real human reply, usually within a few hours.
            </p>
            <div className="flex justify-center">
              <WAButton label="Chat on WhatsApp" message="Hi Abel, I have a question about VillaBooks Bali." />
            </div>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
}
