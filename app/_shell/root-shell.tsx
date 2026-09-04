import type { Metadata } from "next"
import { Geist_Mono, Ubuntu } from "next/font/google"
import { GoogleTagManager } from "@next/third-parties/google"
import { I18nProvider } from "@/lib/i18n-provider"
import etMessages from "@/messages/et.json"
import enMessages from "@/messages/en.json"
import ruMessages from "@/messages/ru.json"
import { renderLdJson } from "@/lib/json-ld-generator"
import { absoluteUrl, BASE_URL, canonicalUrl } from "@/lib/url-utils"
import CookieConsentBanner from "@/app/components/analytics/CookieConsentBanner"
import { CONSENT_DEFAULT_SNIPPET } from "@/app/components/analytics/consent"

const gtmId = process.env.NEXT_PUBLIC_GTM_ID

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "700"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  // Used only for below-the-fold price numbers - skip the head preload.
  preload: false,
})

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@id": `${canonicalUrl("/")}#organization`,
  "@type": "Organization",
  name: "SPS Grupp OÜ",
  url: canonicalUrl("/"),
  logo: absoluteUrl("/SPS_LOGO.svg"),
  address: {
    "@type": "PostalAddress",
    streetAddress: "Mustamäe tee 46",
    addressLocality: "Tallinn",
    postalCode: "10621",
    addressCountry: "EE",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+372-662-3328",
    contactType: "customer service",
    email: "info@spsgrupp.ee",
    availableLanguage: ["Estonian", "Russian", "English"],
  },
  areaServed: ["Tallinn", "Harjumaa"],
  identifier: {
    "@type": "PropertyValue",
    propertyID: "registryCode",
    value: "11394806",
  },
  taxID: "EE101460268",
  foundingDate: "2006",
  sameAs: ["https://www.facebook.com/Puhastusteenused"],
  geo: {
    "@type": "GeoCoordinates",
    latitude: 59.4042,
    longitude: 24.6843,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "17:00",
  },
}

const messagesByLocale = {
  et: etMessages,
  en: enMessages,
  ru: ruMessages,
}

export type SiteLocale = keyof typeof messagesByLocale

export const rootMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "SPS Grupp",
  description: "SPS Grupp - Hästi juhitud ettevõte",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/android-chrome-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon-57x57.png", sizes: "57x57" },
      { url: "/apple-touch-icon-60x60.png", sizes: "60x60" },
      { url: "/apple-touch-icon-72x72.png", sizes: "72x72" },
      { url: "/apple-touch-icon-76x76.png", sizes: "76x76" },
      { url: "/apple-touch-icon-114x114.png", sizes: "114x114" },
      { url: "/apple-touch-icon-120x120.png", sizes: "120x120" },
      { url: "/apple-touch-icon-144x144.png", sizes: "144x144" },
      { url: "/apple-touch-icon-152x152.png", sizes: "152x152" },
      { url: "/apple-touch-icon-167x167.png", sizes: "167x167" },
      { url: "/apple-touch-icon-180x180.png", sizes: "180x180" },
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#1a3358" },
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
  },
  other: {
    "msapplication-TileColor": "#1a3358",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#1a3358",
  },
}

export function RootShell({
  locale,
  children,
}: Readonly<{
  locale: SiteLocale
  children: React.ReactNode
}>) {
  const messages = messagesByLocale[locale]
  const skipLinkText = messages.skipLink.text

  return (
    <html
      lang={locale}
      className={`${ubuntu.variable} ${geistMono.variable} h-full antialiased no-js`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {gtmId ? (
          // Consent Mode v2 defaults must run before GTM loads (GTM loads
          // after hydration, so this parse-time inline script always wins).
          <script
            dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SNIPPET }}
          />
        ) : null}
        <I18nProvider locale={locale} messages={messages}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[10000] focus:bg-[#17345a] focus:text-white focus:px-5 focus:py-3 focus:rounded-lg focus:text-[15px] focus:font-medium focus:outline-none focus:ring-2 focus:ring-[#3abeff] focus:ring-offset-2"
          >
            {skipLinkText}
          </a>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: renderLdJson(ORGANIZATION_SCHEMA),
            }}
          />
          {children}
          {gtmId ? <CookieConsentBanner /> : null}
        </I18nProvider>
        {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
      </body>
    </html>
  )
}
