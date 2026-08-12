import { backendFetch } from "@/lib/backend";

export async function GET(_request: Request, context: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await context.params;
  const response = await backendFetch(`/analysis/reports/${encodeURIComponent(reportId)}`);
  const body = await response.arrayBuffer();
  return new Response(body, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("content-type") ?? "text/html; charset=utf-8" },
  });
}
