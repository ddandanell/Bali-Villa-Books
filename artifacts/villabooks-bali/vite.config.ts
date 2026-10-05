import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { readFileSync, existsSync, statSync } from "node:fs";

const rawPort = process.env.PORT;
const parsedPort = rawPort ? Number(rawPort) : NaN;
const port = Number.isFinite(parsedPort) && parsedPort > 0 ? parsedPort : 5173;
const basePath = process.env.BASE_PATH ?? "/";
const isReplit = process.env.REPL_ID !== undefined;

export default defineConfig({
  base: basePath,
  plugins: [
    {
      name: "public-route-initial-html",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const url = new URL(req.url ?? "/", "http://localhost");
          const pathname = url.pathname.replace(/\/+$/, "") || "/";
          if (req.method !== "GET" && req.method !== "HEAD") return next();
          const publicFile = path.resolve(import.meta.dirname, "public", `.${url.pathname}`);
          if (url.pathname.startsWith("/@") || url.pathname.startsWith("/src/") || url.pathname.startsWith("/node_modules/") || url.pathname.startsWith("/assets/") || existsSync(publicFile) && statSync(publicFile).isFile()) return next();
          if (pathname === "/contact") { res.writeHead(308, { Location: `/get-started${url.search}` }).end(); return; }
          if (pathname !== url.pathname) { res.writeHead(308, { Location: `${pathname}${url.search}` }).end(); return; }
          try {
            const module = await server.ssrLoadModule("/src/entry-server.tsx");
            const html = await server.transformIndexHtml(pathname, readFileSync(path.resolve(import.meta.dirname, "index.html"), "utf8"));
            res.statusCode = module.sitePages[pathname] ? 200 : 404;
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.setHeader("Cache-Control", "no-store");
            res.end(module.pageDocument(html, module.render(pathname), pathname));
          } catch (error) { next(error); }
        });
      },
    },
    react(),
    tailwindcss(),
    ...(isReplit && process.env.NODE_ENV !== "production"
      ? [
          (await import("@replit/vite-plugin-runtime-error-modal")).default(),
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
