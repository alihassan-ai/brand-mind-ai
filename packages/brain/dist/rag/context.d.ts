interface StoreContext {
    summary: string;
    products: string;
    orderPatterns: string;
    topSellers: string;
    recentActivity: string;
}
export declare function buildStoreContext(shopId: string): Promise<StoreContext>;
export declare function formatContextForPrompt(context: StoreContext): string;
export {};
//# sourceMappingURL=context.d.ts.map