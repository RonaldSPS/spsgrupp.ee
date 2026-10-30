import type { Metadata } from "next"
import { Geist_Mono, Ubuntu } from "next/font/google"
import AdminShell from "./AdminShell"
import "../globals.css"

// The admin lives OUTSIDE app/(et) so it gets its own root layout WITHOUT
// GTM / consent banner / attribution (analytics audit 27.10.2026: admin
// traffic must not reach production GA4). URLs are unchanged — proxy.ts
// gates /spsadmn by pathname. The UI shell itself is the client-side
// AdminShell (identical to the old app/(et)/spsadmn/layout.tsx).

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "700"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
  preload: false,
})

export const metadata: Metadata = {
  title: "SPS Admin",
  robots: { index: false, follow: false },
}

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="et"
      className={`${ubuntu.variable} ${geistMono.variable} h-full antialiased no-js`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  )
}
