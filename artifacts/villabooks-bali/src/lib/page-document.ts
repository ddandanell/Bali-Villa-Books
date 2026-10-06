import { sitePages, SITE_ORIGIN, PHONE } from "./site-pages";
import { prices } from "./pricing";
import { additionalFaqs } from "./additional-faqs";

const escape = (value: string) => value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]!));
const json = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

export function pageDocument(template: string, content: string, pathname: string) {
  const path = pathname.replace(/\/+$/, "") || "/";
  const page = sitePages[path] ?? {
    title: "Page Not Found | Bali Accounting", description: "This page could not be found. Browse our villa bookkeeping services or contact Client Advisory.", h1: "Page not found",
  };
  const canonical = `${SITE_ORIGIN}${path}`;
  const businessId = `${SITE_ORIGIN}/#business`;
  const webId = `${SITE_ORIGIN}/#website`;
  const graph: unknown[] = [{
    "@type": "AccountingService", "@id": businessId, name: "Bali Accounting", url: `${SITE_ORIGIN}/`,
    description: "Villa bookkeeping, OTA reconciliation and monthly financial reporting, with organized handover to a licensed tax adviser.",
    telephone: PHONE, image: `${SITE_ORIGIN}/opengraph.jpg`,
    founder: { "@type": "Person", name: "Abel Yuniartini" },
    address: { "@type": "PostalAddress", streetAddress: "Jl. Tukad Barito Timur III No.16, Panjer", addressLocality: "Denpasar Selatan", addressRegion: "Bali", postalCode: "80226", addressCountry: "ID" },
    areaServed: { "@type": "Place", name: "Bali, Indonesia" },
  }, { "@type": "WebSite", "@id": webId, url: `${SITE_ORIGIN}/`, name: "Bali Accounting", publisher: { "@id": businessId } },
  { "@type": "WebPage", "@id": `${canonical}#webpage`, url: canonical, name: page.title, description: page.description, isPartOf: { "@id": webId }, about: { "@id": businessId } }];
  if (path !== "/" && sitePages[path]) graph.push({
    "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
      { "@type": "ListItem", position: 2, name: page.h1, item: canonical },
    ],
  });
  if (page.service) graph.push({ "@type": "Service", "@id": `${canonical}#service`, name: page.h1, description: page.description, url: canonical, provider: { "@id": businessId }, areaServed: "Bali, Indonesia" });
  if (path === "/faq") graph.push({
    "@type": "FAQPage", "@id": `${canonical}#questions`,
    mainEntity: additionalFaqs.map(([question, answer]) => ({
      "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  });
  if (path === "/" || path === "/pricing") graph.push({
    "@type": "OfferCatalog", "@id": `${SITE_ORIGIN}/pricing#packages`, name: "Villa Bookkeeping Packages",
    itemListElement: [["Starter", prices.starter], ["Professional", prices.professional], ["Premium", prices.premium]].map(([name, price]) => ({
      "@type": "Offer", name, url: `${SITE_ORIGIN}/pricing`, seller: { "@id": businessId },
      itemOffered: { "@type": "Service", name: `${name} villa bookkeeping`, provider: { "@id": businessId } },
      priceSpecification: { "@type": "UnitPriceSpecification", price, priceCurrency: "IDR", unitText: "month" },
    })),
  });
  const head = `
<title>${escape(page.title)}</title>
<meta name="description" content="${escape(page.description)}">
${sitePages[path] ? "" : '<meta name="robots" content="noindex,follow">'}
<link rel="canonical" href="${escape(canonical)}">
<meta property="og:type" content="website"><meta property="og:title" content="${escape(page.title)}">
<meta property="og:description" content="${escape(page.description)}"><meta property="og:url" content="${escape(canonical)}">
<meta property="og:image" content="${SITE_ORIGIN}/opengraph.jpg"><meta property="og:image:alt" content="Bali Accounting villa bookkeeping services">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(page.title)}">
<meta name="twitter:description" content="${escape(page.description)}"><meta name="twitter:image" content="${SITE_ORIGIN}/opengraph.jpg">
<script type="application/ld+json" id="site-schema">${json({ "@context": "https://schema.org", "@graph": graph })}</script>`;
  return template
    .replace(/<title>[\s\S]*?<\/title>/gi, "")
    .replace(/<meta[^>]+(?:name|property)=["'](?:description|robots|og:[^"']+|twitter:[^"']+)["'][^>]*>/gi, "")
    .replace(/<link[^>]+rel=["']canonical["'][^>]*>/gi, "")
    .replace(/<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, "")
    .replace("</head>", `${head}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${content}</div>`);
}
