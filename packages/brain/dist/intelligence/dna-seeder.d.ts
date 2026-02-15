/**
 * DNA Seeder
 * Auto-populates Brand DNA from Shopify data and domain analysis
 */
export declare function seedDNAFromShopify(shopId: string): Promise<void>;
export declare function seedDNAFromDomainAnalysis(shopId: string, analysis: {
    brandName?: string;
    description?: string;
    industry?: string;
}): Promise<void>;
//# sourceMappingURL=dna-seeder.d.ts.map