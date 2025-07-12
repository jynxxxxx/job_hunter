import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layoutSections/Header";
import { Toaster } from 'sonner';
import { AuthProvider } from "@/context/AuthContext";
import { UserDataProvider } from '@/context/UserDataContext';
import Footer from "@/components/layoutSections/Footer";
import Script from 'next/script';
import { Analytics } from "@vercel/analytics/next"
import { ScrollToTopOnRouteChange } from "@/components/layoutSections/ScollToTop";

export const metadata: Metadata = {
  title: "바로지원",
  description: "지원서부터 면접까지, 바로지원이 도와드립니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isProd = process.env.NODE_ENV === 'production';
  return (
    <html lang="en">
      <head>
        {isProd && (
          <>
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
            {/* <!-- Meta Pixel Code --> */}
            <Script
              id="fb-pixel"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `!function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '1077657577122728');
                fbq('track', 'PageView');`
              }}
            />

            {/* Facebook Pixel noscript fallback */}
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src="https://www.facebook.com/tr?id=1077657577122728&ev=PageView&noscript=1"
              />
            </noscript>
            {/* <!-- End Meta Pixel Code --> */}
          </>
        )}
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
                <div className="pt-[6rem] sm:pt-[4rem] pb-[12rem] sm:pb-[12rem]">
                  <ScrollToTopOnRouteChange />
                  {children}
                  <Analytics />
                </div>
              <Footer />
            </div>
          </UserDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
