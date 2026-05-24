import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ScrollAnimation from "./components/ScrollAnimation";
import Logos from "./components/Logos";
import HomeAuthority from "./components/HomeAuthority";
import Testimonials from "./components/Testimonials";
import Industries from "./components/Industries";
import FAQ from "./components/FAQ";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Koristusfirma Tallinnas | SPS Grupp",
  description: "Koristusfirma ärikliendile Tallinnas ja Harjumaal. SPS Grupp loob tööplaani, juhib kvaliteeti ja hooldab üle miljoni m² äripindu kuus.",
  keywords: "koristusfirma, koristusfirmad, puhastusfirma, koristusfirma tallinnas, äripindade koristus, koristusteenus tallinn",
  openGraph: {
    title: "Koristusfirma Tallinnas | SPS Grupp",
    description: "Koristusfirma ärikliendile Tallinnas ja Harjumaal. Tööplaan, kvaliteedikontroll ja 20+ aastat kogemust.",
    type: "website",
    locale: "et_EE",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Kui sageli peaks äriruume koristama?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Enamikule ettevõtetele sobib koristus 3-5 korda nädalas, kuid täpne sagedus sõltub ruumide kasutusest, töötajate arvust, kliendiliiklusest ja sanitaarruumide koormusest.",
      },
    },
    {
      "@type": "Question",
      name: "Kuidas võrrelda koristusfirma pakkumisi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pakkumisi tuleb võrrelda töömahu, sageduse, vastutuse, kvaliteedikontrolli ja perioodiliste tööde järgi. Ainult ruutmeetri hind ei näita kogu teenuse sisu.",
      },
    },
    {
      "@type": "Question",
      name: "Miks valida SPS Grupp?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SPS Grupp sobib ärikliendile, kes vajab selget tööplaani, objektijuhtimist, kvaliteedikontrolli, koolitatud meeskonda ja üle 20 aasta kogemust suurte pindade hoolduses.",
      },
    },
    {
      "@type": "Question",
      name: "Kas SPS koristab töövälisel ajal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Jah. Graafiku saab kokku leppida varahommikuks, õhtuks või nädalavahetuseks, et koristus ei segaks ettevõtte igapäevast tööd.",
      },
    },
    {
      "@type": "Question",
      name: "Kas koristusfirma toob ise töövahendid?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Jah. Koristusfirma kasutab professionaalseid töövahendeid ja puhastusaineid ning lepingu alguses lepitakse kokku ka tarvikute täitmise vastutus.",
      },
    },
  ],
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Avaleht",
      item: "https://spsgrupp.ee",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Koristusfirma",
      item: "https://spsgrupp.ee",
    },
  ],
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
      <Navbar />
      <Hero />
      <main>
        <ScrollAnimation animation="fade-up" delay={100}>
          <Logos />
        </ScrollAnimation>
        <ScrollAnimation animation="fade-up" delay={200}>
          <HomeAuthority />
        </ScrollAnimation>
        <ScrollAnimation animation="fade-up" delay={300}>
          <Industries />
        </ScrollAnimation>
        <ScrollAnimation animation="fade-up" delay={400}>
          <Testimonials />
        </ScrollAnimation>
        <ScrollAnimation animation="fade-up" delay={500}>
          <ContactForm />
        </ScrollAnimation>
        <ScrollAnimation animation="fade-up" delay={600}>
          <FAQ />
        </ScrollAnimation>
      </main>
      <ScrollAnimation animation="fade-up" delay={700}>
        <Footer />
      </ScrollAnimation>
    </>
  );
}
