import type { OutdoorServicePageData, ServiceDetailDefs } from '@/app/components/templates/ServiceDetailTemplate'

const etParent = { etPath: "/puhastusteenused", label: "Puhastusteenused" };
const enParent = { etPath: "/puhastusteenused", label: "Specialist cleaning services" };
const ruParent = { etPath: "/puhastusteenused", label: "Клининговые услуги" };

export const et: OutdoorServicePageData = {
  ariaLabel: "Suurpuhastus", heroImage: "/puhastusteenused1.jpg", image: "/puhastusteenused2.jpg", imageAlt: "SPS Grupp suurpuhastus",
  title: "Suurpuhastus", titleAccent: "kontoritele ja äripindadele Tallinnas",
  intro: "Põhjalik süvapuhastus, mis ulatub kohtadesse, kuhu igapäevane koristus ei jõua — põrandate masinpesu, sanitaarruumide katlakivi eemaldus, kõrged riiulid ja raskesti ligipääsetavad alad.",
  cta: "Küsi suurpuhastuse pakkumist", breadcrumb: "Suurpuhastus", parentBreadcrumb: etParent,
  chips: [{ value: "Põhjalik", label: "süvapuhastus", tone: "blue" }, { value: "Kindlustatud", label: "tegevus", tone: "green" }, { value: "Alates 2006", label: "kogemust", tone: "navy" }],
  problemTitle: "Millal on viimati tehtud tõelist süvapuhastust?",
  problemLead: "Regulaarne koristus hoiab pinnad korras, aga mustus koguneb aja jooksul varjatud kohtadesse: põrandate servad, sanitaarruumide vuugid, kõrged riiulid, tehnika taga ja all. Seda ei näe enne, kui lähemalt vaatad.",
  problemDescription: "Suurpuhastus on ühekordne põhjalik puhastus, mis taastab ruumi algse seisukorra. SPS Grupp teeb suurpuhastusi kontoritele, kaubandus- ja tootmispindadele ning kortermajade ühisaladele — professionaalsete masinate ja vahenditega.",
  serviceTitle: "Mida sisaldab suurpuhastus?",
  serviceCards: [
    { bold: "Põrandate masinpesu ja süvapuhastus", desc: "Kõik põrandatüübid, ka liigne kaitsevahendi eemaldus." },
    { bold: "Sanitaarruumide põhjalik puhastus", desc: "Katlakivi, vuugid, desinfitseerimine." },
    { bold: "Kõrged ja varjatud alad", desc: "Riiulite pealsed, ventilatsiooniavad, tehnika taga ja all." },
    { bold: "Klaas- ja peegelpindade pesu", desc: "Sisepinnad, klaasseinad ja uksed." },
    { bold: "Kööginurkade ja puhkeruumide süvapuhastus", desc: "Tehnika sees ja taga, rasv ja katlakivi." },
    { bold: "Tekstiilide ja vaipade puhastus", desc: "Vajadusel koos vaipade ja pehme mööbli süvapuhastusega." },
  ],
  reasonsTitle: "Miks tellida suurpuhastus SPS Grupilt?",
  reasons: [
    { title: "Professionaalne tehnika", desc: "Põrandapesumasinaid, ekstraktorid ja tööstuslikud vahendid, mida igapäevakoristuses ei kasutata." },
    { title: "Kogemus alates 2006. aastast", desc: "Oleme teinud suurpuhastusi kõigil objektitüüpidel — büroodest tootmishooneteni." },
    { title: "Planeerimine ilma tööseisakuta", desc: "Töö teostatakse kokkulepitud ajal — õhtul, nädalavahetusel või etapiviisiliselt, et teie töö ei seiskuks." },
    { title: "ISO 9001 ja ISO 14001", desc: "Sertifitseeritud kvaliteedi- ja keskkonnajuhtimine ka eritööde puhul." },
  ],
  priceTitle: "Kuidas kujuneb suurpuhastuse hind?",
  priceIntro: "Suurpuhastuse hind sõltub pindalast, määrdumisastmest, tööde sisust ja ligipääsust. Täpne pakkumine pärast objekti ülevaatust või fotode põhjal.",
  priceCards: [
    { size: "Kontor suurpuhastus", area: "bürood ja äripinnad", price: "Pakkumine", period: "objekti järgi", highlight: true },
    { size: "Tootmis- ja laopinnad", area: "suured pinnad, masinpesu", price: "Pakkumine", period: "objekti järgi" },
    { size: "Kortermajade ühisalad", area: "trepikojad, koridorid", price: "Pakkumine", period: "objekti järgi" },
  ],
  priceNote: "Suurpuhastus on soodsam koos regulaarse hoolduskoristuse lepinguga — küsi kombineeritud pakkumist.",
  serviceInfoBlock: {
    tag: "Tööplaani kokkulepe",
    title: "Mida lepime enne suurpuhastust kokku?",
    intro: "Et tulemus vastaks ootusele, fikseerime tööde ulatuse ja ajakava enne algust.",
    items: [
      { title: "Tööde ulatus", description: "Määrame täpselt, millised alad ja tööd on kaasatud — põrandatest kõrgete riiuliteni." },
      { title: "Ajakava", description: "Valime aja, mis ei sega teie tööd — õhtu, nädalavahetus või etapiline teostus." },
      { title: "Vastuvõtt", description: "Lepime kokku, kuidas tulemus üle vaadatakse ja kuidas puudusi lahendatakse." },
    ],
  },
  footerTitle: "Taastame teie ruumide algse puhtuse",
  footerDescription: "Saatke fotod või kutsuge meid objektile — koostame tasuta pakkumise ühe tööpäeva jooksul.",
  faq: [
    { q: "Mis vahe on suurpuhastusel ja hoolduskoristusel?", a: "Hoolduskoristus on regulaarne igapäevane teenus, suurpuhastus on ühekordne põhjalik süvapuhastus, mis ulatub ka raskesti ligipääsetavatesse ja varjatud kohtadesse. Paljud kliendid kasutavad mõlemat: suurpuhastus taastab seisukorra, hoolduskoristus hoiab seda." },
    { q: "Kui kaua suurpuhastus aega võtab?", a: "Sõltub pindalast ja määrdumisastmest — tüüpilise kontori puhul 1–2 tööpäeva meeskonna tööd. Täpse aja hindame objekti ülevaatusel." },
    { q: "Kas töö segab meie igapäevast tegevust?", a: "Planeerime töö teie ajakava järgi — õhtuti, nädalavahetustel või etapiviisiliselt alade kaupa, nii et tegevus saab jätkuda." },
    { q: "Kas teete suurpuhastust ka kodudele?", a: "Meie põhifookus on äripinnad, kuid teeme suurpuhastusi ka kortermajade ühisaladel ja eraklientidele objektist sõltuvalt — kirjutage või helistage, vaatame objekti üle." },
    { q: "Mida pean enne suurpuhastust ette valmistama?", a: "Tavaliselt ei midagi — lepime ülevaatusel kokku, kas ja kuidas tuleb mööblit liigutada või alasid tühjendada. Vajadusel teeme selle ise." },
  ],
}


