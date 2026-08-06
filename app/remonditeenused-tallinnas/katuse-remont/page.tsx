import ServiceDetailTemplate from "@/app/components/templates/ServiceDetailTemplate";
import type { Locale } from "@/lib/slug-map";
import { serviceDetail } from "@/lib/pages/definitions/katuse-remont";

export default function Page() {
  return <KatuseRemontPageView locale="et" />;
}

export function KatuseRemontPageView({ locale }: { locale: Locale }) {
  return <ServiceDetailTemplate etPath="/remonditeenused-tallinnas/katuse-remont" locale={locale} defs={serviceDetail} />;
}
