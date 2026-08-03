import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ScrollAnimation from "./components/ScrollAnimation";
import Logos from "./components/Logos";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";
import Industries from "./components/Industries";
import Trust from "./components/Trust";
import FAQ from "./components/FAQ";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import { renderLdJson } from "@/lib/json-ld-generator";
import { absoluteUrl, BASE_URL, canonicalUrl } from "@/lib/url-utils";

export const metadata: Metadata = {
  title: "Koristusfirma Tallinnas | SPS Grupp",
  description: "Alates 2006. aastast tegutsev koristusfirma Tallinnas. Üle 1 000 000 m² meie hoolduses. ISO 9001 ja ISO 14001. Küsi pakkumist!",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "Koristusfirma Tallinnas | SPS Grupp",
    description: "Alates 2006. aastast tegutsev koristusfirma Tallinnas. Üle 1 000 000 m² meie hoolduses.",
    url: canonicalUrl("/"),
    type: "website",
    locale: "et_EE",
    images: [{ url: absoluteUrl("/FrontHeroCar.jpg"), alt: "SPS Grupp koristusteenused" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Koristusfirma Tallinnas | SPS Grupp",
    description: "Alates 2006. aastast tegutsev koristusfirma Tallinnas. Üle 1 000 000 m² meie hoolduses.",
    images: [absoluteUrl("/FrontHeroCar.jpg")],
  },
  alternates: {
    canonical: canonicalUrl("/"),
    languages: {
      et: canonicalUrl("/"),
      en: canonicalUrl("/en"),
      ru: canonicalUrl("/ru"),
      "x-default": canonicalUrl("/"),
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Kui sageli peaks äriruume koristama?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Enamikule ettevõtetele soovitame koristust 3–5 korda nädalas."
      }
    },
    {
      "@type": "Question",
      "name": "Kuidas kujuneb koristuse hind?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Hind sõltub ruumide suurusest, koristuse sagedusest ja eritööde vajadusest."
      }
    },
    {
      "@type": "Question",
      "name": "Miks valida SPS Grupp?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Tegutseme alates 2006. aastast, meil on ISO 9001 ja ISO 14001 sertifitseeritud juhtimissüsteemid ning enam kui 300 töötajat."
      }
    }
  ]
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Avaleht",
      "item": canonicalUrl("/")
    }
  ]
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderLdJson(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderLdJson(breadcrumbLd) }}
      />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <ScrollAnimation animation="fade-up" delay={100}>
          <Logos />
        </ScrollAnimation>
        <ScrollAnimation animation="fade-up" delay={200}>
          <Trust />
        </ScrollAnimation>
        <ScrollAnimation animation="fade-up" delay={300}>
          <Testimonials />
        </ScrollAnimation>
        <ScrollAnimation animation="fade-up" delay={400}>
          <Industries />
        </ScrollAnimation>
        <ScrollAnimation animation="fade-up" delay={500}>
          <Services />
        </ScrollAnimation>
        <ScrollAnimation animation="fade-up" delay={600}>
          <ContactForm />
        </ScrollAnimation>
        <ScrollAnimation animation="fade-up" delay={700}>
          <FAQ />
        </ScrollAnimation>
      </main>
      <ScrollAnimation animation="fade-up" delay={800}>
        <Footer />
      </ScrollAnimation>
    </>
  );
}
