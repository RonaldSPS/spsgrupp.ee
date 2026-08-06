import ServiceDetailTemplate from "@/app/components/templates/ServiceDetailTemplate";
import type { Locale } from "@/lib/slug-map";
import { serviceDetail } from "@/lib/pages/definitions/puhastusteenused";

export default function Puhastusteenused() {
  return <PuhastusteenusedPageView locale="et" />;
}

export function PuhastusteenusedPageView({ locale }: { locale: Locale }) {
  return <ServiceDetailTemplate etPath="/puhastusteenused" locale={locale} defs={serviceDetail} />;
}
