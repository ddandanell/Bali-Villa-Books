import { renderToString } from "react-dom/server";
import { getGetBlogPostQueryKey } from "@workspace/api-client-react";
import App, { queryClient } from "./App";
import { staticJournalPosts, type StaticJournalPost } from "./lib/journal-static";
export { pageDocument } from "./lib/page-document";
export { sitePages } from "./lib/site-pages";
export { staticJournalPosts };
export type { StaticJournalPost };

export function render(pathname = "/", article?: StaticJournalPost): string {
  const path = pathname.replace(/\/+$/, "") || "/";
  const key = article ? getGetBlogPostQueryKey(article.slug) : undefined;
  if (article && key) queryClient.setQueryData(key, article);
  try {
    return renderToString(<App ssrPath={path} />);
  } finally {
    if (key) queryClient.removeQueries({ queryKey: key });
  }
}
