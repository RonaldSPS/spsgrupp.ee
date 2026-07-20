import Link from 'next/link'
import Navbar from './Navbar'
import Footer from './Footer'
import FooterCTA from './FooterCTA'
import ContactForm from './ContactForm'
import CareerForm from './CareerForm'
import TooleAnnouncements from './TooleAnnouncements'
import type { Locale } from '@/lib/slug-map'
import {
  getHeroImage,
  getLocalizedContent,
  type LocalizedContentNamespace,
} from '@/lib/localized-content'

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

  return (
    <>
      <Navbar />
      <main>
        <section
          className="hero-section min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          aria-label={stringValue(hero?.ariaLabel) || title}
          style={{ background: `url('${getHeroImage(etPath)}') center/cover no-repeat` }}
        >
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
              <div className="flex flex-wrap gap-[10px] mb-[24px] animate-fade-up">
                <a href="#pakkumine" className="btn-primary text-[15px] py-2.5 px-4">
                  {stringValue(hero?.ctaButton) || stringValue(hero?.cta) || ctaLabel(locale)}
                </a>
                <Link href="tel:6623328" className="btn-outline bg-white/10 border-white/30 text-white hover:bg-white/20 text-[15px] py-2.5 px-4">
                  662 3328
                </Link>
              </div>
            </div>
          </div>
        </section>

        {renderSection('problem', content.problem, 'white')}
        {renderCardsSection(content.services, 'item')}
        {renderCardsSection(content.whyUs, 'reason')}
        {renderPricing(content.pricing)}
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

function renderCardsSection(sectionValue: unknown, prefix: 'item' | 'reason') {
  const section = asRecord(sectionValue)
  if (!section) return null
  const cards = numberedPairs(section, `${prefix}`, `${prefix}`, true)
  if (cards.length === 0) return null

  return (
    <section className="py-[90px] bg-[#eceef1]">
      <div className="max-w-[1280px] mx-auto px-[5%]">
        {stringValue(section.tag) ? <div className="section-tag mb-4">{stringValue(section.tag)}</div> : null}
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

function renderPricing(sectionValue: unknown) {
  const section = asRecord(sectionValue)
  if (!section) return null
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
  const first = stringValue(hero?.title) || stringValue(hero?.h1Line1) || stringValue(seo?.serviceName)
  const second = stringValue(hero?.subtitle) || stringValue(hero?.h1Line2)
  return [first, second].filter(Boolean).join(' ')
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
