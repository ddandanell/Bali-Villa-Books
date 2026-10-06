import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { SITE_ORIGIN, sitePages } from "@/lib/site-pages";
import { ClientShowcase, SixVillaScenario } from "@/components/ClientShowcase";
import { PageEducation } from "@/components/PageEducation";
import {
  EvidenceSection,
  Hero,
  HomeContact,
  HomeFAQ,
  JournalPreview,
  LocalAbout,
  MidConsultation,
  PricingSection,
  SamplePreview,
  ServicesSection,
  TrustIntro,
  UseCasesSection,
  WorkflowSection,
} from "@/components/HomeSections";

export default function Home() {
  useEffect(() => {
    const page = sitePages["/"];
    document.title = page.title;
    const canonical = `${SITE_ORIGIN}/`;
    const link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (link) link.href = canonical;
    document.querySelector('meta[name="description"]')?.setAttribute("content", page.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", page.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", page.description);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", canonical);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", page.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", page.description);
  }, []);
  return <Layout>
    <Hero />
    <TrustIntro />
    <ServicesSection />
    <SamplePreview />
    <PricingSection />
    <WorkflowSection />
    <MidConsultation />
    <EvidenceSection />
    <ClientShowcase />
    <SixVillaScenario />
    <UseCasesSection />
    <LocalAbout />
    <HomeFAQ />
    <JournalPreview />
    <PageEducation path="/" />
    <HomeContact />
  </Layout>;
}
