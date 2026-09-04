import type { OutdoorServicePageData, ServiceDetailDefs } from '@/app/components/templates/ServiceDetailTemplate'

const etParent = { etPath: "/koristusteenus", label: "Koristusteenus" };
const enParent = { etPath: "/koristusteenus", label: "Cleaning services" };
const ruParent = { etPath: "/koristusteenus", label: "Услуги уборки" };

export const et: OutdoorServicePageData = {
  ariaLabel: "Hoolduskoristus", heroImage: "/Koristusteenused-HERO.jpg", image: "/Koristusteenus2.jpg", imageAlt: "SPS Grupp hoolduskoristus äripindadel",
  title: "Hoolduskoristus", titleAccent: "äripindadele Tallinnas ja Harjumaal",
  intro: "Lepingueline regulaarne koristus kontoritele, kaubandus- ja tootmispindadele - 1–7 korda nädalas, kokkulepitud mahus ja graafikus. Kindel personal, objektijuht ja regulaarne kvaliteedikontroll.",
  cta: "Küsi hoolduskoristuse pakkumist", breadcrumb: "Hoolduskoristus", parentBreadcrumb: etParent,
  chips: [{ value: "1–7×", label: "nädalas", tone: "blue" }, { value: "ISO 9001", label: "sertifitseeritud", tone: "green" }, { value: "300+", label: "töötajat", tone: "navy" }],
  problemTitle: "Kas teie praegune hoolduskoristus vastab ettevõtte ootustele?",
  problemLead: "Paljud ettevõtted on olukorras, kus koristaja küll käib, aga tulemus ei rahulda. Tolm koguneb kappide peale, prügikastid on hommikul täis ja sanitaarruumides lõpevad tarvikud kõige ebasobivamal hetkel.",
  problemDescription: "Hoolduskoristus on lepinguline süsteem, mitte juhuslik külastus. SPS Grupp on alates 2006. aastast hooldanud äripindu üle 1 000 000 m² - teame, et tulemus sünnib täpsest tööplaanist, kindlast personalist ja jooksvast kvaliteedikontrollist.",
  serviceTitle: "Mida sisaldab hoolduskoristuse teenus?",
  serviceCards: [
    { bold: "Igapäevane üldkoristus", desc: "Põrandate kuiv- ja märgpesu, tolmuvõtt ja pindade puhastus." },
    { bold: "Sanitaarruumide hooldus", desc: "Põhjalik puhastus ja hügieenitarvikute täiendamine." },
    { bold: "Prügi käitlemine", desc: "Kogumine, sorteerimine ja kilekottide vahetus." },
    { bold: "Kööginurkade ja puhkeruumide koristus", desc: "Tasapinnad, tehnika ja istumisalad." },
    { bold: "Puutepindade desinfitseerimine", desc: "Ukselingid, lülitid ja muud sageli puudutatavad pinnad." },
    { bold: "Valvekoristus", desc: "Soovi korral puhastusteenindaja objektil kogu tööpäeva vältel." },
  ],
  reasonsTitle: "Miks valida SPS Grupp hoolduskoristuse partneriks?",
  reasons: [
    { title: "Igal objektil kindel personal", desc: "Teie objekti koristab sama koolitatud meeskond - ka haiguste ja puhkuste ajal on asendus tagatud." },
    { title: "Objektijuht ja kvaliteedikontroll", desc: "Objektijuht teeb regulaarseid kontrollkäike ja lahendab puudused enne, kui neist saab korduv probleem." },
    { title: "ISO 9001 ja ISO 14001 süsteemid", desc: "Sertifitseeritud kvaliteedi- ja keskkonnajuhtimine tagab ühtlase tulemuse igal objektil." },
    { title: "Vastutuskindlustusega teenus", desc: "Kogu meie tegevus on kindlustatud - teie vara ja ehitis on kaitstud." },
  ],
  priceTitle: "Kuidas kujuneb hoolduskoristuse hind?",
  priceIntro: "Hoolduskoristuse kuuhind sõltub pindalast, koristuse sagedusest, töötajate arvust ja eritööde vajadusest. Orienteeruv hind alates 1,20 €/m² kuus - täpne pakkumine pärast tasuta objekti ülevaatust.",
  priceCards: [
    { size: "Kontorid ja bürood", area: "alates 800 m²", price: "1,20 €/m²", period: "kuus, alates", highlight: true },
    { size: "Kaubanduspinnad", area: "poed, keskused, esindused", price: "Pakkumine", period: "objekti järgi" },
    { size: "Tootmishooned ja laod", area: "arvestades ohutusnõudeid", price: "Pakkumine", period: "objekti järgi" },
  ],
  priceNote: "Mida suurem pind ja sagedam koristus, seda soodsam m² hind. Regulaarse lepingu korral kehtivad soodustingimused.",
  serviceInfoBlock: {
    tag: "Koristusplaan",
    title: "Mida lepime enne hoolduskoristust kokku?",
    intro: "Hea leping algab objekti ülevaatusest. Paneme kirja tööde mahu, sageduse ja kvaliteedikriteeriumid, et teenus vastaks tegelikule kasutusele.",
    items: [
      { title: "Tööde maht ja sagedus", description: "Kirjeldame alad, igapäevased ja perioodilised tööd ning koristuse sageduse - 1–7 korda nädalas." },
      { title: "Tööaeg ja ligipääs", description: "Tavaliselt töövälises ajas - varahommikul või õhtul; kokkuleppel ka päevasel ajal." },
      { title: "Kvaliteedikontroll", description: "Objektijuhi kontrollkäikude rütm ja tagasiside kanal on lepingu osa." },
    ],
  },
  footerTitle: "Tellige tasuta hoolduskoristuse analüüs",
  footerDescription: "Võtame teiega üldjuhul ühe tööpäeva jooksul ühendust ja lepime kokku tasuta objekti ülevaatuse.",
  faq: [
    { q: "Mis on hoolduskoristus?", a: "Hoolduskoristus on lepinguline regulaarne koristusteenus äripindadele, mida teostatakse kokkulepitud mahus ja graafikus - tüüpiliselt 1–7 korda nädalas. Eesmärk on hoida ruumid igapäevaselt puhtad ja kasutusvalmis." },
    { q: "Kui tihti peaks äripinda koristama?", a: "Enamikule kontoritest soovitame 3–5 korda nädalas. Tiheda liiklusega kaubanduspinnad ja sanitaarruumid vajavad igapäevast hooldust, väiksemad bürood saavad hakkama 2–3 korraga nädalas. Täpne graafik koostatakse tasuta ülevaatuse käigus." },
    { q: "Kas koristus toimub tööajal või väljaspool?", a: "Tavaliselt koristame töövälisel ajal - varahommikul enne tööpäeva algust või õhtul pärast tööaega. Soovi korral korraldame ka päevase valvekoristuse." },
    { q: "Kas sama koristaja käib meil alati?", a: "Jah - igale objektile määratakse kindel meeskond, kes tunneb teie ruumide eripärasid. Haiguste ja puhkuste ajal on tagatud koolitatud asendaja." },
    { q: "Kuidas saab hoolduskoristusega alustada?", a: "Võtke ühendust - teeme tasuta objekti ülevaatuse, koostame koristusplaani ja hinnapakkumise. Tööde algusaeg lepitakse kokku pärast mahu ja meeskonna saadavuse hindamist." },
  ],
}


