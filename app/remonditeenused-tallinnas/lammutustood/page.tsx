import ServiceDetailTemplate from "@/app/components/templates/ServiceDetailTemplate";
import type { Locale } from "@/lib/slug-map";
import { serviceDetail } from "@/lib/pages/definitions/lammutustood";

export default function Page() {
  return <LammutustoodPageView locale="et" />;
}

export function LammutustoodPageView({ locale }: { locale: Locale }) {
  return <ServiceDetailTemplate etPath="/remonditeenused-tallinnas/lammutustood" locale={locale} defs={serviceDetail} />;
}
