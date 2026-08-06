import ServiceDetailTemplate from "@/app/components/templates/ServiceDetailTemplate";
import type { Locale } from "@/lib/slug-map";
import { serviceDetail } from "@/lib/pages/definitions/ehitusprahi-aravedu";

export default function EhitusprahiAravedu() {
  return <EhitusprahiPageView locale="et" />;
}

export function EhitusprahiPageView({ locale }: { locale: Locale }) {
  return <ServiceDetailTemplate etPath="/ehitusprahi-aravedu" locale={locale} defs={serviceDetail} />;
}
