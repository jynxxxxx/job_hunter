import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "바로지원",
  description: "지원서부터 면접까지, 바로지원가 도와드립니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        {children}
      </body>
    </html>
  );
}