export const en: OutdoorServicePageData = {
  ariaLabel: "Regular cleaning", heroImage: "/Koristusteenused-HERO.jpg", image: "/Koristusteenus2.jpg", imageAlt: "SPS Grupp regular cleaning of business premises",
  title: "Regular cleaning", titleAccent: "for business premises in Tallinn and Harjumaa",
  intro: "Contract-based regular cleaning for offices, retail and production premises - 1–7 times a week, at an agreed scope and schedule. Dedicated staff, a site manager and regular quality control.",
  cta: "Request a regular cleaning quote", breadcrumb: "Regular cleaning", parentBreadcrumb: enParent,
  chips: [{ value: "1–7×", label: "per week", tone: "blue" }, { value: "ISO 9001", label: "certified", tone: "green" }, { value: "300+", label: "employees", tone: "navy" }],
  problemTitle: "Does your current cleaning service meet your company's expectations?",
  problemLead: "Many companies find that the cleaner comes, but the result is not satisfying. Dust gathers on cabinets, bins are still full in the morning and supplies run out at the worst moment.",
  problemDescription: "Regular cleaning is a contracted system, not an occasional visit. SPS Grupp has maintained business premises covering over 1,000,000 m² since 2006 - we know results come from a precise work plan, dedicated staff and ongoing quality control.",
  serviceTitle: "What does the regular cleaning service include?",
  serviceCards: [
    { bold: "Daily general cleaning", desc: "Dry and wet cleaning of floors, dusting and surface cleaning." },
    { bold: "Washroom maintenance", desc: "Thorough cleaning and restocking of hygiene supplies." },
    { bold: "Waste handling", desc: "Collection, sorting and replacement of bin liners." },
    { bold: "Kitchenette and break room cleaning", desc: "Surfaces, appliances and seating areas." },
    { bold: "Disinfection of touch points", desc: "Door handles, switches and other frequently touched surfaces." },
    { bold: "Day porter service", desc: "On request, a cleaning attendant on site throughout the working day." },
  ],
  reasonsTitle: "Why choose SPS Grupp as your regular cleaning partner?",
  reasons: [
    { title: "Dedicated staff on every site", desc: "Your site is cleaned by the same trained team - cover is guaranteed during sickness and holidays." },
    { title: "Site manager and quality control", desc: "The site manager makes regular inspection visits and resolves issues before they become recurring problems." },
    { title: "ISO 9001 and ISO 14001 systems", desc: "Certified quality and environmental management ensures a consistent result on every site." },
    { title: "Insured service", desc: "Our entire operation is insured - your property and building are protected." },
  ],
  priceTitle: "How is the price of regular cleaning determined?",
  priceIntro: "The monthly price depends on the area, cleaning frequency, number of employees and specialist work needed. Guide price from €1.20/m² per month - an exact quote after a free site assessment.",
  priceCards: [
    { size: "Offices", area: "from 800 m²", price: "€1.20/m²", period: "per month, from", highlight: true },
    { size: "Retail premises", area: "shops, centres, showrooms", price: "Quote", period: "per site" },
    { size: "Production and warehouse", area: "considering safety requirements", price: "Quote", period: "per site" },
  ],
  priceNote: "The larger the area and the more frequent the cleaning, the lower the m² price. A regular contract qualifies for discounted terms.",
  serviceInfoBlock: {
    tag: "Cleaning plan",
    title: "What do we agree before regular cleaning starts?",
    intro: "A good contract starts with a site assessment. We put the scope, frequency and quality criteria in writing so the service matches actual use.",
    items: [
      { title: "Scope and frequency", description: "We describe areas, daily and periodic tasks and the cleaning frequency - 1–7 times a week." },
      { title: "Timing and access", description: "Usually outside working hours - early morning or evening; daytime cleaning by agreement." },
      { title: "Quality control", description: "The site manager's inspection rhythm and feedback channel are part of the contract." },
    ],
  },
  footerTitle: "Order a free regular cleaning assessment",
  footerDescription: "We usually contact you within one working day and arrange a free site assessment.",
  faq: [
    { q: "What is regular cleaning?", a: "Regular cleaning is a contracted recurring cleaning service for business premises, carried out at an agreed scope and schedule - typically 1–7 times a week. The goal is to keep premises clean and ready for use every day." },
    { q: "How often should business premises be cleaned?", a: "We recommend 3–5 times a week for most offices. High-traffic retail premises and washrooms need daily attention, smaller offices manage with 2–3 times a week. The exact schedule is drawn up during a free assessment." },
    { q: "Does cleaning happen during or outside working hours?", a: "We usually clean outside working hours - early morning before the workday or in the evening. A day porter service can also be arranged on request." },
    { q: "Will we always have the same cleaner?", a: "Yes - every site gets a dedicated team that knows your premises. A trained replacement is guaranteed during sickness and holidays." },
    { q: "How do we get started with regular cleaning?", a: "Contact us - we will do a free site assessment, prepare a cleaning plan and a quote. The start date is agreed after assessing the scope and team availability." },
  ],
}


