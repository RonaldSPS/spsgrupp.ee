import type { Metadata } from "next";
import ServiceSeoTemplate from "../../koristusteenus/_seo-template/ServiceSeoTemplate";
import { extendedServicePages } from "../../koristusteenus/_seo-template/extendedServices";

const data = extendedServicePages.muru2;

export const metadata: Metadata = {
  title: data.metadata.title,
  description: data.metadata.description,
  robots: { index: false, follow: false },
};

export default function MuruniitmineLeht() {
  return <ServiceSeoTemplate data={data} />;
}
