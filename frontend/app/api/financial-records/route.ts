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
    const response = await fetch(
      `${backendBaseUrl()}/financial-records/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          detail:
            data.detail ??
            "تعذر تحميل السجلات المالية",
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


export async function POST(request: Request) {
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
    const response = await fetch(
      `${backendBaseUrl()}/financial-records/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      let message = "تعذر إنشاء السجل المالي";

      if (response.status === 400) {
        message = "يجب إنشاء بيانات الشركة أولًا";
      } else if (response.status === 409) {
        message = "يوجد سجل مالي لهذه السنة بالفعل";
      } else if (response.status === 422) {
        message = "تأكد من صحة البيانات المالية";
      } else if (data?.detail) {
        message = data.detail;
      }

      return NextResponse.json(
        { detail: message },
        { status: response.status }
      );
    }

    return NextResponse.json(
      data,
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { detail: "تعذر الاتصال بالخادم" },
      { status: 503 }
    );
  }
}