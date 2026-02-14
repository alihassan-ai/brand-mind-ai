module.exports = [
"[project]/packages/brain/src/index.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "DecisionEngine",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$decision$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DecisionEngine"],
    "EngineModule",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$decision$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EngineModule"],
    "EvidenceCollector",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$evidence$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EvidenceCollector"],
    "SCORING_VERSION",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$deterministic$2d$scorer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SCORING_VERSION"],
    "SCORING_WEIGHTS",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$deterministic$2d$scorer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SCORING_WEIGHTS"],
    "STRATEGY_INFO",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$strategy$2d$router$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["STRATEGY_INFO"],
    "aggregateDailyMetrics",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$metrics$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["aggregateDailyMetrics"],
    "aggregateProductMetrics",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$metrics$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["aggregateProductMetrics"],
    "analyzeCustomerCohorts",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$insights$2d$engine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["analyzeCustomerCohorts"],
    "analyzeOutcomes",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$outcome$2d$tracker$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["analyzeOutcomes"],
    "analyzePriceBands",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$store$2d$dna$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["analyzePriceBands"],
    "analyzeProductTypePerformance",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$store$2d$dna$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["analyzeProductTypePerformance"],
    "analyzePublicDomain",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$public$2d$analyzer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["analyzePublicDomain"],
    "analyzeSeasonality",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$store$2d$dna$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["analyzeSeasonality"],
    "analyzeVendorPerformance",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$store$2d$dna$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["analyzeVendorPerformance"],
    "askTheBusiness",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$orchestrator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["askTheBusiness"],
    "backfillDailyMetrics",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$metrics$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["backfillDailyMetrics"],
    "buildStoreContext",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$rag$2f$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["buildStoreContext"],
    "calculateCatalogHealth",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$insights$2d$engine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["calculateCatalogHealth"],
    "calculateConfidence",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$evidence$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["calculateConfidence"],
    "calculateDataQuality",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$evidence$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["calculateDataQuality"],
    "calculateExecutiveKPIs",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$executive$2d$dashboard$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["calculateExecutiveKPIs"],
    "calculateProductVelocities",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$store$2d$dna$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["calculateProductVelocities"],
    "calculateRFM",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$agents$2f$retention$2d$agent$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["calculateRFM"],
    "canUseFeature",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$data$2d$sufficiency$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["canUseFeature"],
    "checkDNACompleteness",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$dna$2d$completeness$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkDNACompleteness"],
    "checkDataSufficiency",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$data$2d$sufficiency$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkDataSufficiency"],
    "compileBrandDNA",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$compiler$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["compileBrandDNA"],
    "computeStoreDNA",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$store$2d$dna$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["computeStoreDNA"],
    "detectAllGaps",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$gap$2d$detector$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["detectAllGaps"],
    "detectCannibalization",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$insights$2d$engine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["detectCannibalization"],
    "detectCategoryGaps",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$gap$2d$detector$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["detectCategoryGaps"],
    "detectPriceGaps",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$gap$2d$detector$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["detectPriceGaps"],
    "detectSeasonalGaps",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$gap$2d$detector$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["detectSeasonalGaps"],
    "detectVariantGaps",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$gap$2d$detector$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["detectVariantGaps"],
    "determineExpansionStrategy",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$strategy$2d$router$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["determineExpansionStrategy"],
    "explainRecommendation",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$orchestrator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["explainRecommendation"],
    "fetchTrendsForStore",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$trends$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchTrendsForStore"],
    "findEntryProducts",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$store$2d$dna$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["findEntryProducts"],
    "findMarketingMoments",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$insights$2d$engine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["findMarketingMoments"],
    "formatContextForPrompt",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$rag$2f$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatContextForPrompt"],
    "generateBrandSystemPrompt",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$compiler$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generateBrandSystemPrompt"],
    "generateCandidates",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$candidate$2d$generator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generateCandidates"],
    "generateExecutiveBrief",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$executive$2d$dashboard$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generateExecutiveBrief"],
    "generateLaunchKit",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$agents$2f$launch$2d$kit$2d$agent$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generateLaunchKit"],
    "generateRetentionInsights",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$agents$2f$retention$2d$agent$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generateRetentionInsights"],
    "getDataSufficiency",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$data$2d$sufficiency$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDataSufficiency"],
    "getInsufficientDataResponse",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$evidence$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getInsufficientDataResponse"],
    "getLaunchHistory",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$outcome$2d$tracker$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getLaunchHistory"],
    "getLaunchKit",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$agents$2f$launch$2d$kit$2d$agent$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getLaunchKit"],
    "getLaunchKits",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$agents$2f$launch$2d$kit$2d$agent$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getLaunchKits"],
    "getPatternInsights",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$insights$2d$engine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPatternInsights"],
    "getPriceAlerts",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$insights$2d$engine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPriceAlerts"],
    "getRetentionSummary",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$agents$2f$retention$2d$agent$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRetentionSummary"],
    "getSeasonalCalendar",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$insights$2d$engine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSeasonalCalendar"],
    "getStrategyRecommendation",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$strategy$2d$router$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStrategyRecommendation"],
    "getTopProducts",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$metrics$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTopProducts"],
    "getTopTrends",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$trends$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTopTrends"],
    "getTrendData",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$trends$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTrendData"],
    "gradeProducts",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$insights$2d$engine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["gradeProducts"],
    "predictRestocks",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$insights$2d$engine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["predictRestocks"],
    "recordLaunchDecision",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$outcome$2d$tracker$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["recordLaunchDecision"],
    "recordLaunchPerformance",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$outcome$2d$tracker$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["recordLaunchPerformance"],
    "recordLessonsLearned",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$outcome$2d$tracker$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["recordLessonsLearned"],
    "researchNewProducts",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$product$2d$research$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["researchNewProducts"],
    "runBackgroundAnalysis",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$background$2d$analyzer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["runBackgroundAnalysis"],
    "runDeepAnalysis",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$deep$2d$analyzer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["runDeepAnalysis"],
    "runProductResearch",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$product$2d$research$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["runProductResearch"],
    "scoreAndFilterCandidates",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$candidate$2d$scorer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["scoreAndFilterCandidates"],
    "scoreCandidate",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$deterministic$2d$scorer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["scoreCandidate"],
    "scoreCandidateWithAudit",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$deterministic$2d$scorer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["scoreCandidateWithAudit"],
    "scoreCandidates",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$deterministic$2d$scorer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["scoreCandidates"],
    "seedDNAFromDomainAnalysis",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$dna$2d$seeder$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["seedDNAFromDomainAnalysis"],
    "seedDNAFromShopify",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$dna$2d$seeder$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["seedDNAFromShopify"],
    "suggestBundles",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$insights$2d$engine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["suggestBundles"],
    "suggestWeightAdjustments",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$outcome$2d$tracker$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["suggestWeightAdjustments"],
    "updateDNAField",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$dna$2d$completeness$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateDNAField"],
    "validateClaim",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$evidence$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateClaim"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/brain/src/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$store$2d$dna$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/intelligence/store-dna.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$gap$2d$detector$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/intelligence/gap-detector.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$trends$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/intelligence/trends.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$evidence$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/intelligence/evidence.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$public$2d$analyzer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/intelligence/public-analyzer.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$product$2d$research$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/intelligence/product-research.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$data$2d$sufficiency$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/intelligence/data-sufficiency.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$dna$2d$completeness$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/intelligence/dna-completeness.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$strategy$2d$router$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/intelligence/strategy-router.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$dna$2d$seeder$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/intelligence/dna-seeder.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$intelligence$2f$insights$2d$engine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/intelligence/insights-engine.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$agents$2f$launch$2d$kit$2d$agent$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/agents/launch-kit-agent.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$agents$2f$retention$2d$agent$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/agents/retention-agent.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$deterministic$2d$scorer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/nexthit/deterministic-scorer.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$candidate$2d$generator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/nexthit/candidate-generator.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$candidate$2d$scorer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/nexthit/candidate-scorer.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$deep$2d$analyzer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/nexthit/deep-analyzer.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$background$2d$analyzer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/nexthit/background-analyzer.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$nexthit$2f$outcome$2d$tracker$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/nexthit/outcome-tracker.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$metrics$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/engine/metrics.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$orchestrator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/engine/orchestrator.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$decision$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/engine/decision.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$executive$2d$dashboard$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/engine/executive-dashboard.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$rag$2f$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/rag/context.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$compiler$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/brain/src/compiler.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$metrics$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$orchestrator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$executive$2d$dashboard$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$metrics$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$orchestrator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$brain$2f$src$2f$engine$2f$executive$2d$dashboard$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];