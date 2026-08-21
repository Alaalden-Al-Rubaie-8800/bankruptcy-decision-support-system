import {
  RATIO_CODES,
  RatioCode,
  RatioSet,
  YearKey,
  YearlyRatios,
} from "@/types/analysis";

export const ratioLabels: Record<RatioCode, string> = {
  ROA: "Return on Assets",
  ROE: "Return on Equity",
  ROS: "Return on Sales",

  L1: "Liquidity Ratio L1",
  L2: "Quick Ratio L2",
  L3: "Liquidity Ratio L3",

  ATD: "Asset Turnover Days",
  DTR: "Receivables Collection Days",
  TAT: "Total Asset Turnover",

  ITD: "Inventory Turnover Days",
  DA: "Debt to Assets",
  DE: "Debt to Equity",

  FL: "Financial Leverage",
  ROI: "Return on Investment",
  DIR: "Debt Burden Ratio",

  DCR: "Debt Service Coverage",
  ACR: "Asset Coverage",
  LP: "Liquidity / Profitability Indicator",

  BL: "Borrowing Burden",
  LRR: "Liquidity Reserve Ratio",
  WAR: "Working Capital Indicator",
};

export const yearLabels: Record<YearKey, string> = {
  t_minus_3: "Year 1 (t-3)",
  t_minus_2: "Year 2 (t-2)",
  t_minus_1: "Year 3 (t-1)",
};

export function emptyRatioSet(): RatioSet {
  return Object.fromEntries(
    RATIO_CODES.map((code) => [code, Number.NaN])
  ) as RatioSet;
}

export function emptyYearlyRatios(): YearlyRatios {
  return {
    t_minus_3: emptyRatioSet(),
    t_minus_2: emptyRatioSet(),
    t_minus_1: emptyRatioSet(),
  };
}

export function validateYearlyRatios(
  data: YearlyRatios
): string[] {
  const errors: string[] = [];

  (Object.keys(data) as YearKey[]).forEach((year) => {
    RATIO_CODES.forEach((code) => {
      const value = data[year][code];

      if (!Number.isFinite(value)) {
        errors.push(
          `${yearLabels[year]}: ${code} contains an invalid value.`
        );
      }
    });
  });

  return errors;
}