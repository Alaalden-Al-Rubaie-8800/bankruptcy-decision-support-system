import { RATIO_CODES, RatioCode, RatioSet, YearKey, YearlyRatios } from "@/types/analysis";

export const ratioLabels: Record<RatioCode, string> = {
  ROA: "العائد على الأصول", ROE: "العائد على حقوق الملكية", ROS: "هامش العائد على المبيعات",
  L1: "نسبة السيولة L1", L2: "النسبة السريعة L2", L3: "نسبة السيولة L3",
  ATD: "أيام دوران الأصول", DTR: "أيام تحصيل الذمم", TAT: "دوران إجمالي الأصول",
  ITD: "أيام دوران المخزون", DA: "الدين إلى الأصول", DE: "الدين إلى حقوق الملكية",
  FL: "الرافعة المالية", ROI: "العائد على الاستثمار", DIR: "نسبة عبء الدين",
  DCR: "تغطية خدمة الدين", ACR: "تغطية الأصول", LP: "مؤشر السيولة/الربحية",
  BL: "عبء الاقتراض", LRR: "معدل الاحتياطي للسيولة", WAR: "مؤشر رأس المال العامل",
};

export const yearLabels: Record<YearKey, string> = {
  t_minus_3: "السنة الأقدم (t-3)",
  t_minus_2: "السنة السابقة (t-2)",
  t_minus_1: "أحدث سنة (t-1)",
};

export function emptyRatioSet(): RatioSet {
  return Object.fromEntries(RATIO_CODES.map((code) => [code, 0])) as RatioSet;
}

export function emptyYearlyRatios(): YearlyRatios {
  return { t_minus_3: emptyRatioSet(), t_minus_2: emptyRatioSet(), t_minus_1: emptyRatioSet() };
}

export function validateYearlyRatios(data: YearlyRatios): string[] {
  const errors: string[] = [];
  (Object.keys(data) as YearKey[]).forEach((year) => {
    RATIO_CODES.forEach((code) => {
      const value = data[year][code];
      if (!Number.isFinite(value)) errors.push(`${yearLabels[year]}: ${code} غير صالح`);
    });
  });
  return errors;
}
