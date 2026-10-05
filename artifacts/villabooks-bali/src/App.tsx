import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getGetBlogPostQueryKey, getListBlogPostsQueryKey, type BlogPost, type BlogPostSummary } from "@workspace/api-client-react";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import BlogArticle from "@/pages/BlogArticle";

const queryClient = new QueryClient();
if (typeof window !== "undefined") {
  const bootstrap = (window as Window & { __BLOG_INITIAL__?: { post?: BlogPost; posts?: BlogPostSummary[] } }).__BLOG_INITIAL__;
  if (bootstrap?.post) queryClient.setQueryData(getGetBlogPostQueryKey(bootstrap.post.slug), bootstrap.post);
  if (bootstrap?.posts) queryClient.setQueryData(getListBlogPostsQueryKey({ limit: 50 }), bootstrap.posts);
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogArticle} />
      {/* Legacy paths now redirect to single landing page */}
      <Route path="/services" component={Home} />
      <Route path="/sample-report" component={Home} />
      <Route path="/get-started" component={Home} />
      <Route path="/faq" component={Home} />
      <Route path="/about" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => { document.getElementById("journal-server-content")?.remove(); }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
