import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "نظام دعم القرار لمخاطر الإفلاس",
  description: "AI-powered bankruptcy risk prediction and preventive decision support",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
