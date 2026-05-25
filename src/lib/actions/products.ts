"use server";

import { db } from "@/lib/db";
import { productsServices, businesses } from "@/lib/schema";
import { requireAuth } from "@/lib/session";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type ProductInput = {
  type: string; // "product" | "service"
  name: string;
  price?: string | null;
  description: string;
  benefits: string;
  targetAudience?: string | null;
  painOrProblem?: string | null;
  orderMethod?: string | null;
  notes?: string | null;
  activeForPlanning?: boolean;
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

export async function createProductAction(businessId: string, data: ProductInput) {
  const session = await requireAuth();
  const userId = session.user.id;

  const isOwner = await verifyBusinessOwnership(businessId, userId);
  if (!isOwner) {
    throw new Error("Unauthorized: Business profile not found or not owned by you.");
  }

  const results = await db
    .insert(productsServices)
    .values({
      businessId,
      type: data.type,
      name: data.name,
      price: data.price || null,
      description: data.description,
      benefits: data.benefits,
      targetAudience: data.targetAudience || null,
      painOrProblem: data.painOrProblem || null,
      orderMethod: data.orderMethod || null,
      notes: data.notes || null,
      activeForPlanning: data.activeForPlanning ?? true,
    })
    .returning();

  const newProduct = results[0];
  if (!newProduct) {
    throw new Error("Failed to create product or service");
  }

  revalidatePath(`/businesses/${businessId}`);
  return { success: true, id: newProduct.id };
}

export async function updateProductAction(productId: string, data: Partial<ProductInput>) {
  const session = await requireAuth();
  const userId = session.user.id;

  // Retrieve the product to check business ownership
  const product = await db
    .select()
    .from(productsServices)
    .where(eq(productsServices.id, productId))
    .limit(1);

  const targetProduct = product[0];
  if (!targetProduct) {
    throw new Error("Product not found");
  }

  const businessId = targetProduct.businessId;
  const isOwner = await verifyBusinessOwnership(businessId, userId);
  if (!isOwner) {
    throw new Error("Unauthorized: Business profile not owned by you.");
  }

  const results = await db
    .update(productsServices)
    .set({
      type: data.type,
      name: data.name,
      price: data.price !== undefined ? data.price : undefined,
      description: data.description,
      benefits: data.benefits,
      targetAudience: data.targetAudience !== undefined ? data.targetAudience : undefined,
      painOrProblem: data.painOrProblem !== undefined ? data.painOrProblem : undefined,
      orderMethod: data.orderMethod !== undefined ? data.orderMethod : undefined,
      notes: data.notes !== undefined ? data.notes : undefined,
      activeForPlanning: data.activeForPlanning !== undefined ? data.activeForPlanning : undefined,
      updatedAt: new Date(),
    })
    .where(eq(productsServices.id, productId))
    .returning();

  const updated = results[0];
  if (!updated) {
    throw new Error("Failed to update product or service");
  }

  revalidatePath(`/businesses/${businessId}`);
  return { success: true, id: updated.id };
}

export async function deleteProductAction(productId: string) {
  const session = await requireAuth();
  const userId = session.user.id;

  // Retrieve the product to check business ownership
  const product = await db
    .select()
    .from(productsServices)
    .where(eq(productsServices.id, productId))
    .limit(1);

  const targetProduct = product[0];
  if (!targetProduct) {
    throw new Error("Product not found");
  }

  const businessId = targetProduct.businessId;
  const isOwner = await verifyBusinessOwnership(businessId, userId);
  if (!isOwner) {
    throw new Error("Unauthorized: Business profile not owned by you.");
  }

  await db
    .delete(productsServices)
    .where(eq(productsServices.id, productId));

  revalidatePath(`/businesses/${businessId}`);
  return { success: true };
}

export async function toggleProductActiveAction(productId: string, active: boolean) {
  const session = await requireAuth();
  const userId = session.user.id;

  const product = await db
    .select()
    .from(productsServices)
    .where(eq(productsServices.id, productId))
    .limit(1);

  const targetProduct = product[0];
  if (!targetProduct) {
    throw new Error("Product not found");
  }

  const businessId = targetProduct.businessId;
  const isOwner = await verifyBusinessOwnership(businessId, userId);
  if (!isOwner) {
    throw new Error("Unauthorized: Business profile not owned by you.");
  }

  await db
    .update(productsServices)
    .set({
      activeForPlanning: active,
      updatedAt: new Date(),
    })
    .where(eq(productsServices.id, productId));

  revalidatePath(`/businesses/${businessId}`);
  return { success: true };
}

export async function getProductServicesAction(businessId: string) {
  const session = await requireAuth();
  const userId = session.user.id;

  const isOwner = await verifyBusinessOwnership(businessId, userId);
  if (!isOwner) {
    throw new Error("Unauthorized: Business profile not found or not owned by you.");
  }

  const results = await db
    .select()
    .from(productsServices)
    .where(eq(productsServices.businessId, businessId));

  return results;
}
