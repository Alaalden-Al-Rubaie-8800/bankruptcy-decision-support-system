const stages = [
  "تحميل البيانات المالية",
  "التحقق من البيانات",
  "تشغيل نموذج التنبؤ",
  "تفسير عوامل الخطر",
  "توليد التوصيات الوقائية",
  "إنشاء التقرير وحفظ النتائج",
];

export default function AgentProgress({ running, completed }: { running: boolean; completed: boolean }) {
  if (!running && !completed) return null;
  return (
    <section className="card">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="section-title">دورة عمل الوكيل الذكي</h2>
        <span className={`status-chip ${completed ? "status-ok" : "status-running"}`}>{completed ? "اكتمل" : "قيد التنفيذ"}</span>
      </div>
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {stages.map((stage) => (
          <div key={stage} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
            <span className={`h-2.5 w-2.5 rounded-full ${completed ? "bg-emerald-500" : "animate-pulse bg-amber-500"}`} />
            {stage}
          </div>
        ))}
      </div>
    </section>
  );
}
