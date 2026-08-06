import ServiceDetailTemplate from "@/app/components/templates/ServiceDetailTemplate";
import type { Locale } from "@/lib/slug-map";
import { serviceDetail } from "@/lib/pages/definitions/tanavakivide-pesu-ja-hooldus";

export default function TanavakividePesu() {
  return <TanavakividePesuPageView locale="et" />;
}

export function TanavakividePesuPageView({ locale }: { locale: Locale }) {
  return <ServiceDetailTemplate etPath="/koristusteenus/valikoristus/tanavakivide-pesu-ja-hooldus" locale={locale} defs={serviceDetail} />;
}
