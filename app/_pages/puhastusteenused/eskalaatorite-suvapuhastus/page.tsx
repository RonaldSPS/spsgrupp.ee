import ServiceDetailTemplate from "@/app/components/templates/ServiceDetailTemplate";
import type { Locale } from "@/lib/slug-map";
import { serviceDetail } from "@/lib/pages/definitions/eskalaatorite-suvapuhastus";

export default function Page() {
  return <EskalaatoriteSuvapuhastusPageView locale="et" />;
}

export function EskalaatoriteSuvapuhastusPageView({ locale }: { locale: Locale }) {
  return <ServiceDetailTemplate etPath="/puhastusteenused/eskalaatorite-suvapuhastus" locale={locale} defs={serviceDetail} />;
}
