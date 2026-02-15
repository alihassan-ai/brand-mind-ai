// Common types used across packages

export interface ShopContext {
  shopId: string;
  shopDomain: string;
  accessToken: string;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface PaginationOptions {
  limit?: number;
  cursor?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ScoringWeights {
  storeFit: number;
  gapFill: number;
  trendScore: number;
  marginPotential: number;
  competitionLevel: number;
  seasonalAlignment: number;
}

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  storeFit: 0.25,
  gapFill: 0.20,
  trendScore: 0.15,
  marginPotential: 0.15,
  competitionLevel: 0.10,
  seasonalAlignment: 0.15,
};
