import ServiceDetailTemplate from "@/app/components/templates/ServiceDetailTemplate";
import type { Locale } from "@/lib/slug-map";
import { serviceDetail } from "@/lib/pages/definitions/torutood";

export default function Page() {
  return <TorutoodPageView locale="et" />;
}

export function TorutoodPageView({ locale }: { locale: Locale }) {
  return <ServiceDetailTemplate etPath="/remonditeenused-tallinnas/torutood" locale={locale} defs={serviceDetail} />;
}
