/**
 * DNA Seeder
 * Auto-populates Brand DNA from Shopify data and domain analysis
 */

import { prisma } from '@brandmind/shared';

// ============================================
// TYPES
// ============================================

interface ShopifyMetrics {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  totalProducts: number;
  totalCustomers: number;
  repeatCustomerCount: number;
  topProducts: Array<{
    id: string;
    title: string;
    revenue: number;
    quantity: number;
    productType?: string;
  }>;
  productTypes: string[];
  priceRange: { min: number; max: number; avg: number };
  recentOrders: number;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
}

// ============================================
// MAIN SEEDING FUNCTION
// ============================================

export async function seedDNAFromShopify(shopId: string): Promise<void> {
  console.log(`[DNASeeder] Starting DNA seed for shop ${shopId}`);

  const metrics = await gatherShopifyMetrics(shopId);

  if (!metrics) {
    console.log(`[DNASeeder] No metrics available for shop ${shopId}`);
    return;
  }

  // Calculate derived signals
  const heroProductShare = calculateHeroProductShare(metrics);
  const top5ProductShare = calculateTop5ProductShare(metrics);
  const concentrationRisk = determineConcentrationRisk(heroProductShare);
  const orderVelocityTrend = calculateVelocityTrend(metrics);
  const pricePositioning = determinePricePositioning(metrics);
  const categoryDepth = determineCategoryDepth(metrics);
  const categoryBreadth = determineCategoryBreadth(metrics);
  const priceBands = calculatePriceBands(metrics);
  const bcgMatrix = calculateBCGMatrix(metrics);
  const revenueGrowth = calculateRevenueGrowth(metrics);
  const repeatPurchaseRate = metrics.repeatCustomerCount / Math.max(1, metrics.totalCustomers);

  // Calculate topPerformingTypes from topProducts grouped by productType
  const typeRevenue: Record<string, { revenue: number; quantity: number }> = {};
  // Filter out products with unknown/missing titles
  const validProducts = metrics.topProducts.filter(p => p.title && p.title !== 'Unknown');

  for (const product of validProducts) {
    // Use productType if set, otherwise derive from title
    let type: string = product.productType || '';
    if (!type || type === 'Other' || type === 'Uncategorized') {
      type = deriveProductTypeFromTitle(product.title);
    }
    if (!typeRevenue[type]) {
      typeRevenue[type] = { revenue: 0, quantity: 0 };
    }
    typeRevenue[type].revenue += product.revenue;
    typeRevenue[type].quantity += product.quantity;
  }

  const topPerformingTypes = Object.entries(typeRevenue)
    // Filter out generic/fallback types
    .filter(([type]) => type && type !== 'General' && type !== 'Unknown' && type !== 'Other')
    .map(([type, data]) => ({
      type,
      revenue: data.revenue,
      revenueShare: metrics.totalRevenue > 0 ? (data.revenue / metrics.totalRevenue) * 100 : 0,
      growthRate: 0, // Would need historical data
      avgOrderValue: data.quantity > 0 ? data.revenue / data.quantity : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // Build update data object
  const dnaData = {
    totalProducts: metrics.totalProducts,
    avgOrderValue: metrics.avgOrderValue,
    priceBands: priceBands,
    categoryDepth,
    categoryBreadth,
    heroProductShare,
    top5ProductShare,
    concentrationRisk,
    orderVelocityTrend,
    revenueGrowth30d: revenueGrowth,
    starProductCount: bcgMatrix.stars.length,
    cashCowProductCount: bcgMatrix.cashCows.length,
    questionMarkProductCount: bcgMatrix.questionMarks.length,
    inferredCashPosition: inferCashPosition(bcgMatrix),
    pricePositioning,
    repeatPurchaseRate,
    entryProducts: metrics.topProducts.slice(0, 3).map(p => p.title),
    topPerformingTypes,
    hasShopifyData: true,
    lastShopifySync: new Date(),
  };

  // Upsert StoreDNA using raw query to avoid type issues
  const existingDna = await prisma.storeDNA.findUnique({ where: { shopId } });

  if (existingDna) {
    await prisma.storeDNA.update({
      where: { shopId },
      data: dnaData as any,
    });
  } else {
    await prisma.storeDNA.create({
      data: {
        shopId,
        ...dnaData,
      } as any,
    });
  }

  console.log(`[DNASeeder] DNA seeded for shop ${shopId}`);
}

// ============================================
// GATHER SHOPIFY METRICS
// ============================================

async function gatherShopifyMetrics(shopId: string): Promise<ShopifyMetrics | null> {
  const [orderAgg, productAgg, customerAgg, products, recentOrdersCount] = await Promise.all([
    prisma.order.aggregate({
      where: { shopId },
      _count: true,
      _sum: { totalPrice: true },
      _avg: { totalPrice: true },
    }),
    prisma.product.aggregate({
      where: { shopId },
      _count: true,
    }),
    prisma.customer.aggregate({
      where: { shopId },
      _count: true,
    }),
    prisma.product.findMany({
      where: { shopId },
      select: {
        id: true,
        title: true,
        productType: true,
        variants: {
          select: { price: true },
        },
      },
    }),
    prisma.order.count({
      where: {
        shopId,
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    }),
  ]);

  if (orderAgg._count === 0) {
    return null;
  }

  // Get top products by revenue using line items
  const lineItemsWithRevenue = await prisma.orderLineItem.groupBy({
    by: ['productId'],
    where: {
      order: { shopId },
      productId: { not: null },
    },
    _sum: { price: true, quantity: true },
    orderBy: { _sum: { price: 'desc' } },
    take: 20,
  });

  const topProductIds = lineItemsWithRevenue.map(li => li.productId).filter(Boolean) as string[];
  const topProductDetails = await prisma.product.findMany({
    where: { id: { in: topProductIds } },
    select: { id: true, title: true, productType: true },
  });

  const topProducts = lineItemsWithRevenue
    .map(li => {
      const product = topProductDetails.find(p => p.id === li.productId);
      return {
        id: li.productId || '',
        title: product?.title || '',
        revenue: Number(li._sum.price || 0),
        quantity: Number(li._sum.quantity || 0),
        productType: product?.productType || undefined,
      };
    })
    .filter(p => p.title && p.title.length > 0); // Filter out products without titles

  // Get distinct product types
  const productTypes = [...new Set(products.map(p => p.productType).filter(Boolean))] as string[];

  // Calculate price range
  const allPrices = products.flatMap(p => p.variants.map(v => Number(v.price))).filter(p => p > 0);
  const priceRange = {
    min: allPrices.length > 0 ? Math.min(...allPrices) : 0,
    max: allPrices.length > 0 ? Math.max(...allPrices) : 0,
    avg: allPrices.length > 0 ? allPrices.reduce((a, b) => a + b, 0) / allPrices.length : 0,
  };

  // Get repeat customers
  let repeatCustomerCount = 0;
  try {
    const repeatCustomers = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM (
        SELECT "customerId"
        FROM "Order"
        WHERE "shopId" = ${shopId}
          AND "customerId" IS NOT NULL
        GROUP BY "customerId"
        HAVING COUNT(*) > 1
      ) as repeat_customers
    ` as any[];
    repeatCustomerCount = Number(repeatCustomers[0]?.count || 0);
  } catch (e) {
    repeatCustomerCount = 0;
  }

  // Get monthly revenue for trend analysis
  const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
  const orders = await prisma.order.findMany({
    where: { shopId, createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true, totalPrice: true },
  });

  const monthlyRevenue: Record<string, number> = {};
  orders.forEach(order => {
    const month = order.createdAt.toISOString().slice(0, 7);
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(order.totalPrice);
  });

  return {
    totalOrders: orderAgg._count,
    totalRevenue: Number(orderAgg._sum.totalPrice || 0),
    avgOrderValue: Number(orderAgg._avg.totalPrice || 0),
    totalProducts: productAgg._count,
    totalCustomers: customerAgg._count,
    repeatCustomerCount,
    topProducts,
    productTypes,
    priceRange,
    recentOrders: recentOrdersCount,
    monthlyRevenue: Object.entries(monthlyRevenue)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month)),
  };
}

// ============================================
// CALCULATION HELPERS
// ============================================

function calculateHeroProductShare(metrics: ShopifyMetrics): number {
  if (metrics.topProducts.length === 0 || metrics.totalRevenue === 0) return 0;
  return (metrics.topProducts[0].revenue / metrics.totalRevenue) * 100;
}

function calculateTop5ProductShare(metrics: ShopifyMetrics): number {
  if (metrics.topProducts.length === 0 || metrics.totalRevenue === 0) return 0;
  const top5Revenue = metrics.topProducts.slice(0, 5).reduce((sum, p) => sum + p.revenue, 0);
  return (top5Revenue / metrics.totalRevenue) * 100;
}

function determineConcentrationRisk(heroShare: number): 'low' | 'medium' | 'high' {
  if (heroShare > 50) return 'high';
  if (heroShare > 30) return 'medium';
  return 'low';
}

function calculateVelocityTrend(metrics: ShopifyMetrics): 'accelerating' | 'stable' | 'declining' {
  if (metrics.monthlyRevenue.length < 2) return 'stable';

  const recent = metrics.monthlyRevenue.slice(-3);
  if (recent.length < 2) return 'stable';

  const firstHalf = recent.slice(0, Math.ceil(recent.length / 2));
  const secondHalf = recent.slice(Math.ceil(recent.length / 2));

  const firstAvg = firstHalf.reduce((sum, m) => sum + m.revenue, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, m) => sum + m.revenue, 0) / secondHalf.length;

  const changePercent = ((secondAvg - firstAvg) / Math.max(1, firstAvg)) * 100;

  if (changePercent > 15) return 'accelerating';
  if (changePercent < -15) return 'declining';
  return 'stable';
}

function calculateRevenueGrowth(metrics: ShopifyMetrics): number {
  if (metrics.monthlyRevenue.length < 2) return 0;

  const lastMonth = metrics.monthlyRevenue[metrics.monthlyRevenue.length - 1]?.revenue || 0;
  const prevMonth = metrics.monthlyRevenue[metrics.monthlyRevenue.length - 2]?.revenue || 0;

  if (prevMonth === 0) return 0;
  return ((lastMonth - prevMonth) / prevMonth) * 100;
}

function determinePricePositioning(metrics: ShopifyMetrics): string {
  const avg = metrics.priceRange.avg;
  if (avg < 25) return 'budget';
  if (avg < 75) return 'mid-market';
  if (avg < 200) return 'premium';
  return 'luxury';
}

function determineCategoryDepth(metrics: ShopifyMetrics): 'shallow' | 'moderate' | 'deep' {
  const avgProductsPerType = metrics.totalProducts / Math.max(1, metrics.productTypes.length);
  if (avgProductsPerType < 5) return 'shallow';
  if (avgProductsPerType < 15) return 'moderate';
  return 'deep';
}

function determineCategoryBreadth(metrics: ShopifyMetrics): 'narrow' | 'moderate' | 'broad' {
  const typeCount = metrics.productTypes.length;
  if (typeCount <= 2) return 'narrow';
  if (typeCount <= 5) return 'moderate';
  return 'broad';
}

function calculatePriceBands(metrics: ShopifyMetrics): { low: number; mid: number; high: number } {
  const { min, max } = metrics.priceRange;
  const range = max - min;
  return {
    low: min + range * 0.33,
    mid: min + range * 0.66,
    high: max,
  };
}

function calculateBCGMatrix(metrics: ShopifyMetrics): {
  stars: string[];
  cashCows: string[];
  questionMarks: string[];
  dogs: string[];
} {
  const totalRevenue = metrics.totalRevenue;
  const avgShare = 100 / Math.max(1, metrics.topProducts.length);

  const stars: string[] = [];
  const cashCows: string[] = [];
  const questionMarks: string[] = [];
  const dogs: string[] = [];

  metrics.topProducts.forEach((product, idx) => {
    const share = (product.revenue / Math.max(1, totalRevenue)) * 100;
    const isHighShare = share > avgShare;
    const isHighGrowth = idx < 5;

    if (isHighShare && isHighGrowth) {
      stars.push(product.title);
    } else if (isHighShare && !isHighGrowth) {
      cashCows.push(product.title);
    } else if (!isHighShare && isHighGrowth) {
      questionMarks.push(product.title);
    } else {
      dogs.push(product.title);
    }
  });

  return { stars, cashCows, questionMarks, dogs };
}

function inferCashPosition(bcg: ReturnType<typeof calculateBCGMatrix>): 'cash_rich' | 'balanced' | 'tight' {
  const hasCashCows = bcg.cashCows.length > 0;
  const hasStars = bcg.stars.length > 0;
  const manyDogs = bcg.dogs.length > 5;

  if (hasCashCows && hasStars) return 'cash_rich';
  if (manyDogs && !hasCashCows) return 'tight';
  return 'balanced';
}

function deriveProductTypeFromTitle(title: string): string {
  if (!title || title === 'Unknown') return 'General';

  const lowerTitle = title.toLowerCase();

  // Common product type keywords - extend based on your catalog
  const typeKeywords: Record<string, string[]> = {
    'Haremshose': ['haremshose', 'harem pants', 'harem'],
    'Palazzo': ['palazzo', 'wide leg'],
    'Jumpsuit': ['jumpsuit', 'overall', 'einteiler'],
    'Kleid': ['kleid', 'dress'],
    'Top': ['top', 'shirt', 'bluse', 'blouse'],
    'Hose': ['hose', 'pants', 'trousers'],
    'Rock': ['rock', 'skirt'],
    'Jacke': ['jacke', 'jacket', 'cardigan'],
    'Loungewear': ['loungewear', 'lounge'],
    'Set': ['set', 'combo', 'bundle'],
  };

  for (const [type, keywords] of Object.entries(typeKeywords)) {
    for (const keyword of keywords) {
      if (lowerTitle.includes(keyword)) {
        return type;
      }
    }
  }

  // Words to skip when extracting type from title
  const skipWords = ['warme', 'warm', 'mystery', 'long', 'short', 'version', 'new', 'sale', 'special'];

  // Extract first significant word from title as fallback
  const words = title.split(/[\s\-–]+/).filter(w =>
    w.length > 3 && !skipWords.includes(w.toLowerCase())
  );

  if (words.length > 0) {
    // Capitalize first letter
    return words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
  }

  return 'General';
}

// ============================================
// SEED FROM DOMAIN ANALYSIS
// ============================================

export async function seedDNAFromDomainAnalysis(
  shopId: string,
  analysis: {
    brandName?: string;
    description?: string;
    industry?: string;
  }
): Promise<void> {
  const existingDna = await prisma.storeDNA.findUnique({ where: { shopId } });

  const dnaData = {
    brandName: analysis.brandName,
    industry: analysis.industry,
    hasPublicDemoData: true,
  };

  if (existingDna) {
    await prisma.storeDNA.update({
      where: { shopId },
      data: dnaData as any,
    });
  } else {
    await prisma.storeDNA.create({
      data: {
        shopId,
        ...dnaData,
      } as any,
    });
  }

  console.log(`[DNASeeder] Seeded DNA from domain analysis for shop ${shopId}`);
}