export const en: OutdoorServicePageData = {
  ariaLabel: "Deep cleaning", heroImage: "/puhastusteenused1.jpg", image: "/puhastusteenused2.jpg", imageAlt: "SPS Grupp deep cleaning",
  title: "Deep cleaning", titleAccent: "for offices and business premises in Tallinn",
  intro: "A thorough deep clean that reaches where everyday cleaning cannot — machine scrubbing of floors, limescale removal in washrooms, high shelving and hard-to-access areas.",
  cta: "Request a deep cleaning quote", breadcrumb: "Deep cleaning", parentBreadcrumb: enParent,
  chips: [{ value: "Thorough", label: "deep cleaning", tone: "blue" }, { value: "Insured", label: "operations", tone: "green" }, { value: "Since 2006", label: "experience", tone: "navy" }],
  problemTitle: "When was the last time a real deep clean was done?",
  problemLead: "Regular cleaning keeps surfaces tidy, but dirt accumulates over time in hidden places: floor edges, washroom joints, high shelving, behind and beneath equipment. You only see it when you look closely.",
  problemDescription: "Deep cleaning is a one-off thorough clean that restores the room to its original state. SPS Grupp carries out deep cleaning for offices, retail and production premises and apartment building common areas — with professional machines and products.",
  serviceTitle: "What does deep cleaning include?",
  serviceCards: [
    { bold: "Machine scrubbing and deep cleaning of floors", desc: "All floor types, including removal of excess protective agents." },
    { bold: "Thorough washroom cleaning", desc: "Limescale, joints, disinfection." },
    { bold: "High and hidden areas", desc: "Shelving tops, ventilation grilles, behind and beneath equipment." },
    { bold: "Glass and mirror cleaning", desc: "Interior surfaces, glass walls and doors." },
    { bold: "Kitchenette and break room deep cleaning", desc: "Inside and behind appliances, grease and limescale." },
    { bold: "Textile and carpet cleaning", desc: "Combined with carpet and upholstery deep cleaning where needed." },
  ],
  reasonsTitle: "Why order deep cleaning from SPS Grupp?",
  reasons: [
    { title: "Professional equipment", desc: "Floor scrubbers, extractors and industrial products not used in everyday cleaning." },
    { title: "Experience since 2006", desc: "We have deep-cleaned every type of site — from offices to production buildings." },
    { title: "Planned without downtime", desc: "Work is carried out at an agreed time — evenings, weekends or in stages, so your work does not stop." },
    { title: "ISO 9001 and ISO 14001", desc: "Certified quality and environmental management, also for one-off projects." },
  ],
  priceTitle: "How is the price of deep cleaning determined?",
  priceIntro: "The price depends on the area, level of soiling, scope of work and access. An exact quote follows a site assessment or photos.",
  priceCards: [
    { size: "Office deep cleaning", area: "offices and business premises", price: "Quote", period: "per site", highlight: true },
    { size: "Production and warehouse", area: "large areas, machine scrubbing", price: "Quote", period: "per site" },
    { size: "Apartment building common areas", area: "stairwells, corridors", price: "Quote", period: "per site" },
  ],
  priceNote: "Deep cleaning is more affordable together with a regular cleaning contract — ask for a combined quote.",
  serviceInfoBlock: {
    tag: "Work plan agreement",
    title: "What do we agree before a deep clean?",
    intro: "To make sure the result meets expectations, we fix the scope and schedule before starting.",
    items: [
      { title: "Scope of work", description: "We define exactly which areas and tasks are included — from floors to high shelving." },
      { title: "Schedule", description: "We choose a time that does not disrupt your work — evening, weekend or staged execution." },
      { title: "Acceptance", description: "We agree how the result is reviewed and how any deficiencies are resolved." },
    ],
  },
  footerTitle: "We restore the original cleanliness of your premises",
  footerDescription: "Send photos or invite us to the site — we prepare a free quote within one working day.",
  faq: [
    { q: "What is the difference between deep cleaning and regular cleaning?", a: "Regular cleaning is a recurring daily service; deep cleaning is a one-off thorough clean that also reaches hard-to-access and hidden areas. Many clients use both: deep cleaning restores the state, regular cleaning maintains it." },
    { q: "How long does a deep clean take?", a: "It depends on the area and level of soiling — a typical office takes 1–2 working days for a team. We estimate the exact time during the site assessment." },
    { q: "Will the work disrupt our daily operations?", a: "We plan the work around your schedule — evenings, weekends or in stages area by area, so operations can continue." },
    { q: "Do you also deep-clean homes?", a: "Our main focus is business premises, but we also do deep cleaning for apartment building common areas and, depending on the site, for private clients — write or call and we will review the site." },
    { q: "Do I need to prepare anything before a deep clean?", a: "Usually nothing — at the assessment we agree whether and how furniture should be moved or areas cleared. If needed, we do it ourselves." },
  ],
}


