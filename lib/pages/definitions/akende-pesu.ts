import type { OutdoorServicePageData, ServiceDetailDefs } from '@/app/components/templates/ServiceDetailTemplate'

const etParent = { etPath: "/koristusteenus/valikoristus", label: "Välikoristus" };
const enParent = { etPath: "/koristusteenus/valikoristus", label: "Outdoor cleaning and grounds care" };
const ruParent = { etPath: "/koristusteenus/valikoristus", label: "Уборка и обслуживание территорий" };

export const et: OutdoorServicePageData = {
  ariaLabel: "Akende pesu", heroImage: "/akende-pesu-1.jpg", image: "/akende-pesu-2.jpg", imageAlt: "SPS Grupp akende pesu",
  title: "Akende pesu", titleAccent: "ärihoonetele Tallinnas ja Harjumaal",
  intro: "Professionaalne aknapesu kõrghoonetele, kontoritele ja kaubandushoonetele. Kõrgtööde sertifikaadid, spetsiaalne tehnika, kristallselge tulemus.",
  cta: "Küsi akende pesu pakkumist", breadcrumb: "Akende pesu", parentBreadcrumb: etParent,
  chips: [{ value: "Sertifitseeritud", label: "kõrgtööd", tone: "blue" }, { value: "Kindlustatud", label: "tegevus", tone: "green" }, { value: "Alates 2006", label: "kogemust", tone: "navy" }],
  problemTitle: "Kas teie kontori valgus on viimasel ajal tuhmunud?",
  problemLead: "Aknad määrduvad nii aeglaselt, et seda ei märka. Tolm, saaste, õietolm kevadel, talvised soolajäägid kogunevad tasapisi. Alles siis, kui aknad puhtaks pestakse, märkate muutust kontrastselt.",
  problemDescription: "SPS Grupp toob selle muutuse teie hoonesse. Juba üle 15 aasta toome selge vaate Tallinna ärihoonetele. Oleme spetsialiseerunud suurte klaaspindade puhastusele, sealhulgas Ülemiste City äripiirkonnas.",
  serviceTitle: "Millist akende pesu SPS Grupp pakub?",
  serviceCards: [
    { bold: "Kontori- ja bürooaknade regulaarne pesu", desc: "Pesu seest ja väljast professionaalsete vahenditega." },
    { bold: "Kõrghoonete aknapesu", desc: "Tõstukite ja ronimisvarustusega, sertifitseeritud tehnikud." },
    { bold: "Klaasfassaadide ja klaasseinte puhastus", desc: "Professionaalne puhastus eri tüüpi klaaspindadele ja triibuvaba tulemuse kontroll." },
    { bold: "Kaubanduskeskuste vitriinid ja sissepääsud", desc: "Regulaarne vitriinide ja sissepääsude hooldus esindusliku ilme tagamiseks." },
    { bold: "Aknaraamide, tihendite ja aknalaudade puhastus", desc: "Täispuhastus koos raamide, tihendite ja aknalaudadega." },
    { bold: "Ehitusjärgne akende puhastus", desc: "Tolm, mört, kleebised — eemaldame kõik ehitusjäägid." },
  ],
  reasonsTitle: "Miks valida SPS Grupp akende pesu partneriks?",
  reasons: [
    { title: "Kõrghoonete spetsialistid", desc: "Kasutame Euroopa ohutusstandarditele vastavat varustust. Kõik tehnikud on läbinud kõrgtööde ohutuskoolituse." },
    { title: "Professionaalsed vahendid ja tehnika", desc: "Survepesuseadmed, teleskoopvarred ja puhastatud vee süsteemid. Valime töövahendid klaasi tüübi, kõrguse ja ligipääsu järgi." },
    { title: "Hoolduslepingu lahendused", desc: "Regulaarse aknapesu graafik koostatakse hoone asukoha, klaaspindade ja määrdumise järgi. Hind ning teenuse ulatus lepitakse enne töö algust kokku." },
    { title: "Kindlustatud teenus", desc: "Kõrgtöödel juhtub harva midagi, aga kogu meie tegevus on kindlustatud ja Teie vara ja ehitis on kaitstud." },
  ],
  priceTitle: "Kuidas kujuneb akende pesu hind?",
  priceIntro: "Akende pesu hind sõltub pinna suurusest, aknatüübist, juurdepääsu keerukusest ja töö sagedusest.",
  priceCards: [
    { size: "Kontori aknapesu", area: "Madala kõrgusega", price: "1 €/m²", period: "alates", highlight: true },
    { size: "Klaasfassaadid", area: "Teleskoopvarrega", price: "0,9 €/m²", period: "alates" },
    { size: "Kõrghooned", area: "Ronimisvarustusega", price: "2 €/m²", period: "alates" },
  ],
  priceNote: "Soovituslik sagedus 2–4 korda aastas, sõltuvalt objekti tingimustest. Regulaarse hoolduslepingu korral kehtib soodushind.",
  serviceInfoBlock: {
    tag: "Pesuplaan",
    title: "Mida lepime enne aknapesu kokku?",
    intro: "Töö ulatus, ligipääs ja sobiv aeg määravad nii pesumeetodi kui ka hinna. Paneme need enne töö algust selgelt paika.",
    items: [
      { title: "Pesu ulatus", description: "Määrame, kas klaasid pestakse ühelt või mõlemalt poolt ning kas töö sisaldab ka raamide, tihendite ja aknalaudade puhastust." },
      { title: "Ligipääs ja meetod", description: "Valime hoone kõrguse ja ligipääsu järgi sobiva lahenduse: teleskoopvarre, tõstuki, ronimisvarustuse või tavapärase käsipesu." },
      { title: "Tööaeg ja sagedus", description: "Lepime kokku tööaja, mis häirib hoone kasutajaid võimalikult vähe, ning vajadusel ka regulaarse hooldusgraafiku." },
    ],
  },
  footerTitle: "Toome valguse tagasi teie kontorisse",
  footerDescription: "Saadame eksperdi teie hoonesse hindama ja koostame personaalse pesuplaani.",
  faq: [
    { q: "Kui sageli peaksid Tallinna ärihoonete aknad saama professionaalset pesu?", a: "Pesusagedus sõltub hoone asukohast, liiklusest, ilmast, klaaside tüübist ja soovitud puhtustasemest. Pärast objekti ülevaatust soovitame sobiva graafiku, mida saab hooaja ja tegeliku määrdumise järgi kohandada." },
    { q: "Kuidas saab aknapesu toimuda ilma tööd katkestamata?", a: "Kohandume teie tööajaga. Teeme tööd kas enne kontorite avamist, peale sulgemist või nädalavahetustel. Kõrghoonete puhul töötame väljastpoolt, mis ei sega sisemist tööd üldse." },
    { q: "Kas teete ka kõrghoonete aknapesu?", a: "Jah, see on üks meie põhispetsialiseerumistest. Kasutame tõstukeid, ronimisvarustust ja teleskoopvarrega süsteeme. Kõik tehnikud on sertifitseeritud kõrgtöödeks." },
    { q: "Mis juhtub, kui aknapesu järel tekivad triibud?", a: "Kui märkate pärast töö vastuvõtmist meie tööst tingitud triipe või muid puudusi, andke neist teada. Vaatame olukorra üle ja lepime kokku sobiva lahenduse vastavalt töö tingimustele." },
    { q: "Millal on parim aeg klaashoone aknapesu tellida?", a: "Kevad (aprill–mai) pärast õietolmu perioodi ja sügis (oktoober–november) enne talve on kõige sobivamad. Lisaks regulaarne kvartaalne hooldus." },
  ],
}


