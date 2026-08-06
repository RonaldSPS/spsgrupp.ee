import ServiceDetailTemplate from "@/app/components/templates/ServiceDetailTemplate";
import type { Locale } from "@/lib/slug-map";
import { serviceDetail } from "@/lib/pages/definitions/sanitaarremont-ja-umberehitus";

export default function Page() {
  return <SanitaarremontPageView locale="et" />;
}

export function SanitaarremontPageView({ locale }: { locale: Locale }) {
  return <ServiceDetailTemplate etPath="/remonditeenused-tallinnas/sanitaarremont-ja-umberehitus" locale={locale} defs={serviceDetail} />;
}
