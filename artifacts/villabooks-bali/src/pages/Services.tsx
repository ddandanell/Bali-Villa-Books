import { Layout } from "@/components/Layout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/Motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Clock, CheckCircle, FileText, UploadCloud, AlertCircle } from "lucide-react";

export default function Services() {
  return (
    <Layout>
      <div className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Our Services & Workflow</h1>
            <p className="text-xl text-primary-foreground/80">
              A precise, predictable monthly rhythm designed to give you complete visibility without the headache.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="py-24 container mx-auto px-4 max-w-5xl">
        <FadeIn className="mb-16 text-center">
          <h2 className="text-3xl font-serif font-bold text-primary mb-4">The Monthly Workflow</h2>
          <p className="text-lg text-foreground/70">How we turn raw data into clean financial statements every month.</p>
        </FadeIn>

        <div className="space-y-12">
          {/* Timeline Item 1 */}
          <FadeIn className="relative flex gap-8 md:gap-12 items-start">
            <div className="hidden md:flex flex-col items-center mt-2">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl shadow-lg z-10">1</div>
              <div className="w-0.5 h-32 bg-border mt-4"></div>
            </div>
            <Card className="flex-1 border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Days 1–3: Month-Start</span>
                </div>
                <CardTitle className="text-2xl font-serif text-primary">Data Collection</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex gap-3 items-start">
                    <UploadCloud className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Owner or manager submits all receipts and invoices via your dedicated, secure Google Drive folder.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <FileText className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-foreground/80">We securely download OTA payout reports (Airbnb, Booking.com, VRBO) and cross-reference them against your calendar.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <CheckCircle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Staff wages and payroll details are confirmed with local management.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Timeline Item 2 */}
          <FadeIn className="relative flex gap-8 md:gap-12 items-start">
            <div className="hidden md:flex flex-col items-center mt-2">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl shadow-lg z-10">2</div>
              <div className="w-0.5 h-32 bg-border mt-4"></div>
            </div>
            <Card className="flex-1 border-l-4 border-l-secondary">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Days 4–10: Mid-Month</span>
                </div>
                <CardTitle className="text-2xl font-serif text-primary">Reconciliation & Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex gap-3 items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Every transaction is accurately categorized into standard operating expense buckets.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Vendor invoices (electricity, pool maintenance, banjar fees) are verified against historical averages.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Any anomalies (e.g., unexpected spikes in utility bills, duplicate invoices) are flagged for your review.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Timeline Item 3 */}
          <FadeIn className="relative flex gap-8 md:gap-12 items-start">
            <div className="hidden md:flex flex-col items-center mt-2">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl shadow-lg z-10">3</div>
              <div className="w-0.5 h-16 bg-border mt-4 opacity-0"></div>
            </div>
            <Card className="flex-1 border-l-4 border-l-primary bg-primary/5">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Days 11–15: Month-End</span>
                </div>
                <CardTitle className="text-2xl font-serif text-primary">Reporting & Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex gap-3 items-start">
                    <FileText className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-foreground/80 font-medium">Your Owner Financial Statement is compiled and finalized.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <FileText className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-foreground/80">P&L is finalized and cash balances are reconciled.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <FileText className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-foreground/80">The comprehensive report is delivered to your inbox with a brief, plain-English summary highlighting key metrics and action items.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        <FadeIn className="mt-20 bg-muted/30 rounded-2xl p-8 text-center border border-border/50">
          <h3 className="text-2xl font-serif font-bold text-primary mb-4">Year-Round Tax Readiness</h3>
          <p className="text-foreground/80 max-w-2xl mx-auto mb-6">
            Beyond monthly reporting, we ensure your records are always organized for compliance. Documents are stored in structured annual folders, and at year-end, we prepare a clean document pack ready for seamless coordination with your licensed Konsultan Pajak.
          </p>
        </FadeIn>
      </div>
    </Layout>
  );
}
