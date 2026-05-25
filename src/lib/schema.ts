import { pgTable, text, timestamp, boolean, index, uuid, integer, jsonb } from "drizzle-orm/pg-core";

// IMPORTANT! ID fields should ALWAYS use UUID types, EXCEPT the BetterAuth tables.


export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("user_email_idx").on(table.email)]
);

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("session_user_id_idx").on(table.userId),
    index("session_token_idx").on(table.token),
  ]
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("account_user_id_idx").on(table.userId),
    index("account_provider_account_idx").on(table.providerId, table.accountId),
  ]
);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// ==========================================
// PAGEPILOT DZ - APPLICATION DATA MODELS
// ==========================================

export const businesses = pgTable(
  "businesses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    category: text("category").notNull(),
    customNiche: text("custom_niche"),
    city: text("city").notNull(),
    wilaya: text("wilaya").notNull(),
    description: text("description").notNull(),
    audience: text("audience").notNull(),
    mainPain: text("main_pain").notNull(),
    competitiveAdvantage: text("competitive_advantage").notNull(),
    primaryLanguage: text("primary_language").notNull(),
    toneStyle: text("tone_style").notNull(),
    sellingChannels: text("selling_channels").notNull(), // Comma-separated strings
    orderMethods: text("order_methods").notNull(),
    defaultCta: text("default_cta"),
    contentConstraints: text("content_constraints"),
    weeklyGoal: text("weekly_goal"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("businesses_user_id_idx").on(table.userId),
  ]
);

export const productsServices = pgTable(
  "products_services",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // "product" | "service"
    name: text("name").notNull(),
    price: text("price"),
    description: text("description").notNull(),
    benefits: text("benefits").notNull(),
    targetAudience: text("target_audience"),
    painOrProblem: text("pain_or_problem"),
    orderMethod: text("order_method"),
    notes: text("notes"),
    activeForPlanning: boolean("active_for_planning").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("products_services_business_id_idx").on(table.businessId),
  ]
);

export const pageInputs = pgTable(
  "page_inputs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    platform: text("platform").notNull(), // "facebook" | "instagram" | "both"
    pageUrl: text("page_url"),
    handle: text("handle"),
    bioText: text("bio_text"),
    rawPostsText: text("raw_posts_text"),
    manualNotes: text("manual_notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("page_inputs_business_id_idx").on(table.businessId),
  ]
);

export const pageAudits = pgTable(
  "page_audits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    pageInputId: uuid("page_input_id")
      .notNull()
      .references(() => pageInputs.id, { onDelete: "cascade" }),
    score: integer("score").notNull(),
    scoreBreakdown: jsonb("score_breakdown").notNull(),
    summary: text("summary").notNull(),
    strengths: jsonb("strengths").notNull(),
    weaknesses: jsonb("weaknesses").notNull(),
    urgentFixes: jsonb("urgent_fixes").notNull(),
    bioRewrite: text("bio_rewrite"),
    ctaRecommendation: text("cta_recommendation"),
    trustReview: text("trust_review"),
    contentMixDiagnosis: text("content_mix_diagnosis"),
    conversionReview: text("conversion_review"),
    languageRecommendation: text("language_recommendation"),
    recommendedPillars: jsonb("recommended_pillars"),
    pinnedPostProposal: jsonb("pinned_post_proposal"),
    nextAction: text("next_action"),
    outputJson: jsonb("output_json").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("page_audits_business_id_idx").on(table.businessId),
    index("page_audits_page_input_id_idx").on(table.pageInputId),
  ]
);

export const contentPlans = pgTable(
  "content_plans",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    auditId: uuid("audit_id")
      .notNull()
      .references(() => pageAudits.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    goal: text("goal").notNull(),
    status: text("status").default("draft").notNull(), // "draft" | "ready" | "used"
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("content_plans_business_id_idx").on(table.businessId),
    index("content_plans_audit_id_idx").on(table.auditId),
  ]
);

export const contentItems = pgTable(
  "content_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contentPlanId: uuid("content_plan_id")
      .notNull()
      .references(() => contentPlans.id, { onDelete: "cascade" }),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    dayNumber: integer("day_number").notNull(), // 1 to 7
    platform: text("platform").notNull(), // "facebook" | "instagram" | "both"
    goal: text("goal").notNull(),
    contentType: text("content_type").notNull(), // "educational" | "marketing" | "promotional" | "trust" | "interactive"
    format: text("format").notNull(), // "post" | "reel" | "story" | "carousel"
    hook: text("hook").notNull(),
    caption: text("caption").notNull(),
    cta: text("cta").notNull(),
    visualIdea: text("visual_idea").notNull(),
    textOnVisual: text("text_on_visual"),
    hashtags: jsonb("hashtags"),
    notes: text("notes"),
    status: text("status").default("draft").notNull(), // "draft" | "ready" | "used"
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("content_items_content_plan_id_idx").on(table.contentPlanId),
    index("content_items_business_id_idx").on(table.businessId),
  ]
);

export const aiGenerations = pgTable(
  "ai_generations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    businessId: uuid("business_id")
      .references(() => businesses.id, { onDelete: "cascade" }),
    generationType: text("generation_type").notNull(), // "audit" | "weekly_plan" | "post_variant" | "bio_rewrite"
    inputJson: jsonb("input_json").notNull(),
    outputJson: jsonb("output_json").notNull(),
    model: text("model").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("ai_generations_user_id_idx").on(table.userId),
    index("ai_generations_business_id_idx").on(table.businessId),
  ]
);
