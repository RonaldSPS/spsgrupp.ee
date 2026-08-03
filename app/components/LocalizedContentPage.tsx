import Link from 'next/link'
import Navbar from './Navbar'
import Footer from './Footer'
import FooterCTA from './FooterCTA'
import ContactForm from './ContactForm'
import CareerForm from './CareerForm'
import TooleAnnouncements from './TooleAnnouncements'
import Hinnakalkulaator from './Hinnakalkulaator'
import MaintenancePriceExamples from './MaintenancePriceExamples'
import { localizePath, type Locale } from '@/lib/slug-map'
import {
  getHeroImage,
  getLocalizedContent,
  type LocalizedContentNamespace,
} from '@/lib/localized-content'
import { renderLdJson, generateServiceSchema, generateBreadcrumbSchema, generateFaqSchema } from '@/lib/json-ld-generator'
import HeroBackgroundImage from './HeroBackgroundImage'

type ContentRecord = Record<string, unknown>

interface LocalizedContentPageProps {
  etPath: string
  locale: Locale
  namespace: LocalizedContentNamespace
}

export default function LocalizedContentPage({ etPath, locale, namespace }: LocalizedContentPageProps) {
  const content = asRecord(getLocalizedContent(locale, namespace)) ?? {}
  const hero = asRecord(content.hero)
  const seo = asRecord(content.seo)
  const footerCta = asRecord(content.footerCta)
  const title = getTitle(hero, seo)
  const description = stringValue(hero?.description) || stringValue(hero?.desc1) || stringValue(seo?.serviceDescription)
  const faqItems = numberedPairs(asRecord(content.faq), 'q', 'a')
  const parentPath = getParentPath(etPath)
  const homeLabel = stringValue(seo?.breadcrumbHome) || (locale === 'ru' ? 'Главная' : 'Home')
  const parentLabel =
    stringValue(seo?.breadcrumbService) ||
    stringValue(seo?.breadcrumbServices) ||
    localizedParentLabel(parentPath, locale)

  const breadcrumbItems = [
    { name: homeLabel, etPath: '/' },
    ...(parentPath !== '/' ? [{ name: parentLabel, etPath: parentPath }] : []),
    { name: title, etPath },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: renderLdJson(generateServiceSchema(etPath, locale, title, description)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: renderLdJson(generateBreadcrumbSchema(breadcrumbItems, locale)),
        }}
      />
      {faqItems.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: renderLdJson(generateFaqSchema(faqItems)!),
          }}
        />
      ) : null}
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <section
          className="hero-section relative min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px] overflow-x-clip"
          aria-label={stringValue(hero?.ariaLabel) || title}
        >
          <HeroBackgroundImage src={getHeroImage(etPath)} preload alt="" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px] md:gap-[60px] items-start max-w-[1280px] mx-auto w-full relative z-10">
            <div
              className="animate-fade-up order-2 md:order-1"
              style={{
                background: 'rgba(55, 54, 45, 0.62)',
                backdropFilter: 'blur(5px)',
                WebkitBackdropFilter: 'blur(3px)',
                padding: '32px',
                borderRadius: '20px',
                border: '1px solid rgba(133, 203, 233, 0.2)',
              }}
            >
              <nav aria-label={locale === 'ru' ? 'Навигационная цепочка' : 'Breadcrumb'} className="mb-4 text-[15px] text-white/85">
                <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <li>
                    <Link href={localizePath('/', locale)} className="hover:text-white underline-offset-4 hover:underline">
                      {homeLabel}
                    </Link>
                  </li>
                  {parentPath !== '/' ? (
                    <>
                      <li aria-hidden="true">/</li>
                      <li>
                        <Link href={localizePath(parentPath, locale)} className="hover:text-white underline-offset-4 hover:underline">
                          {parentLabel}
                        </Link>
                      </li>
                    </>
                  ) : null}
                  <li aria-hidden="true">/</li>
                  <li aria-current="page" className="text-white">{title}</li>
                </ol>
              </nav>
              <h1 className="text-[clamp(28px,4.2vw,56px)] font-bold text-white leading-[1.12] mb-[18px]">
                {title}
              </h1>
              {description ? (
                <RichText
                  as="p"
                  className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light"
                  value={description}
                />
              ) : null}
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-[10px] mb-[24px] animate-fade-up">
                <a href="#pakkumine" className="btn-primary text-[15px] py-2.5 px-4 w-full sm:w-auto justify-center">
                  {stringValue(hero?.ctaButton) || stringValue(hero?.cta) || ctaLabel(locale)}
                </a>
                <Link href="tel:6623328" className="btn-outline bg-white/10 border-white/30 text-white hover:bg-white/20 text-[15px] py-2.5 px-4 w-full sm:w-auto justify-center">
                  662 3328
                </Link>
              </div>
            </div>
          </div>
        </section>

        {renderSection('problem', content.problem, 'white')}
        {renderCardsSection(content.services, 'item', locale)}
        {renderCardsSection(content.whyUs, 'reason', locale)}
        {renderPricing(content.pricing, locale, usesMaintenancePricing(etPath))}
        {renderSection('about', content.about, 'white')}
        {renderSection('standards', content.standards, 'muted')}
        {renderSection('customerSatisfaction', content.customerSatisfaction, 'white')}
        {renderSection('certificates', content.certificates, 'muted')}
        {renderSection('emergency', content.emergency, 'white')}
        {renderSection('areas', content.areas, 'muted')}
        {faqItems.length > 0 ? renderFaq(faqItems, locale) : null}
        {etPath === '/tule-meile-toole' ? <TooleAnnouncements locale={locale} /> : null}
        {footerCta ? (
          <FooterCTA
            title={stringValue(footerCta.title)}
            description={stringValue(footerCta.description)}
          />
        ) : null}
        {stringValue(content.form) === 'career' ? <CareerForm /> : stringValue(content.form) === 'none' ? null : <ContactForm />}
      </main>
      <Footer />
    </>
  )
}