export const en: OutdoorServicePageData = {
  ariaLabel: "Window cleaning", heroImage: "/akende-pesu-1.jpg", image: "/akende-pesu-2.jpg", imageAlt: "SPS Grupp window cleaning",
  title: "Window cleaning", titleAccent: "for commercial buildings in Tallinn and Harjumaa",
  intro: "Professional window cleaning for high-rise buildings, offices and commercial premises. Height-access certifications, specialist equipment, crystal-clear results.",
  cta: "Request a window cleaning quote", breadcrumb: "Window cleaning", parentBreadcrumb: enParent,
  chips: [{ value: "Certified", label: "working at height", tone: "blue" }, { value: "Insured", label: "operations", tone: "green" }, { value: "Since 2006", label: "experience", tone: "navy" }],
  problemTitle: "Has your office light been looking dimmer lately?",
  problemLead: "Windows get dirty so gradually you do not notice. Dust, pollution, spring pollen and winter salt residue build up slowly. Only when the windows are cleaned do you notice the contrast sharply.",
  problemDescription: "SPS Grupp brings that change to your building. For over 15 years we have been bringing a clear view to Tallinn's commercial properties. We specialise in cleaning large glass surfaces, including in the Ülemiste City business district.",
  serviceTitle: "What window cleaning does SPS Grupp provide?",
  serviceCards: [
    { bold: "Regular office window cleaning", desc: "Interior and exterior cleaning with professional equipment." },
    { bold: "High-rise window cleaning", desc: "With lifts and rope-access equipment, certified technicians." },
    { bold: "Glass facade and glass wall cleaning", desc: "Professional cleaning for different glass types with streak-free inspection." },
    { bold: "Retail centre shopfronts and entrances", desc: "Regular maintenance of shopfronts and entrances to keep them presentable." },
    { bold: "Window frame, seal and sill cleaning", desc: "Full cleaning including frames, seals and sills." },
    { bold: "Post-construction window cleaning", desc: "Dust, mortar, stickers — we remove all construction residue." },
  ],
  reasonsTitle: "Why choose SPS Grupp as your window cleaning partner?",
  reasons: [
    { title: "High-rise specialists", desc: "We use equipment that complies with European safety standards. All technicians have completed height-safety training." },
    { title: "Professional tools and equipment", desc: "Pressure washers, telescopic poles and purified water systems. We select the tools based on glass type, height and access." },
    { title: "Maintenance contract solutions", desc: "A regular window-cleaning schedule is drawn up according to building location, glass surfaces and soiling. The price and scope are agreed before work begins." },
    { title: "Insured service", desc: "Our full operation is insured and your property and building are protected." },
  ],
  priceTitle: "How is the cost of window cleaning determined?",
  priceIntro: "Window cleaning price depends on surface area, window type, access complexity and frequency of cleaning.",
  priceCards: [
    { size: "Office windows", area: "Low height", price: "1 EUR/m²", period: "from", highlight: true },
    { size: "Glass facades", area: "With telescopic pole", price: "0.9 EUR/m²", period: "from" },
    { size: "High-rise", area: "With access equipment", price: "2 EUR/m²", period: "from" },
  ],
  priceNote: "Recommended frequency 2–4 times per year, depending on the site's conditions. A regular maintenance contract qualifies for a discounted rate.",
  serviceInfoBlock: {
    tag: "Cleaning plan",
    title: "What do we agree on before window cleaning?",
    intro: "The scope of work, access and suitable timing determine both the cleaning method and the price. We set these out clearly before work starts.",
    items: [
      { title: "Cleaning scope", description: "We determine whether windows are cleaned on one or both sides and whether the work includes frames, seals and sills." },
      { title: "Access and method", description: "We choose a suitable solution based on building height and access: telescopic pole, lift, rope access or standard hand cleaning." },
      { title: "Timing and frequency", description: "We agree working hours that cause as little disruption to building users as possible, and a regular maintenance schedule where required." },
    ],
  },
  footerTitle: "Bring the light back into your office",
  footerDescription: "We will send an expert to your building to assess and prepare a personalised cleaning plan.",
  faq: [
    { q: "How often should Tallinn commercial building windows be professionally cleaned?", a: "Cleaning frequency depends on building location, traffic, weather, glass type and desired cleanliness. After a site assessment we recommend a suitable schedule that can be adjusted according to the season and actual soiling." },
    { q: "How can window cleaning be done without disrupting work?", a: "We adapt to your working hours. We work either before offices open, after they close or at weekends. For high-rise buildings we work from the outside, which does not disrupt indoor work at all." },
    { q: "Do you also clean high-rise windows?", a: "Yes, this is one of our core specialisms. We use lifts, rope-access equipment and telescopic pole systems. All technicians are certified for working at height." },
    { q: "What happens if streaks appear after cleaning?", a: "If you notice streaks or other defects caused by our work after acceptance, let us know. We will review the situation and agree a suitable solution based on the conditions of the work." },
    { q: "When is the best time to book a glass building window clean?", a: "Spring (April–May) after the pollen season and autumn (October–November) before winter are most suitable. Plus regular quarterly maintenance." },
  ],
}


