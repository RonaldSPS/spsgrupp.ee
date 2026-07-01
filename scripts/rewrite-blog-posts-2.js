/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const postsDir = path.join(__dirname, "..", "wordpress_migration", "prepared", "posts");

function load(id) {
  return JSON.parse(fs.readFileSync(path.join(postsDir, `post-${id}.json`), "utf-8"));
}

function save(post) {
  fs.writeFileSync(path.join(postsDir, `post-${post.id}.json`), JSON.stringify(post, null, 2) + "\n", "utf-8");
}

// POST 2392: Kontori koristusteenuse kontrollnimekiri
{
  const p = load(2392);
  p.title = "Kontori koristusteenuse kontrollnimekiri: 10 asja, mida igalt teenusepakkujalt küsida";
  p.slug = "kontori-koristusteenuse-kontrollnimekiri";
  p.excerpt = "Enne koristusteenuse lepingu sõlmimist tasub üle kontrollida, mida pakkumine täpselt sisaldab. See kontrollnimekiri aitab sul võrrelda erinevaid teenusepakkujaid ja valida enda kontorile parim.";
  p.contentHtml = `<strong>Kontori koristusteenuse tellimine on suur otsus — see mõjutab sinu töötajate igapäevast keskkonda, ettevõtte esinduslikkust ja eelarvet. Enne lepingu sõlmimist kontrolli need kümme punkti üle.</strong>

<h2>1. Koristuse sagedus ja aeg</h2>
Kui tihti kontorit koristatakse? Kas tööd toimuvad hommikul enne tööpäeva algust või õhtul pärast lõppu? Kas sagedus on fikseeritud või paindlik (nt suvel harvem, talvel tihedamini)?

<h2>2. Tööde täpne loetelu</h2>
Mis on igapäevased, iganädalased ja igakuised tööd? Kontrolli, et pakkumine sisaldaks:
<ul>
<li>Põrandate niiske puhastus ja tolmuimejaga puhastus (iga päev)</li>
<li>Tolmu võtmine pindadelt (1-2× nädalas)</li>
<li>Prügikastide tühjendamine (iga päev)</li>
<li>Kööginurga ja sanitaarruumide puhastus (iga päev)</li>
<li>Uste, lülitite ja muude kontaktpindade puhastus (kord nädalas)</li>
</ul>

<h2>3. Eripuhastustööd</h2>
Kas lepingusse on sisse arvestatud ka eripuhastustööd nagu akende pesu, põrandate vahatamine või vaipade süvapesu? Mõni firma pakub neid lisatasu eest, teine sisaldab hinnas. Selgita see enne lepingu sõlmimist välja.

<h2>4. Puhastusvahendid ja seadmed</h2>
Kes tagab puhastusvahendid, prügikotid, paberkäterätid, seebi ja seadmed (tolmuimeja, mopid)? Kas kõik on hinna sees või tuleb osa asju tellida eraldi?

<h2>5. Kvaliteedikontrolli süsteem</h2>
Kuidas teenusepakkuja tagab kvaliteedi? Kas neil on kontrollnimekirjad? Kes ja kui tihti kontrollib koristaja tööd? Kas klient saab regulaarset tagasisidearuannet?

<h2>6. Asendamise kord</h2>
Kui sinu tavaline koristaja jääb haigeks või läheb puhkusele, kas asendaja tuleb automaatselt? Kui kiiresti? Kas asendaja on kursis sinu kontori eripäradega?

<h2>7. Kindlustus</h2>
Kas teenusepakkujal on tsiviilvastutuskindlustus, mis katab võimalikud kahjustused sinu varale? See on oluline — ilma kindlustuseta võid kahjude korral ise maksma jääda.

<h2>8. Lepingu paindlikkus</h2>
Kas saad teenuse mahtu suurendada või vähendada vastavalt vajadusele? Mis on etteteatamisaeg muudatuste puhul? Mis on lepingu ülesütlemise tingimused?

<h2>9. Kontaktisik ja suhtlus</h2>
Kas sul on oma objektijuht, kelle poole murede korral pöörduda? Kas probleemidest teatamiseks on telefon, e-post või veebikeskkond? Kui kiiresti reageeritakse?

<h2>10. Referentsid</h2>
Küsi teenusepakkujalt referentse — eelistatavalt sinu omaga sarnase suuruse ja tüübiga kontoritelt. Helista mõnele referentsile ja küsi nende kogemuse kohta.

Selle kontrollnimekirjaga oled valmis võrdlema erinevaid pakkumisi ja tegema teadliku otsuse. Kui otsid usaldusväärset kontori koristusteenust, <a href="https://spsgrupp.ee/koristusteenus/kontori-koristus/">vaata SPS Grupi kontori koristuse teenust</a>.`;
  save(p);
  console.log("Updated post-2392");
}

