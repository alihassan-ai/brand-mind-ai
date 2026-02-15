import { cookies } from 'next/headers';
import { prisma } from '@brandmind/shared';

export async function getConnectedShop(): Promise<string | null> {
    const cookieStore = await cookies();
    const cookieDomain = cookieStore.get('shopify_connected_shop')?.value;
    if (cookieDomain) return cookieDomain;

    // Fallback to user session
    const shop = await getCurrentShop();
    return shop?.shopDomain || null;
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_session')?.value;

    if (!userId) return null;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { shops: true },
    });

    return user;
}

export async function getCurrentShop() {
    const user = await getCurrentUser();
    if (!user || user.shops.length === 0) return null;

    // Return the first shop (for now, single shop per user)
    return user.shops[0];
}

export async function isOnboardingComplete(): Promise<boolean> {
    const shop = await getCurrentShop();
    return shop?.onboardingComplete ?? false;
}
