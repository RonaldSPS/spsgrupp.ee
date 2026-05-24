import Image from "next/image";
import Link from "next/link";
import TwoToneHeading from "./TwoToneHeading";

const proofPoints = [
  {
    value: "20+ aastat",
    label: "kogemust äripindade hoolduses",
  },
  {
    value: "ISO 9001 / 14001",
    label: "kvaliteedi- ja keskkonnajuhtimine",
  },
  {
    value: "200+ inimest",
    label: "koolitatud meeskonnas",
  },
  {
    value: "üle miljoni m²",
    label: "hooldatavat pinda",
  },
];

const serviceStories = [
  {
    title: "Regulaarne koristusteenus",
    href: "/koristusteenus/kontori-koristus-seo-naidis",
    image: "/regulaarnekoristusteenus.jpg",
    text: "Igapäevane rütm, mille aluseks on ruumide kasutus, inimeste liikumine ja selgelt kirjeldatud tööplaan. SPS ei müü lihtsalt tunde, vaid toimivat koristussüsteemi.",
  },
  {
    title: "Puhastusteenused ja eritööd",
    href: "/puhastusteenused",
    image: "/puhastusteenused2.jpg",
    text: "Kui tavakoristus enam ei piisa, valime pinna, mustuse ja eesmärgi järgi õige meetodi: vaibad, põrandad, aknad, ehitusjärgne koristus ja desinfitseerimine.",
  },
  {
    title: "Välikoristus ja kinnistu hooldus",
    href: "/koristusteenus/valikoristus-seo-naidis",
    image: "/valikoristus-2.jpg",
    text: "Hoone mulje algab uksest väljaspool: sissepääsud, teed, lumi, lehed, muru ja fassaadid vajavad sama selget vastutust kui siseruumid.",
  },
];

const comparisonRows = [
  {
    question: "Selge tööplaan teeb koostöö lihtsaks",
    sps: "SPS kirjeldab sageduse, vastutuse, eripinnad ja perioodilised tööd enne lepingu algust.",
    risk: "Kui tööde sisu on algusest peale arusaadav, on ka igapäevane koostöö sujuvam ja ootused mõlemal poolel selged.",
  },
  {
    question: "Kvaliteet püsib, kui sellel on omanik",
    sps: "Objektijuht hoiab silma peal tööde rütmil, suhtlusel ja kiirel infovahetusel.",
    risk: "Kliendi jaoks tähendab see, et kokkulepped ei jää üksikute inimeste mälu peale, vaid teenusel on kindel juhtimine.",
  },
  {
    question: "Hea pakkumine näitab kogu teenuse sisu",
    sps: "Aitame lähteülesande selgeks teha, et hind, sagedus ja tööde ulatus oleksid arusaadavad.",
    risk: "Nii saab otsust teha rahulikult: mitte ainult hinna, vaid ka tegeliku töömahu, korralduse ja vastutuse põhjal.",
  },
];