// POST 2292: Kas puhas kontor vähendab haiguspäevi?
{
  const p = load(2292);
  p.title = "Kas puhas kontor vähendab haiguspäevi? 3 teadusuuringut, mida iga juht peaks teadma";
  p.slug = "kas-puhas-kontor-vahendab-haiguspaevi-teadusuuringud";
  p.excerpt = "Kontori puhtuse ja töötajate tervise vahel on tugev seos, kinnitavad mitmed teadusuuringud. Vähem haiguspäevi tähendab suuremat tootlikkust ja madalamaid kulusid. Vaatame, mida teadus ütleb.";
  p.contentHtml = `<strong>Haiguspäevad maksavad Eesti ettevõtetele igal aastal miljoneid eurosid — nii otseseid kulusid (haigushüvitised) kui ka kaudseid (kaotatud tootlikkus, asendamise kulu). Kuid kas kontori puhtus saab haiguspäevade arvu reaalselt vähendada?</strong>

Teadus ütleb jah. Siin on kolm uuringut, mida iga juht peaks tundma.

<h2>1. Arizona Ülikooli uuring: kontorilaud on bakteririkkam kui WC-pott</h2>
Arizona Ülikooli teadlased leidsid, et keskmisel kontorilaual on 400 korda rohkem baktereid kui keskmisel WC-potil. Telefonid, klaviatuurid ja hiired on eriti saastunud — keskmiselt 3 000–25 000 bakterit ruuttolli kohta. Regulaarne pindade puhastamine ja desinfitseerimine vähendab bakterite hulka kuni 99%.

<h2>2. Hollandi uuring: puhtus tõstab produktiivsust</h2>
<a href="https://www.researchgate.net/publication/327022122_Impact_of_cleanliness_on_the_productivity_of_employees">Hollandis viidi läbi uuring</a> viies erinevas organisatsioonis, kus töötajatelt küsiti hinnangut nii töökeskkonna puhtusele kui ka enda produktiivsusele. Tulemused kinnitasid selget seost: mida puhtamaks hindasid töötajad oma kontorit, seda kõrgem oli nende rahulolu ja produktiivsus.

Vastupidiselt: segased ja määrdunud ruumid tekitasid töötajates rahulolematust, mis väljendus madalamas töötahtes ja suuremas stressis. Stress omakorda nõrgestab immuunsüsteemi — ja nakkushaigused saavad kergemini võimust.

<h2>3. Princetoni ülikooli uuring: segadus vähendab keskendumisvõimet</h2>
<a href="https://pubmed.ncbi.nlm.nih.gov/21228167/">Princetoni ülikooli neuroteadlased</a> leidsid, et segadus vaateväljas konkureerib ajus tähelepanu eest — see vähendab kognitiivset võimekust ja suurendab väsimust. Puhas ja korrastatud tööruum võimaldab ajul keskenduda olulistele ülesannetele.

Aga mis on seos haiguspäevadega? Vähem stressi → tugevam immuunsus → vähem haigestumisi. See on kaudne, kuid oluline seos.

<h2>Praktiline järeldus</h2>
Need uuringud näitavad, et investeering kontori puhtusesse ei ole pelgalt esteetiline — see on investeering töötajate tervisesse ja tootlikkusse. Regulaarne professionaalne koristus:
<ul>
<li>Vähendab bakterite ja viiruste hulka pindadel</li>
<li>Parandab siseõhu kvaliteeti (tolmu, allergeenide eemaldamine)</li>
<li>Loob töökeskkonna, mis toetab keskendumist ja vaimset heaolu</li>
<li>Vähendab haigestumiste ja seeläbi haiguspäevade arvu</li>
</ul>

Kui soovid oma kontori puhtuse viia järgmisele tasemele, <a href="https://spsgrupp.ee/koristusteenus/kontori-koristus/">vaata SPS Grupi kontori koristusteenust</a>.`;
  save(p);
  console.log("Updated post-2292");
}

