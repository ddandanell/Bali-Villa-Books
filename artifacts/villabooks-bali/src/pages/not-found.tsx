import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-8xl font-serif font-bold text-primary/20 mb-6">404</div>
          <h1 className="text-2xl font-serif font-bold text-primary mb-3">Page not found</h1>
          <p className="text-foreground/60 mb-8">
            The page you are looking for does not exist. You may have followed a broken link or mistyped the address.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
        </div>
      </div>
    </Layout>
  );
}
