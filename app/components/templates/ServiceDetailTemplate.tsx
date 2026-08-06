import SeoJsonLd from "../SeoJsonLd";
import Tooprotsess from "../Tooprotsess";
import OutdoorServicePage from "../../koristusteenus/valikoristus/_components/OutdoorServicePage";
import type { Locale } from "@/lib/slug-map";

/* ------------------------------------------------------------------ */
/* Data types (moved from OutdoorServicePage.tsx — single source here) */
/* ------------------------------------------------------------------ */

type ServiceCard = {
  bold: string;
  desc: string;
};

type ReasonCard = {
  title: string;
  desc: string;
};

type PriceCard = {
  size: string;
  area: string;
  price: string;
  period: string;
  highlight?: boolean;
};

type FAQItem = {
  q: string;
  a: string;
};

export type ServiceInfoBlockData = {
  tag: string;
  title: string;
  intro: string;
  items: Array<{ title: string; description: string }>;
};

export type OutdoorServicePageData = {
  ariaLabel: string;
  heroImage: string;
  image: string;
  imageAlt: string;
  title: string;
  titleAccent: string;
  intro: string;
  cta: string;
  breadcrumb: string;
  parentBreadcrumb?: { etPath: string; label: string };
  chips: { value: string; label: string; tone: "blue" | "green" | "navy" }[];
  problemTitle: string;
  problemLead: string;
  problemDescription: string;
  serviceTitle: string;
  serviceCards: ServiceCard[];
  reasonsTitle: string;
  reasons: ReasonCard[];
  priceTitle: string;
  priceIntro: string;
  priceCards: PriceCard[];
  priceNote: string;
  serviceInfoBlock?: ServiceInfoBlockData;
  footerTitle: string;
  footerDescription: string;
  faq: FAQItem[];
};

/* ------------------------------------------------------------------ */
/* Template wiring types                                               */
/* ------------------------------------------------------------------ */

export type ServiceDetailSeo = {
  serviceName: string;
  serviceDescription: string;
};

export type ServiceDetailTooprotsess = {
  title: string;
  intro: string;
  steps: [string, string][];
};

export type ServiceDetailBreadcrumb = {
  name: string;
  etPath: string;
};

/** Everything the template needs for one locale of one page. */
export type ServiceDetailLocaleData = {
  data: OutdoorServicePageData;
  seo: ServiceDetailSeo;
  tooprotsess: ServiceDetailTooprotsess;
  breadcrumbs: ServiceDetailBreadcrumb[];
};

/** Export shape of lib/pages/definitions/<slug>.ts consumed by this template. */
export type ServiceDetailDefs = Record<Locale, ServiceDetailLocaleData>;

/* ------------------------------------------------------------------ */
/* Template                                                            */
/* ------------------------------------------------------------------ */

export default function ServiceDetailTemplate({
  etPath,
  locale,
  defs,
}: {
  etPath: string;
  locale: Locale;
  defs: ServiceDetailDefs;
}) {
  const { data, seo, tooprotsess, breadcrumbs } = defs[locale];
  return (
    <>
      <SeoJsonLd
        etPath={etPath}
        locale={locale}
        serviceName={seo.serviceName}
        serviceDescription={seo.serviceDescription}
        breadcrumbs={breadcrumbs}
        faq={data.faq.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <OutdoorServicePage
        data={data}
        locale={locale}
        tooprotsess={
          <Tooprotsess title={tooprotsess.title} intro={tooprotsess.intro} steps={tooprotsess.steps} locale={locale} />
        }
      />
    </>
  );
}
