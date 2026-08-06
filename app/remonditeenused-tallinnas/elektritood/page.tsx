import ServiceDetailTemplate from "@/app/components/templates/ServiceDetailTemplate";
import type { Locale } from "@/lib/slug-map";
import { serviceDetail } from "@/lib/pages/definitions/elektritood";

export default function Page() {
  return <ElektritoodPageView locale="et" />;
}

export function ElektritoodPageView({ locale }: { locale: Locale }) {
  return <ServiceDetailTemplate etPath="/remonditeenused-tallinnas/elektritood" locale={locale} defs={serviceDetail} />;
}
