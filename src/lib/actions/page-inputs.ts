"use server";

import { db } from "@/lib/db";
import { pageInputs, businesses } from "@/lib/schema";
import { requireAuth } from "@/lib/session";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type PageInputData = {
  platform: string; // "facebook" | "instagram" | "both"
  pageUrl?: string | null;
  handle?: string | null;
  bioText?: string | null;
  rawPostsText?: string | null;
  manualNotes?: string | null;
};

// Check if a business is owned by the user
async function verifyBusinessOwnership(businessId: string, userId: string) {
  const business = await db
    .select()
    .from(businesses)
    .where(and(eq(businesses.id, businessId), eq(businesses.userId, userId)))
    .limit(1);
  return business.length > 0;
}

export async function createPageInputAction(businessId: string, data: PageInputData) {
  const session = await requireAuth();
  const userId = session.user.id;

  const isOwner = await verifyBusinessOwnership(businessId, userId);
  if (!isOwner) {
    throw new Error("Unauthorized: Business profile not found or not owned by you.");
  }

  const results = await db
    .insert(pageInputs)
    .values({
      businessId,
      platform: data.platform,
      pageUrl: data.pageUrl || null,
      handle: data.handle || null,
      bioText: data.bioText || null,
      rawPostsText: data.rawPostsText || null,
      manualNotes: data.manualNotes || null,
    })
    .returning();

  const newInput = results[0];
  if (!newInput) {
    throw new Error("Failed to save page inputs");
  }

  revalidatePath(`/businesses/${businessId}`);
  return { success: true, id: newInput.id };
}

export async function getLatestPageInputAction(businessId: string) {
  const session = await requireAuth();
  const userId = session.user.id;

  const isOwner = await verifyBusinessOwnership(businessId, userId);
  if (!isOwner) {
    throw new Error("Unauthorized: Business profile not found or not owned by you.");
  }

  const results = await db
    .select()
    .from(pageInputs)
    .where(eq(pageInputs.businessId, businessId))
    .orderBy(desc(pageInputs.createdAt))
    .limit(1);

  if (results.length === 0) {
    return null;
  }

  return results[0];
}
