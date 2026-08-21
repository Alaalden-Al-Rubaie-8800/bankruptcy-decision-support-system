import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { backendBaseUrl } from "@/lib/backend";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { detail: "غير مسجل الدخول" },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(`${backendBaseUrl()}/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          detail:
            data.detail ?? "تعذر تحميل بيانات الحساب",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { detail: "تعذر الاتصال بالخادم" },
      { status: 503 }
    );
  }
}

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { detail: "غير مسجل الدخول" },
      { status: 401 }
    );
  }

  const body = await request.json();

  try {
    const response = await fetch(`${backendBaseUrl()}/users/me`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      let message = "تعذر تحديث بيانات الحساب";

      if (response.status === 409) {
        message = "البريد الإلكتروني مستخدم من قبل";
      } else if (response.status === 422) {
        message = "تأكد من صحة البيانات المدخلة";
      } else if (typeof data.detail === "string") {
        message = data.detail;
      }

      return NextResponse.json(
        { detail: message },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { detail: "تعذر الاتصال بالخادم" },
      { status: 503 }
    );
  }
}