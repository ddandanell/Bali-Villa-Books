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
