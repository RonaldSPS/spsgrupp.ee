import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locale as rootLocale } from 'next/root-params'
import { enToEt, localizedPaths, ruToEt, type Locale } from '@/lib/slug-map'
import { getAllPaths, getPage } from '@/lib/page-registry'
import { localizedPageRegistry } from '@/lib/localized-page-registry'
import { localizedPageMetadata, pageMetadata } from '@/lib/metadata-registry'
import { etLayoutMetadata } from '@/lib/et-metadata-registry'
import { generateLocalizedMetadata } from '@/lib/seo-metadata'
import PrivacyPolicyPage from '@/app/components/PrivacyPolicyPage'
import DynamicJobOffer from '@/app/components/DynamicJobOffer'
import JobsItemListJsonLd from '@/app/components/JobsItemListJsonLd'
import { ReviewsPage } from '@/app/_pages/sps-grupp/arvamused/page'
import { metadata as homeMetadata } from '@/app/_pages/home/page'
import TooleAnnouncementPage, { generateMetadata as etJobMetadata } from '@/app/_pages/tule-meile-toole/[slug]/page'
import { getTranslatedAnnouncementBySlug } from '@/lib/announcements'
import { getContentNamespace, getHeroImage, getLocalizedSeoMetadata } from '@/lib/localized-content'
import { localizedPages } from '@/lib/pages/registry'
import { absoluteUrl, canonicalUrl } from '@/lib/url-utils'

// Known paths prerender (generateStaticParams); unlisted ones render on demand
// so admin-created job postings work without a redeploy, then cache per TTL.
export const revalidate = 300

interface Props {
  params: Promise<{ locale: string; slug?: string[] }>
}

export async function generateStaticParams() {
  const current = (await rootLocale()) as Locale
  if (current === 'et') {
    // '/blog' is a real route under app/(et)/blog and never reaches this tree.
    return getAllPaths()
      .filter((etPath) => etPath !== '/blog')
      .map((etPath) => ({ slug: etPath === '/' ? undefined : etPath.slice(1).split('/') }))
  }
  return localizedPages.map((page) => ({
    slug: page[current] === '/' ? undefined : (page[current] as string).slice(1).split('/'),
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: current, slug } = await params
  // Dotted paths (foo.xml, *.php) skip the ET rewrite in proxy.ts and land here
  // with a bogus [locale] segment - they must 404, not render the homepage.
  if (current !== 'et' && current !== 'en' && current !== 'ru') notFound()
  const path = resolvePath(slug)

  if (current === 'et') {
    if (path === '/') return homeMetadata
    const jobSlug = getChildSlug(path, '/tule-meile-toole')
    if (jobSlug) return etJobMetadata({ params: Promise.resolve({ slug: jobSlug }) })
    const layoutLoader = etLayoutMetadata[path]
    if (layoutLoader) return (await layoutLoader()).metadata ?? {}
    // Paths the old [...slug] catch-all used to serve (live-overlay metadata).
    const meta = pageMetadata[path]
    if (!meta) return {}
    return generateLocalizedMetadata(path, 'et', meta.title, meta.description)
  }

  const loc = current as 'en' | 'ru'
  const dynamicMetadata = await getDynamicMetadata(loc, path)
  if (dynamicMetadata) return dynamicMetadata

  const etPath = toEt(loc, path)
  if (!etPath) return {}

  const localizedMeta = localizedPageMetadata[loc]?.[etPath] || getLocalizedSeoMetadata(loc, etPath)
  const meta = localizedMeta || pageMetadata[etPath] || pageMetadata['/']
  return generateLocalizedMetadata(etPath, loc, meta.title, meta.description, Boolean(localizedMeta), getHeroImage(etPath))
}

export default async function LocalePage({ params }: Props) {
  const { locale: current, slug } = await params
  if (current !== 'et' && current !== 'en' && current !== 'ru') notFound()
  const path = resolvePath(slug)

  if (current === 'et') {
    const jobSlug = getChildSlug(path, '/tule-meile-toole')
    if (jobSlug) return <TooleAnnouncementPage params={Promise.resolve({ slug: jobSlug })} />
    const PageComponent = await getPage(path)
    if (!PageComponent) notFound()
    return (
      <>
        {path === '/tule-meile-toole' && <JobsItemListJsonLd locale="et" />}
        <PageComponent />
      </>
    )
  }

  const loc = current as 'en' | 'ru'
  const dynamicPage = await getDynamicPage(loc, path)
  if (dynamicPage) return dynamicPage

  const etPath = toEt(loc, path)
  if (!etPath) notFound()

  const PageComponent = await getPage(etPath)
  if (!PageComponent) notFound()

  const renderer = localizedPageRegistry[etPath]
  if (renderer) {
    return (
      <>
        {etPath === '/tule-meile-toole' && <JobsItemListJsonLd locale={loc} />}
        {renderer(loc)}
      </>
    )
  }

  const namespace = getContentNamespace(etPath)
  if (namespace === 'privacyPolicy') return <PrivacyPolicyPage locale={loc} />

  return <PageComponent />
}

function toEt(loc: 'en' | 'ru', path: string): string | undefined {
  return (loc === 'en' ? enToEt : ruToEt)[path]
}

async function getDynamicPage(loc: 'en' | 'ru', path: string) {
  if (path === localizedPaths['/sps-grupp/arvamused'][loc]) {
    return <ReviewsPage locale={loc} />
  }

  const jobSlug = getChildSlug(path, localizedPaths['/tule-meile-toole'][loc])
  if (jobSlug) {
    const announcement = await getTranslatedAnnouncementBySlug(loc, jobSlug)
    if (announcement) return <DynamicJobOffer announcement={announcement} locale={loc} />
  }

  return null
}

async function getDynamicMetadata(loc: 'en' | 'ru', path: string): Promise<Metadata | null> {
  const jobParent = localizedPaths['/tule-meile-toole'][loc]
  const jobSlug = getChildSlug(path, jobParent)
  if (jobSlug) {
    const announcement = await getTranslatedAnnouncementBySlug(loc, jobSlug)
    if (!announcement) return null
    const canonical = canonicalUrl(`/${loc}${jobParent}/${announcement.slug}`)
    const image = absoluteUrl('/tuletoole-1.jpg')
    return {
      title: `${announcement.title} | SPS Grupp`,
      description: (announcement.subtitle || `${announcement.title} - ${announcement.location}`).slice(0, 160),
      alternates: { canonical },
      openGraph: {
        title: `${announcement.title} | SPS Grupp`,
        description: announcement.subtitle || announcement.title,
        type: 'website',
        locale: loc === 'en' ? 'en_GB' : 'ru_RU',
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
