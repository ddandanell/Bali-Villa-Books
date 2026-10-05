import { renderToString } from "react-dom/server";
import App from "./App";
export { pageDocument } from "./lib/page-document";
export { sitePages } from "./lib/site-pages";

export function render(pathname = "/"): string {
  const path = pathname.replace(/\/+$/, "") || "/";
  return renderToString(<App ssrPath={path} />);
}
