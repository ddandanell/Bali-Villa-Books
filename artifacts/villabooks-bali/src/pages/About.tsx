import { Layout } from "@/components/Layout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/Motion";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, BookOpen, Building, CheckCircle2, Globe, MapPin } from "lucide-react";

export default function About() {
  return (
    <Layout>
      <div className="bg-primary text-primary-foreground py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <FadeIn>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">About VillaBooks Bali</h1>
            <p className="text-xl md:text-2xl text-primary-foreground/80 font-serif italic">
              Built for foreign villa owners who deserve financial clarity.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <FadeIn>
            <h2 className="text-3xl font-serif font-bold text-primary mb-6">The Mission</h2>
            <p className="text-lg text-foreground/80 leading-relaxed mb-6">
              We started VillaBooks Bali because we saw a recurring problem: foreign investors pouring capital into beautiful Bali properties, only to realize months later that they had no idea if they were actually turning a profit.
            </p>
            <p className="text-lg text-foreground/80 leading-relaxed">
              Between complex OTA payouts, local maintenance vendors operating mostly in cash, and a local management team focused entirely on guest experience rather than spreadsheets—owners are left in the dark. We exist to turn the lights on.
            </p>
          </FadeIn>
          <FadeIn delay={0.2} className="relative">
            <div className="aspect-square rounded-2xl bg-muted overflow-hidden relative shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1537726235470-8504e3beef77?q=80&w=2070&auto=format&fit=crop" 
                alt="Bali Villa Details" 
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-primary/10"></div>
            </div>
          </FadeIn>
        </div>

        <FadeIn className="mb-12">
          <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">Our Core Expertise</h2>
        </FadeIn>

        <StaggerContainer className="grid sm:grid-cols-2 gap-6 mb-24">
          {[
            {
              icon: <BookOpen className="w-6 h-6 text-secondary" />,
              title: "Boutique Bookkeeping",
              desc: "Meticulous categorization of every Rupiah spent and earned."
            },
            {
              icon: <Globe className="w-6 h-6 text-secondary" />,
              title: "OTA Reconciliation",
              desc: "Untangling the web of Airbnb, Booking.com, and direct payment payouts."
            },
            {
              icon: <Building className="w-6 h-6 text-secondary" />,
              title: "Bali Villa Operations",
              desc: "We understand banjar fees, pool chemical costs, and local staff norms."
            },
            {
              icon: <MapPin className="w-6 h-6 text-secondary" />,
              title: "Indonesian Business Structure",
              desc: "Navigating the financial realities of PT PMAs and leasehold arrangements."
            }
          ].map((item, i) => (
            <StaggerItem key={i}>
              <Card className="h-full border-border/50 hover:border-primary/20 transition-colors">
                <CardContent className="p-8">
                  <div className="bg-primary/5 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-foreground/70">{item.desc}</p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="bg-muted/30 rounded-2xl p-8 md:p-12 border border-border/50 mb-24">
          <FadeIn>
            <h3 className="text-2xl font-serif font-bold text-primary mb-4">100% Remote, Timezone Aware</h3>
            <p className="text-foreground/80 leading-relaxed mb-6">
              Our service is entirely digital. Whether you're waking up in Sydney, London, Amsterdam, or New York, your financial reports will be waiting for you. We coordinate securely online, meaning you never need to fly to Bali just to sort out paperwork.
            </p>
            <div className="flex flex-wrap gap-4">
              <span className="inline-flex items-center rounded-full bg-background border px-3 py-1 text-sm font-medium text-muted-foreground">
                Australia — AEST / AWST
              </span>
              <span className="inline-flex items-center rounded-full bg-background border px-3 py-1 text-sm font-medium text-muted-foreground">
                UK — GMT / BST
              </span>
              <span className="inline-flex items-center rounded-full bg-background border px-3 py-1 text-sm font-medium text-muted-foreground">
                Netherlands — CET / CEST
              </span>
              <span className="inline-flex items-center rounded-full bg-background border px-3 py-1 text-sm font-medium text-muted-foreground">
                USA — EST / PST
              </span>
            </div>
          </FadeIn>
        </div>

        <FadeIn className="text-center pb-12">
          <p className="text-sm text-foreground/50 max-w-2xl mx-auto">
            <strong>A Note on Compliance:</strong> VillaBooks Bali is a bookkeeping and financial reporting service. We organize your financial records and prepare them for review by a licensed professional. Our reports are for owner information only and do not constitute official tax filings or legal advice. For Indonesian tax filings and legal compliance, we coordinate with and refer to licensed Konsultan Pajak registered with the Directorate General of Taxes (DJP).
          </p>
        </FadeIn>
      </div>
    </Layout>
  );
}
