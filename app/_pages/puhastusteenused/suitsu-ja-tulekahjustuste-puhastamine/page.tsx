import ServiceDetailTemplate from "@/app/components/templates/ServiceDetailTemplate";
import type { Locale } from "@/lib/slug-map";
import { serviceDetail } from "@/lib/pages/definitions/suitsu-ja-tulekahjustuste-puhastamine";

export default function Page() {
  return <SuitsuJaTulekahjustustePuhastaminePageView locale="et" />;
}

export function SuitsuJaTulekahjustustePuhastaminePageView({ locale }: { locale: Locale }) {
  return <ServiceDetailTemplate etPath="/puhastusteenused/suitsu-ja-tulekahjustuste-puhastamine" locale={locale} defs={serviceDetail} />;
}
