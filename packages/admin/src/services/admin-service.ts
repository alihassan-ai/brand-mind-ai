import { prisma } from '@brandmind/shared';

export interface AdminStats {
  totalUsers: number;
  totalShops: number;
  totalOrders: number;
  totalProducts: number;
  activeUsers: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const [totalUsers, totalShops, totalOrders, totalProducts] = await Promise.all([
    prisma.user.count(),
    prisma.shop.count(),
    prisma.order.count(),
    prisma.product.count(),
  ]);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const activeUsers = await prisma.user.count({
    where: {
      sessions: {
        some: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      },
    },
  });

  return {
    totalUsers,
    totalShops,
    totalOrders,
    totalProducts,
    activeUsers,
  };
}

export async function getAllUsers(limit = 50, offset = 0) {
  return prisma.user.findMany({
    take: limit,
    skip: offset,
    include: {
      shops: true,
      _count: {
        select: {
          usageLogs: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      shops: {
        include: {
          _count: {
            select: {
              orders: true,
              products: true,
              customers: true,
            },
          },
        },
      },
      usageLogs: {
        take: 100,
        orderBy: { timestamp: 'desc' },
      },
    },
  });
}

export async function deleteUser(userId: string) {
  // Delete in order of dependencies
  await prisma.usageLog.deleteMany({ where: { userId } });
  await prisma.session.deleteMany({ where: { userId } });

  // Get user's shops
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { shops: true },
  });

  if (user?.shops) {
    for (const shop of user.shops) {
      await deleteShopData(shop.id);
    }
  }

  return prisma.user.delete({ where: { id: userId } });
}

async function deleteShopData(shopId: string) {
  // Delete all shop-related data
  await prisma.orderLineItem.deleteMany({
    where: { order: { shopId } },
  });
  await prisma.order.deleteMany({ where: { shopId } });
  await prisma.variant.deleteMany({
    where: { product: { shopId } },
  });
  await prisma.product.deleteMany({ where: { shopId } });
  await prisma.customer.deleteMany({ where: { shopId } });
  await prisma.refund.deleteMany({ where: { shopId } });
  await prisma.dailyMetric.deleteMany({ where: { shopId } });
  await prisma.productMetric.deleteMany({ where: { shopId } });
  await prisma.goal.deleteMany({ where: { shopId } });
  await prisma.recommendation.deleteMany({ where: { shopId } });
  await prisma.nextHitCandidate.deleteMany({ where: { shopId } });
  await prisma.shop.delete({ where: { id: shopId } });
}
