import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPage } from '@/lib/page-registry'
import { pageMetadata } from '@/lib/metadata-registry'
import { generateLocalizedMetadata } from '@/lib/seo-metadata'

interface Props {
  params: Promise<{ slug: string[] }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const etPath = resolvePath((await params).slug)
  const meta = pageMetadata[etPath]
  if (!meta) return {}
  return generateLocalizedMetadata(etPath, 'et', meta.title, meta.description)
}

export default async function EtCatchAllPage({ params }: Props) {
  const etPath = resolvePath((await params).slug)
  const PageComponent = await getPage(etPath)
  if (!PageComponent) notFound()

  return <PageComponent />
}

function resolvePath(slugParts: string[]): string {
  return `/${slugParts.join('/')}`.replace(/\/$/, '')
}
