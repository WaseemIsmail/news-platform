import "./globals.css";
import Script from "next/script";
import { Inter } from "next/font/google";
import { generateSEO } from "@/lib/seo";
import { AuthProvider } from "@/context/AuthContext";
import { AppProvider } from "@/context/AppContext";
import { NotificationProvider } from "@/context/NotificationContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export const metadata = generateSEO({
  title: "Contextra | News, Analysis, Opinion & Timelines",
  description:
    "Contextra is a modern news platform for breaking stories, deep analysis, opinion pieces, fact checks, and timeline-based reporting.",
  image: "/images/default-og.jpg",
  url: "https://contextra.vercel.app",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </head>

      <body className={`${inter.className} bg-white text-slate-900 antialiased`}>
        <AuthProvider>
          <AppProvider>
            <NotificationProvider>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </NotificationProvider>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}