function renderSection(key: string, sectionValue: unknown, tone: 'white' | 'muted') {
  const section = asRecord(sectionValue)
  if (!section) return null

  const heading = stringValue(section.heading) || stringValue(section.title) || stringValue(section.leftTitle)
  const entries = Object.entries(section).filter(([entryKey, value]) => {
    if (['tag', 'heading', 'title', 'imageAlt', 'mapAlt'].includes(entryKey)) return false
    return typeof value === 'string'
  })

  if (!heading && entries.length === 0) return null

  return (
    <section key={key} className={`py-[90px] ${tone === 'muted' ? 'bg-[#eceef1]' : 'bg-white'}`}>
      <div className="max-w-[1280px] mx-auto px-[5%]">
        {stringValue(section.tag) ? <div className="section-tag mb-4">{stringValue(section.tag)}</div> : null}
        {heading ? <h2 className="text-[clamp(28px,3vw,44px)] leading-[1.15] font-bold text-[#17345a] mb-8">{heading}</h2> : null}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {entries.map(([entryKey, value]) => (
            <RichText
              key={entryKey}
              as="div"
              className="text-[16px] leading-[1.8] text-[#2f353f] font-light"
              value={String(value)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function renderCardsSection(sectionValue: unknown, prefix: 'item' | 'reason', locale: Locale) {
  const section = asRecord(sectionValue)
  if (!section) return null
  const cards = numberedPairs(section, `${prefix}`, `${prefix}`, true)
  if (cards.length === 0) return null

  return (
    <section className="py-[90px] bg-[#eceef1]">
      <div className="max-w-[1280px] mx-auto px-[5%]">
        {stringValue(section.tag) ? <div className="section-tag mb-4">{cardSectionTag(stringValue(section.tag), locale)}</div> : null}
        <h2 className="text-[clamp(28px,3vw,44px)] leading-[1.15] font-bold text-[#17345a] mb-10">
          {stringValue(section.heading)}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card, index) => (
            <article key={index} className="bg-white rounded-lg border border-[#dfe5ec] p-5">
              <div className="text-[15px] text-[#5a6474] mb-3">{String(index + 1).padStart(2, '0')}</div>
              <h3 className="text-[20px] leading-[1.3] font-semibold text-[#17345a] mb-3">{card.q}</h3>
              {card.a ? <RichText as="p" className="text-[15px] leading-[1.75] text-[#5a6474]" value={card.a} /> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function cardSectionTag(tag: string, locale: Locale): string {
  if (tag === 'Service content' || tag === 'Сервисный контент') {
    return locale === 'ru' ? 'Состав услуги' : 'Services'
  }
  return tag
}

function renderPricing(sectionValue: unknown, locale: Locale, maintenancePricing: boolean) {
  const section = asRecord(sectionValue)
  if (!section) return null

  if (maintenancePricing) {
    return (
      <section className="py-[90px] bg-white">
        <div className="max-w-[1280px] mx-auto px-[5%]">
          {stringValue(section.tag) ? <div className="section-tag mb-4">{stringValue(section.tag)}</div> : null}
          <h2 className="text-[clamp(28px,3vw,44px)] leading-[1.15] font-bold text-[#17345a] mb-5">
            {stringValue(section.heading)}
          </h2>
          {stringValue(section.description) ? (
            <RichText as="p" className="text-[16px] leading-[1.8] text-[#2f353f] max-w-[820px] mb-10" value={stringValue(section.description)} />
          ) : null}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">
            <MaintenancePriceExamples locale={locale} />
            <Hinnakalkulaator locale={locale} />
          </div>
        </div>
      </section>
    )
  }

  const cards = numberedPairs(section, 'item', 'item', true, ['Size', 'Area', 'Price', 'Period'])
  if (cards.length === 0) return null

  return (
    <section className="py-[90px] bg-white">
      <div className="max-w-[1280px] mx-auto px-[5%]">
        {stringValue(section.tag) ? <div className="section-tag mb-4">{stringValue(section.tag)}</div> : null}
        <h2 className="text-[clamp(28px,3vw,44px)] leading-[1.15] font-bold text-[#17345a] mb-5">
          {stringValue(section.heading)}
        </h2>
        {stringValue(section.description) ? (
          <RichText as="p" className="text-[16px] leading-[1.8] text-[#2f353f] max-w-[820px] mb-10" value={stringValue(section.description)} />
        ) : null}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((card, index) => (
            <article key={index} className="rounded-lg border border-[#dfe5ec] p-5 bg-[#f8fafc]">
              <h3 className="text-[20px] font-semibold text-[#17345a] mb-2">{card.q}</h3>
              <p className="text-[15px] text-[#5a6474] mb-4">{card.meta}</p>
              <p className="text-[30px] font-bold text-[#17345a]">{card.price}</p>
              <p className="text-[15px] text-[#5a6474]">{card.period}</p>
            </article>
          ))}
        </div>
        {stringValue(section.note) ? <RichText as="p" className="text-[15px] leading-[1.75] text-[#5a6474] mt-6" value={stringValue(section.note)} /> : null}
      </div>
    </section>
  )
}

function usesMaintenancePricing(etPath: string): boolean {
  return [
    '/koristusteenus',
    '/koristusteenus/kontori-koristus',
    '/koristusteenus/kaubanduspindade-koristus',
    '/koristusteenus/tootmishoonete-koristus',
    '/koolide-koristamine',
  ].includes(etPath)
}

function getParentPath(etPath: string): string {
  if (etPath.startsWith('/koristusteenus/valikoristus/')) return '/koristusteenus/valikoristus'
  if (etPath.startsWith('/koristusteenus/')) return '/koristusteenus'
  if (etPath.startsWith('/puhastusteenused/')) return '/puhastusteenused'
  if (etPath.startsWith('/remonditeenused-tallinnas/')) return '/remonditeenused-tallinnas'
  return '/'
}

function localizedParentLabel(parentPath: string, locale: Locale): string {
  const labels: Record<string, { en: string; ru: string }> = {
    '/koristusteenus': { en: 'Regular cleaning', ru: 'Регулярная уборка' },
    '/puhastusteenused': { en: 'Specialist cleaning', ru: 'Специализированная уборка' },
    '/remonditeenused-tallinnas': { en: 'Repair services', ru: 'Ремонтные услуги' },
    '/koristusteenus/valikoristus': { en: 'Outdoor cleaning and grounds care', ru: 'Уборка и обслуживание территорий' },
  }
  return labels[parentPath]?.[locale === 'ru' ? 'ru' : 'en'] || (locale === 'ru' ? 'Услуги' : 'Services')
}

function renderFaq(items: Array<{ q: string; a: string }>, locale: Locale) {
  return (
    <section className="py-[90px] bg-white">
      <div className="max-w-[1280px] mx-auto px-[5%]">
        <div className="section-tag mb-4">{locale === 'ru' ? 'FAQ' : 'FAQ'}</div>
        <h2 className="text-[clamp(28px,3vw,44px)] leading-[1.15] font-bold text-[#17345a] mb-10">
          {locale === 'ru' ? 'Частые вопросы' : 'Frequently asked questions'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, index) => (
            <article key={index} className="rounded-lg border border-[#dfe5ec] p-5 bg-[#f8fafc]">
              <h3 className="text-[18px] leading-[1.35] font-semibold text-[#17345a] mb-3">{item.q}</h3>
              <RichText as="p" className="text-[15px] leading-[1.75] text-[#5a6474]" value={item.a} />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function numberedPairs(
  section: ContentRecord | undefined,
  questionPrefix: string,
  answerPrefix: string,
  titleDescMode = false,
  pricingKeys?: string[],
) {
  if (!section) return []
  const indexes = new Set<number>()
  for (const key of Object.keys(section)) {
    const match = key.match(new RegExp(`^${questionPrefix}(\\d+)`))
    if (match) indexes.add(Number(match[1]))
  }

  return [...indexes].sort((a, b) => a - b).map((index) => {
    if (pricingKeys) {
      return {
        q: stringValue(section[`${questionPrefix}${index}${pricingKeys[0]}`]),
        a: '',
        meta: stringValue(section[`${questionPrefix}${index}${pricingKeys[1]}`]),
        price: stringValue(section[`${questionPrefix}${index}${pricingKeys[2]}`]),
        period: stringValue(section[`${questionPrefix}${index}${pricingKeys[3]}`]),
      }
    }
    if (titleDescMode) {
      return {
        q: stringValue(section[`${questionPrefix}${index}Title`]) || stringValue(section[`${questionPrefix}${index}`]),
        a: stringValue(section[`${answerPrefix}${index}Desc`]) || stringValue(section[`${answerPrefix}${index}`]),
      }
    }
    return {
      q: stringValue(section[`${questionPrefix}${index}`]),
      a: stringValue(section[`${answerPrefix}${index}`]),
    }
  }).filter((item) => item.q)
}

function getTitle(hero: ContentRecord | undefined, seo: ContentRecord | undefined): string {
  const serviceName = stringValue(seo?.serviceName)
  if (serviceName) return serviceName

  const first = stringValue(hero?.title) || stringValue(hero?.h1Line1)
  const second = stringValue(hero?.subtitle) || stringValue(hero?.h1Line2)
  return [first, second].filter(Boolean).join(' — ')
}

function asRecord(value: unknown): ContentRecord | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined
  return value as ContentRecord
}

function stringValue(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function RichText({ as: Tag, className, value }: { as: 'p' | 'div'; className: string; value: string }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: value }} />
}

function ctaLabel(locale: Locale): string {
  if (locale === 'ru') return 'Запросить предложение'
  return 'Request a quote'
}
