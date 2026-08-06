import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { enToEt, localizedPaths } from '@/lib/slug-map'
import { getPage } from '@/lib/page-registry'
import { localizedPageRegistry } from '@/lib/localized-page-registry'
import { localizedPageMetadata, pageMetadata } from '@/lib/metadata-registry'
import { generateLocalizedMetadata } from '@/lib/seo-metadata'
import PrivacyPolicyPage from '@/app/components/PrivacyPolicyPage'
import DynamicJobOffer from '@/app/components/DynamicJobOffer'
import { ReviewsPage } from '@/app/sps-grupp/arvamused/page'
import { getTranslatedAnnouncementBySlug } from '@/lib/announcements'
import { getContentNamespace, getHeroImage, getLocalizedSeoMetadata } from '@/lib/localized-content'
import { absoluteUrl, canonicalUrl } from '@/lib/url-utils'

interface Props {
  params: Promise<{ slug?: string[] }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const enPath = resolvePath(slug)
  const dynamicMetadata = await getDynamicMetadata(enPath)
  if (dynamicMetadata) return dynamicMetadata

  const etPath = enToEt[enPath]
  if (!etPath) return {}

  const localizedMeta = localizedPageMetadata.en?.[etPath] || getLocalizedSeoMetadata('en', etPath)
  const meta = localizedMeta || pageMetadata[etPath] || pageMetadata['/']
  return generateLocalizedMetadata(etPath, 'en', meta.title, meta.description, Boolean(localizedMeta), getHeroImage(etPath))
}

export default async function EnPage({ params }: Props) {
  const { slug } = await params
  const enPath = resolvePath(slug)
  const dynamicPage = await getDynamicPage(enPath)
  if (dynamicPage) return dynamicPage

  const etPath = enToEt[enPath]
  if (!etPath) notFound()

  const PageComponent = await getPage(etPath)
  if (!PageComponent) notFound()

  const renderer = localizedPageRegistry[etPath]
  if (renderer) return renderer('en')

  const namespace = getContentNamespace(etPath)
  if (namespace === 'privacyPolicy') return <PrivacyPolicyPage locale="en" />

  return <PageComponent />
}

async function getDynamicPage(enPath: string) {
  if (enPath === localizedPaths['/sps-grupp/arvamused'].en) {
    return <ReviewsPage locale="en" />
  }

  const jobSlug = getChildSlug(enPath, localizedPaths['/tule-meile-toole'].en)
  if (jobSlug) {
    const announcement = await getTranslatedAnnouncementBySlug('en', jobSlug)
    if (announcement) return <DynamicJobOffer announcement={announcement} locale="en" />
  }

  return null
}

async function getDynamicMetadata(enPath: string): Promise<Metadata | null> {
  const jobParent = localizedPaths['/tule-meile-toole'].en
  const jobSlug = getChildSlug(enPath, jobParent)
  if (jobSlug) {
    const announcement = await getTranslatedAnnouncementBySlug('en', jobSlug)
    if (!announcement) return null
    const canonical = canonicalUrl(`/en${jobParent}/${announcement.slug}`)
    const image = absoluteUrl('/tuletoole-1.jpg')
    return {
      title: `${announcement.title} | SPS Grupp`,
      description: (announcement.subtitle || `${announcement.title} - ${announcement.location}`).slice(0, 160),
      alternates: { canonical },
      openGraph: {
        title: `${announcement.title} | SPS Grupp`,
        description: announcement.subtitle || announcement.title,
        type: 'website',
        locale: 'en_GB',
        url: canonical,
        images: [{ url: image, alt: announcement.title }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${announcement.title} | SPS Grupp`,
        description: announcement.subtitle || announcement.title,
        images: [image],
      },
    }
  }

  return null
}

function getChildSlug(path: string, parent: string): string | null {
  const normalizedParent = parent === '/' ? '' : parent
  const prefix = `${normalizedParent}/`
  if (!path.startsWith(prefix)) return null
  const rest = path.slice(prefix.length)
  return rest && !rest.includes('/') ? rest : null
}

function resolvePath(slugParts?: string[]): string {
  if (!slugParts || slugParts.length === 0) return '/'
  const path = '/' + slugParts.join('/')
  try {
    return decodeURI(path)
  } catch {
    return path
  }
}
