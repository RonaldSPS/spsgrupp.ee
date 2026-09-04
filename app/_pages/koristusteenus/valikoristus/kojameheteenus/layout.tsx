import { generatePageMetadata } from "@/lib/metadata-helper";

export const metadata = generatePageMetadata({
  path: "/koristusteenus/valikoristus/kojameheteenus",
  locale: "et",
  title: "Kojameheteenus - välikoristus | SPS Grupp",
  description:
    "Kojameheteenus ärikinnistutele ja korteriühistutele. Sissepääsude, kõnniteede, prügialade ja hooneümbruse regulaarne korrashoid Tallinnas.",
  imagePath: "/kojameheteenus-1.jpg",
});

export default function KojameheTeenusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
