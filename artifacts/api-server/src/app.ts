import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import blogSeo from "./routes/blog-seo";
import { logger } from "./lib/logger";

const app: Express = express();
app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  const host = (req.get("x-forwarded-host") ?? req.get("host") ?? "").split(",")[0].trim().split(":")[0];
  if (process.env.NODE_ENV === "production" && ["www.bali-villa-accounting-service.com", "bali-villa-books.replit.app"].includes(host)) {
    res.redirect(308, `https://bali-villa-accounting-service.com${req.originalUrl}`); return;
  }
  next();
});

app.use("/api", router);
app.use(blogSeo);

export default app;
