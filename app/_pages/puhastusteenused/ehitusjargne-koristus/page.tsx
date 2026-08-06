import ServiceDetailTemplate from "@/app/components/templates/ServiceDetailTemplate";
import type { Locale } from "@/lib/slug-map";
import { serviceDetail } from "@/lib/pages/definitions/ehitusjargne-koristus";

export default function Page() {
  return <EhitusjargneKoristusPageView locale="et" />;
}

export function EhitusjargneKoristusPageView({ locale }: { locale: Locale }) {
  return <ServiceDetailTemplate etPath="/puhastusteenused/ehitusjargne-koristus" locale={locale} defs={serviceDetail} />;
}
