type BreadcrumbItem = {
  position: number;
  name: string;
  item: string;
};

type FAQItem = {
  question: string;
  answer: string;
};

type Props = {
  serviceName: string;
  serviceDescription: string;
  serviceUrl: string;
  breadcrumbs: BreadcrumbItem[];
  faq?: FAQItem[];
};

const ORGANIZATION = {
  "@type": "Organization",
  name: "SPS Grupp OÜ",
  url: "https://spsgrupp.ee",
  logo: "https://spsgrupp.ee/SPS_LOGO.svg",
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
  areaServed: ["Tallinn", "Harjumaa"],
};

export default function SeoJsonLd({ serviceName, serviceDescription, serviceUrl, breadcrumbs, faq }: Props) {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    description: serviceDescription,
    provider: ORGANIZATION,
    areaServed: ["Tallinn", "Harjumaa"],
    url: serviceUrl,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs,
  };

  const orgSchema = {
    "@context": "https://schema.org",
    ...ORGANIZATION,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      {faq && faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faq.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            }),
          }}
        />
      )}
    </>
  );
}