export const ru: OutdoorServicePageData = {
  ariaLabel: "Мойка окон", heroImage: "/akende-pesu-1.jpg", image: "/akende-pesu-2.jpg", imageAlt: "SPS Grupp мойка окон",
  title: "Мойка окон", titleAccent: "коммерческих зданий в Таллинне и Харьюмаа",
  intro: "Профессиональная мойка окон высотных зданий, офисов и торговых помещений. Сертификация высотных работ, специальное оборудование, кристально чистый результат.",
  cta: "Запросить предложение по мойке окон", breadcrumb: "Мойка окон", parentBreadcrumb: ruParent,
  chips: [{ value: "Сертифицированы", label: "высотные работы", tone: "blue" }, { value: "Застраховано", label: "деятельность", tone: "green" }, { value: "С 2006", label: "опыт", tone: "navy" }],
  problemTitle: "Стал ли свет в вашем офисе тусклее в последнее время?",
  problemLead: "Окна загрязняются так медленно, что этого не замечаешь. Пыль, загрязнения, весенняя пыльца и зимние солевые остатки накапливаются постепенно. Только когда окна вымоют, разница становится заметной.",
  problemDescription: "SPS Grupp приносит эти изменения в ваше здание. Более 15 лет мы возвращаем ясный вид коммерческим зданиям Таллинна. Мы специализируемся на очистке больших стеклянных поверхностей, в том числе в деловом районе Ülemiste City.",
  serviceTitle: "Какую мойку окон предлагает SPS Grupp?",
  serviceCards: [
    { bold: "Регулярная мойка офисных окон", desc: "Мойка изнутри и снаружи профессиональными средствами." },
    { bold: "Мойка окон высотных зданий", desc: "С подъёмниками и альпинистским снаряжением, сертифицированные специалисты." },
    { bold: "Очистка стеклянных фасадов и перегородок", desc: "Профессиональная очистка различных типов стеклянных поверхностей с контролем результата." },
    { bold: "Витрины и входы торговых центров", desc: "Регулярное обслуживание витрин и входов для поддержания презентабельного вида." },
    { bold: "Очистка оконных рам, уплотнителей и подоконников", desc: "Полная очистка вместе с рамами, уплотнителями и подоконниками." },
    { bold: "Послестроительная мойка окон", desc: "Пыль, раствор, наклейки — удаляем все строительные остатки." },
  ],
  reasonsTitle: "Почему выбрать SPS Grupp партнёром по мойке окон?",
  reasons: [
    { title: "Специалисты по высотным зданиям", desc: "Используем оборудование, соответствующее европейским стандартам безопасности. Все специалисты прошли обучение по высотным работам." },
    { title: "Профессиональные средства и техника", desc: "Аппараты высокого давления, телескопические штанги и системы очищенной воды. Подбираем инструменты по типу стекла и высоте." },
    { title: "Решения с договором на обслуживание", desc: "График регулярной мойки окон составляется с учётом расположения здания и загрязнения. Цена и объём согласовываются до начала работ." },
    { title: "Застрахованная услуга", desc: "На высотных работах редко что-то случается, но вся наша деятельность застрахована и ваше имущество защищено." },
  ],
  priceTitle: "Как определяется стоимость мойки окон?",
  priceIntro: "Цена зависит от площади поверхности, типа окон, сложности доступа и частоты работ.",
  priceCards: [
    { size: "Офисные окна", area: "Низкая высота", price: "1 €/м²", period: "от", highlight: true },
    { size: "Стеклянные фасады", area: "Телескопическая штанга", price: "0,9 €/м²", period: "от" },
    { size: "Высотные здания", area: "Альпинистское снаряжение", price: "2 €/м²", period: "от" },
  ],
  priceNote: "Рекомендуемая частота 2–4 раза в год, в зависимости от условий объекта. При договоре обслуживания действует сниженная цена.",
  serviceInfoBlock: {
    tag: "План мойки",
    title: "О чём мы договариваемся перед мойкой окон?",
    intro: "Объём работ, доступ и подходящее время определяют как метод мойки, так и цену. Чётко прописываем эти пункты до начала работ.",
    items: [
      { title: "Объём мойки", description: "Определяем, моются ли стёкла с одной или обеих сторон и включает ли работа очистку рам, уплотнителей и подоконников." },
      { title: "Доступ и метод", description: "Выбираем подходящее решение в зависимости от высоты здания: телескопическая штанга, подъёмник, альпинистское снаряжение или ручная мойка." },
      { title: "Время и частота", description: "Согласовываем рабочее время с минимальными неудобствами для пользователей здания, а при необходимости — регулярный график обслуживания." },
    ],
  },
  footerTitle: "Вернём свет в ваш офис",
  footerDescription: "Отправим эксперта в ваше здание для оценки и составим индивидуальный план мойки.",
  faq: [
    { q: "Как часто следует профессионально мыть окна коммерческих зданий в Таллинне?", a: "Частота зависит от расположения здания, транспорта, погоды, типа стёкол и желаемой чистоты. После осмотра объекта рекомендуем подходящий график, который корректируется по сезону и фактическому загрязнению." },
    { q: "Как можно выполнять мойку окон, не нарушая работу?", a: "Подстраиваемся под ваш рабочий график. Работаем до открытия офисов, после закрытия или по выходным. Для высотных зданий работаем снаружи, что не нарушает работу внутри." },
    { q: "Моете ли вы окна высотных зданий?", a: "Да, это одна из наших основных специализаций. Используем подъёмники, альпинистское снаряжение и телескопические штанги. Все специалисты сертифицированы для высотных работ." },
    { q: "Что делать, если после мойки появились разводы?", a: "Если после приёмки работ вы заметите разводы или другие недостатки, вызванные нашей работой, сообщите нам. Рассмотрим ситуацию и согласуем решение." },
    { q: "Когда лучше заказать мойку окон стеклянного здания?", a: "Весна (апрель–май) после периода цветения и осень (октябрь–ноябрь) перед зимой — наиболее подходящее время. Плюс регулярное квартальное обслуживание." },
  ],
}


