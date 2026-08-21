const stages = [
  {
    title: "Load Financial Data",
    description: "Read the financial ratios submitted by the user.",
  },
  {
    title: "Validate Data",
    description: "Check that all required financial values are valid.",
  },
  {
    title: "Run Prediction Model",
    description: "Calculate the bankruptcy probability using the trained model.",
  },
  {
    title: "Explain Risk Factors",
    description: "Identify the financial indicators that influenced the prediction.",
  },
  {
    title: "Generate Recommendations",
    description: "Create preventive actions based on the detected financial risk.",
  },
  {
    title: "Generate Report",
    description: "Save the analysis results and create the decision support report.",
  },
];


export default function AgentProgress({
  running,
  completed,
}: {
  running: boolean;
  completed: boolean;
}) {
  if (!running && !completed) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">

        <div>

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">

              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21h-4v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3v-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1L7.1 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V3h4v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v4H21a1.7 1.7 0 0 0-1.6 1Z" />
              </svg>

            </div>


            <div>

              <h2 className="text-lg font-bold text-slate-950">
                AI Agent Workflow
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                End-to-end processing pipeline for the bankruptcy risk analysis.
              </p>

            </div>

          </div>

        </div>


        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${
            completed
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >

          <span
            className={`h-2 w-2 rounded-full ${
              completed
                ? "bg-emerald-500"
                : "animate-pulse bg-amber-500"
            }`}
          />

          {completed
            ? "Completed"
            : "Processing"}

        </span>

      </div>


      {/* Workflow */}
      <div className="p-5">

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">

          {stages.map(
            (
              stage,
              index
            ) => (

              <article
                key={stage.title}
                className={`relative rounded-2xl border p-4 transition ${
                  completed
                    ? "border-emerald-100 bg-emerald-50/40"
                    : "border-slate-200 bg-slate-50"
                }`}
              >

                <div className="flex items-start gap-3">

                  {/* Step Number */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                      completed
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {completed
                      ? (
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m5 12 4 4L19 6" />
                          </svg>
                        )
                      : index + 1}
                  </div>


                  <div className="min-w-0">

                    <h3 className="text-sm font-bold text-slate-900">
                      {stage.title}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {stage.description}
                    </p>

                  </div>

                </div>


                {/* Bottom Progress Line */}
                <div
                  className={`absolute bottom-0 left-0 h-1 rounded-b-2xl ${
                    completed
                      ? "w-full bg-emerald-500"
                      : "w-1/2 animate-pulse bg-amber-400"
                  }`}
                />

              </article>

            )
          )}

        </div>

      </div>

    </section>
  );
}