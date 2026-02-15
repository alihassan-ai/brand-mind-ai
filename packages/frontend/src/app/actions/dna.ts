"use server";

import { getConnectedShop } from "@brandmind/backend/auth/session";
import { prisma } from "@brandmind/shared";
import { seedDNAFromShopify, checkDNACompleteness, getStrategyRecommendation } from "@brandmind/brain";
import { revalidatePath } from "next/cache";

/**
 * Sync DNA from Shopify data
 * Call this after Shopify data sync or when user requests a refresh
 */
export async function syncDNA() {
  const shopDomain = await getConnectedShop();

  if (!shopDomain) {
    throw new Error("Not authenticated");
  }

  const shop = await prisma.shop.findUnique({ where: { shopDomain } });

  if (!shop) {
    throw new Error("Shop not found");
  }

  // Seed DNA from Shopify data
  await seedDNAFromShopify(shop.id);

  // Check completeness and update strategy
  await checkDNACompleteness(shop.id);
  await getStrategyRecommendation(shop.id);

  // Revalidate relevant pages
  revalidatePath("/intelligence/dna");
  revalidatePath("/nexthits");
  revalidatePath("/launch-kit");
  revalidatePath("/retention");

  return { success: true };
}

/**
 * Update a single DNA field
 */
export async function updateDNAField(field: string, value: any) {
  const shopDomain = await getConnectedShop();

  if (!shopDomain) {
    throw new Error("Not authenticated");
  }

  const shop = await prisma.shop.findUnique({ where: { shopDomain } });

  if (!shop) {
    throw new Error("Shop not found");
  }

  // Import dynamically to avoid circular deps
  const { updateDNAField: updateField } = await import("@brandmind/brain");
  await updateField(shop.id, field, value);

  // Revalidate
  revalidatePath("/intelligence/dna");
  revalidatePath("/nexthits");

  return { success: true };
}

/**
 * Get current DNA completeness status
 */
export async function getDNAStatus() {
  const shopDomain = await getConnectedShop();

  if (!shopDomain) {
    return null;
  }

  const shop = await prisma.shop.findUnique({ where: { shopDomain } });

  if (!shop) {
    return null;
  }

  const completeness = await checkDNACompleteness(shop.id);
  const strategy = await getStrategyRecommendation(shop.id);

  return {
    completeness,
    strategy,
  };
}
