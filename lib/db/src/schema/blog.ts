import { pgTable, serial, text, integer, timestamp, jsonb, boolean, index, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  metaTitle: text("meta_title").notNull(),
  metaDescription: text("meta_description").notNull(),
  primaryKeyword: text("primary_keyword").notNull(),
  category: text("category").notNull(),
  contentHtml: text("content_html").notNull(),
  imageUrl: text("image_url").default("/images/bali-villa-accounting-services-hero.jpg").notNull(),
  imageAlt: text("image_alt").default("Bali accounting professional reviewing villa financial records").notNull(),
  wordCount: integer("word_count").default(0).notNull(),
  automationKey: text("automation_key"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  readTimeMinutes: integer("read_time_minutes").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [uniqueIndex("blog_posts_slug_idx").on(table.slug), uniqueIndex("blog_posts_automation_key_idx").on(table.automationKey), index("blog_posts_published_idx").on(table.publishedAt)]);

export const blogRevisions = pgTable("blog_revisions", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => blogPosts.id).notNull(),
  previousContent: jsonb("previous_content").notNull(),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const blogEvents = pgTable("blog_events", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull(),
  eventType: text("event_type").notNull(),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [index("blog_events_slug_time_idx").on(table.slug, table.occurredAt)]);

export const automationRuns = pgTable("blog_automation_runs", {
  id: serial("id").primaryKey(),
  runKey: text("run_key").notNull(),
  status: text("status").notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  publishedCount: integer("published_count").default(0).notNull(),
  errorMessage: text("error_message"),
  metadata: jsonb("metadata"),
}, (table) => [uniqueIndex("blog_automation_runs_key_idx").on(table.runKey)]);

export const automationConfig = pgTable("blog_automation_config", {
  id: serial("id").primaryKey(),
  enabled: boolean("enabled").default(true).notNull(),
  lastRunAt: timestamp("last_run_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts);
export const insertBlogEventSchema = createInsertSchema(blogEvents);
export type BlogPost = typeof blogPosts.$inferSelect;
export type BlogEvent = typeof blogEvents.$inferSelect;
export type AutomationRun = typeof automationRuns.$inferSelect;