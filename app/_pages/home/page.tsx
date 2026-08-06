import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import Logos from "../../components/Logos";
import Services from "../../components/Services";
import Testimonials from "../../components/Testimonials";
import Industries from "../../components/Industries";
import Trust from "../../components/Trust";
import FAQ from "../../components/FAQ";
import ContactForm from "../../components/ContactForm";
import Footer from "../../components/Footer";
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
  other: {
    "og:locale:alternate": ["en_US", "ru_RU"],
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
          <Logos animDelay={100} />
        </section>
        <section data-section="trust">
          <Trust animDelay={200} />
        </section>
        <section data-section="testimonials">
          <Testimonials animDelay={300} />
        </section>
        <section data-section="industries">
          <Industries animDelay={400} />
        </section>
        <section data-section="services">
          <Services animDelay={500} />
        </section>
        <section data-section="contact-form">
          <ContactForm animDelay={600} />
        </section>
        <section data-section="faq">
          <FAQ animDelay={700} />
        </section>
      </main>
      <Footer animDelay={800} />
    </>
  );
}
