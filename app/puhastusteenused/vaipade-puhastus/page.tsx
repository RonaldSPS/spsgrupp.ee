import ServiceDetailTemplate from "@/app/components/templates/ServiceDetailTemplate";
import type { Locale } from "@/lib/slug-map";
import { serviceDetail } from "@/lib/pages/definitions/vaipade-puhastus";

export default function Page() {
  return <VaipadePuhastusPageView locale="et" />;
}

export function VaipadePuhastusPageView({ locale }: { locale: Locale }) {
  return <ServiceDetailTemplate etPath="/puhastusteenused/vaipade-puhastus" locale={locale} defs={serviceDetail} />;
}
