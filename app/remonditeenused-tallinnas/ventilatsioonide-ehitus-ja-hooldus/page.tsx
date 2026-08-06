import ServiceDetailTemplate from "@/app/components/templates/ServiceDetailTemplate";
import type { Locale } from "@/lib/slug-map";
import { serviceDetail } from "@/lib/pages/definitions/ventilatsioonide-ehitus-ja-hooldus";

export default function Page() {
  return <VentilatsioonidPageView locale="et" />;
}

export function VentilatsioonidPageView({ locale }: { locale: Locale }) {
  return <ServiceDetailTemplate etPath="/remonditeenused-tallinnas/ventilatsioonide-ehitus-ja-hooldus" locale={locale} defs={serviceDetail} />;
}
