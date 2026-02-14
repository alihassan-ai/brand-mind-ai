/**
 * DNA Completeness Checker
 * Identifies missing fields in Brand DNA and prompts users to fill them
 */

import { prisma } from '@brandmind/shared';
import { Prisma } from '@prisma/client';

// ============================================
// TYPES
// ============================================

export interface MissingField {
    field: string;
    section: 'identity' | 'marketPosition' | 'operationalDNA' | 'customerDNA';
    importance: 'critical' | 'important' | 'nice_to_have';
    question: string;
    inputType: 'text' | 'select' | 'multiselect' | 'number' | 'textarea';
    options?: Array<{ label: string; value: string } | string>;
    placeholder?: string;
    helpText?: string;
}

export interface SectionCompleteness {
    score: number;
    filledFields: number;
    totalFields: number;
    missingCritical: string[];
    missingImportant: string[];
    missingOptional: string[];
}

export interface CompletenessResult {
    overallScore: number;
    isActionable: boolean;
    sections: {
        identity: SectionCompleteness;
        marketPosition: SectionCompleteness;
        operationalDNA: SectionCompleteness;
        customerDNA: SectionCompleteness;
    };
    userActionRequired: MissingField[];
    dataRequired: Array<{
        field: string;
        section: string;
        source: string;
        message: string;
        action: string;
    }>;
}

// ============================================
// FIELD DEFINITIONS
// ============================================

const IDENTITY_FIELDS: Array<{
    field: string;
    importance: MissingField['importance'];
    question: string;
    inputType: MissingField['inputType'];
    options?: MissingField['options'];
    placeholder?: string;
    helpText?: string;
}> = [
    {
        field: 'brandName',
        importance: 'critical',
        question: 'What is your brand name?',
        inputType: 'text',
        placeholder: 'e.g., Nike, Glossier, Allbirds',
    },
    {
        field: 'mission',
        importance: 'important',
        question: 'What is your brand mission?',
        inputType: 'textarea',
        placeholder: 'e.g., To bring sustainable fashion to everyone',
        helpText: 'This helps us suggest products aligned with your values',
    },
    {
        field: 'coreValues',
        importance: 'important',
        question: "What are your brand's core values?",
        inputType: 'multiselect',
        options: [
            'Quality', 'Sustainability', 'Innovation', 'Affordability',
            'Luxury', 'Authenticity', 'Community', 'Simplicity', 'Craftsmanship',
            'Transparency', 'Inclusivity', 'Wellness', 'Creativity',
        ],
        helpText: 'Select 3-5 values that define your brand',
    },
    {
        field: 'targetAudience',
        importance: 'critical',
        question: 'Who is your primary customer?',
        inputType: 'select',
        options: [
            { label: 'Women 18-24', value: 'women_18_24' },
            { label: 'Women 25-34', value: 'women_25_34' },
            { label: 'Women 35-44', value: 'women_35_44' },
            { label: 'Women 45+', value: 'women_45_plus' },
            { label: 'Men 18-24', value: 'men_18_24' },
            { label: 'Men 25-34', value: 'men_25_34' },
            { label: 'Men 35-44', value: 'men_35_44' },
            { label: 'Men 45+', value: 'men_45_plus' },
            { label: 'All genders 18-34', value: 'all_18_34' },
            { label: 'All genders 35+', value: 'all_35_plus' },
            { label: 'Families', value: 'families' },
            { label: 'Businesses (B2B)', value: 'b2b' },
        ],
        helpText: 'This shapes what products we recommend',
    },
    {
        field: 'brandPersonality',
        importance: 'nice_to_have',
        question: 'How would you describe your brand personality?',
        inputType: 'multiselect',
        options: [
            'Bold', 'Minimalist', 'Playful', 'Sophisticated', 'Edgy',
            'Classic', 'Modern', 'Warm', 'Professional', 'Adventurous',
        ],
        helpText: 'Select 2-4 traits that describe your brand',
    },
];

