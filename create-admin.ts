
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@brandmind.ai';
    const password = 'password123';
    const hashedPassword = await hash(password, 10);

    // Create or update admin user
    const user = await prisma.user.upsert({
        where: { email },
        update: { passwordHash: hashedPassword },
        create: {
            email,
            passwordHash: hashedPassword,
            name: 'Admin User',
            role: 'admin',
        },
    });

    console.log(`✓ User created/updated: ${user.email}`);

    // Create a demo shop for the user
    const shopDomain = 'demo-store.myshopify.com';

    const shop = await prisma.shop.upsert({
        where: { shopDomain },
        update: { userId: user.id },
        create: {
            userId: user.id,
            shopDomain,
            accessToken: 'demo-token',
            onboardingComplete: true,
            currencyCode: 'USD',
        },
    });

    console.log(`✓ Shop created/updated: ${shop.shopDomain}`);

    // Create DataSufficiency record for the shop
    await prisma.dataSufficiency.upsert({
        where: { shopId: shop.id },
        update: {},
        create: {
            shopId: shop.id,
            orderCount: 0,
            productCount: 0,
            customerCount: 0,
            storeAgeDays: 0,
            dataSpanDays: 0,
            overallScore: 0,
            isSufficient: false,
            nextHitReady: false,
            seasonalityReady: false,
            customerSegmentReady: false,
            basketAffinityReady: false,
            categoryExpansionReady: false,
        },
    });

    console.log(`✓ DataSufficiency initialized`);

    // Create StoreDNA record
    await prisma.storeDNA.upsert({
        where: { shopId: shop.id },
        update: {},
        create: {
            shopId: shop.id,
            brandName: 'Demo Store',
            totalProducts: 0,
            totalVariants: 0,
            vendorConcentration: 0,
            catalogHealthScore: 50,
            customerHealthScore: 50,
            overallHealthScore: 50,
            isActionable: false,
        },
    });

    console.log(`✓ StoreDNA initialized`);

    console.log(`\n✅ Setup complete!`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Shop: ${shopDomain}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
