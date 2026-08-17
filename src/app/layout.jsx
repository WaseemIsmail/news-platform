import "./globals.css";
import Script from "next/script";
import { generateSEO } from "@/lib/seo";
import { AuthProvider } from "@/context/AuthContext";
import { AppProvider } from "@/context/AppContext";
import { NotificationProvider } from "@/context/NotificationContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WebVitals from "@/components/analytics/WebVitals";
import InstallAppPrompt from "@/components/layout/InstallAppPrompt";
import { siteMetadata } from "@/lib/metadata";

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export const metadata = {
  ...generateSEO({
    title: "Contextra | News, Analysis, Opinion & Timelines",
    description:
      "Contextra is a modern news platform for breaking stories, deep analysis, opinion pieces, fact checks, and timeline-based reporting.",
    image: "/opengraph-image",
    url: "/",
  }),
  metadataBase: new URL(siteMetadata.siteUrl),
  applicationName: siteMetadata.siteName,
  authors: [{ name: siteMetadata.author, url: siteMetadata.siteUrl }],
  creator: siteMetadata.author,
  publisher: siteMetadata.siteName,
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Contextra",
  },
  icons: {
    apple: "/contextra-apple-touch-icon.png",
  },
  formatDetection: { email: false, address: false, telephone: false },
};

export default function RootLayout({ children }) {
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteMetadata.siteUrl}/#organization`,
        name: siteMetadata.siteName,
        url: siteMetadata.siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteMetadata.siteUrl}${siteMetadata.publisherLogo}`,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteMetadata.siteUrl}/#website`,
        url: siteMetadata.siteUrl,
        name: siteMetadata.siteName,
        description: siteMetadata.description,
        inLanguage: siteMetadata.language,
        publisher: { "@id": `${siteMetadata.siteUrl}/#organization` },
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-initializer" strategy="beforeInteractive">
          {`(function(){try{var saved=localStorage.getItem('contexta-theme');var theme=saved==='dark'||saved==='light'?saved:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');var root=document.documentElement;root.classList.toggle('dark',theme==='dark');root.dataset.theme=theme;root.style.colorScheme=theme;}catch(e){}})();`}
        </Script>
        <meta
          name="google-site-verification"
          content="Tov0yAGszSiqfmTlFnKg_yMBPdfQteNjsFS5Byw3ZWI"
        />

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

      <body
        className="bg-white text-slate-900 antialiased transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData).replace(/</g, "\\u003c") }}
        />
        <a
          href="#main-content"
          className="fixed left-4 top-3 z-[100] -translate-y-24 rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-xl transition focus:translate-y-0 dark:bg-amber-500 dark:text-slate-950"
        >
          Skip to main content
        </a>
        <AuthProvider>
          <AppProvider>
            <NotificationProvider>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <div id="main-content" tabIndex={-1} className="flex-1 outline-none">
                  {children}
                </div>
                <Footer />
                <WebVitals />
                <InstallAppPrompt />
              </div>
            </NotificationProvider>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
