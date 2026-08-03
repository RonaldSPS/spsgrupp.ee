"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FooterCTA from "../components/FooterCTA";

export default function PrivaatsusPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="pt-[130px] pb-[80px]">
        <div className="max-w-[900px] mx-auto px-[25px]">
          <h1 className="text-[42px] font-bold text-[#17345a] mb-8">Andmekaitsetingimused</h1>

          <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
            Andmekaitsetingimuste kirjeldamisel arvestame EUROOPA PARLAMENDI JA EUROOPA NÕUKOGU MÄÄRUST (EL) 2016/679.
          </p>
          <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
            Kasutame turvameetmeid oma töös, mis puudutab SPS Grupp OÜ klientide teenindamist ning töötajatega seonduvate isikuandmete käsitlemist.
          </p>
          <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
            Andmekaitsetingimused kehtivad kõikide isikute suhtes, kes kasutavad ettevõtte serveri- ja võrgulahendusi, veebilehte, esitavad meie teenuste kohta päringuid või suhtlevad teistel viisidel SPS Grupp OÜga.
          </p>
          <p className="text-[15px] text-[#2f353f] leading-relaxed mb-8">
            SPS Grupp OÜ töötleb oma töötajate ning klientide ja kontaktisikute andmeid, kes on avaldanud soovi lepingulisteks kohustusteks või kinnitanud, et on tutvunud meie andmekaitsetingimustega ja on nõustunud nende tingimustega.
          </p>

          <Section title="Mõisted">
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              <strong>Isikuandmed</strong> – on teave inimese ehk füüsilise isiku (andmesubjekti) kohta, millega teda saab otse või kaudselt tuvastada: nimi, isikukood, asukohateave, võrguidentifikaatorid (tunnused, mis sidevõrgus aitavad viia konkreetse isikuni), samuti füüsilised, majanduslikud, kultuurilised ja mistahes muud tuvastamist võimaldavad tunnused ja nende kombinatsioonid.
            </p>
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              <strong>Isikuandmete töötlemine</strong> – on andmetega tehtav mistahes toiming: kogumine, korrastamine, säilitamine, muutmine, lugemine, kasutamine, edastamine, ühendamine, kustutamine jne.
            </p>
          </Section>

          <Section title="Vastutava töötleja ja volitatud töötleja identifitseerimine">
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              SPS Grupp OÜ on isikuandmete vastutav töötleja – oma töötajate, veebilehe külastajate, klientide esindajate isikuandmete töötlemisel ja oma teenuse edasi arendamisel. SPS Grupp OÜ volitatud töötlejad on koostööpartnerid, kes osutavad SPS Grupp OÜle teenust.
            </p>
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              Volitatud töötleja peab vastutava töötleja nimel ja ülesandel isikuandmeid käsitlema kõigi kehtivate regulatsioonide kohaselt.
            </p>
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              Volitatud töötlejal on õigus teostada töötlemise toiminguid üksnes nende isikuandmete osas ja sellises ulatuses, milleks vastutav töötleja on volitatud töötlejat volitanud.
            </p>
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              SPS Grupp OÜ on oma klientide poolt SPS Grupp OÜ äritarkvarasse sisestatud/edastatud isikuandmete (nt klientide klientide andmed) osas oma kliendi volitatud töötleja. Selles olukorras on isikuandmete vastutav töötleja vastav SPS Grupp OÜ klient.
            </p>
          </Section>

          <Section title="Isikuandmete töötlemise eesmärgid ja töötlemise alused">
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              Kliendiandmete kogumisel piirdume minimaalsega, mida vajame teenuse osutamise ning parema teenindusega seotud eesmärkide täitmiseks.
            </p>
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              Isikuandmete töötlemise aluseks on lepingu sõlmimine, õigustatud huvi või isiku nõusolek.
            </p>
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              SPS Grupp OÜ ei levita, edasta, muuda ega kasuta mõnel muul andmete kogumisel mitte teatavaks tehtud viisil meile usaldatud isikuandmeid, välja arvatud juhul, kui isikuga ei ole vastavat kokkulepet või kui info avaldamise vajadus tuleneb vastava riigi seadusandlusest.
            </p>
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              SPS Grupp OÜ kogub isikuandmeid:
            </p>
            <ul className="list-disc pl-6 mb-4 text-[15px] text-[#2f353f] leading-relaxed space-y-1">
              <li>isiku tuvastamiseks;</li>
              <li>töötaja töökohustuste ja seadusest tulenevate kohustuste täitmiseks (nt maksuametisse edastatavad andmed, töötervishoiu arstile edastatavad andmed vms);</li>
              <li>kliendilepingu ja/või arve koostamiseks;</li>
              <li>kliendiga sõlmitud lepingu tingimuste täitmiseks;</li>
              <li>isikuga ühenduse võtmiseks teenuse osutamiseks;</li>
              <li>kliendi hoidmise või küsimuste lahendamise eesmärgil.</li>
            </ul>
          </Section>

          <Section title="Kogutavad isikuandmed">
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              Meie poolt kogutavad isikuandmed võivad sisaldada järgmist:
            </p>
            <ul className="list-disc pl-6 mb-4 text-[15px] text-[#2f353f] leading-relaxed space-y-1">
              <li>Teie nime;</li>
              <li>Teie isikukoodi;</li>
              <li>Teie telefoninumbrit;</li>
              <li>Teie e-posti aadressi;</li>
              <li>Teie aadressi;</li>
              <li>Teie ettevõtte nime ja Teie ametikohta;</li>
              <li>Teie arveldusarve andmeid;</li>
              <li>Teie päringu teksti;</li>
              <li>muid teenuse osutamiseks vajalikke andmeid.</li>
            </ul>
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              Töödeldavate isikuandmete kategooriad võivad erineda tulenevalt SPS Grupp OÜ ja töölepingu, seaduse või kliendi vahelisest lepingust.
            </p>
          </Section>

          <Section title="Andmete säilitamine">
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              Me säilitame isikuandmeid nii kaua, kui see on vajalik nende eesmärkide saavutamiseks, mille otstarbel neid andmeid koguti. Säilitamistähtaeg sõltub ka seadusejärgsetest nõuetest dokumentide säilitamisel.
            </p>
            <ul className="list-disc pl-6 mb-4 text-[15px] text-[#2f353f] leading-relaxed space-y-1">
              <li>SPS Grupp OÜ tehingutega seotud isikuandmeid säilitatakse vähemalt seitse (7) aastat majandusaasta lõppemisest tulenevalt raamatupidamisseaduses olevast kohustusest tehinguid tõendada.</li>
              <li>Töötajatega seotud andmeid säilitatakse vähemalt 10 aastat peale töölepingu lõppemist ning töötervishoiu andmeid vähemalt 55 aastat vastavalt Eesti Vabariigi seaduslikele nõuetele.</li>
              <li>Teenuste klientide isikuandmeid säilitatakse vähemalt seitse (7) aastat peale kliendiks olemise või töösuhte lõpetamist juhuks, kui tekib vajadus enda õiguste kaitseks andmesubjekti või kliendiga tekkinud vaidluse või muuks juriidiliseks nõudeks.</li>
            </ul>
          </Section>

          <Section title="Kuidas me jagame ja avalikustame teavet">
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              SPS Grupp OÜ poolt töödeldavaid isikuandmeid võib isiku nõusolekuta edastada üksnes asutusele või isikule, kellel on selleks põhjendatud vajadus või otsene seadusest tulenev õigus (näiteks kohus või kohtueelne menetleja).
            </p>
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              Me võime edastada Teie andmeid töötlemiseks kolmandatele isikutele, kes aitavad meil osutada ja hallata Teenuseid ning kes pakuvad klientide päringute haldamisega seotud teenuseid. Nende isikute hulka võivad kuuluda näiteks transpordiettevõtted, kinnisvara haldaja jne.
            </p>
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              Kõikidel juhtudel edastame andmetöötlejale vaid konkreetse ülesande täitmiseks või konkreetse teenuse osutamiseks vajalikke andmeid.
            </p>
          </Section>

          <Section title="Kodulehel külastajate informatsiooni kogumine">
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              SPS Grupp OÜ koduleht kasutab küpsiseid. Küpsiste informatsiooniga kogutakse statistika saamiseks kasutajate arvu kohta, samuti teabe saamiseks meie kasutajate geograafilise asukoha kohta, et kodulehe sisu ja teenust kohandada.
            </p>
          </Section>

          <Section title="Isikuandmete turvalisus">
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              SPS Grupp OÜ rakendab vajalikke tehnilisi, füüsilisi (konfidentsiaalsust vajavad dokumendid hoiustatakse lukustatuna) ja korralduslikke turvameetmeid (konfidentsiaalsuslepped personaliga) kliendi ja töötajate isikuandmete kaitsmiseks kadumise ja ebaseadusliku töötlemise eest.
            </p>
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              SPS Grupp OÜ on kehtestanud kõigile isikutele, kes ettevõtte nimel ja ülesandel isikuandmeid töötlevad, selged ja kohustuslikud nõuded ning need teatavaks teinud.
            </p>
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              SPS Grupp OÜ järgib isikuandmete töötlemisel kehtivaid andmekaitsealaseid õigusakte ja rakendab asjakohaseid tehnilisi ning organisatsioonilisi turvameetmeid.
            </p>
          </Section>

          <Section title="Isikuandmete lekke või rikkumisest teatamine andmesubjektile">
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              Kui rikkumise tulemusena tekib inimeste õigustele ja vabadustele tõenäoliselt suur oht, peab vastutav töötleja põhjendamatu viivituseta sellest teavitama ka andmesubjekti.
            </p>
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              Teavituse eesmärk on lisaks andmetöötlejale võimaldada ka andmesubjektil endal võtta vajalikke ettevaatusabinõusid ohu leevendamiseks.
            </p>
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              Teates anname isikuandmetega seotud rikkumise olemuslikku infot, samuti soovitusi võimaliku kahjuliku mõju leevendamiseks.
            </p>
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4 font-semibold">Isikule edastatavas teates on:</p>
            <ul className="list-disc pl-6 mb-4 text-[15px] text-[#2f353f] leading-relaxed space-y-1">
              <li>selges ja lihtsas keeles selgitatud isikuandmetega seotud rikkumise olemus;</li>
              <li>SPS Grupp OÜ poolse kontaktisiku nimi ja kontaktandmed;</li>
              <li>isikuandmetega seotud rikkumise võimalike tagajärgede kirjeldus;</li>
              <li>meetmete kirjeldus isikuandmetega seotud rikkumise lahendamiseks.</li>
            </ul>
          </Section>

          <Section title="Andmesubjekti õigused">
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              <strong>Parandamise õigus</strong> – andmesubjekti õigus nõuda, et temaga seotud ebatäpsed või ebatäielikud isikuandmed põhjendamatu viivituseta parandataks.
            </p>
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              <strong>Õigus andmete kustutamisele</strong> – andmesubjekti õigus nõuda, et tema isikuandmed põhjendamatu viivituseta kustutataks, kui on täidetud teatud lisatingimused.
            </p>
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              Kui isikuandmete töötlemiseks, avalikustamiseks või andmetele juurdepääsu võimaldamiseks ei ole (enam) seaduslikku alust, saab nõuda andmete kasutamise lõpetamist või kustutamist, andmete avalikustamise või andmetele juurdepääsu võimaldamise lõpetamist. Selleks tuleks esitada isikut tuvastada võimaldaval moel taotlus.
            </p>
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4 font-semibold">Taotlust ei rahuldata, kui:</p>
            <ul className="list-disc pl-6 mb-4 text-[15px] text-[#2f353f] leading-relaxed space-y-1">
              <li>see võib kahjustada teise isiku õigusi ja vabadusi;</li>
              <li>see võib takistada teenuse osutamist või teenuse mitteosutamist;</li>
              <li>see võib takistada õiguskaitse organite tööd;</li>
              <li>see ei ole tehniliselt vajalik ega/või võimalik;</li>
              <li>taotleja isik ei ole andmetega õiguslikult seotud;</li>
              <li>taotleja isikut ei ole võimalik identifitseerida.</li>
            </ul>
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              <strong>Õigus piirata töötlemist</strong> – andmesubjekti õigus teatud juhtudel ajutiselt või alaliselt piirata enda kõikide või osade isikuandmete töötlemist.
            </p>
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              <strong>Juurdepääsuõigus</strong> – õigus olla teavitatud isikuandmetest ja nõuda juurdepääsu isikuandmetele, mida Teie kohta töötleme.
            </p>
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              Kui isikuandmete töötlemise aluseks on andmesubjekti nõusolek, on andmesubjektil õigus see nõusolek igal ajal tagasi võtta teavitades sellest e-kirja teel, ilma et see mõjutaks enne tagasivõtmist nõusoleku alusel toimunud töötlemise seaduslikkust.
            </p>
          </Section>

          <Section title="Andmekaitsetingimused ja muudatused">
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              Käesolevate andmekaitsetingimustega tutvumisel kinnitab andmesubjekt nõusolekuga taasesitataval kujul (nt. lepingu lisana vms.).
            </p>
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              SPS Grupp OÜ jätab endale õiguse vajadusel andmekaitsetingimusi muuta, lisada või eemaldada. Hetkel kehtivad andmekaitsetingimused on SPS Grupp veebisaidil spsgrupp.ee/andmekaitsetingimused.
            </p>
            <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
              Kui Te leiate, et SPS Grupp OÜ on rikkunud Teie õigusi isikuandmete töötlemisel, siis teavitage sellest meid kirjaga meie avalikul e-posti aadressil. Vaidlused lahendatakse läbirääkimiste teel. Samuti on Teil õigus (näiteks kokkuleppe mittesaavutamisel) pöörduda Andmekaitse Inspektsiooni (aki.ee, e-post: info@aki.ee) või pädeva kohtu poole.
            </p>
            <p className="text-[15px] text-[#2f353f] leading-relaxed">
              Andmekaitsetingimused kehtivad alates 08.12.2021.
            </p>
          </Section>
        </div>
      </main>
      <FooterCTA />
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-[28px] font-bold text-[#17345a] mb-4">{title}</h2>
      {children}
    </section>
  );
}
