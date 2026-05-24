import type { Metadata } from "next";
import ServiceSeoTemplate from "../../_seo-template/ServiceSeoTemplate";
import { serviceSeoPages } from "../../_seo-template/services";

const data = serviceSeoPages.kojameheteenus;

export const metadata: Metadata = {
  title: data.metadata.title,
  description: data.metadata.description,
  robots: { index: false, follow: false },
  openGraph: { title: data.metadata.title, description: data.metadata.description, type: "website", locale: "et_EE" },
};

export default function KojameheteenusSeoNaidis() {
  return <ServiceSeoTemplate data={data} />;
}
