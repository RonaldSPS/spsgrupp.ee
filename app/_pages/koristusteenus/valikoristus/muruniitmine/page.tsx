import ServiceDetailTemplate from "@/app/components/templates/ServiceDetailTemplate";
import type { Locale } from "@/lib/slug-map";
import { serviceDetail } from "@/lib/pages/definitions/muruniitmine";

export default function Muruniitmine() {
  return <MuruniitminePageView locale="et" />;
}

export function MuruniitminePageView({ locale }: { locale: Locale }) {
  return <ServiceDetailTemplate etPath="/koristusteenus/valikoristus/muruniitmine" locale={locale} defs={serviceDetail} />;
}