// POST 4027: Mida ütleb neuroteadus segaduse ja stressi seosest?
{
  const p = load(4027);
  p.title = "Mida ütleb neuroteadus segaduse ja stressi seosest?";
  p.slug = "segadus-ja-stress-neuroteadus";
  p.excerpt = "Segadus töölaual ei ole lihtsalt ebameeldiv — see mõõdetavalt tõstab stressihormooni kortisooli taset, vähendab keskendumisvõimet ja halvendab und. Mida teadus ütleb ja kuidas seda teadmist rakendada?";
  p.contentHtml = `<strong>Kas oled kunagi tundnud, et segadus töölaual või kontoris hakkab sind vaimselt lämmatama? See ei ole kujutlus. Neuroteadus on tõestanud, et füüsiline segadus mõjutab otseselt aju tööd, stressitaset ja vaimset tervist.</strong>

<h2>Kuidas aju segadust kogeb?</h2>
Princetoni ülikooli neuroteadlaste <a href="https://pubmed.ncbi.nlm.nih.gov/21228167/">uuring</a> näitas, et visuaalne segadus — liiga palju objekte vaateväljas — konkureerib ajus tähelepanu eest. See tähendab, et iga ese sinu töölaual, mida sa parasjagu ei kasuta, "varastab" natuke sinu kognitiivsest võimekusest. Aju peab pidevalt otsustama, millele keskenduda, ja see protsess kulutab vaimset energiat.

<h2>Segadus ja stressihormoon kortisool</h2>
Ajakirjas <a href="https://www.psycom.net/anxiety/mental-health-benefits-cleaning">Psycom</a> avaldatud uuringu kohaselt on inimestel, kes tunnevad, et nende keskkond on segamini, kõrgem stressihormooni kortisooli tase. Kortisool on "võitle või põgene" hormoon, mis on kasulik lühiajalistes ohuolukordades, kuid kahjulik, kui see on pidevalt kõrgem.

Krooniliselt kõrge kortisoolitase põhjustab:
<ul>
<li>Une kvaliteedi langust</li>
<li>Kontsentratsiooni- ja mäluprobleeme</li>
<li>Immuunsüsteemi nõrgenemist</li>
<li>Suuremat ärevust ja depressiooni riski</li>
</ul>

<h2>Kuidas segadus mõjutab und ja toitumist?</h2>
Sama uuringu kohaselt magavad inimesed, kes hoiavad oma keskkonna korras, paremini ja kauem. Nad söövad tervislikumalt, teevad rohkem trenni ja neil on rohkem energiat. See ei ole juhus — kui kortisoolitase õhtuks ei lange (sest aju on pidevas "segaduse režiimis"), jääb uni pealiskaudseks ja taastav faas jääb lühikeseks.

<h2>Mida sellega teha?</h2>
Lahendus ei ole ise hakata iga päev tunde koristama — see lisaks niigi kõrgele stressitasemele veel ühe kohustuse. Uuringu autorid soovitavad hoopis delegeerida: professionaalne koristusteenus eemaldab segaduse allika, andes sulle puhta ja selge keskkonna, ilma et peaksid ise energiat kulutama.

Professionaalne koristusteenus võib olla üks lihtsamaid viise kontori töökeskkonna ja meeskonna heaolu parandamiseks. <a href="https://spsgrupp.ee/koristusteenus/">Vaata SPS Grupi koristusteenuseid</a>.`;
  save(p);
  console.log("Updated post-4027");
}

// POST 3698: Miks segadus teeb meid ärevaks?
{
  const p = load(3698);
  p.title = "Miks segadus teeb meid ärevaks? Psühholoogi selgitus";
  p.slug = "miks-segadus-teeb-arevaks-psuhholoogia";
  p.excerpt = "Segadus kontoris või kodus ei riku ainult tuju — see tekitab ärevust, vähendab keskendumisvõimet ja teeb otsuste langetamise raskemaks. Mis toimub ajus, kui sind ümbritseb korralagedus?";
  p.contentHtml = `<strong>Oled kunagi märganud, et segases toas või kontoris tunned end kuidagi rahutuna, väsinuna või isegi ärritununa? See on psühholoogiliselt seletatav.</strong>

<h2>Visuaalne müra — mida see tähendab?</h2>
Princetoni ülikooli <a href="https://www.jneurosci.org/content/31/2/587">neuroteadlaste uuring</a> tuvastas nähtuse, mida nimetatakse visuaalseks müraks. Kui sinu vaateväljas on liiga palju objekte — paberivirnad, tassid, juhtmed, laokil asjad — peab aju iga objekti eraldi töötlema. Isegi kui sa ei mõtle nendele teadlikult, töötleb aju neid taustal.

See tekitab kognitiivset ülekoormust. Aju ressursid, mida võiks kasutada keskendumiseks, loovuseks või otsuste tegemiseks, kuluvad hoopis visuaalse keskkonna haldamisele.

<h2>Lõpetamata ülesannete psühholoogia</h2>
Segadus ei ole ainult füüsiline — see on ka psühholoogiline. Iga laokil ese, iga virn pabereid, iga tolmurull esindab lõpetamata tegevust. Ja aju ei armasta lõpetamata tegevusi. Need tekitavad taustal pidevat madalat pinget, justkui keegi sosistaks kogu aeg: "See on veel tegemata. See ka. Ja see."

See on nn Zeigarniku efekt — me mäletame paremini lõpetamata kui lõpetatud ülesandeid. Segases keskkonnas on neid lõpetamata ülesandeid sadu ja igaüks neist võtab natuke vaimset ruumi.

<h2>Kuidas segadus mõjutab suhteid?</h2>
Kui töötad koos teistega, võib segadus tekitada pahameelt — "Kes selle siia jättis?", "Miks keegi ei korista?". Need madalad pinged kogunevad aja jooksul ja võivad viia konfliktideni. Puhas töökeskkond välistab selle konfliktiallika.

<h2>Mida teha?</h2>
Lahendus ei pea olema "hakka ise rohkem koristama". Pigem tasub mõelda süsteemselt:
<ul>
<li>Vähenda visuaalset müra — hoia töölaual ainult see, mida praegu kasutad</li>
<li>Loo igale asjale oma koht — kui kõigel on koht, ei teki segadust</li>
<li>Delegeeri suurpuhastus — igapäevane korrashoid on üks asi, põrandate, vaipade ja pindade süvapuhastus on teine</li>
</ul>

Professionaalne koristusteenus võib olla lihtsaim ja efektiivseim viis tagada, et sinu töökeskkond toetab vaimset heaolu, mitte ei kahjusta seda. <a href="https://spsgrupp.ee/koristusteenus/">Vaata SPS Grupi teenuseid</a>.`;
  save(p);
  console.log("Updated post-3698");
}

