import { NextResponse } from "next/server";

import { backendFetch } from "@/lib/backend";


export async function PUT(
  request: Request,
  context: {
    params: Promise<{
      userId: string;
    }>;
  }
) {
  const { userId } = await context.params;
  const body = await request.json();

  try {
    const response = await backendFetch(
      `/users/${encodeURIComponent(userId)}`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      let message = "تعذر تحديث المستخدم";

      if (response.status === 401) {
        message = "غير مسجل الدخول";
      } else if (response.status === 403) {
        message = "هذه العملية متاحة للإداري فقط";
      } else if (response.status === 404) {
        message = "المستخدم غير موجود";
      } else if (response.status === 409) {
        message = "البريد الإلكتروني مستخدم من قبل";
      } else if (response.status === 422) {
        message = "تأكد من صحة البيانات";
      } else if (typeof data?.detail === "string") {
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
      userId: string;
    }>;
  }
) {
  const { userId } = await context.params;

  try {
    const response = await backendFetch(
      `/users/${encodeURIComponent(userId)}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      let message = "تعذر حذف المستخدم";

      try {
        const data = await response.json();

        if (response.status === 401) {
          message = "غير مسجل الدخول";
        } else if (response.status === 403) {
          message = "هذه العملية متاحة للإداري فقط";
        } else if (response.status === 404) {
          message = "المستخدم غير موجود";
        } else if (typeof data?.detail === "string") {
          message = data.detail;
        }
      } catch {
        // لا توجد استجابة JSON
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