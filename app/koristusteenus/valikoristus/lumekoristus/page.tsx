import ServiceDetailTemplate from "@/app/components/templates/ServiceDetailTemplate";
import type { Locale } from "@/lib/slug-map";
import { serviceDetail } from "@/lib/pages/definitions/lumekoristus";

export default function Lumekoristus() {
  return <LumekoristusPageView locale="et" />;
}

export function LumekoristusPageView({ locale }: { locale: Locale }) {
  return <ServiceDetailTemplate etPath="/koristusteenus/valikoristus/lumekoristus" locale={locale} defs={serviceDetail} />;
}