export const ru: OutdoorServicePageData = {
  ariaLabel: "Регулярная уборка", heroImage: "/Koristusteenused-HERO.jpg", image: "/Koristusteenus2.jpg", imageAlt: "SPS Grupp регулярная уборка коммерческих помещений",
  title: "Регулярная уборка", titleAccent: "коммерческих помещений в Таллинне и Харьюмаа",
  intro: "Договорная регулярная уборка офисов, торговых и производственных помещений - 1–7 раз в неделю, в согласованном объёме и по графику. Постоянный персонал, менеджер объекта и регулярный контроль качества.",
  cta: "Запросить предложение по регулярной уборке", breadcrumb: "Регулярная уборка", parentBreadcrumb: ruParent,
  chips: [{ value: "1–7×", label: "в неделю", tone: "blue" }, { value: "ISO 9001", label: "сертифицировано", tone: "green" }, { value: "300+", label: "сотрудников", tone: "navy" }],
  problemTitle: "Соответствует ли ваша текущая уборка ожиданиям компании?",
  problemLead: "Многие компании сталкиваются с ситуацией, когда уборщик приходит, но результат не устраивает. Пыль собирается на шкафах, урны утром всё ещё полные, а расходные материалы в санузлах заканчиваются в самый неподходящий момент.",
  problemDescription: "Регулярная уборка - это договорная система, а не случайный визит. SPS Grupp с 2006 года обслуживает коммерческие помещения площадью более 1 000 000 м² - мы знаем, что результат рождается из точного плана работ, постоянного персонала и постоянного контроля качества.",
  serviceTitle: "Что входит в услугу регулярной уборки?",
  serviceCards: [
    { bold: "Ежедневная общая уборка", desc: "Сухая и влажная уборка полов, удаление пыли и очистка поверхностей." },
    { bold: "Обслуживание санузлов", desc: "Тщательная уборка и пополнение гигиенических средств." },
    { bold: "Обращение с отходами", desc: "Сбор, сортировка и замена мешков для мусора." },
    { bold: "Уборка кухонь и комнат отдыха", desc: "Поверхности, техника и зоны отдыха." },
    { bold: "Дезинфекция точек касания", desc: "Дверные ручки, выключатели и другие часто используемые поверхности." },
    { bold: "Дневной дежурный уборщик", desc: "По желанию - сотрудник на объекте в течение всего рабочего дня." },
  ],
  reasonsTitle: "Почему выбрать SPS Grupp партнёром по регулярной уборке?",
  reasons: [
    { title: "Постоянный персонал на каждом объекте", desc: "Ваш объект убирает одна и та же обученная команда - замена гарантирована на время болезней и отпусков." },
    { title: "Менеджер объекта и контроль качества", desc: "Менеджер проводит регулярные проверки и решает проблемы до того, как они станут повторяющимися." },
    { title: "Системы ISO 9001 и ISO 14001", desc: "Сертифицированный менеджмент качества и экологии обеспечивает стабильный результат на каждом объекте." },
    { title: "Застрахованная услуга", desc: "Вся наша деятельность застрахована - ваше имущество и здание защищены." },
  ],
  priceTitle: "Как формируется цена регулярной уборки?",
  priceIntro: "Месячная цена зависит от площади, частоты уборки, числа сотрудников и необходимости специальных работ. Ориентировочная цена от 1,20 €/м² в месяц - точное предложение после бесплатной оценки объекта.",
  priceCards: [
    { size: "Офисы", area: "от 800 м²", price: "1,20 €/м²", period: "в месяц, от", highlight: true },
    { size: "Торговые помещения", area: "магазины, центры, шоурумы", price: "Предложение", period: "по объекту" },
    { size: "Производство и склады", area: "с учётом требований безопасности", price: "Предложение", period: "по объекту" },
  ],
  priceNote: "Чем больше площадь и чаще уборка, тем выгоднее цена за м². При регулярном договоре действуют льготные условия.",
  serviceInfoBlock: {
    tag: "План уборки",
    title: "О чём мы договариваемся до начала регулярной уборки?",
    intro: "Хороший договор начинается с оценки объекта. Мы фиксируем объём, частоту и критерии качества, чтобы услуга соответствовала реальному использованию.",
    items: [
      { title: "Объём и частота", description: "Описываем зоны, ежедневные и периодические работы и частоту уборки - 1–7 раз в неделю." },
      { title: "Время и доступ", description: "Обычно вне рабочего времени - рано утром или вечером; по договорённости и днём." },
      { title: "Контроль качества", description: "Ритм проверок менеджера объекта и канал обратной связи - часть договора." },
    ],
  },
  footerTitle: "Закажите бесплатную оценку регулярной уборки",
  footerDescription: "Мы обычно связываемся с вами в течение одного рабочего дня и договариваемся о бесплатной оценке объекта.",
  faq: [
    { q: "Что такое регулярная уборка?", a: "Регулярная уборка - это договорная повторяющаяся услуга уборки коммерческих помещений в согласованном объёме и по графику - обычно 1–7 раз в неделю. Цель - ежедневно поддерживать помещения чистыми и готовыми к использованию." },
    { q: "Как часто нужно убирать коммерческие помещения?", a: "Большинству офисов мы рекомендуем 3–5 раз в неделю. Торговые помещения с высокой проходимостью и санузлы требуют ежедневного обслуживания, небольшие офисы справляются 2–3 раза в неделю. Точный график составляется при бесплатной оценке." },
    { q: "Уборка происходит в рабочее время или вне его?", a: "Обычно мы убираем вне рабочего времени - рано утром до начала рабочего дня или вечером. По запросу организуем и дневную дежурную уборку." },
    { q: "У нас всегда будет один и тот же уборщик?", a: "Да - за каждым объектом закрепляется постоянная команда, которая знает особенности ваших помещений. На время болезней и отпусков гарантирована обученная замена." },
    { q: "Как начать пользоваться регулярной уборкой?", a: "Свяжитесь с нами - мы проведём бесплатную оценку объекта, составим план уборки и предложение цены. Дата начала работ согласовывается после оценки объёма и доступности команды." },
  ],
}


