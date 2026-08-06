import ServiceDetailTemplate from "@/app/components/templates/ServiceDetailTemplate";
import type { Locale } from "@/lib/slug-map";
import { serviceDetail } from "@/lib/pages/definitions/remonditeenused-tallinnas";

export default function Remonditeenused() {
  return <RemonditeenusedPageView locale="et" />;
}

export function RemonditeenusedPageView({ locale }: { locale: Locale }) {
  return <ServiceDetailTemplate etPath="/remonditeenused-tallinnas" locale={locale} defs={serviceDetail} />;
}
