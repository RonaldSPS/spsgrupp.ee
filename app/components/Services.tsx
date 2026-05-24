import Link from "next/link";
import TwoToneHeading from "./TwoToneHeading";

export default function Services() {
  return (
    <section className="services-section py-[100px] bg-white" id="teenused">
      <div className="max-w-[1280px] mx-auto px-[5%]">
        <div className="mb-12 max-w-[800px] mx-auto">
          <TwoToneHeading text="Miks Eesti suurettevõtted valivad SPS Grupi koristusfirmaks?" />
          <div className="text-[16px] text-[#333a46] leading-[1.8]">
            <p className="mb-4">
              <Link href="/koristusteenus" className="text-[#17345a] underline hover:text-[#5ab5da]">Koristusteenuse</Link> pakkuja valikul ei ole küsimus ainult hinnas. Enamik firmasid, kes meie poole pöörduvad, on varasemalt juba teenusepakkujat vahetanud, põhjuseks ebastabiilne kvaliteet, kehv kommunikatsioon või puuduv vastutus.
            </p>
            <p className="mb-4">
              Hea teenus ei sõltu ainult koristajast. Oluline on <strong className="font-semibold text-[#17345a]">süsteem: selge tööplaan, regulaarne kvaliteedikontroll ja kiire reageerimine</strong> olukordades, mis igapäevatöös paratamatult tekivad. See kehtib nii <Link href="/koristusteenus/kontori-koristus" className="text-[#17345a] underline hover:text-[#5ab5da]">kontorikoristuse</Link>, <Link href="/puhastusteenused" className="text-[#17345a] underline hover:text-[#5ab5da]">puhastusteenuste</Link> kui ka <Link href="/remonditeenused-tallinnas" className="text-[#17345a] underline hover:text-[#5ab5da]">remonditeenuste</Link> puhul.
            </p>
            <p className="mb-4">
              SPS Grupp on aastaid keskendunud just äriklientidele. Meie <Link href="/koristusteenus" className="text-[#17345a] underline hover:text-[#5ab5da]">koristusteenus</Link> põhineb standardiseeritud protsessidel, koolitatud meeskonnal ja digitaalsel tööde jälgimisel. See annab kindluse, et teenus toimib järjepidevalt ka siis, kui inimesed või olukorrad muutuvad.
            </p>
            <p>
              Kui otsite partnerit, kes hoiab püsivat kvaliteeti läbi aastate, võtke meiega ühendust. Alustame vajaduste kaardistamisest ja läbipaistvast hinnapakkumisest.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
