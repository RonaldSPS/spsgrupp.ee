import ServiceDetailTemplate from "@/app/components/templates/ServiceDetailTemplate";
import type { Locale } from "@/lib/slug-map";
import { serviceDetail } from "@/lib/pages/definitions/fassaadipesu";

export default function Fassaadipesu() {
  return <FassaadipesuPageView locale="et" />;
}

export function FassaadipesuPageView({ locale }: { locale: Locale }) {
  return <ServiceDetailTemplate etPath="/koristusteenus/valikoristus/fassaadipesu" locale={locale} defs={serviceDetail} />;
}
