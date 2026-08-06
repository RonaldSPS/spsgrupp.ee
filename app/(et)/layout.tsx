import type { Metadata } from "next"
import { RootShell, rootMetadata } from "@/app/_shell/root-shell"
import "../globals.css"

export const metadata: Metadata = rootMetadata

export default function EtGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <RootShell locale="et">{children}</RootShell>
}
