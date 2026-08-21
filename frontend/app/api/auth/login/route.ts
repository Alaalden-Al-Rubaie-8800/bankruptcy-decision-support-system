import { NextResponse } from "next/server";
import { backendBaseUrl } from "@/lib/backend";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { detail: "البريد وكلمة المرور مطلوبان" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${backendBaseUrl()}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { detail: data.detail ?? "فشل تسجيل الدخول" },
        { status: response.status }
      );
    }

    const result = NextResponse.json({ ok: true });

    result.cookies.set("access_token", data.access_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return result;
  } catch {
    return NextResponse.json(
      { detail: "تعذر الاتصال بالخادم" },
      { status: 503 }
    );
  }
}