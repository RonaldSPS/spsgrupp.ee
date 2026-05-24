import type { Metadata } from "next";
import ServiceSeoTemplate from "../koristusteenus/_seo-template/ServiceSeoTemplate";
import { extendedServicePages } from "../koristusteenus/_seo-template/extendedServices";

const data = extendedServicePages.ehitusprahi;

export const metadata: Metadata = {
  title: data.metadata.title,
  description: data.metadata.description,
  robots: { index: false, follow: false },
};

export default function EhitusprahiAravedu() {
  return <ServiceSeoTemplate data={data} />;
}
