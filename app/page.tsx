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
        dangerouslySetInnerHTML={{ __html: renderLdJson(breadcrumbLd) }}
      />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <section data-section="hero"><Hero /></section>
        <section data-section="logos">
          <ScrollAnimation animation="fade-up" delay={100}>
            <Logos />
          </ScrollAnimation>
        </section>
        <section data-section="trust">
          <ScrollAnimation animation="fade-up" delay={200}>
            <Trust />
          </ScrollAnimation>
        </section>
        <section data-section="testimonials">
          <ScrollAnimation animation="fade-up" delay={300}>
            <Testimonials />
          </ScrollAnimation>
        </section>
        <section data-section="industries">
          <ScrollAnimation animation="fade-up" delay={400}>
            <Industries />
          </ScrollAnimation>
        </section>
        <section data-section="services">
          <ScrollAnimation animation="fade-up" delay={500}>
            <Services />
          </ScrollAnimation>
        </section>
        <section data-section="contact-form">
          <ScrollAnimation animation="fade-up" delay={600}>
            <ContactForm />
          </ScrollAnimation>
        </section>
        <section data-section="faq">
          <ScrollAnimation animation="fade-up" delay={700}>
            <FAQ />
          </ScrollAnimation>
        </section>
      </main>
      <ScrollAnimation animation="fade-up" delay={800}>
        <Footer />
      </ScrollAnimation>
    </>
  );
}
