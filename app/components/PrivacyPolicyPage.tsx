import type { ReactNode } from 'react'
import etMessages from '@/messages/et.json'
import enMessages from '@/messages/en.json'
import ruMessages from '@/messages/ru.json'
import type { Locale } from '@/lib/slug-map'
import Navbar from './Navbar'
import FooterCTA from './FooterCTA'
import Footer from './Footer'

type PolicyBlock =
  | { type: 'paragraph'; content: string }
  | { type: 'list'; items: string[] }

interface PolicySection {
  title: string
  blocks: PolicyBlock[]
}

interface PolicyContent {
  title: string
  intro: string[]
  sections: PolicySection[]
}

const policyByLocale = {
  et: etMessages.privacyPolicy,
  en: enMessages.privacyPolicy,
  ru: ruMessages.privacyPolicy,
} as const

export default function PrivacyPolicyPage({ locale }: { locale: Locale }) {
  const policy = policyByLocale[locale] as PolicyContent

  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="pt-[130px] pb-[80px]">
        <article className="max-w-[900px] mx-auto px-[25px]">
          <h1 className="text-[42px] font-bold text-[#17345a] mb-8">{policy.title}</h1>

          {policy.intro.map((paragraph, index) => (
            <p
              key={`intro-${index}`}
              className={`text-[15px] text-[#2f353f] leading-relaxed ${index === policy.intro.length - 1 ? 'mb-8' : 'mb-4'}`}
            >
              {renderRichText(paragraph)}
            </p>
          ))}

          {policy.sections.map((section) => (
            <section key={section.title} className="mb-8">
              <h2 className="text-[28px] font-bold text-[#17345a] mb-4">{section.title}</h2>
              {section.blocks.map((block, index) => {
                if (block.type === 'list') {
                  return (
                    <ul
                      key={`${section.title}-list-${index}`}
                      className="list-disc pl-6 mb-4 text-[15px] text-[#2f353f] leading-relaxed space-y-1"
                    >
                      {block.items.map((item, itemIndex) => (
                        <li key={`${section.title}-${index}-${itemIndex}`}>{renderRichText(item)}</li>
                      ))}
                    </ul>
                  )
                }

                return (
                  <p
                    key={`${section.title}-paragraph-${index}`}
                    className="text-[15px] text-[#2f353f] leading-relaxed mb-4"
                  >
                    {renderRichText(block.content)}
                  </p>
                )
              })}
            </section>
          ))}
        </article>
      </main>
      <FooterCTA />
      <Footer />
    </>
  )
}

function renderRichText(value: string): ReactNode[] {
  const parts = value.split(/(<strong>.*?<\/strong>)/g).filter(Boolean)
  return parts.map((part, index) => {
    const strong = part.match(/^<strong>(.*?)<\/strong>$/)
    return strong
      ? <strong key={index}>{strong[1]}</strong>
      : <span key={index}>{part}</span>
  })
}