const MARKET_POSITION_FIELDS: typeof IDENTITY_FIELDS = [
    {
        field: 'industry',
        importance: 'critical',
        question: 'What industry are you in?',
        inputType: 'select',
        options: [
            { label: 'Fashion & Apparel', value: 'fashion' },
            { label: 'Beauty & Cosmetics', value: 'beauty' },
            { label: 'Home & Living', value: 'home' },
            { label: 'Food & Beverage', value: 'food' },
            { label: 'Health & Wellness', value: 'health' },
            { label: 'Electronics & Tech', value: 'electronics' },
            { label: 'Sports & Outdoors', value: 'sports' },
            { label: 'Kids & Baby', value: 'kids' },
            { label: 'Pets', value: 'pets' },
            { label: 'Jewelry & Accessories', value: 'jewelry' },
            { label: 'Art & Crafts', value: 'art' },
            { label: 'Other', value: 'other' },
        ],
    },
    {
        field: 'niche',
        importance: 'important',
        question: 'What is your specific niche?',
        inputType: 'text',
        placeholder: 'e.g., Sustainable yoga wear, Minimalist home decor',
        helpText: 'Be specific - this helps us find your unique opportunities',
    },
    {
        field: 'pricePositioning',
        importance: 'critical',
        question: 'How would you describe your price positioning?',
        inputType: 'select',
        options: [
            { label: 'Budget - Lowest prices in market', value: 'budget' },
            { label: 'Mid-Market - Competitive pricing', value: 'mid-market' },
            { label: 'Premium - Higher quality, higher price', value: 'premium' },
            { label: 'Luxury - Highest tier', value: 'luxury' },
        ],
    },
    {
        field: 'competitiveDifferentiator',
        importance: 'important',
        question: 'What makes you different from competitors?',
        inputType: 'textarea',
        placeholder: 'e.g., We use 100% recycled materials and donate 5% to ocean cleanup',
        helpText: 'Your unique selling proposition',
    },
    {
        field: 'directCompetitors',
        importance: 'nice_to_have',
        question: 'Who are your top 3 competitors?',
        inputType: 'text',
        placeholder: 'e.g., Lululemon, Athleta, Outdoor Voices',
        helpText: 'Helps us understand your competitive landscape',
    },
];

// ============================================
// MAIN FUNCTION
// ============================================

