import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { enToEt, localizedPaths } from '@/lib/slug-map'
import { getPage } from '@/lib/page-registry'
import { pageMetadata } from '@/lib/metadata-registry'
import { generateLocalizedMetadata } from '@/lib/seo-metadata'
import LocalizedContentPage from '@/app/components/LocalizedContentPage'
import DynamicBlogArchive from '@/app/components/DynamicBlogArchive'
import DynamicBlogPost from '@/app/components/DynamicBlogPost'
import DynamicJobOffer from '@/app/components/DynamicJobOffer'
import { ReviewsPage } from '@/app/sps-grupp/arvamused/page'
import { getTranslatedBlogPosts, getTranslatedPostBySlug } from '@/app/blog/data'
import { getTranslatedAnnouncementBySlug } from '@/lib/announcements'
import { getContentNamespace } from '@/lib/localized-content'

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

  const meta = pageMetadata[etPath] || pageMetadata['/']
  return generateLocalizedMetadata(etPath, 'en', meta.title, meta.description)
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

  const namespace = getContentNamespace(etPath)
  if (namespace) return <LocalizedContentPage etPath={etPath} locale="en" namespace={namespace} />

  return <PageComponent />
}

async function getDynamicPage(enPath: string) {
  if (enPath === localizedPaths['/sps-grupp/arvamused'].en) {
    return <ReviewsPage locale="en" />
  }

  if (enPath === '/blog') {
    const posts = await getTranslatedBlogPosts('en')
    return <DynamicBlogArchive posts={posts} locale="en" />
  }

  const blogSlug = getChildSlug(enPath, '/blog')
  if (blogSlug) {
    const post = await getTranslatedPostBySlug('en', blogSlug)
    if (post) return <DynamicBlogPost post={post} locale="en" />
  }

  const jobSlug = getChildSlug(enPath, localizedPaths['/tule-meile-toole'].en)
  if (jobSlug) {
    const announcement = await getTranslatedAnnouncementBySlug('en', jobSlug)
    if (announcement) return <DynamicJobOffer announcement={announcement} locale="en" />
  }

  return null
}

async function getDynamicMetadata(enPath: string): Promise<Metadata | null> {
  if (enPath === '/blog') {
    return {
      title: 'Blog | SPS Grupp',
      description: 'Articles and news about cleaning services, office cleaning and outdoor maintenance.',
      alternates: { canonical: 'https://spsgrupp.ee/en/blog' },
      openGraph: {
        title: 'Blog | SPS Grupp',
        description: 'Articles and news about cleaning services, office cleaning and outdoor maintenance.',
        type: 'website',
        locale: 'en_GB',
      },
    }
  }

  const blogSlug = getChildSlug(enPath, '/blog')
  if (blogSlug) {
    const post = await getTranslatedPostBySlug('en', blogSlug)
    if (!post) return null
    return {
      title: `${post.title} | SPS Grupp Blog`,
      description: post.excerpt,
      alternates: { canonical: `https://spsgrupp.ee/en/blog/${post.slug}` },
      openGraph: {
        title: post.title,
        description: post.excerpt,
        url: `https://spsgrupp.ee/en/blog/${post.slug}`,
        type: 'article',
        publishedTime: post.date,
        locale: 'en_GB',
        images: [{ url: `https://spsgrupp.ee${post.featuredImage}`, width: 1200, height: 630, alt: post.title }],
      },
    }
  }

  const jobParent = localizedPaths['/tule-meile-toole'].en
  const jobSlug = getChildSlug(enPath, jobParent)
  if (jobSlug) {
    const announcement = await getTranslatedAnnouncementBySlug('en', jobSlug)
    if (!announcement) return null
    return {
      title: `${announcement.title} | SPS Grupp`,
      description: (announcement.subtitle || `${announcement.title} - ${announcement.location}`).slice(0, 160),
      alternates: { canonical: `https://spsgrupp.ee/en${jobParent}/${announcement.slug}` },
      openGraph: {
        title: `${announcement.title} | SPS Grupp`,
        description: announcement.subtitle || announcement.title,
        type: 'website',
        locale: 'en_GB',
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
