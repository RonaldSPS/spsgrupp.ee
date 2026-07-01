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

export const metadata: Metadata = {
  title: "Koristusfirma Tallinnas | SPS Grupp",
  description: "20+ aastase kogemusega koristusfirma Tallinnas. Hooldame üle miljoni m² iga päev. ISO 9001 sertifikaat. Küsi tasuta pakkumist!",
  keywords: "koristusfirma, koristusfirmad, puhastusfirma, koristusfirma tallinnas, äripindade koristus, koristusteenus tallinn",
  openGraph: {
    title: "Koristusfirma Tallinnas | SPS Grupp",
    description: "20+ aastase kogemusega koristusfirma Tallinnas. Hooldame üle miljoni m² iga päev.",
    type: "website",
    locale: "et_EE",
    images: [{ url: "https://spsgrupp.ee/SPS_LOGO.svg", width: 512, height: 512, alt: "SPS Grupp logo" }],
  },
  twitter: {
    card: "summary",
    title: "Koristusfirma Tallinnas | SPS Grupp",
    description: "20+ aastase kogemusega koristusfirma Tallinnas. Hooldame üle miljoni m² iga päev.",
  },
  alternates: {
    canonical: "https://spsgrupp.ee",
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
        "text": "Meil on 20+ aastat kogemust, ISO 9001 sertifikaat ja 200+ koolitatud töötajat."
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
      "item": "https://spsgrupp.ee"
    }
  ]
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://spsgrupp.ee/#organization",
  name: "SPS Grupp OÜ",
  url: "https://spsgrupp.ee",
  logo: "https://spsgrupp.ee/SPS_LOGO.svg",
  image: "https://spsgrupp.ee/SPS_LOGO.svg",
  description: "20+ aastase kogemusega koristusfirma Tallinnas. ISO 9001 sertifikaat.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Mustamäe tee 46",
    addressLocality: "Tallinn",
    postalCode: "10621",
    addressCountry: "EE",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+372-662-3328",
    contactType: "customer service",
    email: "info@spsgrupp.ee",
    availableLanguage: ["Estonian", "Russian", "English"],
  },
  sameAs: ["https://www.facebook.com/Puhastusteenused"],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <Navbar />
      <Hero />
      <main>
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