import ServiceDetailTemplate from "@/app/components/templates/ServiceDetailTemplate";
import type { Locale } from "@/lib/slug-map";
import { serviceDetail } from "@/lib/pages/definitions/kojameheteenus";

export default function KojameheTeenus() {
  return <KojameheteenusPageView locale="et" />;
}

export function KojameheteenusPageView({ locale }: { locale: Locale }) {
  return <ServiceDetailTemplate etPath="/koristusteenus/valikoristus/kojameheteenus" locale={locale} defs={serviceDetail} />;
}