export const serviceDetail: ServiceDetailDefs = {
  et: { data: et, seo: {"serviceName":"Hoolduskoristus","serviceDescription":"Hoolduskoristus äripindadele Tallinnas ja Harjumaal - regulaarne lepinguline koristus 1–7 korda nädalas, alates 1,20 €/m² kuus. Tasuta ülevaatus!"}, tooprotsess: {"title":"Kuidas SPS hoolduskoristuse käivitab?","intro":"Parem teenus algab enne esimest koristuskorda - kaardistame, kuidas teie objekt päriselt töötab, ja ehitame tööplaani selle põhjal.","steps":[["Objekti ülevaatus","Vaatame üle ruumide suuruse, kasutuskoormuse, põrandatüübid, sanitaarruumid ja tööajad."],["Tööplaani koostamine","Kirjeldame alad, sageduse, igapäevased ja perioodilised tööd ning vastutava kontaktisiku."],["Meeskonna ettevalmistus","Määrame objektile sobiva väljaõppega teenindajad ja vajalikud vahendid."],["Teenuse käivitamine","Alustame kokkulepitud graafiku järgi ja täpsustame mahtu tegeliku kasutuse põhjal."],["Kvaliteedikontroll","Objektijuht kontrollib tulemust ja lahendab puudused enne, kui neist saab korduv probleem."]]}, breadcrumbs: [{"name":"Avaleht","etPath":"/"},{"name":"Koristusteenus","etPath":"/koristusteenus"},{"name":"Hoolduskoristus","etPath":"/koristusteenus/hoolduskoristus"}] },
  en: { data: en, seo: {"serviceName":"Regular cleaning","serviceDescription":"Regular contract cleaning for business premises in Tallinn and Harjumaa - 1–7 times a week, from €1.20/m² per month. Free assessment!"}, tooprotsess: {"title":"How does SPS launch regular cleaning?","intro":"A better service starts before the first cleaning - we map how your site actually works and build the work plan around it.","steps":[["Site assessment","We review room sizes, usage load, floor types, washrooms and working hours."],["Work plan","We describe areas, frequency, daily and periodic tasks and the responsible contact person."],["Team preparation","We assign suitably trained attendants and the required equipment."],["Service launch","We start on the agreed schedule and fine-tune the scope based on actual use."],["Quality control","The site manager checks results and resolves issues before they recur."]]}, breadcrumbs: [{"name":"Home","etPath":"/"},{"name":"Cleaning services","etPath":"/koristusteenus"},{"name":"Regular cleaning","etPath":"/koristusteenus/hoolduskoristus"}] },
  ru: { data: ru, seo: {"serviceName":"Регулярная уборка","serviceDescription":"Регулярная договорная уборка коммерческих помещений в Таллинне и Харьюмаа - 1–7 раз в неделю, от 1,20 €/м² в месяц. Бесплатная оценка!"}, tooprotsess: {"title":"Как SPS запускает регулярную уборку?","intro":"Лучший сервис начинается до первой уборки - мы изучаем, как ваш объект работает на самом деле, и строим план на этой основе.","steps":[["Оценка объекта","Оцениваем размеры помещений, нагрузку, типы полов, санузлы и рабочее время."],["План работ","Описываем зоны, частоту, ежедневные и периодические задачи и ответственное контактное лицо."],["Подготовка команды","Назначаем обученных сотрудников и необходимое оборудование."],["Запуск услуги","Начинаем по согласованному графику и уточняем объём по фактическому использованию."],["Контроль качества","Менеджер объекта проверяет результат и решает проблемы до их повторения."]]}, breadcrumbs: [{"name":"Главная","etPath":"/"},{"name":"Услуги уборки","etPath":"/koristusteenus"},{"name":"Регулярная уборка","etPath":"/koristusteenus/hoolduskoristus"}] },
}
