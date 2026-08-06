import ServiceDetailTemplate from "@/app/components/templates/ServiceDetailTemplate";
import type { Locale } from "@/lib/slug-map";
import { serviceDetail } from "@/lib/pages/definitions/plaatimistood";

export default function Page() {
  return <PlaatinistoodPageView locale="et" />;
}

export function PlaatinistoodPageView({ locale }: { locale: Locale }) {
  return <ServiceDetailTemplate etPath="/remonditeenused-tallinnas/plaatimistood" locale={locale} defs={serviceDetail} />;
}
