import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { localizedPaths, ruToEt } from '@/lib/slug-map'
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
  const ruPath = resolvePath(slug)
  const dynamicMetadata = await getDynamicMetadata(ruPath)
  if (dynamicMetadata) return dynamicMetadata

  const etPath = ruToEt[ruPath]
  if (!etPath) return {}

  const meta = pageMetadata[etPath] || pageMetadata['/']
  return generateLocalizedMetadata(etPath, 'ru', meta.title, meta.description)
}

export default async function RuPage({ params }: Props) {
  const { slug } = await params
  const ruPath = resolvePath(slug)
  const dynamicPage = await getDynamicPage(ruPath)
  if (dynamicPage) return dynamicPage

  const etPath = ruToEt[ruPath]
  if (!etPath) notFound()

  const PageComponent = await getPage(etPath)
  if (!PageComponent) notFound()

  const namespace = getContentNamespace(etPath)
  if (namespace) return <LocalizedContentPage etPath={etPath} locale="ru" namespace={namespace} />

  return <PageComponent />
}

async function getDynamicPage(ruPath: string) {
  if (ruPath === localizedPaths['/sps-grupp/arvamused'].ru) {
    return <ReviewsPage locale="ru" />
  }

  if (ruPath === '/blog') {
    const posts = await getTranslatedBlogPosts('ru')
    return <DynamicBlogArchive posts={posts} locale="ru" />
  }

  const blogSlug = getChildSlug(ruPath, '/blog')
  if (blogSlug) {
    const post = await getTranslatedPostBySlug('ru', blogSlug)
    if (post) return <DynamicBlogPost post={post} locale="ru" />
  }

  const jobSlug = getChildSlug(ruPath, localizedPaths['/tule-meile-toole'].ru)
  if (jobSlug) {
    const announcement = await getTranslatedAnnouncementBySlug('ru', jobSlug)
    if (announcement) return <DynamicJobOffer announcement={announcement} locale="ru" />
  }

  return null
}

async function getDynamicMetadata(ruPath: string): Promise<Metadata | null> {
  if (ruPath === '/blog') {
    return {
      title: 'Блог | SPS Grupp',
      description: 'Статьи и новости об уборочных услугах, уборке офисов и обслуживании наружных территорий.',
      alternates: { canonical: 'https://spsgrupp.ee/ru/blog' },
      openGraph: {
        title: 'Блог | SPS Grupp',
        description: 'Статьи и новости об уборочных услугах, уборке офисов и обслуживании наружных территорий.',
        type: 'website',
        locale: 'ru_RU',
      },
    }
  }

  const blogSlug = getChildSlug(ruPath, '/blog')
  if (blogSlug) {
    const post = await getTranslatedPostBySlug('ru', blogSlug)
    if (!post) return null
    return {
      title: `${post.title} | SPS Grupp Блог`,
      description: post.excerpt,
      alternates: { canonical: `https://spsgrupp.ee/ru/blog/${post.slug}` },
      openGraph: {
        title: post.title,
        description: post.excerpt,
        url: `https://spsgrupp.ee/ru/blog/${post.slug}`,
        type: 'article',
        publishedTime: post.date,
        locale: 'ru_RU',
        images: [{ url: `https://spsgrupp.ee${post.featuredImage}`, width: 1200, height: 630, alt: post.title }],
      },
    }
  }

  const jobParent = localizedPaths['/tule-meile-toole'].ru
  const jobSlug = getChildSlug(ruPath, jobParent)
  if (jobSlug) {
    const announcement = await getTranslatedAnnouncementBySlug('ru', jobSlug)
    if (!announcement) return null
    return {
      title: `${announcement.title} | SPS Grupp`,
      description: (announcement.subtitle || `${announcement.title} - ${announcement.location}`).slice(0, 160),
      alternates: { canonical: `https://spsgrupp.ee/ru${jobParent}/${announcement.slug}` },
      openGraph: {
        title: `${announcement.title} | SPS Grupp`,
        description: announcement.subtitle || announcement.title,
        type: 'website',
        locale: 'ru_RU',
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
