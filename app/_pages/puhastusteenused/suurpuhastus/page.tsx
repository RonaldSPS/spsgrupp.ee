import ServiceDetailTemplate from "@/app/components/templates/ServiceDetailTemplate";
import type { Locale } from "@/lib/slug-map";
import { serviceDetail } from "@/lib/pages/definitions/suurpuhastus";

export default function Suurpuhastus() {
  return <SuurpuhastusPageView locale="et" />;
}

export function SuurpuhastusPageView({ locale }: { locale: Locale }) {
  return <ServiceDetailTemplate etPath="/puhastusteenused/suurpuhastus" locale={locale} defs={serviceDetail} />;
}
