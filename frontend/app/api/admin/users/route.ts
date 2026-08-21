import { NextResponse } from "next/server";

import { backendFetch } from "@/lib/backend";


export async function GET() {
  try {
    const response = await backendFetch("/users/");

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          detail:
            data.detail ??
            "تعذر تحميل المستخدمين",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      {
        detail: "تعذر الاتصال بالخادم",
      },
      { status: 503 }
    );
  }
}