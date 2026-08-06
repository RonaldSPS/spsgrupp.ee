import ServiceDetailTemplate from "@/app/components/templates/ServiceDetailTemplate";
import type { Locale } from "@/lib/slug-map";
import { serviceDetail } from "@/lib/pages/definitions/siseviimistlustood";

export default function Page() {
  return <SiseviimistlustoodPageView locale="et" />;
}

export function SiseviimistlustoodPageView({ locale }: { locale: Locale }) {
  return <ServiceDetailTemplate etPath="/remonditeenused-tallinnas/siseviimistlustood" locale={locale} defs={serviceDetail} />;
}
