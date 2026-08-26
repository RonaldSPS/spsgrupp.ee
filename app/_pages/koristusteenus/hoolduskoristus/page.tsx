import ServiceDetailTemplate from "@/app/components/templates/ServiceDetailTemplate";
import type { Locale } from "@/lib/slug-map";
import { serviceDetail } from "@/lib/pages/definitions/hoolduskoristus";

export default function Hoolduskoristus() {
  return <HoolduskoristusPageView locale="et" />;
}

export function HoolduskoristusPageView({ locale }: { locale: Locale }) {
  return <ServiceDetailTemplate etPath="/koristusteenus/hoolduskoristus" locale={locale} defs={serviceDetail} />;
}