export default function HomeAuthority() {
  return (
    <>
      <section className="py-[100px] bg-white">
        <div className="max-w-[1280px] mx-auto px-[5%]">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-14 items-center">
            <div>
              <div className="section-tag">Koristusfirma valik</div>
              <TwoToneHeading text="Puhas töökeskkond toetab head tööpäeva" />
              <div className="space-y-5 text-[17px] leading-[1.85] text-[#2f353f] font-light mt-7">
                <p>
                  Hea koristuspartner aitab hoida ettevõtte igapäevase rütmi selge ja esindusliku. Kui kontor, kaubanduspind või tootmishoone on hooldatud, on lihtsam keskenduda inimestele, klientidele ja tööle endale.
                </p>
                <p>
                  SPS Grupp loob koristusteenuse ümber läbimõeldud tööplaani: milliseid ruume hooldatakse, kui tihti seda tehakse, millised pinnad vajavad erihooldust ja kuidas kvaliteeti järjepidevalt hoitakse. Nii on teenus arusaadav, stabiilne ja lihtne juhtida.
                </p>
                <p>
                  SPS sobib ettevõtetele, kes näevad puhtust osana oma teenindusest, tööohutusest ja professionaalsest esmamuljest. Meie roll on teha see igapäevane standard kliendi jaoks mugavaks.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="#pakkumine" className="btn-primary text-[15px] py-2.5 px-4">
                  Küsi pakkumist
                </Link>
                <Link href="/koristusteenus/kontori-koristus-seo-naidis" className="btn-outline text-[15px] py-2.5 px-4">
                  Vaata kontorikoristust
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative min-h-[520px] rounded-[8px] overflow-hidden shadow-lg">
                <Image
                  src="/kontorikoristus2.jpg"
                  alt="SPS Grupp koristusfirma kontori- ja äripindadele"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  style={{ color: "#2d3748" }}
                />
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-[#0f1f33]/85 to-transparent">
                  <p className="text-[15px] leading-[1.7] text-white max-w-[520px]">
                    SPSi tugevus on suurte äripindade praktiline korraldus: inimesed, töövahendid, objektijuht ja kvaliteedikontroll peavad töötama ühe süsteemina.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {proofPoints.map((item) => (
                  <div key={item.value} className="rounded-[8px] bg-[#f8fafc] border border-[rgba(23,52,90,0.08)] p-4">
                    <div className="text-[20px] font-bold text-[#17345a] leading-tight">{item.value}</div>
                    <div className="text-[15px] text-[#5a6474] leading-[1.45] mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-[95px] bg-[#eceef1]">
        <div className="max-w-[1280px] mx-auto px-[5%]">
          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 items-start">
            <div>
              <div className="section-tag">Võrdlemise raam</div>
              <TwoToneHeading text="Kuidas valida koostööks õige koristusfirma?" />
              <p className="text-[17px] leading-[1.8] text-[#2f353f] font-light mt-6">
                Hea valik algab arusaadavast lähteülesandest. Kui tööde ulatus, sagedus ja vastutus on selgelt kokku lepitud, saab koristusteenusest toetav osa ettevõtte igapäevasest toimimisest.
              </p>
            </div>
            <div className="space-y-4">
              {comparisonRows.map((row) => (
                <article key={row.question} className="rounded-[8px] bg-white border border-[rgba(23,52,90,0.08)] p-6 shadow-sm">
                  <h3 className="text-[22px] leading-[1.3] font-bold text-[#17345a] mb-4">{row.question}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <p className="text-[15px] leading-[1.75] text-[#2f353f] font-light">
                      <strong className="text-[#17345a] font-semibold">SPSi lähenemine: </strong>
                      {row.sps}
                    </p>
                    <p className="text-[15px] leading-[1.75] text-[#2f353f] font-light">
                      <strong className="text-[#17345a] font-semibold">Mida see kliendile annab: </strong>
                      {row.risk}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-[100px] bg-white">
        <div className="max-w-[1280px] mx-auto px-[5%]">
          <div className="max-w-[760px] mb-12">
            <div className="section-tag">Teenused</div>
            <TwoToneHeading text="Üks koristusfirma, mitu töövoogu" />
            <p className="text-[17px] leading-[1.8] text-[#2f353f] font-light mt-6">
              SPS aitab hoida korras nii siseruumid, välialad kui ka erihooldust vajavad pinnad. Kliendi jaoks tähendab see üht partnerit, selget vastutust ja teenuseid, mida saab kasvatada koos hoone tegeliku vajadusega.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {serviceStories.map((service) => (
              <Link key={service.href} href={service.href} className="group no-underline rounded-[8px] overflow-hidden bg-[#f8fafc] border border-[rgba(23,52,90,0.08)] transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="relative h-[260px]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    style={{ color: "#2d3748" }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-[22px] font-bold text-[#17345a] leading-[1.3] mb-4">{service.title}</h3>
                  <p className="text-[15px] leading-[1.75] text-[#2f353f] font-light">{service.text}</p>
                  <span className="inline-flex items-center mt-5 text-[15px] font-medium text-[#0078b5]">
                    Vaata teenust
                    <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
