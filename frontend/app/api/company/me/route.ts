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
    const response = await fetch(`${backendBaseUrl()}/companies/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (response.status === 404) {
      return NextResponse.json(
        { company: null },
        { status: 200 }
      );
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { detail: data.detail ?? "تعذر تحميل بيانات الشركة" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      company: data,
    });
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
    const response = await fetch(`${backendBaseUrl()}/companies/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      let message = "تعذر إنشاء الشركة";

      if (response.status === 409) {
        message =
          data.detail === "User already has a company"
            ? "لديك شركة مسجلة بالفعل"
            : "رقم التسجيل مستخدم من قبل";
      } else if (response.status === 422) {
        message = "تأكد من صحة بيانات الشركة";
      }

      return NextResponse.json(
        { detail: message },
        { status: response.status }
      );
    }

    return NextResponse.json(data, {
      status: 201,
    });
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
    const currentResponse = await fetch(
      `${backendBaseUrl()}/companies/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!currentResponse.ok) {
      return NextResponse.json(
        { detail: "تعذر العثور على الشركة" },
        { status: currentResponse.status }
      );
    }

    const company = await currentResponse.json();

    const response = await fetch(
      `${backendBaseUrl()}/companies/${company.id}`,
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
      return NextResponse.json(
        {
          detail:
            response.status === 409
              ? "رقم التسجيل مستخدم من قبل"
              : data.detail ?? "تعذر تحديث بيانات الشركة",
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