// POST 1640: Miks puhastusteenuste hinnad tõusevad?
{
  const p = load(1640);
  p.title = "Miks puhastusteenuste hinnad tõusevad? Miinimumpalga ja tööjõukulu mõju";
  p.slug = "miks-puhastusteenuste-hinnad-tousevad";
  p.excerpt = "Puhastusteenuste hinnad on viimastel aastatel tõusnud ja jätkavad tõusu. Peamine põhjus on tööjõukulu — miinimumpalga tõus, maksukoormus ja töötajate nappus. Selgitame, mis mõjutab hindu ja kuidas sellest aru saada.";
  p.contentHtml = `<strong>Puhastusteenuste hinnad Eestis on viimase viie aastaga tõusnud 20–40%. Tellijana võib see tekitada küsimusi — miks teenus kallineb ja kas see on põhjendatud?</strong>

<h2>Tööjõukulu: 60–75% teenuse hinnast</h2>
Koristusteenuste hinna suurim komponent on tööjõud. Sõltuvalt teenuse tüübist moodustab tööjõukulu 60–75% koguhinnast. See tähendab, et igasugune palgakasv mõjutab otseselt teenuse lõpphinda.

<h2>Miinimumpalga tõus</h2>
Eesti miinimumpalk on viimastel aastatel tõusnud:
<ul>
<li>2020: 584 €</li>
<li>2021: 584 €</li>
<li>2022: 654 €</li>
<li>2023: 725 €</li>
<li>2024: 820 €</li>
</ul>

See on ligi 40% tõus nelja aastaga. Kuna suur osa koristussektori töötajatest teenib miinimumpalga lähedast tasu, kandub see tõus otse teenuse hinda.

Aga see pole veel kõik. Tööandja maksab lisaks brutopalgale sotsiaalmaksu (33%) ja töötuskindlustusmakset (0,8%). Kui brutopalk tõuseb, tõusevad ka maksud.

<h2>Töötajate nappus</h2>
Koristussektor seisab silmitsi tööjõupuudusega. Kvalifitseeritud koristajaid napib ja see sunnib ettevõtteid pakkuma kõrgemat palka, et häid töötajaid hoida. SPS Grupi juhatuse esimees Silver Bakhoff on öelnud: "Meie töötaja palk olgu kõrgem tegevusala keskmisest — see on peatähtis heade inimeste hoidmisel."

<h2>Puhastusvahendite ja seadmete kallinemine</h2>
Lisaks tööjõule on kallinenud ka puhastusvahendid, seadmed ja kütus. Inflatsioon mõjutab kõiki sisendeid — puhastuskemikaalidest tolmuimejakottideni.

<h2>Mida see teenuse tellija jaoks tähendab?</h2>
Hinnatõus on paratamatu, kuid see ei tähenda, et peaksid leppima kehva teenusega. Vastupidi — kõrgem hind peaks tähendama paremat kvaliteeti, koolitatud personali, kindlustust ja usaldusväärsust.

Odavaim pakkumine ei ole alati parim. Riigihangetel võidab sageli madalaim hind, kuid paljud ettevõtted (sh SPS Grupp) neist ei osale, sest kvaliteeti ei saa alla teatud hinna pakkuda.

Kui soovid arutada, millest koosneb sinu kontori koristusteenuse hind, <a href="https://spsgrupp.ee/kontakt/">võta SPS Grupiga ühendust</a> ja küsi personaalset pakkumist.`;
  save(p);
  console.log("Updated post-1640");
}

console.log("\n=== All remaining posts updated ===");
