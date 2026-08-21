import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bankruptcy Risk Prediction System",
  description:
    "Bankruptcy risk prediction and financial decision support system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}