export async function readApiError(response: Response): Promise<string> {
  try {
    const body = await response.json();
    if (typeof body?.detail === "string") return body.detail;
    if (Array.isArray(body?.detail)) {
      return body.detail.map((item: { msg?: string }) => item.msg ?? "بيانات غير صالحة").join("، ");
    }
    if (typeof body?.error === "string") return body.error;
  } catch {
    // The backend may return a non-JSON error page.
  }
  return `فشل الطلب (${response.status})`;
}
