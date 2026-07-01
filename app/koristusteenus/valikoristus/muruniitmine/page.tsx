import SeoJsonLd from "../../../components/SeoJsonLd";
import Tooprotsess from "../../../components/Tooprotsess";
import OutdoorServicePage, { type OutdoorServicePageData } from "../_components/OutdoorServicePage";

const data: OutdoorServicePageData = {
  ariaLabel: "Muruniitmine",
  heroImage: "/muruniitmine-1.webp",
  image: "/muruniitmin-2.jpg",
  imageAlt: "SPS Grupp muruniitmine ja haljasalade hooldus",
  title: "Muruniitmine",
  titleAccent: "Tallinnas ja Harjumaal",
  intro:
    "Regulaarne muruniitmine ärikinnistutele, korteriühistutele ja avalikele aladele. Hoiame haljasalad korras kogu kasvuperioodi vältel.",
  cta: "Küsi muruniitmise pakkumist",
  breadcrumb: "Muruniitmine",
  chips: [
    { value: "Hooajaline", label: "hooldus", tone: "blue" },
    { value: "Korrapärane", label: "graafik", tone: "green" },
    { value: "Ärikinnistud", label: "ja ühistud", tone: "navy" },
  ],
  problemTitle: "Hooldamata muru jätab kinnistust lohaka mulje",
  problemLeft:
    "Kõrgeks kasvanud muru, niitmata servad ja koristamata niide muudavad ka korraliku hoone ümbruse kiiresti hooletuks. Ärikinnistu, korteriühistu või esindushoone puhul on väliala esimene asi, mida külastaja märkab.",
  problemRight:
    "SPS Grupp koostab niitmisgraafiku vastavalt kasvukiirusele, ilmastikule ja objekti kasutusele. Me ei tee ainult ühekordset niitmist, vaid hoiame territooriumi kogu hooaja vältel ühtlaselt korras.",
  serviceTitle: "Mida sisaldab muruniitmise teenus?",
  serviceCards: [
    { bold: "Regulaarne muruniitmine", desc: "Niitmine kokkulepitud sagedusega kogu kasvuperioodi vältel." },
    { bold: "Servade trimmerdamine", desc: "Äärekivide, piirete, puude ja hooneümbruse täpne viimistlus." },
    { bold: "Niite kogumine või multšimine", desc: "Valime lahenduse vastavalt murupinnale ja objekti nõuetele." },
    { bold: "Haljasala ülevaatus", desc: "Märkame probleemseid kohti ning anname soovitusi hoolduse parandamiseks." },
    { bold: "Kõnniteede puhastus pärast niitmist", desc: "Eemaldame murujäägid teedelt, sissepääsudelt ja parkla servadest." },
    { bold: "Hooajaline hooldusleping", desc: "Üks kokkulepe, selge graafik ja prognoositav kulu." },
  ],
  reasonsTitle: "Miks tellida muruniitmine SPS Grupilt?",
  reasons: [
    { title: "Töö toimub graafiku järgi", desc: "Te ei pea iga kord eraldi helistama. Hoiame niitmissageduse kooskõlas hooaja ja ilmaga." },
    { title: "Korras servad ja sissepääsud", desc: "Trimmerdamine ja järelpuhastus annavad tulemusele viimistletud ilme." },
    { title: "Sobib suurtele pindadele", desc: "Teenindame äriparke, korteriühistuid, büroohooneid ja muid suuremaid kinnistuid." },
    { title: "Üks partner välitöödeks", desc: "Vajadusel ühendame muruniitmise lehekoristuse, kojameheteenuse ja talvise hooldusega." },
  ],
  priceTitle: "Millest sõltub muruniitmise hind?",
  priceIntro:
    "Hind sõltub niidetava ala suurusest, niitmise sagedusest, servatööde mahust ja sellest, kas niide kogutakse või multšitakse.",
  priceCards: [
    { size: "Väike kinnistu", area: "ühistu või büroo", price: "al. 60€", period: "kord", highlight: true },
    { size: "Keskmine ala", area: "ärikinnistu", price: "al. 120€", period: "kord" },
    { size: "Hooajaleping", area: "regulaarne hooldus", price: "Kuu hind", period: "pakkumine" },
  ],
  priceNote: "Täpse hinna anname pärast objekti ülevaatust või pindala ja töömahu kirjelduse põhjal.",
  statsTitle: "Haljasalade hooldus kindla graafikuga",
  statsIntro: "Regulaarne hooldus hoiab kinnistu esindusliku ja vähendab hooaja lõpus suuremate korrastustööde vajadust.",
  stats: [
    { number: "20+", label: "aastat kogemust" },
    { number: "1", label: "kindel kontaktisik" },
    { number: "100%", label: "kokkulepitud graafik" },
  ],
  footerTitle: "Tellige muruniitmise hooldusplaan",
  footerDescription:
    "Saatke meile kinnistu info ja koostame sobiva niitmisgraafiku koos hinnapakkumisega.",
  faq: [
    { q: "Kui tihti peaks muru niitma?", a: "Tavaliselt iga 7-14 päeva järel, sõltuvalt kasvuperioodist, ilmast ja kinnistu esinduslikkuse nõudest." },
    { q: "Kas teete ka trimmerdamist?", a: "Jah. Servade trimmerdamine kuulub teenuse juurde, kui see on pakkumises kokku lepitud." },
    { q: "Kas niide viiakse ära?", a: "Vajadusel kogume ja viime niite ära. Suurematel aladel on sageli mõistlik kasutada multšimist." },
    { q: "Kas saab sõlmida hooajalise lepingu?", a: "Jah. Hooajaleping on mugavaim lahendus, sest töö toimub automaatselt kokkulepitud graafiku järgi." },
  ],
};

export default function Muruniitmine() {
  return (
    <>
      <SeoJsonLd
        serviceName="Muruniitmine"
        serviceDescription="Muruniitmine ja haljasalade hooldus ärikinnisvaral. Regulaarne niitmine ja muru servade korrastus."
        serviceUrl="https://spsgrupp.ee/koristusteenus/valikoristus/muruniitmine"
        breadcrumbs={[
          { position: 1, name: "Avaleht", item: "https://spsgrupp.ee" },
          { position: 2, name: "Koristusteenus", item: "https://spsgrupp.ee/koristusteenus" },
          { position: 3, name: "Välikoristus", item: "https://spsgrupp.ee/koristusteenus/valikoristus" },
          { position: 4, name: "Muruniitmine", item: "https://spsgrupp.ee/koristusteenus/valikoristus/muruniitmine" },
        ]}
        faq={data.faq.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <OutdoorServicePage data={data} tooprotsess={
        <Tooprotsess
          title="Kuidas SPS muruniitmise graafiku koostab?"
          intro="SPS alustab objekti ülevaatusest, et töömeetod, sagedus ja tehnika vastaksid tegelikule vajadusele."
          steps={[
            ["Ala ülevaatus", "Hindame niidetava ala ja takistused."],
            ["Sageduse kokkulepe", "Lepime kokku hooajalise rütmi."],
            ["Servatööd", "Määrame trimmerdamise ulatuse."],
            ["Niitmine", "Teostame töö graafiku järgi."],
            ["Järelpuhastus", "Puhastame teed ja sissepääsud murujääkidest."],
          ]}
        />
      } />
    </>
  );
}
