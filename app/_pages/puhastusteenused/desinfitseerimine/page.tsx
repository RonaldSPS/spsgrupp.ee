import ServiceDetailTemplate from "@/app/components/templates/ServiceDetailTemplate";
import type { Locale } from "@/lib/slug-map";
import { serviceDetail } from "@/lib/pages/definitions/desinfitseerimine";

export default function Page() {
  return <DesinfitseeriminePageView locale="et" />;
}

export function DesinfitseeriminePageView({ locale }: { locale: Locale }) {
  return <ServiceDetailTemplate etPath="/puhastusteenused/koroonaviiruse-jargne-puhastus" locale={locale} defs={serviceDetail} />;
}
