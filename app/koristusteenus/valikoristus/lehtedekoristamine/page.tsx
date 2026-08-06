import ServiceDetailTemplate from "@/app/components/templates/ServiceDetailTemplate";
import type { Locale } from "@/lib/slug-map";
import { serviceDetail } from "@/lib/pages/definitions/lehtedekoristamine";

export default function LehtedeKoristamine() {
  return <LehtedekoristaminePageView locale="et" />;
}

export function LehtedekoristaminePageView({ locale }: { locale: Locale }) {
  return <ServiceDetailTemplate etPath="/koristusteenus/valikoristus/lehtedekoristamine" locale={locale} defs={serviceDetail} />;
}
