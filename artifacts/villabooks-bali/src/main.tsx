import { inject } from "@vercel/analytics";
import { measurementUrl } from "./lib/measurement-url";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const container = document.getElementById("root")!;

if (container.hasChildNodes()) {
  // Pre-rendered HTML exists — hydrate it (keeps SEO content visible immediately)
  hydrateRoot(container, <App />);
} else {
  // No pre-rendered HTML — fresh client render
  createRoot(container).render(<App />);
}

// Only the public production hostname collects; previews and local checks do not.
if (window.location.hostname === "bali-villa-accounting-service.com") {
  inject({ mode: "production", beforeSend: event => {
    const url = measurementUrl(event.url);
    return url ? { ...event, url } : null;
  } });
}
