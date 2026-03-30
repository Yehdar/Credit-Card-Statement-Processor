export interface MetaData {
  account_holder: string | null;
  persona_title: string;
  vibe_check: string;
}

export interface StatsSummary {
  total_spent: number;
  top_category: string;
  transaction_count: number;
}

export type SlideType = "top_merchant" | "night_owl" | "big_flex";

export interface WrappedSlide {
  slide_type: SlideType;
  headline: string;
  main_stat: string;
  context: string;
}

export interface RewardsEngine {
  points_earned: number;
  missed_bag: number;
  optimization_tip: string;
}

export interface WrappedResponse {
  meta_data: MetaData;
  stats_summary: StatsSummary;
  wrapped_slides: WrappedSlide[];
  rewards_engine: RewardsEngine;
}

export interface ApiResponse {
  data?: WrappedResponse;
  error?: string;
}
