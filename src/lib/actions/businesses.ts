"use server";

import { db } from "@/lib/db";
import { businesses, pageAudits, contentPlans } from "@/lib/schema";
import { requireAuth } from "@/lib/session";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type BusinessInput = {
  name: string;
  category: string;
  customNiche?: string | null;
  city: string;
  wilaya: string;
  description: string;
  audience: string;
  mainPain: string;
  competitiveAdvantage: string;
  primaryLanguage: string;
  toneStyle: string;
  sellingChannels: string; // Comma-separated
  orderMethods: string;    // Comma-separated
  defaultCta?: string | null;
  contentConstraints?: string | null;
  weeklyGoal?: string | null;
};

export async function createBusinessAction(data: BusinessInput) {
  const session = await requireAuth();
  const userId = session.user.id;

  const results = await db
    .insert(businesses)
    .values({
      userId,
      name: data.name,
      category: data.category,
      customNiche: data.customNiche || null,
      city: data.city,
      wilaya: data.wilaya,
      description: data.description,
      audience: data.audience,
      mainPain: data.mainPain,
      competitiveAdvantage: data.competitiveAdvantage,
      primaryLanguage: data.primaryLanguage,
      toneStyle: data.toneStyle,
      sellingChannels: data.sellingChannels,
      orderMethods: data.orderMethods,
      defaultCta: data.defaultCta || null,
      contentConstraints: data.contentConstraints || null,
      weeklyGoal: data.weeklyGoal || null,
    })
    .returning();

  const newBusiness = results[0];
  if (!newBusiness) {
    throw new Error("Failed to create business profile");
  }

  revalidatePath("/dashboard");
  revalidatePath("/businesses");

  return { success: true, id: newBusiness.id };
}

export async function updateBusinessAction(id: string, data: Partial<BusinessInput>) {
  const session = await requireAuth();
  const userId = session.user.id;

  // Validate ownership first
  const existing = await db
    .select()
    .from(businesses)
    .where(and(eq(businesses.id, id), eq(businesses.userId, userId)))
    .limit(1);

  if (existing.length === 0) {
    throw new Error("Business not found or unauthorized");
  }

  const results = await db
    .update(businesses)
    .set({
      name: data.name,
      category: data.category,
      customNiche: data.customNiche !== undefined ? data.customNiche : undefined,
      city: data.city,
      wilaya: data.wilaya,
      description: data.description,
      audience: data.audience,
      mainPain: data.mainPain,
      competitiveAdvantage: data.competitiveAdvantage,
      primaryLanguage: data.primaryLanguage,
      toneStyle: data.toneStyle,
      sellingChannels: data.sellingChannels,
      orderMethods: data.orderMethods,
      defaultCta: data.defaultCta !== undefined ? data.defaultCta : undefined,
      contentConstraints: data.contentConstraints !== undefined ? data.contentConstraints : undefined,
      weeklyGoal: data.weeklyGoal !== undefined ? data.weeklyGoal : undefined,
      updatedAt: new Date(),
    })
    .where(and(eq(businesses.id, id), eq(businesses.userId, userId)))
    .returning();

  const updatedBusiness = results[0];
  if (!updatedBusiness) {
    throw new Error("Failed to update business profile");
  }

  revalidatePath("/dashboard");
  revalidatePath("/businesses");
  revalidatePath(`/businesses/${id}`);

  return { success: true, id: updatedBusiness.id };
}

export async function deleteBusinessAction(id: string) {
  const session = await requireAuth();
  const userId = session.user.id;

  // Validate ownership
  const existing = await db
    .select()
    .from(businesses)
    .where(and(eq(businesses.id, id), eq(businesses.userId, userId)))
    .limit(1);

  if (existing.length === 0) {
    throw new Error("Business not found or unauthorized");
  }

  await db
    .delete(businesses)
    .where(and(eq(businesses.id, id), eq(businesses.userId, userId)));

  revalidatePath("/dashboard");
  revalidatePath("/businesses");

  return { success: true };
}

export async function getBusinessesAction() {
  const session = await requireAuth();
  const userId = session.user.id;

  const results = await db
    .select()
    .from(businesses)
    .where(eq(businesses.userId, userId));

  return results;
}

export async function getBusinessDetailAction(id: string) {
  const session = await requireAuth();
  const userId = session.user.id;

  const results = await db
    .select()
    .from(businesses)
    .where(and(eq(businesses.id, id), eq(businesses.userId, userId)))
    .limit(1);

  if (results.length === 0) {
    return null;
  }

  return results[0];
}

export async function getDashboardStatsAction() {
  const session = await requireAuth();
  const userId = session.user.id;

  const [businessesCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(businesses)
    .where(eq(businesses.userId, userId));

  const [auditsCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(pageAudits)
    .innerJoin(businesses, eq(pageAudits.businessId, businesses.id))
    .where(eq(businesses.userId, userId));

  const [plansCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(contentPlans)
    .innerJoin(businesses, eq(contentPlans.businessId, businesses.id))
    .where(eq(businesses.userId, userId));

  return {
    businesses: businessesCount?.count || 0,
    audits: auditsCount?.count || 0,
    contentPlans: plansCount?.count || 0,
  };
}