export const ru: OutdoorServicePageData = {
  ariaLabel: "Генеральная уборка", heroImage: "/puhastusteenused1.jpg", image: "/puhastusteenused2.jpg", imageAlt: "SPS Grupp генеральная уборка",
  title: "Генеральная уборка", titleAccent: "офисов и коммерческих помещений в Таллинне",
  intro: "Тщательная генеральная уборка, которая достаёт туда, куда повседневная уборка не добирается — машинная мойка полов, удаление известкового налёта в санузлах, высокие стеллажи и труднодоступные зоны.",
  cta: "Запросить предложение по генеральной уборке", breadcrumb: "Генеральная уборка", parentBreadcrumb: ruParent,
  chips: [{ value: "Тщательно", label: "генеральная уборка", tone: "blue" }, { value: "Застраховано", label: "деятельность", tone: "green" }, { value: "С 2006", label: "опыт", tone: "navy" }],
  problemTitle: "Когда в последний раз делалась настоящая генеральная уборка?",
  problemLead: "Регулярная уборка поддерживает порядок, но грязь со временем накапливается в скрытых местах: края полов, швы санузлов, верхние полки, за и под техникой. Это видно, только когда присмотритесь.",
  problemDescription: "Генеральная уборка — это разовая тщательная уборка, восстанавливающая помещение до первоначального состояния. SPS Grupp выполняет генеральные уборки офисов, торговых и производственных помещений и общих зон жилых домов — профессиональными машинами и средствами.",
  serviceTitle: "Что входит в генеральную уборку?",
  serviceCards: [
    { bold: "Машинная мойка и глубокая чистка полов", desc: "Все типы полов, включая удаление излишков защитных средств." },
    { bold: "Тщательная уборка санузлов", desc: "Известковый налёт, швы, дезинфекция." },
    { bold: "Высокие и скрытые зоны", desc: "Верх стеллажей, вентиляционные решётки, за и под техникой." },
    { bold: "Мойка стеклянных и зеркальных поверхностей", desc: "Внутренние поверхности, стеклянные стены и двери." },
    { bold: "Глубокая чистка кухонь и комнат отдыха", desc: "Внутри и за техникой, жир и известковый налёт." },
    { bold: "Чистка текстиля и ковров", desc: "При необходимости вместе с глубокой чисткой ковров и мягкой мебели." },
  ],
  reasonsTitle: "Почему заказывать генеральную уборку у SPS Grupp?",
  reasons: [
    { title: "Профессиональная техника", desc: "Поломоечные машины, экстракторы и промышленные средства, не используемые в повседневной уборке." },
    { title: "Опыт с 2006 года", desc: "Мы делали генеральные уборки на всех типах объектов — от офисов до производственных зданий." },
    { title: "Планирование без простоя", desc: "Работа выполняется в согласованное время — вечером, в выходные или поэтапно, чтобы ваша работа не останавливалась." },
    { title: "ISO 9001 и ISO 14001", desc: "Сертифицированный менеджмент качества и экологии также для разовых работ." },
  ],
  priceTitle: "Как формируется цена генеральной уборки?",
  priceIntro: "Цена зависит от площади, степени загрязнения, объёма работ и доступа. Точное предложение — после оценки объекта или по фотографиям.",
  priceCards: [
    { size: "Генеральная уборка офиса", area: "офисы и коммерческие помещения", price: "Предложение", period: "по объекту", highlight: true },
    { size: "Производственные и складские", area: "большие площади, машинная мойка", price: "Предложение", period: "по объекту" },
    { size: "Общие зоны жилых домов", area: "лестничные клетки, коридоры", price: "Предложение", period: "по объекту" },
  ],
  priceNote: "Генеральная уборка выгоднее вместе с договором регулярной уборки — запросите комбинированное предложение.",
  serviceInfoBlock: {
    tag: "Согласование плана",
    title: "О чём мы договариваемся до генеральной уборки?",
    intro: "Чтобы результат соответствовал ожиданиям, мы фиксируем объём работ и график до начала.",
    items: [
      { title: "Объём работ", description: "Точно определяем, какие зоны и работы включены — от полов до высоких стеллажей." },
      { title: "График", description: "Выбираем время, не мешающее вашей работе — вечер, выходные или поэтапное выполнение." },
      { title: "Приёмка", description: "Договариваемся, как проверяется результат и как устраняются недочёты." },
    ],
  },
  footerTitle: "Вернём вашим помещениям первоначальную чистоту",
  footerDescription: "Пришлите фотографии или пригласите нас на объект — подготовим бесплатное предложение в течение одного рабочего дня.",
  faq: [
    { q: "В чём разница между генеральной и регулярной уборкой?", a: "Регулярная уборка — повторяющаяся ежедневная услуга; генеральная — разовая тщательная уборка, охватывающая также труднодоступные и скрытые места. Многие клиенты используют обе: генеральная восстанавливает состояние, регулярная поддерживает его." },
    { q: "Сколько времени занимает генеральная уборка?", a: "Зависит от площади и степени загрязнения — типичный офис занимает 1–2 рабочих дня команды. Точное время оценим при осмотре объекта." },
    { q: "Помешает ли работа нашей повседневной деятельности?", a: "Планируем работу под ваш график — вечерами, в выходные или поэтапно по зонам, чтобы деятельность продолжалась." },
    { q: "Делаете ли вы генеральную уборку в домах?", a: "Наш основной фокус — коммерческие помещения, но мы делаем генеральную уборку и в общих зонах жилых домов, а в зависимости от объекта и у частных клиентов — напишите или позвоните, оценим объект." },
    { q: "Нужно ли что-то подготовить до генеральной уборки?", a: "Обычно ничего — при осмотре договоримся, нужно ли и как передвигать мебель или освобождать зоны. При необходимости сделаем это сами." },
  ],
}


