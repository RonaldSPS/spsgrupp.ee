import type { OutdoorServicePageData, ServiceDetailDefs } from '@/app/components/templates/ServiceDetailTemplate'

const etParentBreadcrumb = { etPath: "/koristusteenus/valikoristus", label: "Välikoristus" };
const enParentBreadcrumb = { etPath: "/koristusteenus/valikoristus", label: "Outdoor cleaning and grounds care" };
const ruParentBreadcrumb = { etPath: "/koristusteenus/valikoristus", label: "\u0423\u0431\u043E\u0440\u043A\u0430 \u0438 \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u0435 \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u0439" };

export const etData: OutdoorServicePageData = {
  ariaLabel: "Muruniitmine",
  heroImage: "/muruniitmine-1.webp",
  image: "/muruniitmin-2.jpg",
  imageAlt: "SPS Grupp muruniitmine ja haljasalade hooldus",
  title: "Muruniitmine",
  titleAccent: "Tallinnas ja Harjumaal",
  intro: "Regulaarne muruniitmine ärikinnistutele, korteriühistutele ja avalikele aladele. Hoiame haljasalad korras kogu kasvuperioodi vältel.",
  cta: "Küsi muruniitmise pakkumist",
  breadcrumb: "Muruniitmine",
  parentBreadcrumb: etParentBreadcrumb,
  chips: [
    { value: "Hooajaline", label: "hooldus", tone: "blue" },
    { value: "Korrapärane", label: "graafik", tone: "green" },
    { value: "Ärikinnistud", label: "ja ühistud", tone: "navy" },
  ],
  problemTitle: "Hooldamata muru jätab kinnistust lohaka mulje",
  problemLead: "Kõrgeks kasvanud muru, niitmata servad ja koristamata niide muudavad ka korraliku hoone ümbruse kiiresti hooletuks. Ärikinnistu, korteriühistu või esindushoone puhul on väliala esimene asi, mida külastaja märkab.",
  problemDescription: "Regulaarne hooldus hoiab kinnistu esinduslikuna ja vähendab hooaja lõpus suuremate korrastustööde vajadust.",
  serviceTitle: "Mida sisaldab muruniitmise teenus?",
  serviceCards: [
    { bold: "Regulaarne muruniitmine", desc: "Niitmine kokkulepitud sagedusega kogu kasvuperioodi vältel." },
    { bold: "Servade trimmerdamine", desc: "Äärekivide, piirete, puude ja hooneümbruse täpne viimistlus." },
    { bold: "Rohu kogumine või multsimine", desc: "Valime lahenduse vastavalt murupinnale ja objekti nõuetele." },
    { bold: "Ala ülevaatus", desc: "Hindame niidetava ala suurust ja takistusi." },
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
  priceIntro: "Hind sõltub niidetava ala suurusest, niitmise sagedusest, servatööde mahust ja sellest, kas niide kogutakse või multsitakse.",
  priceCards: [
    { size: "Väike kinnistu", area: "ühistu või büroo", price: "al. 60 \u20AC", period: "kord", highlight: true },
    { size: "Keskmine ala", area: "ärikinnistu", price: "al. 120 \u20AC", period: "kord" },
    { size: "Hooajaleping", area: "regulaarne hooldus", price: "Kuu hind", period: "pakkumine" },
  ],
  priceNote: "Täpse hinna anname pärast objekti ülevaatust või pindala ja töömahu kirjelduse põhjal.",
  serviceInfoBlock: {
    tag: "Hooldusplaan",
    title: "Mida lepime enne muruniitmise alustamist kokku?",
    intro: "Niidetava ala ulatus, soovitud hooldustase ja niite käitlemine mõjutavad töökorraldust ning hinda. Lepime need enne hooaja algust või esimest niitmist selgelt kokku.",
    items: [
      { title: "Ala ja ligipääs", description: "Määrame niidetava ala piirid, hindame nõlvad, takistused ja tehnika ligipääsu ning lepime kokku alad, mis vajavad käsitsi trimmerdamist." },
      { title: "Hooldustase ja sagedus", description: "Lepime kokku soovitud muru kõrguse ja hooldussageduse. Graafikut kohandame kasvukiiruse, ilma ja kinnistu kasutuse järgi." },
      { title: "Servatööd ja niite käitlus", description: "Täpsustame servade trimmerdamise, teede järelpuhastuse ning selle, kas niide multsitakse, kogutakse või viiakse objektilt ära." },
    ],
  },
  footerTitle: "Tellige muruniitmise hooldusplaan",
  footerDescription: "Saatke meile kinnistu info ja koostame sobiva niitmisgraafiku koos hinnapakkumisega.",
  faq: [
    { q: "Kui tihti peaks muru niitma?", a: "Niitmissagedus sõltub kasvuperioodist, ilmast, murutüübist ja kinnistu soovitud ilmetasemest. Graafikut kohandame hooaja ning tegeliku kasvukiiruse järgi." },
    { q: "Kas teete ka trimmerdamist?", a: "Jah. Servade trimmerdamine kuulub teenuse juurde, kui see on pakkumises kokku lepitud." },
    { q: "Kas niide viiakse ära?", a: "Vajadusel kogume ja viime niidetud muru ära. Suurematel aladel on sageli mõistlik kasutada multsimist." },
    { q: "Kas saab sõlmida hooajalise lepingu?", a: "Jah. Hooajaleping on mugavaim lahendus, sest töö toimub automaatselt kokkulepitud graafiku järgi." },
  ],
};

export function getMuruniitmineEnData(): OutdoorServicePageData {
  return {
    ariaLabel: "Lawn Mowing",
    heroImage: "/muruniitmine-1.webp",
    image: "/muruniitmin-2.jpg",
    imageAlt: "SPS Grupp lawn mowing and grounds maintenance",
    title: "Lawn Mowing",
    titleAccent: "in Tallinn and Harjumaa",
    intro: "Regular lawn mowing for commercial properties, housing associations and public areas. We keep green spaces well-maintained throughout the growing season.",
    cta: "Request a lawn mowing quote",
    breadcrumb: "Lawn Mowing",
    parentBreadcrumb: enParentBreadcrumb,
    chips: [
      { value: "Seasonal", label: "maintenance", tone: "blue" },
      { value: "Regular", label: "schedule", tone: "green" },
      { value: "Commercial", label: "properties", tone: "navy" },
    ],
    problemTitle: "An unkempt lawn makes a property look neglected",
    problemLead: "Overgrown grass, untrimmed edges and uncleared clippings quickly make even a well-maintained building look scruffy. For commercial properties, housing associations or corporate headquarters, the outdoor area is the first thing visitors notice.",
    problemDescription: "Regular maintenance keeps the property looking presentable and reduces the need for larger restoration jobs at the end of the season.",
    serviceTitle: "What does the lawn mowing service include?",
    serviceCards: [
      { bold: "Regular lawn mowing", desc: "Mowing at an agreed frequency throughout the growing season." },
      { bold: "Edge trimming", desc: "Precise finishing along kerbs, fences, trees and building perimeters." },
      { bold: "Grass collection or mulching", desc: "We choose the solution based on the lawn surface and site requirements." },
      { bold: "Area assessment", desc: "We evaluate the size of the mowing area and any obstacles." },
      { bold: "Pathway sweep after mowing", desc: "We remove grass debris from paths, entrances and car park edges." },
      { bold: "Seasonal maintenance contract", desc: "One agreement, a clear schedule and predictable costs." },
    ],
    reasonsTitle: "Why choose SPS Grupp for lawn mowing?",
    reasons: [
      { title: "Work follows a set schedule", desc: "You do not need to call us each time. We keep the mowing frequency aligned with the season and weather." },
      { title: "Neat edges and entrances", desc: "Trimming and after-care give the result a polished look." },
      { title: "Suitable for large areas", desc: "We serve business parks, housing associations, office buildings and other larger properties." },
      { title: "One partner for outdoor maintenance", desc: "Where needed, we combine lawn mowing with leaf clearance, janitorial services and winter maintenance." },
    ],
    priceTitle: "What affects the cost of lawn mowing?",
    priceIntro: "The price depends on the size of the mowing area, mowing frequency, extent of edge work and whether clippings are collected or mulched.",
    priceCards: [
      { size: "Small property", area: "association or office", price: "from 60 EUR", period: "per visit", highlight: true },
      { size: "Medium area", area: "commercial property", price: "from 120 EUR", period: "per visit" },
      { size: "Seasonal contract", area: "regular maintenance", price: "Monthly rate", period: "quote" },
    ],
    priceNote: "A precise price is provided after a site assessment or based on the area size and scope of work described.",
    serviceInfoBlock: {
      tag: "Maintenance plan",
      title: "What do we agree on before starting lawn mowing?",
      intro: "The extent of the mowing area, the desired level of maintenance and how clippings are handled all affect the work schedule and price. We agree these clearly before the season starts or before the first mow.",
      items: [
        { title: "Area and access", description: "We define the boundaries of the mowing area, assess slopes, obstacles and equipment access, and agree which areas require manual trimming." },
        { title: "Maintenance level and frequency", description: "We agree on the desired grass height and maintenance frequency. The schedule is adjusted according to growth rate, weather and use of the property." },
        { title: "Edge work and clippings disposal", description: "We specify edge trimming, pathway clearing after mowing, and whether clippings are mulched, collected or removed from site." },
      ],
    },
    footerTitle: "Order your lawn mowing maintenance plan",
    footerDescription: "Send us your property details and we will prepare a suitable mowing schedule and quotation.",
    faq: [
      { q: "How often should a lawn be mown?", a: "Mowing frequency depends on the growing season, weather, grass type and the desired appearance of the property. The schedule is adjusted according to the season and actual growth rate." },
      { q: "Do you also do trimming?", a: "Yes. Edge trimming is included in the service where agreed in the quotation." },
      { q: "Are clippings removed?", a: "Where required, we collect and remove cut grass. For larger areas mulching is often the most practical solution." },
      { q: "Can a seasonal contract be taken out?", a: "Yes. A seasonal contract is the most convenient solution, as work is carried out automatically to the agreed schedule." },
    ],
  };
}

export function getMuruniitmineRuData(): OutdoorServicePageData {
  return {
    ariaLabel: "\u0421\u0442\u0440\u0438\u0436\u043A\u0430 \u0433\u0430\u0437\u043E\u043D\u043E\u0432",
    heroImage: "/muruniitmine-1.webp",
    image: "/muruniitmin-2.jpg",
    imageAlt: "SPS Grupp \u0441\u0442\u0440\u0438\u0436\u043A\u0430 \u0433\u0430\u0437\u043E\u043D\u043E\u0432 \u0438 \u0443\u0445\u043E\u0434 \u0437\u0430 \u0437\u0435\u043B\u0435\u043D\u044B\u043C\u0438 \u043D\u0430\u0441\u0430\u0436\u0434\u0435\u043D\u0438\u044F\u043C\u0438",
    title: "\u0421\u0442\u0440\u0438\u0436\u043A\u0430 \u0433\u0430\u0437\u043E\u043D\u043E\u0432",
    titleAccent: "\u0432 \u0422\u0430\u043B\u043B\u0438\u043D\u043D\u0435 \u0438 \u0425\u0430\u0440\u044C\u044E\u043C\u0430\u0430",
    intro: "\u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u0430\u044F \u0441\u0442\u0440\u0438\u0436\u043A\u0430 \u0433\u0430\u0437\u043E\u043D\u043E\u0432 \u0434\u043B\u044F \u043A\u043E\u043C\u043C\u0435\u0440\u0447\u0435\u0441\u043A\u0438\u0445 \u043E\u0431\u044A\u0435\u043A\u0442\u043E\u0432, \u043A\u0432\u0430\u0440\u0442\u0438\u0440\u043D\u044B\u0445 \u0442\u043E\u0432\u0430\u0440\u0438\u0449\u0435\u0441\u0442\u0432 \u0438 \u043E\u0431\u0449\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0445 \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u0439. \u041C\u044B \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u043C \u0437\u0435\u043B\u0435\u043D\u044B\u0435 \u043D\u0430\u0441\u0430\u0436\u0434\u0435\u043D\u0438\u044F \u0432 \u043F\u043E\u0440\u044F\u0434\u043A\u0435 \u043D\u0430 \u043F\u0440\u043E\u0442\u044F\u0436\u0435\u043D\u0438\u0438 \u0432\u0441\u0435\u0433\u043E \u0432\u0435\u0433\u0435\u0442\u0430\u0446\u0438\u043E\u043D\u043D\u043E\u0433\u043E \u043F\u0435\u0440\u0438\u043E\u0434\u0430.",
    cta: "\u0417\u0430\u043F\u0440\u043E\u0441\u0438\u0442\u044C \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u043F\u043E \u0441\u0442\u0440\u0438\u0436\u043A\u0435 \u0433\u0430\u0437\u043E\u043D\u043E\u0432",
    breadcrumb: "\u0421\u0442\u0440\u0438\u0436\u043A\u0430 \u0433\u0430\u0437\u043E\u043D\u043E\u0432",
    parentBreadcrumb: ruParentBreadcrumb,
    chips: [
      { value: "\u0421\u0435\u0437\u043E\u043D\u043D\u044B\u0439", label: "\u0443\u0445\u043E\u0434", tone: "blue" },
      { value: "\u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u044B\u0439", label: "\u0433\u0440\u0430\u0444\u0438\u043A", tone: "green" },
      { value: "\u041A\u043E\u043C\u043C\u0435\u0440\u0447\u0435\u0441\u043A\u0438\u0435", label: "\u043E\u0431\u044A\u0435\u043A\u0442\u044B", tone: "navy" },
    ],
    problemTitle: "\u041D\u0435\u0443\u0445\u043E\u0436\u0435\u043D\u043D\u044B\u0439 \u0433\u0430\u0437\u043E\u043D \u0441\u043E\u0437\u0434\u0430\u0435\u0442 \u0432\u043F\u0435\u0447\u0430\u0442\u043B\u0435\u043D\u0438\u0435 \u0437\u0430\u043F\u0443\u0449\u0435\u043D\u043D\u043E\u0441\u0442\u0438 \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u0438",
    problemLead: "\u0412\u044B\u0441\u043E\u043A\u0430\u044F \u0442\u0440\u0430\u0432\u0430, \u043D\u0435\u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0430\u043D\u043D\u044B\u0435 \u043A\u0440\u0430\u044F \u0438 \u043D\u0435\u0443\u0431\u0440\u0430\u043D\u043D\u0430\u044F \u0441\u043A\u043E\u0448\u0435\u043D\u043D\u0430\u044F \u0442\u0440\u0430\u0432\u0430 \u0431\u044B\u0441\u0442\u0440\u043E \u0434\u0435\u043B\u0430\u044E\u0442 \u0434\u0430\u0436\u0435 \u0443\u0445\u043E\u0436\u0435\u043D\u043D\u043E\u0435 \u0437\u0434\u0430\u043D\u0438\u0435 \u043D\u0435\u043E\u043F\u0440\u044F\u0442\u043D\u044B\u043C. \u0414\u043B\u044F \u043A\u043E\u043C\u043C\u0435\u0440\u0447\u0435\u0441\u043A\u043E\u0439 \u043D\u0435\u0434\u0432\u0438\u0436\u0438\u043C\u043E\u0441\u0442\u0438 \u0438\u043B\u0438 \u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u0438\u0442\u0435\u043B\u044C\u0441\u043A\u043E\u0433\u043E \u0437\u0434\u0430\u043D\u0438\u044F \u043D\u0430\u0440\u0443\u0436\u043D\u0430\u044F \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u044F \u2014 \u043F\u0435\u0440\u0432\u043E\u0435, \u0447\u0442\u043E \u0437\u0430\u043C\u0435\u0447\u0430\u0435\u0442 \u043F\u043E\u0441\u0435\u0442\u0438\u0442\u0435\u043B\u044C.",
    problemDescription: "\u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u044B\u0439 \u0443\u0445\u043E\u0434 \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u0435\u0442 \u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u0438\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0439 \u0432\u0438\u0434 \u043E\u0431\u044A\u0435\u043A\u0442\u0430 \u0438 \u0443\u043C\u0435\u043D\u044C\u0448\u0430\u0435\u0442 \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E\u0441\u0442\u044C \u0432 \u043A\u0440\u0443\u043F\u043D\u044B\u0445 \u0440\u0430\u0431\u043E\u0442\u0430\u0445 \u043F\u043E \u0443\u0431\u043E\u0440\u043A\u0435 \u0432 \u043A\u043E\u043D\u0446\u0435 \u0441\u0435\u0437\u043E\u043D\u0430.",
    serviceTitle: "\u0427\u0442\u043E \u0432\u0445\u043E\u0434\u0438\u0442 \u0432 \u0443\u0441\u043B\u0443\u0433\u0443 \u043F\u043E \u0441\u0442\u0440\u0438\u0436\u043A\u0435 \u0433\u0430\u0437\u043E\u043D\u043E\u0432?",
    serviceCards: [
      { bold: "\u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u0430\u044F \u0441\u0442\u0440\u0438\u0436\u043A\u0430 \u0433\u0430\u0437\u043E\u043D\u043E\u0432", desc: "\u0421\u0442\u0440\u0438\u0436\u043A\u0430 \u0441 \u0441\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u043D\u043E\u0439 \u043F\u0435\u0440\u0438\u043E\u0434\u0438\u0447\u043D\u043E\u0441\u0442\u044C\u044E \u043D\u0430 \u043F\u0440\u043E\u0442\u044F\u0436\u0435\u043D\u0438\u0438 \u0432\u0441\u0435\u0433\u043E \u0432\u0435\u0433\u0435\u0442\u0430\u0446\u0438\u043E\u043D\u043D\u043E\u0433\u043E \u043F\u0435\u0440\u0438\u043E\u0434\u0430." },
      { bold: "\u041E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0430 \u043A\u0440\u0430\u0435\u0432", desc: "\u0422\u043E\u0447\u043D\u0430\u044F \u043E\u0442\u0434\u0435\u043B\u043A\u0430 \u0432\u0434\u043E\u043B\u044C \u0431\u043E\u0440\u0434\u044E\u0440\u043E\u0432, \u0437\u0430\u0431\u043E\u0440\u043E\u0432, \u0434\u0435\u0440\u0435\u0432\u044C\u0435\u0432 \u0438 \u043F\u043E \u043F\u0435\u0440\u0438\u043C\u0435\u0442\u0440\u0443 \u0437\u0434\u0430\u043D\u0438\u0439." },
      { bold: "\u0421\u0431\u043E\u0440 \u0438\u043B\u0438 \u043C\u0443\u043B\u044C\u0447\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0442\u0440\u0430\u0432\u044B", desc: "\u0412\u044B\u0431\u0438\u0440\u0430\u0435\u043C \u0440\u0435\u0448\u0435\u043D\u0438\u0435 \u0432 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0438 \u043E\u0442 \u0442\u0438\u043F\u0430 \u0433\u0430\u0437\u043E\u043D\u0430 \u0438 \u0442\u0440\u0435\u0431\u043E\u0432\u0430\u043D\u0438\u0439 \u043E\u0431\u044A\u0435\u043A\u0442\u0430." },
      { bold: "\u041E\u0446\u0435\u043D\u043A\u0430 \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u0438", desc: "\u041E\u0446\u0435\u043D\u0438\u0432\u0430\u0435\u043C \u0440\u0430\u0437\u043C\u0435\u0440 \u043F\u043B\u043E\u0449\u0430\u0434\u0438 \u0438 \u043E\u0441\u043E\u0431\u0435\u043D\u043D\u043E\u0441\u0442\u0438 \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u0438." },
      { bold: "\u041E\u0447\u0438\u0441\u0442\u043A\u0430 \u0434\u043E\u0440\u043E\u0436\u0435\u043A \u043F\u043E\u0441\u043B\u0435 \u0441\u0442\u0440\u0438\u0436\u043A\u0438", desc: "\u0423\u0434\u0430\u043B\u044F\u0435\u043C \u043E\u0441\u0442\u0430\u0442\u043A\u0438 \u0442\u0440\u0430\u0432\u044B \u0441 \u0434\u043E\u0440\u043E\u0436\u0435\u043A, \u0432\u0445\u043E\u0434\u043E\u0432 \u0438 \u043A\u0440\u0430\u0435\u0432 \u043F\u0430\u0440\u043A\u043E\u0432\u043E\u043A." },
      { bold: "\u0421\u0435\u0437\u043E\u043D\u043D\u044B\u0439 \u0434\u043E\u0433\u043E\u0432\u043E\u0440 \u043D\u0430 \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u0435", desc: "\u041E\u0434\u0438\u043D \u0434\u043E\u0433\u043E\u0432\u043E\u0440, \u0447\u0451\u0442\u043A\u0438\u0439 \u0433\u0440\u0430\u0444\u0438\u043A \u0438 \u043F\u0440\u043E\u0433\u043D\u043E\u0437\u0438\u0440\u0443\u0435\u043C\u044B\u0435 \u0440\u0430\u0441\u0445\u043E\u0434\u044B." },
    ],
    reasonsTitle: "\u041F\u043E\u0447\u0435\u043C\u0443 \u0432\u044B\u0431\u0440\u0430\u0442\u044C SPS Grupp \u0434\u043B\u044F \u0441\u0442\u0440\u0438\u0436\u043A\u0438 \u0433\u0430\u0437\u043E\u043D\u043E\u0432?",
    reasons: [
      { title: "\u0420\u0430\u0431\u043E\u0442\u0430 \u0432\u044B\u043F\u043E\u043B\u043D\u044F\u0435\u0442\u0441\u044F \u043F\u043E \u0433\u0440\u0430\u0444\u0438\u043A\u0443", desc: "\u0412\u0430\u043C \u043D\u0435 \u043D\u0443\u0436\u043D\u043E \u0437\u0432\u043E\u043D\u0438\u0442\u044C \u043A\u0430\u0436\u0434\u044B\u0439 \u0440\u0430\u0437. \u041C\u044B \u0441\u043E\u0431\u043B\u044E\u0434\u0430\u0435\u043C \u0447\u0430\u0441\u0442\u043E\u0442\u0443 \u0441\u0442\u0440\u0438\u0436\u043A\u0438 \u0432 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0438\u0438 \u0441 \u0441\u0435\u0437\u043E\u043D\u043E\u043C \u0438 \u043F\u043E\u0433\u043E\u0434\u043E\u0439." },
      { title: "\u0410\u043A\u043A\u0443\u0440\u0430\u0442\u043D\u044B\u0435 \u043A\u0440\u0430\u044F \u0438 \u0432\u0445\u043E\u0434\u044B", desc: "\u0422\u0440\u0438\u043C\u043C\u0435\u0440\u043E\u0432\u043A\u0430 \u0438 \u0444\u0438\u043D\u0430\u043B\u044C\u043D\u0430\u044F \u0443\u0431\u043E\u0440\u043A\u0430 \u043F\u0440\u0438\u0434\u0430\u044E\u0442 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0443 \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043D\u043D\u044B\u0439 \u0432\u0438\u0434." },
      { title: "\u041F\u043E\u0434\u0445\u043E\u0434\u0438\u0442 \u0434\u043B\u044F \u0431\u043E\u043B\u044C\u0448\u0438\u0445 \u043F\u043B\u043E\u0449\u0430\u0434\u0435\u0439", desc: "\u041E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u0435\u043C \u0431\u0438\u0437\u043D\u0435\u0441-\u043F\u0430\u0440\u043A\u0438, \u043A\u0432\u0430\u0440\u0442\u0438\u0440\u043D\u044B\u0435 \u0442\u043E\u0432\u0430\u0440\u0438\u0449\u0435\u0441\u0442\u0432\u0430, \u043E\u0444\u0438\u0441\u043D\u044B\u0435 \u0437\u0434\u0430\u043D\u0438\u044F \u0438 \u0434\u0440\u0443\u0433\u0438\u0435 \u043A\u0440\u0443\u043F\u043D\u044B\u0435 \u043E\u0431\u044A\u0435\u043A\u0442\u044B." },
      { title: "\u041E\u0434\u0438\u043D \u043F\u0430\u0440\u0442\u043D\u0451\u0440 \u0434\u043B\u044F \u043D\u0430\u0440\u0443\u0436\u043D\u044B\u0445 \u0440\u0430\u0431\u043E\u0442", desc: "\u041F\u0440\u0438 \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E\u0441\u0442\u0438 \u043E\u0431\u044A\u0435\u0434\u0438\u043D\u044F\u0435\u043C \u0441\u0442\u0440\u0438\u0436\u043A\u0443 \u0433\u0430\u0437\u043E\u043D\u043E\u0432 \u0441 \u0443\u0431\u043E\u0440\u043A\u043E\u0439 \u043B\u0438\u0441\u0442\u044C\u0435\u0432, \u0443\u0441\u043B\u0443\u0433\u0430\u043C\u0438 \u0434\u0432\u043E\u0440\u043D\u0438\u043A\u0430 \u0438 \u0437\u0438\u043C\u043D\u0438\u043C \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u0435\u043C." },
    ],
    priceTitle: "\u041E\u0442 \u0447\u0435\u0433\u043E \u0437\u0430\u0432\u0438\u0441\u0438\u0442 \u0446\u0435\u043D\u0430 \u0441\u0442\u0440\u0438\u0436\u043A\u0438 \u0433\u0430\u0437\u043E\u043D\u043E\u0432?",
    priceIntro: "\u0426\u0435\u043D\u0430 \u0437\u0430\u0432\u0438\u0441\u0438\u0442 \u043E\u0442 \u0440\u0430\u0437\u043C\u0435\u0440\u0430 \u043F\u043B\u043E\u0449\u0430\u0434\u0438, \u0447\u0430\u0441\u0442\u043E\u0442\u044B \u0441\u0442\u0440\u0438\u0436\u043A\u0438, \u043E\u0431\u044A\u0451\u043C\u0430 \u0440\u0430\u0431\u043E\u0442 \u043F\u043E \u043A\u0440\u0430\u044F\u043C \u0438 \u043E\u0442 \u0442\u043E\u0433\u043E, \u0441\u043E\u0431\u0438\u0440\u0430\u044E\u0442\u0441\u044F \u043B\u0438 \u0441\u043A\u043E\u0448\u0435\u043D\u043D\u0430\u044F \u0442\u0440\u0430\u0432\u0430 \u0438\u043B\u0438 \u043C\u0443\u043B\u044C\u0447\u0438\u0440\u0443\u0435\u0442\u0441\u044F.",
    priceCards: [
      { size: "\u041D\u0435\u0431\u043E\u043B\u044C\u0448\u043E\u0439 \u043E\u0431\u044A\u0435\u043A\u0442", area: "\u0442\u043E\u0432\u0430\u0440\u0438\u0449\u0435\u0441\u0442\u0432\u043E \u0438\u043B\u0438 \u043E\u0444\u0438\u0441", price: "\u043E\u0442 60 \u20AC", period: "\u0437\u0430 \u0432\u044B\u0435\u0437\u0434", highlight: true },
      { size: "\u0421\u0440\u0435\u0434\u043D\u044F\u044F \u043F\u043B\u043E\u0449\u0430\u0434\u044C", area: "\u043A\u043E\u043C\u043C\u0435\u0440\u0447\u0435\u0441\u043A\u0438\u0439 \u043E\u0431\u044A\u0435\u043A\u0442", price: "\u043E\u0442 120 \u20AC", period: "\u0437\u0430 \u0432\u044B\u0435\u0437\u0434" },
      { size: "\u0421\u0435\u0437\u043E\u043D\u043D\u044B\u0439 \u0434\u043E\u0433\u043E\u0432\u043E\u0440", area: "\u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u044B\u0439 \u0443\u0445\u043E\u0434", price: "\u041C\u0435\u0441\u044F\u0447\u043D\u0430\u044F \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C", period: "\u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435" },
    ],
    priceNote: "\u0422\u043E\u0447\u043D\u0430\u044F \u0446\u0435\u043D\u0430 \u043F\u0440\u0435\u0434\u043E\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u043F\u043E\u0441\u043B\u0435 \u043E\u0441\u043C\u043E\u0442\u0440\u0430 \u043E\u0431\u044A\u0435\u043A\u0442\u0430 \u0438\u043B\u0438 \u043D\u0430 \u043E\u0441\u043D\u043E\u0432\u0430\u043D\u0438\u0438 \u043E\u043F\u0438\u0441\u0430\u043D\u043D\u043E\u0439 \u043F\u043B\u043E\u0449\u0430\u0434\u0438 \u0438 \u043E\u0431\u044A\u0451\u043C\u0430 \u0440\u0430\u0431\u043E\u0442.",
    serviceInfoBlock: {
      tag: "\u041F\u043B\u0430\u043D \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u044F",
      title: "\u041E \u0447\u0451\u043C \u043C\u044B \u0434\u043E\u0433\u043E\u0432\u0430\u0440\u0438\u0432\u0430\u0435\u043C\u0441\u044F \u043F\u0435\u0440\u0435\u0434 \u043D\u0430\u0447\u0430\u043B\u043E\u043C \u0441\u0442\u0440\u0438\u0436\u043A\u0438 \u0433\u0430\u0437\u043E\u043D\u043E\u0432?",
      intro: "\u041E\u0431\u044A\u0451\u043C \u043F\u043B\u043E\u0449\u0430\u0434\u0438, \u0436\u0435\u043B\u0430\u0435\u043C\u044B\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C \u0443\u0445\u043E\u0434\u0430 \u0438 \u0441\u043F\u043E\u0441\u043E\u0431 \u043E\u0431\u0440\u0430\u0449\u0435\u043D\u0438\u044F \u0441\u043E \u0441\u043A\u043E\u0448\u0435\u043D\u043D\u043E\u0439 \u0442\u0440\u0430\u0432\u043E\u0439 \u0432\u043B\u0438\u044F\u044E\u0442 \u043D\u0430 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044E \u0440\u0430\u0431\u043E\u0442 \u0438 \u0446\u0435\u043D\u0443. \u041C\u044B \u0447\u0451\u0442\u043A\u043E \u0441\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u044B\u0432\u0430\u0435\u043C \u044D\u0442\u0438 \u0432\u043E\u043F\u0440\u043E\u0441\u044B \u043F\u0435\u0440\u0435\u0434 \u043D\u0430\u0447\u0430\u043B\u043E\u043C \u0441\u0435\u0437\u043E\u043D\u0430 \u0438\u043B\u0438 \u043F\u0435\u0440\u0432\u043E\u0439 \u0441\u0442\u0440\u0438\u0436\u043A\u043E\u0439.",
      items: [
        { title: "\u041F\u043B\u043E\u0449\u0430\u0434\u044C \u0438 \u0434\u043E\u0441\u0442\u0443\u043F", description: "\u041E\u043F\u0440\u0435\u0434\u0435\u043B\u044F\u0435\u043C \u0433\u0440\u0430\u043D\u0438\u0446\u044B \u043F\u043B\u043E\u0449\u0430\u0434\u0438, \u043E\u0446\u0435\u043D\u0438\u0432\u0430\u0435\u043C \u0443\u043A\u043B\u043E\u043D\u044B, \u043F\u0440\u0435\u043F\u044F\u0442\u0441\u0442\u0432\u0438\u044F \u0438 \u0434\u043E\u0441\u0442\u0443\u043F \u0442\u0435\u0445\u043D\u0438\u043A\u0438, \u0434\u043E\u0433\u043E\u0432\u0430\u0440\u0438\u0432\u0430\u0435\u043C\u0441\u044F \u043E\u0431 \u0443\u0447\u0430\u0441\u0442\u043A\u0430\u0445, \u0442\u0440\u0435\u0431\u0443\u044E\u0449\u0438\u0445 \u0440\u0443\u0447\u043D\u043E\u0439 \u0442\u0440\u0438\u043C\u043C\u0435\u0440\u043E\u0432\u043A\u0438." },
        { title: "\u0423\u0440\u043E\u0432\u0435\u043D\u044C \u0443\u0445\u043E\u0434\u0430 \u0438 \u0447\u0430\u0441\u0442\u043E\u0442\u0430", description: "\u0414\u043E\u0433\u043E\u0432\u0430\u0440\u0438\u0432\u0430\u0435\u043C\u0441\u044F \u043E \u0436\u0435\u043B\u0430\u0435\u043C\u043E\u0439 \u0432\u044B\u0441\u043E\u0442\u0435 \u0442\u0440\u0430\u0432\u044B \u0438 \u0447\u0430\u0441\u0442\u043E\u0442\u0435 \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u044F. \u0413\u0440\u0430\u0444\u0438\u043A \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u0432 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0438 \u043E\u0442 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u0438 \u0440\u043E\u0441\u0442\u0430, \u043F\u043E\u0433\u043E\u0434\u044B \u0438 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u044F \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u0438." },
        { title: "\u0420\u0430\u0431\u043E\u0442\u0430 \u043F\u043E \u043A\u0440\u0430\u044F\u043C \u0438 \u0443\u0442\u0438\u043B\u0438\u0437\u0430\u0446\u0438\u044F \u0442\u0440\u0430\u0432\u044B", description: "\u0423\u0442\u043E\u0447\u043D\u044F\u0435\u043C \u0442\u0440\u0438\u043C\u043C\u0435\u0440\u043E\u0432\u043A\u0443 \u043A\u0440\u0430\u0451\u0432, \u043E\u0447\u0438\u0441\u0442\u043A\u0443 \u0434\u043E\u0440\u043E\u0436\u0435\u043A \u043F\u043E\u0441\u043B\u0435 \u0441\u0442\u0440\u0438\u0436\u043A\u0438 \u0438 \u0442\u043E, \u0431\u0443\u0434\u0435\u0442 \u043B\u0438 \u0442\u0440\u0430\u0432\u0430 \u043C\u0443\u043B\u044C\u0447\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F, \u0441\u043E\u0431\u0438\u0440\u0430\u0442\u044C\u0441\u044F \u0438\u043B\u0438 \u0432\u044B\u0432\u043E\u0437\u0438\u0442\u044C\u0441\u044F \u0441 \u043E\u0431\u044A\u0435\u043A\u0442\u0430." },
      ],
    },
    footerTitle: "\u0417\u0430\u043A\u0430\u0436\u0438\u0442\u0435 \u043F\u043B\u0430\u043D \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u044F \u043F\u043E \u0441\u0442\u0440\u0438\u0436\u043A\u0435 \u0433\u0430\u0437\u043E\u043D\u043E\u0432",
    footerDescription: "\u041E\u0442\u043F\u0440\u0430\u0432\u044C\u0442\u0435 \u043D\u0430\u043C \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044E \u043E\u0431 \u043E\u0431\u044A\u0435\u043A\u0442\u0435, \u0438 \u043C\u044B \u0441\u043E\u0441\u0442\u0430\u0432\u0438\u043C \u043F\u043E\u0434\u0445\u043E\u0434\u044F\u0449\u0438\u0439 \u0433\u0440\u0430\u0444\u0438\u043A \u0441\u0442\u0440\u0438\u0436\u043A\u0438 \u0432\u043C\u0435\u0441\u0442\u0435 \u0441 \u0446\u0435\u043D\u043E\u0432\u044B\u043C \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435\u043C.",
    faq: [
      { q: "\u041A\u0430\u043A \u0447\u0430\u0441\u0442\u043E \u043D\u0443\u0436\u043D\u043E \u0441\u0442\u0440\u0438\u0447\u044C \u0433\u0430\u0437\u043E\u043D?", a: "\u0427\u0430\u0441\u0442\u043E\u0442\u0430 \u0441\u0442\u0440\u0438\u0436\u043A\u0438 \u0437\u0430\u0432\u0438\u0441\u0438\u0442 \u043E\u0442 \u0432\u0435\u0433\u0435\u0442\u0430\u0446\u0438\u043E\u043D\u043D\u043E\u0433\u043E \u043F\u0435\u0440\u0438\u043E\u0434\u0430, \u043F\u043E\u0433\u043E\u0434\u044B, \u0442\u0438\u043F\u0430 \u0442\u0440\u0430\u0432\u044B \u0438 \u0436\u0435\u043B\u0430\u0435\u043C\u043E\u0433\u043E \u0443\u0440\u043E\u0432\u043D\u044F \u0432\u043D\u0435\u0448\u043D\u0435\u0433\u043E \u0432\u0438\u0434\u0430 \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u0438. \u0413\u0440\u0430\u0444\u0438\u043A \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u0432 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0438\u0438 \u0441 \u0441\u0435\u0437\u043E\u043D\u043E\u043C \u0438 \u0444\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u044C\u044E \u0440\u043E\u0441\u0442\u0430." },
      { q: "\u0414\u0435\u043B\u0430\u0435\u0442\u0435 \u043B\u0438 \u0432\u044B \u0442\u0440\u0438\u043C\u043C\u0435\u0440\u043E\u0432\u043A\u0443?", a: "\u0414\u0430. \u0422\u0440\u0438\u043C\u043C\u0435\u0440\u043E\u0432\u043A\u0430 \u043A\u0440\u0430\u0451\u0432 \u0432\u0445\u043E\u0434\u0438\u0442 \u0432 \u0443\u0441\u043B\u0443\u0433\u0443, \u0435\u0441\u043B\u0438 \u044D\u0442\u043E \u0441\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u043E \u0432 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0438." },
      { q: "\u0412\u044B\u0432\u043E\u0437\u044F\u0442 \u043B\u0438 \u0441\u043A\u043E\u0448\u0435\u043D\u043D\u0443\u044E \u0442\u0440\u0430\u0432\u0443?", a: "\u041F\u0440\u0438 \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E\u0441\u0442\u0438 \u043C\u044B \u0441\u043E\u0431\u0438\u0440\u0430\u0435\u043C \u0438 \u0432\u044B\u0432\u043E\u0437\u0438\u043C \u0441\u043A\u043E\u0448\u0435\u043D\u043D\u0443\u044E \u0442\u0440\u0430\u0432\u0443. \u041D\u0430 \u0431\u043E\u043B\u0435\u0435 \u043A\u0440\u0443\u043F\u043D\u044B\u0445 \u043F\u043B\u043E\u0449\u0430\u0434\u044F\u0445 \u0447\u0430\u0441\u0442\u043E \u0446\u0435\u043B\u0435\u0441\u043E\u043E\u0431\u0440\u0430\u0437\u043D\u0435\u0435 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u043C\u0443\u043B\u044C\u0447\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435." },
      { q: "\u041C\u043E\u0436\u043D\u043E \u043B\u0438 \u0437\u0430\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0441\u0435\u0437\u043E\u043D\u043D\u044B\u0439 \u0434\u043E\u0433\u043E\u0432\u043E\u0440?", a: "\u0414\u0430. \u0421\u0435\u0437\u043E\u043D\u043D\u044B\u0439 \u0434\u043E\u0433\u043E\u0432\u043E\u0440 \u2014 \u044D\u0442\u043E \u0441\u0430\u043C\u043E\u0435 \u0443\u0434\u043E\u0431\u043D\u043E\u0435 \u0440\u0435\u0448\u0435\u043D\u0438\u0435, \u043F\u043E\u0441\u043A\u043E\u043B\u044C\u043A\u0443 \u0440\u0430\u0431\u043E\u0442\u044B \u0432\u044B\u043F\u043E\u043B\u043D\u044F\u044E\u0442\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u043F\u043E \u0441\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u043D\u043E\u043C\u0443 \u0433\u0440\u0430\u0444\u0438\u043A\u0443." },
    ],
  };
}

export const serviceDetail: ServiceDetailDefs = {
  et: { data: etData, seo: {"serviceName":"Muruniitmine","serviceDescription":"Muruniitmine ja haljasalade hooldus ärikinnisvaral. Regulaarne niitmine ja muru servade korrastus."}, tooprotsess: {"title":"Kuidas SPS muruniitmise graafiku koostab?","intro":"SPS alustab objekti ülevaatusest, et töömeetod, sagedus ja tehnika vastaksid tegelikule vajadusele.","steps":[["Ala ülevaatus","Hindame niidetava ala suurust ja takistusi."],["Sageduse kokkulepe","Lepime kokku hooajalise hooldusgraafiku."],["Servatööd","Määrame trimmerdamise ulatuse."],["Niitmine","Teostame töö graafiku järgi."],["Järelpuhastus","Puhastame teed ja sissepääsud murujääkidest."]]}, breadcrumbs: [{"name":"Avaleht","etPath":"/"},{"name":"Koristusteenus","etPath":"/koristusteenus"},{"name":"Välikoristus","etPath":"/koristusteenus/valikoristus"},{"name":"Muruniitmine","etPath":"/koristusteenus/valikoristus/muruniitmine"}] },
  en: { data: getMuruniitmineEnData(), seo: {"serviceName":"Lawn Mowing","serviceDescription":"Lawn mowing and grounds maintenance for commercial property. Regular mowing and lawn edging."}, tooprotsess: {"title":"How does SPS schedule lawn mowing?","intro":"SPS starts with a site assessment to ensure the method, frequency and equipment match the actual needs.","steps":[["Site assessment","We evaluate the size and features of the mowing area."],["Agree schedule","We agree on a seasonal maintenance schedule."],["Edge work","We define the extent of trimming required."],["Mowing","We carry out the work according to the schedule."],["Clean-up","We clear paths and entrances of grass debris."]]}, breadcrumbs: [{"name":"Home","etPath":"/"},{"name":"Cleaning","etPath":"/koristusteenus"},{"name":"Outdoor cleaning","etPath":"/koristusteenus/valikoristus"},{"name":"Lawn Mowing","etPath":"/koristusteenus/valikoristus/muruniitmine"}] },
  ru: { data: getMuruniitmineRuData(), seo: {"serviceName":"Стрижка газонов","serviceDescription":"Стрижка газонов и уход за зелеными насаждениями на коммерческой недвижимости."}, tooprotsess: {"title":"Как SPS составляет график стрижки газонов?","intro":"SPS начинает с осмотра объекта, чтобы выбрать подходящий метод.","steps":[["Осмотр объекта","Оцениваем размер и особенности территории."],["Согласование графика","Договариваемся о сезонном графике."],["Обработка краев","Определяем объем триммеровки."],["Стрижка","Выполняем работу по графику."],["Финальная уборка","Очищаем дорожки от остатков травы."]]}, breadcrumbs: [{"name":"Главная","etPath":"/"},{"name":"Уборка","etPath":"/koristusteenus"},{"name":"Уборка территорий","etPath":"/koristusteenus/valikoristus"},{"name":"Стрижка газонов","etPath":"/koristusteenus/valikoristus/muruniitmine"}] },
}
