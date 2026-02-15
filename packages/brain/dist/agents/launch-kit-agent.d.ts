/**
 * Launch Kit Agent
 * Product launch strategy, copy generation, and success planning
 */
export interface LaunchKitInput {
    productName: string;
    productType: string;
    targetPrice: number;
    description?: string;
    shopId: string;
    candidateId?: string;
}
export interface LaunchStrategy {
    timing: {
        recommendedLaunch: string;
        peakMonth: string;
        reasoning: string;
    };
    channels: {
        primary: string;
        secondary: string[];
        prioritization: string;
    };
    budget: {
        suggested: number;
        breakdown: Record<string, number>;
    };
}
export interface CopyAssets {
    headline: string;
    tagline: string;
    description: string;
    emailSubject: string;
    socialPosts: string[];
}
export interface PricingStrategy {
    msrp: number;
    introPrice: number;
    introDiscountPercent: number;
    bundleOptions: Array<{
        name: string;
        products: string[];
        bundlePrice: number;
        savings: number;
    }>;
}
export declare function generateLaunchKit(input: LaunchKitInput): Promise<any>;
export declare function getLaunchKits(shopId: string): Promise<any[]>;
export declare function getLaunchKit(id: string): Promise<any | null>;
//# sourceMappingURL=launch-kit-agent.d.ts.map