export const serviceDetail: ServiceDetailDefs = {
  et: { data: et, seo: {"serviceName":"Akende pesu","serviceDescription":"Akende pesu ärihoonetel Tallinnas. Kõrghoonete aknapesu, klaasfassaadid, regulaarne hooldus."}, tooprotsess: {"title":"Kuidas SPS aknapesu korraldab?","intro":"SPS alustab objekti ülevaatusest, et töömeetod, sagedus ja tehnika vastaksid tegelikule vajadusele.","steps":[["Pindade ülevaatus","Hindame klaaspindade mahu ja ligipääsu."],["Meetodi valik","Valime tõstuki, teleskoopvarre või muu lahenduse."],["Tööaja kokkulepe","Planeerime töö nii, et see ei segaks kliente ega töötajaid."],["Pesu ja kontroll","Teeme töö ning kontrollime triipudevaba tulemust."],["Hooldusgraafik","Soovi korral lepime kokku korduva pesurütmi."]]}, breadcrumbs: [{"name":"Avaleht","etPath":"/"},{"name":"Koristusteenus","etPath":"/koristusteenus"},{"name":"Välikoristus","etPath":"/koristusteenus/valikoristus"},{"name":"Akende pesu","etPath":"/koristusteenus/valikoristus/akende-pesu"}] },
  en: { data: en, seo: {"serviceName":"Window cleaning","serviceDescription":"Window cleaning for commercial buildings in Tallinn. High-rise, glass facades, regular maintenance."}, tooprotsess: {"title":"How does SPS arrange window cleaning?","intro":"SPS starts with a site assessment so the method, frequency and equipment match actual needs.","steps":[["Surface assessment","We assess the glass area and access."],["Method selection","We choose a lift, telescopic pole or other solution."],["Schedule agreement","We plan the work to avoid disruption to clients and staff."],["Cleaning and check","We do the work and check for a streak-free result."],["Maintenance schedule","We agree a repeat cleaning rhythm if desired."]]}, breadcrumbs: [{"name":"Home","etPath":"/"},{"name":"Cleaning","etPath":"/koristusteenus"},{"name":"Outdoor cleaning","etPath":"/koristusteenus/valikoristus"},{"name":"Window cleaning","etPath":"/koristusteenus/valikoristus/akende-pesu"}] },
  ru: { data: ru, seo: {"serviceName":"Мойка окон","serviceDescription":"Мойка окон коммерческих зданий в Таллинне. Высотные работы, стеклянные фасады."}, tooprotsess: {"title":"Как SPS организует мойку окон?","intro":"SPS начинает с осмотра объекта, чтобы метод, частота и оборудование соответствовали реальным потребностям.","steps":[["Осмотр поверхностей","Оцениваем объём стеклянных поверхностей и доступ."],["Выбор метода","Выбираем подъёмник, телескопическую штангу или другое решение."],["Согласование времени","Планируем работу так, чтобы не мешать клиентам и сотрудникам."],["Мойка и контроль","Выполняем работу и проверяем результат без разводов."],["График обслуживания","При желании согласовываем повторный график мойки."]]}, breadcrumbs: [{"name":"Главная","etPath":"/"},{"name":"Уборка","etPath":"/koristusteenus"},{"name":"Уборка территорий","etPath":"/koristusteenus/valikoristus"},{"name":"Мойка окон","etPath":"/koristusteenus/valikoristus/akende-pesu"}] },
}