export const serviceDetail: ServiceDetailDefs = {
  et: { data: et, seo: {"serviceName":"Suurpuhastus","serviceDescription":"Suurpuhastus kontoritele ja äripindadele Tallinnas — põhjalik süvapuhastus, põrandate masinpesu, sanitaarruumide katlakivi eemaldus. Tasuta pakkumine!"}, tooprotsess: {"title":"Kuidas SPS suurpuhastuse korraldab?","intro":"Alustame objekti ülevaatusest, et töö ulatus, ajakava ja tehnika vastaksid tegelikule vajadusele.","steps":[["Objekti ülevaatus","Hindame pindade mahu, määrdumise ja ligipääsu."],["Tööplaani koostamine","Fikseerime tööde ulatuse, ajakava ja vastuvõtu kriteeriumid."],["Meeskond ja tehnika","Määrame sobiva meeskonna, masinad ja puhastusvahendid."],["Teostus","Teeme töö kokkulepitud ajal, teie tegevust segamata."],["Vastuvõtt","Vaatame tulemuse koos üle ja lahendame võimalikud puudused."]]}, breadcrumbs: [{"name":"Avaleht","etPath":"/"},{"name":"Puhastusteenused","etPath":"/puhastusteenused"},{"name":"Suurpuhastus","etPath":"/puhastusteenused/suurpuhastus"}] },
  en: { data: en, seo: {"serviceName":"Deep cleaning","serviceDescription":"Deep cleaning for offices and business premises in Tallinn — thorough cleaning, machine scrubbing of floors, limescale removal. Free quote!"}, tooprotsess: {"title":"How does SPS arrange deep cleaning?","intro":"We start with a site assessment so the scope, schedule and equipment match actual needs.","steps":[["Site assessment","We assess surface areas, soiling and access."],["Work plan","We fix the scope, schedule and acceptance criteria."],["Team and equipment","We assign a suitable team, machines and cleaning products."],["Execution","We do the work at the agreed time without disrupting your operations."],["Acceptance","We review the result together and resolve any deficiencies."]]}, breadcrumbs: [{"name":"Home","etPath":"/"},{"name":"Specialist cleaning services","etPath":"/puhastusteenused"},{"name":"Deep cleaning","etPath":"/puhastusteenused/suurpuhastus"}] },
  ru: { data: ru, seo: {"serviceName":"Генеральная уборка","serviceDescription":"Генеральная уборка офисов и коммерческих помещений в Таллинне — тщательная уборка, машинная мойка полов, удаление известкового налёта. Бесплатное предложение!"}, tooprotsess: {"title":"Как SPS организует генеральную уборку?","intro":"Начинаем с оценки объекта, чтобы объём работ, график и техника соответствовали реальным потребностям.","steps":[["Оценка объекта","Оцениваем площадь поверхностей, загрязнение и доступ."],["План работ","Фиксируем объём работ, график и критерии приёмки."],["Команда и техника","Назначаем подходящую команду, машины и моющие средства."],["Выполнение","Выполняем работу в согласованное время, не мешая вашей деятельности."],["Приёмка","Проверяем результат вместе и устраняем возможные недочёты."]]}, breadcrumbs: [{"name":"Главная","etPath":"/"},{"name":"Клининговые услуги","etPath":"/puhastusteenused"},{"name":"Генеральная уборка","etPath":"/puhastusteenused/suurpuhastus"}] },
}