export async function checkDNACompleteness(shopId: string): Promise<CompletenessResult> {
    const dna = await prisma.storeDNA.findUnique({
        where: { shopId },
    });

    const userActionRequired: MissingField[] = [];
    const dataRequired: CompletenessResult['dataRequired'] = [];

    // ═══════════════════════════════════════════════════════════════
    // CHECK IDENTITY FIELDS
    // ═══════════════════════════════════════════════════════════════
    const identityMissingCritical: string[] = [];
    const identityMissingImportant: string[] = [];
    const identityMissingOptional: string[] = [];
    let identityFilled = 0;

    for (const fieldDef of IDENTITY_FIELDS) {
        const value = dna?.[fieldDef.field as keyof typeof dna];
        const isEmpty = !value || (Array.isArray(value) && value.length === 0) ||
            (typeof value === 'string' && value.trim() === '');

        if (isEmpty) {
            userActionRequired.push({
                field: fieldDef.field,
                section: 'identity',
                importance: fieldDef.importance,
                question: fieldDef.question,
                inputType: fieldDef.inputType,
                options: fieldDef.options,
                placeholder: fieldDef.placeholder,
                helpText: fieldDef.helpText,
            });

            if (fieldDef.importance === 'critical') identityMissingCritical.push(fieldDef.field);
            else if (fieldDef.importance === 'important') identityMissingImportant.push(fieldDef.field);
            else identityMissingOptional.push(fieldDef.field);
        } else {
            identityFilled++;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // CHECK MARKET POSITION FIELDS
    // ═══════════════════════════════════════════════════════════════
    const marketMissingCritical: string[] = [];
    const marketMissingImportant: string[] = [];
    const marketMissingOptional: string[] = [];
    let marketFilled = 0;

    for (const fieldDef of MARKET_POSITION_FIELDS) {
        const value = dna?.[fieldDef.field as keyof typeof dna];
        const isEmpty = !value || (Array.isArray(value) && value.length === 0) ||
            (typeof value === 'string' && value.trim() === '');

        if (isEmpty) {
            userActionRequired.push({
                field: fieldDef.field,
                section: 'marketPosition',
                importance: fieldDef.importance,
                question: fieldDef.question,
                inputType: fieldDef.inputType,
                options: fieldDef.options,
                placeholder: fieldDef.placeholder,
                helpText: fieldDef.helpText,
            });

            if (fieldDef.importance === 'critical') marketMissingCritical.push(fieldDef.field);
            else if (fieldDef.importance === 'important') marketMissingImportant.push(fieldDef.field);
            else marketMissingOptional.push(fieldDef.field);
        } else {
            marketFilled++;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // CHECK OPERATIONAL DNA (From Shopify - can't be manually filled)
    // ═══════════════════════════════════════════════════════════════
    const operationalMissingCritical: string[] = [];
    let operationalFilled = 0;
    const operationalTotal = 5; // Key operational metrics

    if (!dna?.avgOrderValue) {
        operationalMissingCritical.push('avgOrderValue');
        dataRequired.push({
            field: 'avgOrderValue',
            section: 'operationalDNA',
            source: 'shopify_orders',
            message: 'Average order value requires order data',
            action: 'Ensure your store has at least 10 orders for accurate analysis',
        });
    } else {
        operationalFilled++;
    }

    if (!dna?.priceBands) {
        operationalMissingCritical.push('priceBands');
        dataRequired.push({
            field: 'priceBands',
            section: 'operationalDNA',
            source: 'shopify_orders',
            message: 'Price band analysis requires order history',
            action: 'More orders will improve price intelligence',
        });
    } else {
        operationalFilled++;
    }

    if (!dna?.totalProducts || dna.totalProducts < 5) {
        operationalMissingCritical.push('catalogStructure');
        dataRequired.push({
            field: 'catalogStructure',
            section: 'operationalDNA',
            source: 'shopify_products',
            message: 'Catalog analysis requires more products',
            action: 'Add at least 5 products for meaningful catalog insights',
        });
    } else {
        operationalFilled++;
    }

    if (!dna?.seasonalityCurve) {
        dataRequired.push({
            field: 'seasonality',
            section: 'operationalDNA',
            source: 'shopify_orders',
            message: 'Seasonality requires 6+ months of data',
            action: 'Seasonality patterns will emerge over time',
        });
    } else {
        operationalFilled++;
    }

    if (!dna?.heroProductShare) {
        dataRequired.push({
            field: 'revenueConcentration',
            section: 'operationalDNA',
            source: 'shopify_orders',
            message: 'Revenue concentration requires sales data',
            action: 'More orders will reveal product performance patterns',
        });
    } else {
        operationalFilled++;
    }

    // ═══════════════════════════════════════════════════════════════
    // CHECK CUSTOMER DNA (From Shopify - can't be manually filled)
    // ═══════════════════════════════════════════════════════════════
    const customerMissingCritical: string[] = [];
    let customerFilled = 0;
    const customerTotal = 4;

    if (!dna?.repeatPurchaseRate) {
        customerMissingCritical.push('repeatPurchaseRate');
        dataRequired.push({
            field: 'repeatPurchaseRate',
            section: 'customerDNA',
            source: 'shopify_orders',
            message: 'Repeat purchase analysis requires order history',
            action: 'Need at least 50 orders to calculate repeat patterns',
        });
    } else {
        customerFilled++;
    }

    if (!dna?.basketAffinities) {
        dataRequired.push({
            field: 'basketAffinities',
            section: 'customerDNA',
            source: 'shopify_orders',
            message: 'Basket affinity requires multi-item orders',
            action: 'Need orders with multiple products to identify buying patterns',
        });
    } else {
        customerFilled++;
    }

    if (!dna?.segmentDistribution) {
        dataRequired.push({
            field: 'customerSegments',
            section: 'customerDNA',
            source: 'shopify_customers',
            message: 'Customer segmentation requires customer data',
            action: 'Need at least 50 customers for meaningful segments',
        });
    } else {
        customerFilled++;
    }

    if (!dna?.entryProducts) {
        dataRequired.push({
            field: 'entryProducts',
            section: 'customerDNA',
            source: 'shopify_orders',
            message: 'Entry product analysis requires first-purchase data',
            action: 'More customer purchase data will reveal entry points',
        });
    } else {
        customerFilled++;
    }

    // ═══════════════════════════════════════════════════════════════
    // CALCULATE SCORES
    // ═══════════════════════════════════════════════════════════════
    const identityTotal = IDENTITY_FIELDS.length;
    const marketTotal = MARKET_POSITION_FIELDS.length;

    const identityScore = Math.round((identityFilled / identityTotal) * 100);
    const marketScore = Math.round((marketFilled / marketTotal) * 100);
    const operationalScore = Math.round((operationalFilled / operationalTotal) * 100);
    const customerScore = Math.round((customerFilled / customerTotal) * 100);

    // Overall score weighted: Identity & Market more important for user input
    const overallScore = Math.round(
        (identityScore * 0.30) +
        (marketScore * 0.25) +
        (operationalScore * 0.30) +
        (customerScore * 0.15)
    );

    // Can make predictions if critical identity + market + some operational data
    const hasCriticalIdentity = identityMissingCritical.length === 0;
    const hasCriticalMarket = marketMissingCritical.length === 0;
    const hasMinimalOperational = operationalFilled >= 2;
    const isActionable = hasCriticalIdentity && hasCriticalMarket && hasMinimalOperational;

    // Sort user actions by importance
    userActionRequired.sort((a, b) => {
        const order = { critical: 0, important: 1, nice_to_have: 2 };
        return order[a.importance] - order[b.importance];
    });

    const result: CompletenessResult = {
        overallScore,
        isActionable,
        sections: {
            identity: {
                score: identityScore,
                filledFields: identityFilled,
                totalFields: identityTotal,
                missingCritical: identityMissingCritical,
                missingImportant: identityMissingImportant,
                missingOptional: identityMissingOptional,
            },
            marketPosition: {
                score: marketScore,
                filledFields: marketFilled,
                totalFields: marketTotal,
                missingCritical: marketMissingCritical,
                missingImportant: marketMissingImportant,
                missingOptional: marketMissingOptional,
            },
            operationalDNA: {
                score: operationalScore,
                filledFields: operationalFilled,
                totalFields: operationalTotal,
                missingCritical: operationalMissingCritical,
                missingImportant: [],
                missingOptional: [],
            },
            customerDNA: {
                score: customerScore,
                filledFields: customerFilled,
                totalFields: customerTotal,
                missingCritical: customerMissingCritical,
                missingImportant: [],
                missingOptional: [],
            },
        },
        userActionRequired,
        dataRequired,
    };

    // ═══════════════════════════════════════════════════════════════
    // SAVE TO DNA
    // ═══════════════════════════════════════════════════════════════
    if (dna) {
        await prisma.storeDNA.update({
            where: { shopId },
            data: {
                completenessScore: overallScore,
                isActionable,
                missingFields: userActionRequired as unknown as Prisma.InputJsonValue,
                dataBlockers: dataRequired as unknown as Prisma.InputJsonValue,
            },
        });
    }

    console.log(`[DNACompleteness] Shop ${shopId}: ${overallScore}% complete, Actionable: ${isActionable}, Missing fields: ${userActionRequired.length}`);

    return result;
}

// ============================================
// UPDATE DNA FIELD
// ============================================

export async function updateDNAField(shopId: string, field: string, value: any): Promise<void> {
    const updateData: Record<string, any> = {};

    // Handle special cases for JSON fields
    if (field === 'targetAudience' && typeof value === 'string') {
        updateData[field] = { primaryDemographic: value };
    } else if (field === 'coreValues' || field === 'brandPersonality' || field === 'directCompetitors') {
        // Convert comma-separated string to array if needed
        updateData[field] = Array.isArray(value) ? value : value.split(',').map((s: string) => s.trim()).filter(Boolean);
    } else {
        updateData[field] = value;
    }

    await prisma.storeDNA.upsert({
        where: { shopId },
        update: updateData,
        create: {
            shopId,
            ...updateData,
        },
    });

    console.log(`[DNACompleteness] Updated ${field} for shop ${shopId}`);

    // Recheck completeness
    await checkDNACompleteness(shopId);
}
