export const RATIO_CODES = [
  "ROA", "ROE", "ROS", "L1", "L2", "L3", "ATD", "DTR", "TAT", "ITD",
  "DA", "DE", "FL", "ROI", "DIR", "DCR", "ACR", "LP", "BL", "LRR", "WAR",
] as const;

export type RatioCode = (typeof RATIO_CODES)[number];
export type RatioSet = Record<RatioCode, number>;
export type YearKey = "t_minus_3" | "t_minus_2" | "t_minus_1";

export type YearlyRatios = Record<YearKey, RatioSet>;

export interface RiskFactor {
  feature?: string;
  year_offset: string;
  ratio_code: string;
  ratio_name: string;
  category: string;
  value: number;
  median_reference?: number;
  probability_delta?: number;
}

export interface Recommendation {
  id?: string;
  title: string;
  description: string;
  priority: string;
  priority_rank?: number;
  action_category: string;
  time_horizon?: string;
  risk_level?: string;
  related_risk_factors?: RiskFactor[];
}

export interface ReportMeta {
  report_id: string;
  status: string;
  filename: string;
  view_url: string;
  download_url: string;
}

export interface AnalysisResult {
  user_id: number;
  company_id: number;
  financial_record_id: number;
  prediction_id: number;
  bankruptcy_probability: number;
  predicted_class: number;
  risk_level: string;
  explanation: string;
  top_risk_factors: RiskFactor[];
  recommendations: Recommendation[];
  report: ReportMeta;
  model_version: string;
  status: string;
  error: string | null;
}

export interface AnalysisHistoryItem {
  id: number;
  user_id: number;
  company_id: number;
  financial_record_id: number;
  prediction_id: number;
  status: string;
  created_at: string;
}
