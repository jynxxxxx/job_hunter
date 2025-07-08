import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layoutSections/Header";
import { Toaster } from 'sonner';
import { AuthProvider } from "@/context/AuthContext";
import { UserDataProvider } from '@/context/UserDataContext';
import Footer from "@/components/layoutSections/Footer";
import Script from 'next/script';

export const metadata: Metadata = {
  title: "바로지원",
  description: "지원서부터 면접까지, 바로지원이 도와드립니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Microsoft Clarity Tracking Script */}
        <Script
          id="ms-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "sbjgikhecb");`
          }}
        />
      </head>
      <body>
        <Script
          src="https://developers.kakao.com/sdk/js/kakao.js"
          strategy="beforeInteractive"
        />
        <AuthProvider>
          <UserDataProvider>
            <Toaster position="top-center" />
            <div className="min-h-screen relative">
              <Header />
                <div className="pt-[6rem] sm:pt-[4rem] pb-[13rem] sm:pb-[15rem]">
                  {children}
                </div>
              <Footer />
            </div>
          </UserDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
