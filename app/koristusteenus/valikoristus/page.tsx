import ServiceDetailTemplate from "@/app/components/templates/ServiceDetailTemplate";
import type { Locale } from "@/lib/slug-map";
import { serviceDetail } from "@/lib/pages/definitions/valikoristus";

export default function Page() {
  return <ValikoristusPageView locale="et" />;
}

export function ValikoristusPageView({ locale }: { locale: Locale }) {
  return <ServiceDetailTemplate etPath="/koristusteenus/valikoristus" locale={locale} defs={serviceDetail} />;
}
