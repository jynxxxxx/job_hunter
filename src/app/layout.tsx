import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/landingSections/Header";
import { Toaster } from 'sonner';
import { AuthProvider } from "@/context/AuthContext";
import { UserDataProvider } from '@/context/UserDataContext';
import Footer from "@/components/layoutSections/Footer";

export const metadata: Metadata = {
  title: "바로지원",
  description: "지원서부터 면접까지, 바로지원가 도와드립니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body >
        <AuthProvider>
          <UserDataProvider>
            <Toaster position="top-center" />
            <Header />
              {children}
            <Footer />
          </UserDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
