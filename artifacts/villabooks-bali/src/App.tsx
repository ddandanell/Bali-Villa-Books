import { Switch, Route, Redirect, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getGetBlogPostQueryKey, getListBlogPostsQueryKey, type BlogPost, type BlogPostSummary, type ListBlogPostsParams } from "@workspace/api-client-react";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import BlogArticle from "@/pages/BlogArticle";
import PageContent from "@/pages/PageContent";

const queryClient = new QueryClient();
if (typeof window !== "undefined") {
  const bootstrap = (window as Window & { __BLOG_INITIAL__?: { post?: BlogPost; posts?: BlogPostSummary[]; listParams?: ListBlogPostsParams } }).__BLOG_INITIAL__;
  if (bootstrap?.post) queryClient.setQueryData(getGetBlogPostQueryKey(bootstrap.post.slug), bootstrap.post);
  if (bootstrap?.posts) queryClient.setQueryData(getListBlogPostsQueryKey(bootstrap.listParams ?? { limit: 50 }), bootstrap.posts);
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogArticle} />
      <Route path="/services"><PageContent path="/services" /></Route>
      <Route path="/airbnb-bookkeeping-bali"><PageContent path="/airbnb-bookkeeping-bali" /></Route>
      <Route path="/villa-financial-reporting-bali"><PageContent path="/villa-financial-reporting-bali" /></Route>
      <Route path="/villa-bookkeeping-cleanup-bali"><PageContent path="/villa-bookkeeping-cleanup-bali" /></Route>
      <Route path="/pt-pma-villa-bookkeeping"><PageContent path="/pt-pma-villa-bookkeeping" /></Route>
      <Route path="/company-formation-bali"><PageContent path="/company-formation-bali" /></Route>
      <Route path="/business-licensing-bali"><PageContent path="/business-licensing-bali" /></Route>
      <Route path="/tax-registration-bali"><PageContent path="/tax-registration-bali" /></Route>
      <Route path="/tax-compliance-bali"><PageContent path="/tax-compliance-bali" /></Route>
      <Route path="/tax-planning-bali"><PageContent path="/tax-planning-bali" /></Route>
      <Route path="/business-visa-bali"><PageContent path="/business-visa-bali" /></Route>
      <Route path="/investor-kitas-bali"><PageContent path="/investor-kitas-bali" /></Route>
      <Route path="/company-compliance-bali"><PageContent path="/company-compliance-bali" /></Route>
      <Route path="/villa-payroll-records-bali"><PageContent path="/villa-payroll-records-bali" /></Route>
      <Route path="/pricing"><PageContent path="/pricing" /></Route>
      <Route path="/sample-report"><PageContent path="/sample-report" /></Route>
      <Route path="/about"><PageContent path="/about" /></Route>
      <Route path="/get-started"><PageContent path="/get-started" /></Route>
      <Route path="/faq"><PageContent path="/faq" /></Route>
      <Route path="/privacy"><PageContent path="/privacy" /></Route>
      <Route path="/terms"><PageContent path="/terms" /></Route>
      <Route path="/contact"><Redirect to="/get-started" /></Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App({ ssrPath }: { ssrPath?: string } = {}) {
  useEffect(() => { document.getElementById("journal-server-content")?.remove(); }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")} ssrPath={ssrPath}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
