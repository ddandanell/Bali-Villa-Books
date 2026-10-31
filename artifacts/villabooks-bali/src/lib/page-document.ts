import { sitePages, SITE_ORIGIN, PHONE, OFFICE_LATITUDE, OFFICE_LONGITUDE, mapsDirectionsUrl } from "./site-pages";
import { prices } from "./pricing";
import { additionalFaqs } from "./additional-faqs";
import { homeFaqs } from "./home-faqs";
import { OTA_PILLAR_PATH, otaFaqs, otaSteps } from "./ota-pillar";
import { DEFAULT_SHARE_IMAGE, shareImage, shareImageAlt } from "./social-images";
import { expandedServices } from "./expanded-services";
import { getPageImagery } from "./page-imagery";
import { comparePages, compareHub } from "./compare-pages";
import { serviceFaqs } from "./service-faqs";

const escape = (value: string) => value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]!));
const json = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

export type ArticleMeta = {
  title: string; description: string; category: string;
  publishedAt: string; updatedAt: string;
  imageUrl: string; imageAlt: string;
  faqs?: [string, string][];
};

export function pageDocument(template: string, content: string, pathname: string, article?: ArticleMeta) {
  const path = pathname.replace(/\/+$/, "") || "/";
  const page = article ? { title: article.title, description: article.description, h1: article.title } : sitePages[path] ?? {
    title: "Page Not Found | Bali Accounting", description: "This page could not be found. Browse our villa bookkeeping services or contact Client Advisory.", h1: "Page not found",
  };
  const canonical = `${SITE_ORIGIN}${path}`;
  const socialImage = article ? new URL(article.imageUrl, SITE_ORIGIN).href : `${SITE_ORIGIN}${shareImage(path)}`;
  const socialAlt = article ? article.imageAlt : shareImageAlt(path);
  // Declare the file that is actually served. Journal heroes are 1200x750 WebP; page share cards are 1200x630 JPEG.
  const journalHero = /\/images\/journal\/[^/]+\.webp$/i.test(socialImage);
  const socialType = journalHero ? "image/webp" : /\.png$/i.test(socialImage) ? "image/png" : "image/jpeg";
  const socialSize = journalHero ? { width: 1200, height: 750 } : { width: 1200, height: 630 };
  const compareChild = comparePages.find(item => item.path === path);
  const businessId = `${SITE_ORIGIN}/#business`;
  const webId = `${SITE_ORIGIN}/#website`;
  const graph: unknown[] = [{
    "@type": "AccountingService", "@id": businessId, name: "Bali Accounting", url: `${SITE_ORIGIN}/`,
    description: "Bali bookkeeping, owner reporting, company formation, licensing, separately scoped tax support and visa-application administration through an in-house team.",
    telephone: PHONE, image: `${SITE_ORIGIN}${DEFAULT_SHARE_IMAGE}`,
    founder: { "@type": "Person", name: "Abel Yuniartini" },
    address: { "@type": "PostalAddress", streetAddress: "Jl. Tukad Barito Timur III No.16, Panjer", addressLocality: "Denpasar Selatan", addressRegion: "Bali", postalCode: "80226", addressCountry: "ID" },
    geo: { "@type": "GeoCoordinates", latitude: OFFICE_LATITUDE, longitude: OFFICE_LONGITUDE },
    openingHoursSpecification: [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00", closes: "18:00",
    }],
    sameAs: [mapsDirectionsUrl],
    areaServed: { "@type": "Place", name: "Bali, Indonesia" },
  }, { "@type": "WebSite", "@id": webId, url: `${SITE_ORIGIN}/`, name: "Bali Accounting", publisher: { "@id": businessId } },
  { "@type": "WebPage", "@id": `${canonical}#webpage`, url: canonical, name: page.title, description: page.description, isPartOf: { "@id": webId }, about: { "@id": businessId } }];
  if (article) graph.push({
    "@type": "BlogPosting", "@id": `${canonical}#article`,
    headline: article.title, description: article.description, url: canonical,
    image: socialImage, datePublished: article.publishedAt, dateModified: article.updatedAt,
    author: { "@type": "Organization", name: "Bali Accounting", url: SITE_ORIGIN },
    publisher: { "@id": businessId }, isPartOf: { "@id": webId },
    articleSection: article.category, inLanguage: "en",
    mainEntityOfPage: { "@id": `${canonical}#webpage` },
  }, {
    "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
      { "@type": "ListItem", position: 2, name: "Journal", item: `${SITE_ORIGIN}/blog` },
      { "@type": "ListItem", position: 3, name: article.title, item: canonical },
    ],
  });
  if (article?.faqs?.length) graph.push({
    "@type": "FAQPage", "@id": `${canonical}#questions`,
    mainEntity: article.faqs.map(([question, answer]) => ({
      "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  });
  if (path !== "/" && sitePages[path]) graph.push({
    "@type": "BreadcrumbList", itemListElement: compareChild
      ? [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: "Compare", item: `${SITE_ORIGIN}/compare` },
          { "@type": "ListItem", position: 3, name: compareChild.label, item: canonical },
        ]
      : [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: page.h1, item: canonical },
        ],
  });
  // Comparison pages answer the same questions on the page and in the schema.
  const compareEntry = compareChild ?? (path === compareHub.path ? compareHub : undefined);
  if (compareEntry) graph.push({
    "@type": "FAQPage", "@id": `${canonical}#questions`,
    mainEntity: compareEntry.faqs.map(entry => ({
      "@type": "Question", name: entry[0], acceptedAnswer: { "@type": "Answer", text: entry[1] },
    })),
  });
  if (path === compareHub.path) graph.push({
    "@type": "CollectionPage", "@id": `${canonical}#comparisons`, name: compareHub.h1,
    description: compareHub.description, url: canonical,
    hasPart: comparePages.map(item => ({ "@type": "WebPage", name: item.h1, url: `${SITE_ORIGIN}${item.path}` })),
  });
  const visual = getPageImagery(path);
  if (visual) graph.push({
    "@type": "ImageObject", "@id": `${canonical}#primary-image`,
    contentUrl: `${SITE_ORIGIN}${visual.imageUrl}`, caption: visual.imageAlt,
    width: visual.width, height: visual.height,
  });
  if (page.service) graph.push({ "@type": "Service", "@id": `${canonical}#service`, name: page.h1, description: page.description, image: visual ? `${SITE_ORIGIN}${visual.imageUrl}` : undefined, url: canonical, provider: { "@id": businessId }, areaServed: "Bali, Indonesia" });
  const legacyFaqs = serviceFaqs[path];
  if (legacyFaqs?.length) graph.push({
    "@type": "FAQPage", "@id": `${canonical}#questions`,
    mainEntity: legacyFaqs.map(([question, answer]) => ({
      "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  });
  const service = expandedServices.find(item => item.path === path);
  if (service) graph.push({
    "@type": "FAQPage", "@id": `${canonical}#questions`,
    mainEntity: service.details.faqs.map(([question, answer]) => ({
      "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  });
  if (path === "/faq") graph.push({
    "@type": "FAQPage", "@id": `${canonical}#questions`,
    mainEntity: additionalFaqs.map(([question, answer]) => ({
      "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  });
  if (path === "/") graph.push({
    "@type": "FAQPage", "@id": `${canonical}#questions`,
    mainEntity: homeFaqs.map(([question, answer]) => ({
      "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  });
  if (path === OTA_PILLAR_PATH) graph.push({
    "@type": "FAQPage", "@id": `${canonical}#questions`,
    mainEntity: otaFaqs.map(([question, answer]) => ({
      "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  }, {
    "@type": "HowTo", "@id": `${canonical}#howto`,
    name: "How to reconcile Airbnb and OTA payouts for a Bali villa",
    description: page.description,
    step: otaSteps.map((step, index) => ({
      "@type": "HowToStep", position: index + 1, name: step.name, text: step.text,
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
${sitePages[path] || article ? "" : '<meta name="robots" content="noindex,follow">'}
<link rel="canonical" href="${escape(canonical)}">
<meta property="og:type" content="${article ? "article" : "website"}"><meta property="og:title" content="${escape(page.title)}">
${article ? `<meta property="article:published_time" content="${article.publishedAt}"><meta property="article:modified_time" content="${article.updatedAt}"><meta property="article:section" content="${escape(article.category)}">` : ""}
<meta property="og:description" content="${escape(page.description)}"><meta property="og:url" content="${escape(canonical)}">
<meta property="og:image" content="${socialImage}"><meta property="og:image:secure_url" content="${socialImage}">
<meta property="og:image:alt" content="${escape(socialAlt)}"><meta property="og:image:type" content="${socialType}">
<meta property="og:image:width" content="${socialSize.width}"><meta property="og:image:height" content="${socialSize.height}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(page.title)}">
<meta name="twitter:description" content="${escape(page.description)}"><meta name="twitter:image" content="${socialImage}">
<meta name="twitter:image:alt" content="${escape(socialAlt)}">
<script type="application/ld+json" id="site-schema">${json({ "@context": "https://schema.org", "@graph": graph })}</script>`;
  return template
    .replace(/<title>[\s\S]*?<\/title>/gi, "")
    .replace(/<meta[^>]+(?:name|property)=["'](?:description|robots|og:[^"']+|twitter:[^"']+)["'][^>]*>/gi, "")
    .replace(/<link[^>]+rel=["']canonical["'][^>]*>/gi, "")
    .replace(/<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, "")
    .replace("</head>", `${head}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${content}</div>`);
}
