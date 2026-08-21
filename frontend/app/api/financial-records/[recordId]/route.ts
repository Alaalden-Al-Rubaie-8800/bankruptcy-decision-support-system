import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { backendBaseUrl } from "@/lib/backend";


export async function PUT(
  request: Request,
  context: {
    params: Promise<{
      recordId: string;
    }>;
  }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { detail: "غير مسجل الدخول" },
      { status: 401 }
    );
  }

  const { recordId } = await context.params;
  const body = await request.json();

  try {
    const response = await fetch(
      `${backendBaseUrl()}/financial-records/${encodeURIComponent(recordId)}`,
      {
        method: "PUT",
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
      let message = "تعذر تعديل السجل المالي";

      if (response.status === 403) {
        message = "ليس لديك صلاحية لتعديل هذا السجل";
      } else if (response.status === 404) {
        message = "السجل المالي غير موجود";
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

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { detail: "تعذر الاتصال بالخادم" },
      { status: 503 }
    );
  }
}


export async function DELETE(
  _request: Request,
  context: {
    params: Promise<{
      recordId: string;
    }>;
  }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { detail: "غير مسجل الدخول" },
      { status: 401 }
    );
  }

  const { recordId } = await context.params;

  try {
    const response = await fetch(
      `${backendBaseUrl()}/financial-records/${encodeURIComponent(recordId)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      let message = "تعذر حذف السجل المالي";

      try {
        const data = await response.json();

        if (response.status === 403) {
          message = "ليس لديك صلاحية لحذف هذا السجل";
        } else if (response.status === 404) {
          message = "السجل المالي غير موجود";
        } else if (data?.detail) {
          message = data.detail;
        }
      } catch {
        // لا يوجد JSON في الاستجابة
      }

      return NextResponse.json(
        { detail: message },
        { status: response.status }
      );
    }

    return new Response(null, {
      status: 204,
    });
  } catch {
    return NextResponse.json(
      { detail: "تعذر الاتصال بالخادم" },
      { status: 503 }
    );
  }
}