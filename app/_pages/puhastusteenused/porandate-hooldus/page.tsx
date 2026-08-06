import ServiceDetailTemplate from "@/app/components/templates/ServiceDetailTemplate";
import type { Locale } from "@/lib/slug-map";
import { serviceDetail } from "@/lib/pages/definitions/porandate-hooldus";

export default function Page() {
  return <PorandateHooldusPageView locale="et" />;
}

export function PorandateHooldusPageView({ locale }: { locale: Locale }) {
  return <ServiceDetailTemplate etPath="/puhastusteenused/porandate-hooldus" locale={locale} defs={serviceDetail} />;
}
