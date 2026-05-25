"use server";

import { db } from "@/lib/db";
import { businesses, pageInputs, pageAudits, productsServices } from "@/lib/schema";
import { requireAuth } from "@/lib/session";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateObject } from "ai";
import { z } from "zod";

// Zod schema matching database structure for strict AI generation validation
const pageAuditResponseSchema = z.object({
  score: z.number().min(0).max(100),
  scoreBreakdown: z.object({
    bio: z.number().min(0).max(100),
    trust: z.number().min(0).max(100),
    conversion: z.number().min(0).max(100),
    contentMix: z.number().min(0).max(100),
  }),
  summary: z.string(),
  strengths: z.array(z.string().min(1)),
  weaknesses: z.array(z.string().min(1)),
  urgentFixes: z.array(z.string().min(1)),
  bioRewrite: z.string(),
  ctaRecommendation: z.string(),
  trustReview: z.string(),
  contentMixDiagnosis: z.string(),
  conversionReview: z.string(),
  languageRecommendation: z.string(),
  recommendedPillars: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      objective: z.string(),
    })
  ),
  pinnedPostProposal: z.object({
    hook: z.string(),
    body: z.string(),
    cta: z.string(),
    visualConcept: z.string(),
  }),
  nextAction: z.string(),
});

export async function generatePageAuditAction(businessId: string) {
  const session = await requireAuth();
  const userId = session.user.id;

  // 1. Verify business ownership
  const business = await db
    .select()
    .from(businesses)
    .where(and(eq(businesses.id, businessId), eq(businesses.userId, userId)))
    .limit(1)
    .then((res) => res[0]);

  if (!business) {
    throw new Error("Unauthorized: Business profile not found or not owned by you.");
  }

  // 2. Fetch latest page inputs
  const pageInput = await db
    .select()
    .from(pageInputs)
    .where(eq(pageInputs.businessId, businessId))
    .orderBy(desc(pageInputs.createdAt))
    .limit(1)
    .then((res) => res[0]);

  if (!pageInput) {
    throw new Error("No page configuration found. Please configure Page Inputs before generating an audit.");
  }

  // 3. Fetch active products/services
  const activeProducts = await db
    .select()
    .from(productsServices)
    .where(and(eq(productsServices.businessId, businessId), eq(productsServices.activeForPlanning, true)));

  // 4. Initialize AI Provider
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OpenRouter API key is not configured. Please add OPENROUTER_API_KEY to your .env file.");
  }

  const openrouter = createOpenRouter({ apiKey });
  const modelName = process.env.OPENROUTER_MODEL || "openai/gpt-5-mini";

  // Formulate prompts
  const productsSnippet = activeProducts.map((p) => 
    `- [${p.type.toUpperCase()}] Name: ${p.name}, Price: ${p.price || "N/A"}, Description: ${p.description}, Benefits: ${p.benefits}`
  ).join("\n");

  const systemPrompt = `You are a world-class social media Conversion Rate Optimization (CRO) expert and copywriting consultant specializing in the Algerian local commerce market.
Your target is to deliver highly specialized, premium, and actionable audits for local Algerian businesses selling through social media (Facebook/Instagram).

Algerian E-commerce & Social Selling Realities:
1. LOGISTICS: Domestic shipping relies heavily on Yalidine Express, Nord et Sud, and local couriers. Delivery stopped at local stop desks ("Stop Desk") is highly popular and cheaper than home delivery ("A domicile").
2. PAYMENTS: Over 95% of social e-commerce transactions in Algeria occur via Cash on Delivery (COD / Paiement à la livraison). Online card payments (CIB / Dahabia) are rare.
3. INTAKE CHANNELS: Customers order by calling, messaging on WhatsApp/Viber, or direct messaging (DM / "l'inbox" / "messagerie").
4. DIALECT & LANGUAGE: The brand's local customer audience communicates with a mixture of Algerian Darija (Arabic dialect), French phrases, and standard Arabic. Captions and Bios must reflect authentic, high-converting dialect/French combinations.
5. MAJOR SALES BLOCKERS:
   - Price hiding ("inbox for price" or "arwah privé") is a major conversion killer in Algeria. Recommending direct price transparency is a huge CRO win.
   - Hiding shipping costs or delivery timelines.
   - Boring, copy-pasted social media bios that do not hook the customer immediately.
   - Complex ordering pipelines. Recommending Yalidine stop-desk ordering directly in the bio or post boosts conversion.

INSTRUCTIONS:
1. Act strictly as a high-end social commerce consultant. Your tone should be constructive, highly strategic, and commercially focused.
2. Analyze the business details, active products list, and social page parameters provided.
3. Rewrite the social page Bio (bioRewrite) to be extremely catchy, authentic, and containing local dialect hooks, relevant emojis, Yalidine delivery mentions, and a strong CTA (e.g. Yalidine Delivery + COD).
4. Evaluate strengths, weaknesses, and URGENT fixes that are costing the client sales.
5. Propose 3-4 dynamic marketing pillars (recommendedPillars) to construct their content calendar around.
6. Provide a proposal for a Pinned Post (pinnedPostProposal) to catch traffic, including a hook, caption body written in authentic, natural mix of Darija/French/Arabic, a direct ordering CTA, and visual instructions.
7. Fill out the Zod schema exactly. Do NOT use placeholder values or generic terms. Be specific to the products they sell.`;

  const userPrompt = `
BUSINESS DETAILS:
- Name: ${business.name}
- Category: ${business.category} (${business.customNiche || "No custom niche"})
- Description: ${business.description}
- Target Audience: ${business.audience}
- Core Pain Point: ${business.mainPain}
- Competitive Advantage: ${business.competitiveAdvantage}
- Primary Language Choice: ${business.primaryLanguage}
- Writing Tone: ${business.toneStyle}
- Selling Channels: ${business.sellingChannels}
- Order Intake Methods: ${business.orderMethods}
- Default Brand CTA: ${business.defaultCta || "None"}
- Constraints: ${business.contentConstraints || "None"}

ACTIVE PRODUCTS & SERVICES:
${productsSnippet || "No active products/services catalogged yet."}

CURRENT PAGE INPUTS FOR AUDIT:
- Target Platform: ${pageInput.platform}
- Page URL: ${pageInput.pageUrl || "N/A"}
- Handle: @${pageInput.handle || "N/A"}
- Current Bio: ${pageInput.bioText || "N/A"}
- Past Social Media Posts Pasted:
"""
${pageInput.rawPostsText || "No past posts provided."}
"""
- User Strategic Notes/Guidelines: ${pageInput.manualNotes || "None"}

Evaluate and return the structured JSON audit report matching the expected schema. Make all evaluations tailored strictly to these brand details and the Algerian consumer landscape.
`;

  try {
    const { object: auditData } = await generateObject({
      model: openrouter(modelName),
      schema: pageAuditResponseSchema,
      system: systemPrompt,
      prompt: userPrompt,
    });

    // 5. Store the structured result in the database
    const results = await db
      .insert(pageAudits)
      .values({
        businessId,
        pageInputId: pageInput.id,
        score: auditData.score,
        scoreBreakdown: auditData.scoreBreakdown,
        summary: auditData.summary,
        strengths: auditData.strengths,
        weaknesses: auditData.weaknesses,
        urgentFixes: auditData.urgentFixes,
        bioRewrite: auditData.bioRewrite,
        ctaRecommendation: auditData.ctaRecommendation,
        trustReview: auditData.trustReview,
        contentMixDiagnosis: auditData.contentMixDiagnosis,
        conversionReview: auditData.conversionReview,
        languageRecommendation: auditData.languageRecommendation,
        recommendedPillars: auditData.recommendedPillars,
        pinnedPostProposal: auditData.pinnedPostProposal,
        nextAction: auditData.nextAction,
        outputJson: auditData,
      })
      .returning();

    const newAudit = results[0];
    if (!newAudit) {
      throw new Error("Database error: Failed to save the generated page audit.");
    }

    // Revalidate business detail paths
    revalidatePath(`/businesses/${businessId}`);
    revalidatePath("/dashboard");
    revalidatePath("/library");

    return { success: true, id: newAudit.id };
  } catch (error) {
    console.error("AI Page Audit Generation Failed:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to run page audit. Please try again.");
  }
}

export async function getBusinessAuditsAction(businessId: string) {
  const session = await requireAuth();
  const userId = session.user.id;

  // Verify ownership first
  const business = await db
    .select()
    .from(businesses)
    .where(and(eq(businesses.id, businessId), eq(businesses.userId, userId)))
    .limit(1)
    .then((res) => res[0]);

  if (!business) {
    throw new Error("Unauthorized: Business profile not found or not owned by you.");
  }

  const audits = await db
    .select()
    .from(pageAudits)
    .where(eq(pageAudits.businessId, businessId))
    .orderBy(desc(pageAudits.createdAt));

  return audits;
}

export async function getAuditDetailAction(auditId: string) {
  const session = await requireAuth();
  const userId = session.user.id;

  const result = await db
    .select({
      audit: pageAudits,
      business: businesses,
    })
    .from(pageAudits)
    .innerJoin(businesses, eq(pageAudits.businessId, businesses.id))
    .where(and(eq(pageAudits.id, auditId), eq(businesses.userId, userId)))
    .limit(1)
    .then((res) => res[0]);

  if (!result) {
    return null;
  }

  return {
    ...result.audit,
    business: result.business,
  };
}
