CREATE TABLE "ai_generations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"business_id" uuid,
	"generation_type" text NOT NULL,
	"input_json" jsonb NOT NULL,
	"output_json" jsonb NOT NULL,
	"model" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "businesses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"custom_niche" text,
	"city" text NOT NULL,
	"wilaya" text NOT NULL,
	"description" text NOT NULL,
	"audience" text NOT NULL,
	"main_pain" text NOT NULL,
	"competitive_advantage" text NOT NULL,
	"primary_language" text NOT NULL,
	"tone_style" text NOT NULL,
	"selling_channels" text NOT NULL,
	"order_methods" text NOT NULL,
	"default_cta" text,
	"content_constraints" text,
	"weekly_goal" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_plan_id" uuid NOT NULL,
	"business_id" uuid NOT NULL,
	"day_number" integer NOT NULL,
	"platform" text NOT NULL,
	"goal" text NOT NULL,
	"content_type" text NOT NULL,
	"format" text NOT NULL,
	"hook" text NOT NULL,
	"caption" text NOT NULL,
	"cta" text NOT NULL,
	"visual_idea" text NOT NULL,
	"text_on_visual" text,
	"hashtags" jsonb,
	"notes" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"audit_id" uuid NOT NULL,
	"title" text NOT NULL,
	"goal" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_audits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"page_input_id" uuid NOT NULL,
	"score" integer NOT NULL,
	"score_breakdown" jsonb NOT NULL,
	"summary" text NOT NULL,
	"strengths" jsonb NOT NULL,
	"weaknesses" jsonb NOT NULL,
	"urgent_fixes" jsonb NOT NULL,
	"bio_rewrite" text,
	"cta_recommendation" text,
	"trust_review" text,
	"content_mix_diagnosis" text,
	"conversion_review" text,
	"language_recommendation" text,
	"recommended_pillars" jsonb,
	"pinned_post_proposal" jsonb,
	"next_action" text,
	"output_json" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_inputs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"platform" text NOT NULL,
	"page_url" text,
	"handle" text,
	"bio_text" text,
	"raw_posts_text" text,
	"manual_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products_services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"price" text,
	"description" text NOT NULL,
	"benefits" text NOT NULL,
	"target_audience" text,
	"pain_or_problem" text,
	"order_method" text,
	"notes" text,
	"active_for_planning" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_generations" ADD CONSTRAINT "ai_generations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_generations" ADD CONSTRAINT "ai_generations_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_items" ADD CONSTRAINT "content_items_content_plan_id_content_plans_id_fk" FOREIGN KEY ("content_plan_id") REFERENCES "public"."content_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_items" ADD CONSTRAINT "content_items_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_plans" ADD CONSTRAINT "content_plans_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_plans" ADD CONSTRAINT "content_plans_audit_id_page_audits_id_fk" FOREIGN KEY ("audit_id") REFERENCES "public"."page_audits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_audits" ADD CONSTRAINT "page_audits_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_audits" ADD CONSTRAINT "page_audits_page_input_id_page_inputs_id_fk" FOREIGN KEY ("page_input_id") REFERENCES "public"."page_inputs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_inputs" ADD CONSTRAINT "page_inputs_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products_services" ADD CONSTRAINT "products_services_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_generations_user_id_idx" ON "ai_generations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ai_generations_business_id_idx" ON "ai_generations" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "businesses_user_id_idx" ON "businesses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "content_items_content_plan_id_idx" ON "content_items" USING btree ("content_plan_id");--> statement-breakpoint
CREATE INDEX "content_items_business_id_idx" ON "content_items" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "content_plans_business_id_idx" ON "content_plans" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "content_plans_audit_id_idx" ON "content_plans" USING btree ("audit_id");--> statement-breakpoint
CREATE INDEX "page_audits_business_id_idx" ON "page_audits" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "page_audits_page_input_id_idx" ON "page_audits" USING btree ("page_input_id");--> statement-breakpoint
CREATE INDEX "page_inputs_business_id_idx" ON "page_inputs" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "products_services_business_id_idx" ON "products_services" USING btree ("business_id");