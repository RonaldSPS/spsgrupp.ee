import OutdoorServicePage, { type OutdoorServicePageData } from "../_components/OutdoorServicePage";

const data: OutdoorServicePageData = {
  ariaLabel: "Lehtede koristamine",
  heroImage: "/lehekoristus-1.jpg",
  image: "/lehekoristus-2.jpg",
  imageAlt: "SPS Grupp lehtede koristamine välialadel",
  title: "Lehtede koristamine",
  titleAccent: "ärikinnistutele ja ühistutele",
  intro:
    "Sügisesed lehed, oksad ja märg orgaaniline praht muudavad teed libedaks ning kinnistu korratuks. Koristame lehed kiiresti ja viime vajadusel ära.",
  cta: "Küsi lehekoristuse pakkumist",
  breadcrumb: "Lehtede koristamine",
  chips: [
    { value: "Sügisene", label: "kiirtöö", tone: "blue" },
    { value: "Lehed", label: "ja oksad", tone: "green" },
    { value: "Äravedu", label: "vajadusel", tone: "navy" },
  ],
  problemTitle: "Märjad lehed on korrashoiu- ja ohutusrisk",
  problemLeft:
    "Lehed kogunevad kiiresti sissepääsudele, kõnniteedele, parklaservadesse ja vihmaveerennide ümbrusse. Märjaks saades muutuvad need libedaks ning võivad ummistada äravoolud.",
  problemRight:
    "SPS Grupp aitab sügisperioodil hoida territooriumi läbikäidava ja esinduslikuna. Koristame lehed käsitsi või tehnikaga, kogume prahi kokku ja viime selle kokkuleppel ära.",
  serviceTitle: "Mida sisaldab lehtede koristamise teenus?",
  serviceCards: [
    { bold: "Lehtede riisumine ja puhumine", desc: "Kasutame sobivat meetodit vastavalt pinnale, liiklusele ja objektile." },
    { bold: "Kõnniteede ja parklaservade puhastus", desc: "Eemaldame lehed aladelt, kus need segavad liikumist või loovad libedusohu." },
    { bold: "Oksade ja orgaanilise prahi kogumine", desc: "Koristame lisaks lehtedele ka väiksemad oksad ja muu hooajalise prahi." },
    { bold: "Lehekottide täitmine", desc: "Kogume lehed kottidesse või konteinerisse vastavalt objekti võimalustele." },
    { bold: "Jäätmete äravedu", desc: "Korraldame lehtede ja haljastusjäätmete äraveo, kui seda on vaja." },
    { bold: "Korduv sügishooldus", desc: "Suuremate puude ja aktiivse lehelanguse korral lepime kokku korduva graafiku." },
  ],
  reasonsTitle: "Miks valida SPS Grupp lehekoristuseks?",
  reasons: [
    { title: "Kiire reageerimine hooajal", desc: "Sügisel on ajastus oluline. Tuleme siis, kui lehti on päriselt vaja koristada." },
    { title: "Ohutumad liikumisteed", desc: "Puhastame esmajärjekorras sissepääsud, trepid, kõnniteed ja muud käidavad alad." },
    { title: "Töö koos äraveoga", desc: "Vajadusel ei jää lehekotid kinnistule seisma, vaid korraldame ka äraveo." },
    { title: "Sobib hoolduslepingu osaks", desc: "Lehekoristuse saab ühendada muruniitmise, kojameheteenuse ja lumekoristusega." },
  ],
  priceTitle: "Kuidas kujuneb lehekoristuse hind?",
  priceIntro:
    "Hind sõltub lehtede hulgast, koristatava ala suurusest, ligipääsust ning sellest, kas haljastusjäätmed tuleb ära vedada.",
  priceCards: [
    { size: "Väike ala", area: "sissepääsud ja teed", price: "al. 70€", period: "kord", highlight: true },
    { size: "Keskmine kinnistu", area: "ühistu või büroo", price: "al. 150€", period: "kord" },
    { size: "Suur territoorium", area: "parkla ja haljasala", price: "Individuaalne", period: "pakkumine" },
  ],
  priceNote: "Haljastusjäätmete äravedu hinnastatakse eraldi vastavalt mahule ja objekti asukohale.",
  statsTitle: "Sügisene korrashoid ilma viimase hetke paanikata",
  statsIntro: "Regulaarne lehekoristus aitab ennetada libedust, ummistusi ja kinnistu üldmulje halvenemist.",
  stats: [
    { number: "24h", label: "kiire pakkumine" },
    { number: "3", label: "põhitööd: koristus, kogumine, äravedu" },
    { number: "1", label: "partner kogu välialale" },
  ],
  footerTitle: "Broneerige lehtede koristamine sügishooajaks",
  footerDescription:
    "Kirjeldage kinnistut ja lehtede mahtu. Koostame selge pakkumise koos tööde ulatuse ja võimaliku äraveoga.",
  faq: [
    { q: "Kas lehed viiakse ära?", a: "Jah, kui see on tellimuses kokku lepitud. Saame lehed koguda kottidesse või korraldada haljastusjäätmete äraveo." },
    { q: "Kas koristate ka märjad lehed?", a: "Jah. Märjad lehed on sageli kõige olulisem koristada, sest need muudavad kõnniteed ja trepid libedaks." },
    { q: "Kas teenust saab tellida korduvalt?", a: "Jah. Suuremate puude all soovitame korduvat sügishooldust, sest kogu lehemass ei lange korraga." },
    { q: "Milliseid alasid puhastate?", a: "Puhastame kõnniteed, parklad, trepid, sissepääsud, haljasalad ja muud kinnistu välialad." },
  ],
};

export default function LehtedeKoristamine() {
  return <OutdoorServicePage data={data} />;
}
