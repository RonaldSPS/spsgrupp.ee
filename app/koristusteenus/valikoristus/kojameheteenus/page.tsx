import SeoJsonLd from "../../../components/SeoJsonLd";
import Tooprotsess from "../../../components/Tooprotsess";
import OutdoorServicePage, { type OutdoorServicePageData } from "../_components/OutdoorServicePage";

const data: OutdoorServicePageData = {
  ariaLabel: "Kojamehe teenus",
  heroImage: "/kojameheteenus-1.jpg",
  image: "/kojameheteenus_2.jpg",
  imageAlt: "SPS Grupp kojamehe teenus kinnistutele",
  title: "Kojamehe teenus",
  titleAccent: "kinnistu igapäevaseks korrashoiuks",
  intro:
    "Kojamehe teenus hoiab sissepääsud, kõnniteed, prügialad ja hoone ümbruse korras igal hooajal. Sobib büroohoonetele, korteriühistutele ja ärikinnistutele.",
  cta: "Küsi kojamehe teenuse pakkumist",
  breadcrumb: "Kojamehe teenus",
  chips: [
    { value: "Igapäevane", label: "korrashoid", tone: "blue" },
    { value: "4 hooaega", label: "välitööd", tone: "green" },
    { value: "Üks", label: "kontaktisik", tone: "navy" },
  ],
  problemTitle: "Kinnistu korrashoid vajab järjepidevat kohalolekut",
  problemLeft:
    "Väliala läheb käest väikeste asjade kaudu: prügi sissepääsu juures, täitunud prügikastid, libedad trepid, lehed restides või lumi ukse ees. Need pisiasjad mõjutavad nii turvalisust kui ka hoone mainet.",
  problemRight:
    "SPS Grupi kojamehe teenus tähendab regulaarset ülevaatust ja praktilisi korrashoiutöid. Lepime kokku tööde sageduse, vastutusalad ja hooajalised lisad, et kinnistu oleks korras ilma pideva korraldamiseta.",
  serviceTitle: "Mida sisaldab kojamehe teenus?",
  serviceCards: [
    { bold: "Sissepääsude ja kõnniteede puhastus", desc: "Pühkimine, prahi eemaldus ja käidavate alade korrashoid." },
    { bold: "Prügialade korrashoid", desc: "Prügimajade, konteinerite ümbruse ja sorteerimisala regulaarne ülevaatus." },
    { bold: "Väikeprügi koristamine", desc: "Konid, pakendid, oksad ja muu igapäevane praht hoone ümbrusest." },
    { bold: "Hooajalised välitööd", desc: "Sügisel lehed, talvel lumi ja libedusetõrje, kevadel üldkorrastus." },
    { bold: "Sissepääsumattide ja treppide hooldus", desc: "Hoiame esindusala puhta ning vähendame mustuse kandumist siseruumidesse." },
    { bold: "Probleemide märkamine ja teavitamine", desc: "Anname teada kahjustustest, ummistustest või ohtlikest olukordadest." },
  ],
  reasonsTitle: "Miks tellida kojamehe teenus SPS Grupilt?",
  reasons: [
    { title: "Püsiv korrashoid", desc: "Kinnistu ei sõltu juhuslikest ühekordsetest töödest, vaid selgest hooldusrütmist." },
    { title: "Hooajad on kaetud", desc: "Ühe lepingu alla saab siduda suvise, sügisese ja talvise väliala hoolduse." },
    { title: "Selge vastutus", desc: "Lepime kokku tööde nimekirja ja vastutusalad, et ootused oleksid üheselt arusaadavad." },
    { title: "Kogemus ärikinnistutega", desc: "Teenindame objekte, kus puhtus, ligipääsetavus ja esinduslikkus peavad olema pidevalt tagatud." },
  ],
  priceTitle: "Millest sõltub kojamehe teenuse hind?",
  priceIntro:
    "Kojamehe teenuse hind sõltub kinnistu suurusest, tööde sagedusest, hooajalistest lisatöödest ja sellest, kas teenus sisaldab talvist valmisolekut.",
  priceCards: [
    { size: "Väike kinnistu", area: "1-2 korda nädalas", price: "al. 180€", period: "kuu", highlight: true },
    { size: "Ärikinnistu", area: "regulaarne graafik", price: "al. 350€", period: "kuu" },
    { size: "Täisteenus", area: "4 hooaega", price: "Individuaalne", period: "pakkumine" },
  ],
  priceNote: "Täisteenuse puhul saab kojamehe töö ühendada muruniitmise, lehekoristuse ja lumekoristusega.",
  statsTitle: "Kinnistu igapäevane korrashoid ühest kohast",
  statsIntro: "Kojamehe teenus vähendab halduskoormust ja aitab hoida kinnistu kasutajatele turvalise ning esindusliku.",
  stats: [
    { number: "4", label: "hooaega kaetud" },
    { number: "1", label: "kontakt ja leping" },
    { number: "20+", label: "aastat kogemust" },
  ],
  footerTitle: "Koostame teie kinnistule kojamehe hoolduskava",
  footerDescription:
    "Saatke objekti kirjeldus ja soovitud sagedus. Pakume praktilise graafiku, mis katab igapäevased ja hooajalised vajadused.",
  faq: [
    { q: "Kui sageli kojamees objektile tuleb?", a: "Sagedus lepitakse kokku vastavalt vajadusele. Levinud on 1-5 korda nädalas, suurematel objektidel ka igapäevaselt." },
    { q: "Kas talvine lumekoristus kuulub teenusesse?", a: "See sõltub lepingust. Kojamehe teenusele saab lisada lumekoristuse ja libedusetõrje." },
    { q: "Kas te koristate ka prügimaja ümbrust?", a: "Jah. Prügialade korrashoid on üks tavalisemaid kojamehe teenuse osi." },
    { q: "Kas teenus sobib korteriühistule?", a: "Jah. Teenus sobib nii korteriühistutele, büroohoonetele, laohoonetele kui ka muudele ärikinnistutele." },
  ],
};

export default function KojameheTeenus() {
  return (
    <>
      <SeoJsonLd
        serviceName="Kojamehe teenus"
        serviceDescription="Kojamehe teenus hoiab sissepääsud, kõnniteed, prügialad ja hoone ümbruse korras igal hooajal."
        serviceUrl="https://spsgrupp.ee/koristusteenus/valikoristus/kojameheteenus"
        breadcrumbs={[
          { position: 1, name: "Avaleht", item: "https://spsgrupp.ee" },
          { position: 2, name: "Koristusteenus", item: "https://spsgrupp.ee/koristusteenus" },
          { position: 3, name: "Välikoristus", item: "https://spsgrupp.ee/koristusteenus/valikoristus" },
          { position: 4, name: "Kojamehe teenus", item: "https://spsgrupp.ee/koristusteenus/valikoristus/kojameheteenus" },
        ]}
        faq={data.faq.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <OutdoorServicePage data={data} tooprotsess={
        <Tooprotsess
          title="Kuidas SPS kojamehe teenuse käivitab?"
          intro="SPS alustab objekti ülevaatusest, et töömeetod, sagedus ja tehnika vastaksid tegelikule vajadusele."
          steps={[
            ["Objekti ülevaatus", "Vaatame üle alad ja ligipääsud."],
            ["Tööde nimekiri", "Paneme kirja igapäevased ja hooajalised tööd."],
            ["Graafik", "Lepime kokku sageduse."],
            ["Teenuse algus", "Meeskond alustab graafiku järgi."],
            ["Tagasiside", "Täpsustame töömahtu vajaduse järgi."],
          ]}
        />
      } />
    </>
  );
}
