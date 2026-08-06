import ServiceDetailTemplate from "@/app/components/templates/ServiceDetailTemplate";
import type { Locale } from "@/lib/slug-map";
import { serviceDetail } from "@/lib/pages/definitions/grafiti-eemaldamine";

export default function GrafitiEemaldamine() {
  return <GrafitiEemaldaminePageView locale="et" />;
}

export function GrafitiEemaldaminePageView({ locale }: { locale: Locale }) {
  return <ServiceDetailTemplate etPath="/koristusteenus/valikoristus/grafiti-eemaldamine" locale={locale} defs={serviceDetail} />;
}
