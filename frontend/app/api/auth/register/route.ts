import { NextResponse } from "next/server";
import { backendBaseUrl } from "@/lib/backend";

export async function POST(request: Request) {
  const { full_name, email, password } = await request.json();

  if (!full_name || !email || !password) {
    return NextResponse.json(
      { detail: "جميع الحقول مطلوبة" },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { detail: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${backendBaseUrl()}/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name,
        email,
        password,
      }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      let message = "تعذر إنشاء الحساب";

      if (response.status === 409) {
        message = "البريد الإلكتروني مستخدم من قبل";
      } else if (response.status === 422) {
        message = "تأكد من صحة البيانات المدخلة";
      } else if (data.detail) {
        message =
          typeof data.detail === "string"
            ? data.detail
            : message;
      }

      return NextResponse.json(
        { detail: message },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        user: {
          id: data.id,
          full_name: data.full_name,
          email: data.email,
          role: data.role,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { detail: "تعذر الاتصال بالخادم" },
      { status: 503 }
    );
  }
}