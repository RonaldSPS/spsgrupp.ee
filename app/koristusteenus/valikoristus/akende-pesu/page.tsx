import ServiceDetailTemplate from "@/app/components/templates/ServiceDetailTemplate";
import type { Locale } from "@/lib/slug-map";
import { serviceDetail } from "@/lib/pages/definitions/akende-pesu";

export default function AkendePesu() {
  return <AkendePesuPageView locale="et" />;
}

export function AkendePesuPageView({ locale }: { locale: Locale }) {
  return <ServiceDetailTemplate etPath="/koristusteenus/valikoristus/akende-pesu" locale={locale} defs={serviceDetail} />;
}
