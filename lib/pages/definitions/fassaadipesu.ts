import type { OutdoorServicePageData, ServiceDetailDefs } from '@/app/components/templates/ServiceDetailTemplate'

const etParent = { etPath: "/koristusteenus/valikoristus", label: "Välikoristus" };
const enParent = { etPath: "/koristusteenus/valikoristus", label: "Outdoor cleaning and grounds care" };
const ruParent = { etPath: "/koristusteenus/valikoristus", label: "Уборка и обслуживание территорий" };

export const et: OutdoorServicePageData = {
  ariaLabel: "Fassaadipesu", heroImage: "/fassaadipesu1.jpg", image: "/fassaadipesu1.jpg", imageAlt: "SPS Grupp fassaadipesu",
  title: "Fassaadipesu", titleAccent: "Tallinnas ja Harjumaal",
  intro: "Taastame teie hoone välisilme, olgu selle katteks krohv, klinker, klaas või metall. Õige meetod iga pinnatüübi jaoks. Ökoloogilised lahendused ja kõrghoonete spetsialistid.",
  cta: "Küsi fassaadipesu pakkumist", breadcrumb: "Fassaadipesu", parentBreadcrumb: etParent,
  chips: [{ value: "Kõrgtööde", label: "kogemus", tone: "blue" }, { value: "Kindlustatud", label: "tegevus", tone: "green" }, { value: "Alates 2006", label: "kogemust", tone: "navy" }],
  problemTitle: "Aastatega muutub iga fassaad vaikselt määrdunuks",
  problemLead: "Tallinna kliima on fassaadidele karm. Talvised soolajäägid, kevadine õietolm, suvine saaste, sügisesed lehed ja pidev niiskus. Kõik see koguneb fassaadipindadele aja jooksul. Muutus on nii aeglane, et hoone omanikud seda tavaliselt ei märka.",
  problemDescription: "Määrdunud fassaad ei mõjuta ainult välimust, vaid ka hoone kestvust. Õigeaegne pesu on odavam kui hilisem renoveerimine. SPS Grupp on alates 2006. aastast pakkunud professionaalset fassaadipesu Tallinna ärihoonetele.",
  serviceTitle: "Milliseid fassaadipesu teenuseid pakume?",
  serviceCards: [
    { bold: "Krohvfassaadide pesu keskmise surve ja öko-vahenditega", desc: "Krohvile sobiv meetod ja surve valitakse pinna seisukorra ning proovipuhastuse järgi." },
    { bold: "Klinkertellise fassaadi pesu ja hooldus", desc: "Spetsiaalsed vahendid tellise pooridesse kogunenud mustuse eemaldamiseks." },
    { bold: "Klaasfassaadide professionaalne puhastus", desc: "Klaaspindade puhastus koos tulemuse kontrolliga." },
    { bold: "Metallfassaadide ja komposiitkatete pesu", desc: "Õige surve ja vahendid, et vältida metallpinna oksüdeerumist." },
    { bold: "Soolakihi ja taimede eemaldamine", desc: "Talvised soolajäägid, samblikud ja vetikad - eemaldame kõik." },
    { bold: "Kõrghoonete fassaadipesu tõstukite ja ronimisvarustusega", desc: "Ohutu ja professionaalne ligipääs kuni 20+ korrustele hoonetele." },
  ],
  reasonsTitle: "Miks valida SPS Grupp fassaadipesu partneriks?",
  reasons: [
    { title: "Pinnapõhine lähenemine", desc: "Krohv vajab õrna kätt, klinker talub suuremat survet, klaas vajab spetsiaalseid vahendeid. Me ei kasuta sama meetodit kõigile." },
    { title: "Kõrghoonete spetsialistid", desc: "Tõstukid, ronimisvarustus, teleskoopvardad. Töötame ka Ülemiste City mastaabis hoonetel." },
    { title: "Ökoloogilised vahendid", desc: "Valime puhastusvahendi pinna ja tööala järgi ning kaitseme töö käigus kokkulepitud haljastust ja ümbritsevaid pindu." },
    { title: "Kindlustatud teenus", desc: "Teenuse vastutus ja kindlustuskaitse lähtuvad lepingust, juhtumi asjaoludest ning kindlustustingimustest." },
  ],
  priceTitle: "Kuidas kujuneb fassaadipesu hind?",
  priceIntro: "Hind sõltub pinna suurusest, fassaaditüübist, määrdumisastmest ja ligipääsu keerukusest.",
  priceCards: [
    { size: "Krohvfassaadi pesu", area: "Keskmise survega", price: "2 €/m²", period: "alates", highlight: true },
    { size: "Kivifassaadi pesu", area: "Spetsiaalsed vahendid", price: "2 €/m²", period: "alates" },
    { size: "Klaasfassaadi pesu", area: "Tulemuse kontrolliga", price: "0,9 €/m²", period: "alates" },
  ],
  priceNote: "Regulaarne ülevaatus aitab pesu õigel ajal planeerida ja säilitada pinna seisukorda. Kõrghoonete pesu (ronimisvarustusega): lisatasu.",
  serviceInfoBlock: {
    tag: "Töö ettevalmistus",
    title: "Mida lepime enne fassaadipesu kokku?",
    intro: "Fassaadi materjal, seisukord, mustuse liik ja ligipääs määravad sobiva pesumeetodi. Vaatame need enne töö algust üle.",
    items: [
      { title: "Pind ja mustuse liik", description: "Selgitame välja fassaadi materjali, viimistluse ja kahjustused ning hindame sambla, tahma, soolade või muu mustuse ulatust. Vajadusel teeme proovipuhastuse." },
      { title: "Ligipääs ja tööala", description: "Lepime kokku sobiva ligipääsutehnika, vee- ja elektrikasutuse ning akende, ventilatsiooniavade ja haljastuse kaitsmise." },
      { title: "Töö ulatus ja järelhooldus", description: "Määrame pestavad pinnad ja oodatava tulemuse. Otsustame, kas enne pesu on vaja parandustöid või pärast kaitsetöötlust." },
    ],
  },
  footerTitle: "Uuendage oma hoone ilmet",
  footerDescription: "Tuleme kohale, hindame fassaadi seisundit ja koostame personaalse pakkumise. Tasuta ja kohustuseta.",
  faq: [
    { q: "Kui sageli peaks ärihoone fassaadi pesema?", a: "Pesusagedus sõltub fassaadi materjalist, toonist, asukohast, liikluskoormusest ja tegelikust määrdumisest. Pärast ülevaatust soovitame objektile sobiva hooldusgraafiku." },
    { q: "Kas fassaadipesu kahjustab hoone viimistlust?", a: "Hindame esmalt fassaadi materjali ja seisukorda ning valime sellele sobiva surve, puhastusvahendi ja töömeetodi. Vajadusel teeme proovipuhastuse." },
    { q: "Mis ajal aastast on parim fassaadipesu tellida?", a: "Kevadel (aprill–mai) pärast talve ja õietolmu perioodi või sügisel (september–oktoober) enne külma. Temperatuur peaks olema vähemalt +5°C." },
    { q: "Kas teete fassaadipesu ka kõrghoonetel?", a: "Jah. Omame vastavat varustust ja kogemust kõrgtöödeks. Oleme teinud fassaadipesu kuni 20+ korrustel hoonetel." },
    { q: "Kas kaitsekihi lisamine on vajalik?", a: "Kaitsekihi vajadus sõltub fassaadi materjalist, seisukorrast ja asukohast. Sobiv kaitsetöötlus võib aidata puhtal tulemusel kauem püsida." },
  ],
}


export const en: OutdoorServicePageData = {
  ariaLabel: "Facade cleaning", heroImage: "/fassaadipesu1.jpg", image: "/fassaadipesu1.jpg", imageAlt: "SPS Grupp facade cleaning",
  title: "Facade cleaning", titleAccent: "in Tallinn and Harjumaa",
  intro: "We restore your building's exterior appearance, whether it is render, clinker, glass or metal. The right method for every surface type. Eco-friendly solutions and high-rise specialists.",
  cta: "Request a facade cleaning quote", breadcrumb: "Facade cleaning", parentBreadcrumb: enParent,
  chips: [{ value: "Height work", label: "experience", tone: "blue" }, { value: "Insured", label: "operations", tone: "green" }, { value: "Since 2006", label: "experience", tone: "navy" }],
  problemTitle: "Over the years every facade quietly becomes dirty",
  problemLead: "Tallinn's climate is harsh on facades. Winter salt residue, spring pollen, summer pollution, autumn leaves and constant damp. All of this builds up on facade surfaces over time. The change is so gradual that building owners usually do not notice.",
  problemDescription: "A dirty facade does not only affect appearance but also the building's durability. Timely cleaning is cheaper than later renovation. SPS Grupp has been providing professional facade cleaning for Tallinn's commercial buildings since 2006.",
  serviceTitle: "What facade cleaning services do we provide?",
  serviceCards: [
    { bold: "Render facade cleaning with medium pressure and eco-products", desc: "Method and pressure for render are selected based on surface condition and trial cleaning." },
    { bold: "Clinker brick facade cleaning and maintenance", desc: "Specialist products to remove dirt that has gathered in brick pores." },
    { bold: "Professional glass facade cleaning", desc: "Cleaning of glass surfaces with result inspection." },
    { bold: "Metal facade and composite cladding cleaning", desc: "Correct pressure and products to prevent metal surface oxidation." },
    { bold: "Salt layer and vegetation removal", desc: "Winter salt residue, lichen and algae - we remove everything." },
    { bold: "High-rise facade cleaning with lifts and rope access", desc: "Safe and professional access for buildings of 20+ storeys." },
  ],
  reasonsTitle: "Why choose SPS Grupp as your facade cleaning partner?",
  reasons: [
    { title: "Surface-specific approach", desc: "Render needs a gentle touch, clinker can handle more pressure, glass needs specialist products. We do not use the same method for everything." },
    { title: "High-rise specialists", desc: "Lifts, rope-access equipment, telescopic poles. We also work on buildings on the scale of Ülemiste City." },
    { title: "Eco-friendly products", desc: "We choose the cleaning product based on the surface and work area, and protect agreed landscaping and surrounding surfaces during work." },
    { title: "Insured service", desc: "Service liability and insurance cover are based on the contract, the circumstances and insurance terms." },
  ],
  priceTitle: "How is the cost of facade cleaning determined?",
  priceIntro: "The price depends on surface area, facade type, level of soiling and access complexity.",
  priceCards: [
    { size: "Render facade", area: "Medium pressure", price: "2 EUR/m²", period: "from", highlight: true },
    { size: "Stone facade", area: "Specialist products", price: "2 EUR/m²", period: "from" },
    { size: "Glass facade", area: "With result check", price: "0.9 EUR/m²", period: "from" },
  ],
  priceNote: "Regular inspection helps plan cleaning at the right time and maintain surface condition. High-rise cleaning (with rope access): surcharge applies.",
  serviceInfoBlock: {
    tag: "Work preparation",
    title: "What do we agree on before facade cleaning?",
    intro: "Facade material, condition, type of soiling and access determine the appropriate cleaning method. We review these before work starts.",
    items: [
      { title: "Surface and soiling type", description: "We identify the facade material, finish and any damage, and assess the extent of moss, soot, salts or other soiling. We carry out a trial clean where needed." },
      { title: "Access and work area", description: "We agree suitable access equipment, water and electricity supply, and protection of windows, ventilation openings and landscaping." },
      { title: "Scope of work and aftercare", description: "We define the surfaces to be cleaned and the expected result. We decide whether repairs are needed before cleaning or a protective treatment afterwards." },
    ],
  },
  footerTitle: "Renew your building's appearance",
  footerDescription: "We will visit, assess the facade condition and prepare a personalised quote. Free and without obligation.",
  faq: [
    { q: "How often should a commercial building facade be cleaned?", a: "Cleaning frequency depends on the facade material, colour, location, traffic volume and actual soiling. After an inspection we recommend a maintenance schedule suitable for the property." },
    { q: "Will facade cleaning damage the building finish?", a: "We first assess the facade material and condition and choose appropriate pressure, cleaning product and method. We carry out a trial clean where needed to reduce the risk of surface damage." },
    { q: "What time of year is best for facade cleaning?", a: "Spring (April–May) after winter and pollen, or autumn (September–October) before freezing weather. Temperature should be at least +5°C." },
    { q: "Do you also clean high-rise facades?", a: "Yes. We have the appropriate equipment and experience for working at height. We have carried out facade cleaning on buildings of 20+ storeys." },
    { q: "Is a protective coating necessary?", a: "The need for a protective coating depends on the facade material, condition and location. A suitable protective treatment can help the clean result last longer and make future maintenance easier." },
  ],
}


export const ru: OutdoorServicePageData = {
  ariaLabel: "Мойка фасадов", heroImage: "/fassaadipesu1.jpg", image: "/fassaadipesu1.jpg", imageAlt: "SPS Grupp мойка фасадов",
  title: "Мойка фасадов", titleAccent: "в Таллинне и Харьюмаа",
  intro: "Восстанавливаем внешний вид вашего здания, будь то штукатурка, клинкер, стекло или металл. Правильный метод для каждого типа поверхности. Экологичные решения и специалисты по высотным зданиям.",
  cta: "Запросить предложение по мойке фасадов", breadcrumb: "Мойка фасадов", parentBreadcrumb: ruParent,
  chips: [{ value: "Высотные", label: "работы", tone: "blue" }, { value: "Застраховано", label: "деятельность", tone: "green" }, { value: "С 2006", label: "опыт", tone: "navy" }],
  problemTitle: "С годами каждый фасад незаметно загрязняется",
  problemLead: "Климат Таллинна суров для фасадов. Зимние солевые остатки, весенняя пыльца, летнее загрязнение, осенние листья и постоянная влажность. Всё это накапливается на фасадах со временем. Изменение настолько постепенное, что владельцы зданий обычно его не замечают.",
  problemDescription: "Грязный фасад влияет не только на внешний вид, но и на долговечность здания. Своевременная мойка дешевле последующего ремонта. SPS Grupp с 2006 года предоставляет профессиональную мойку фасадов для коммерческих зданий Таллинна.",
  serviceTitle: "Какие услуги по мойке фасадов мы предлагаем?",
  serviceCards: [
    { bold: "Мойка штукатурных фасадов средним давлением и эко-средствами", desc: "Метод и давление для штукатурки подбираются по состоянию поверхности и пробной очистке." },
    { bold: "Мойка и уход за клинкерным кирпичом", desc: "Специальные средства для удаления грязи, скопившейся в порах кирпича." },
    { bold: "Профессиональная очистка стеклянных фасадов", desc: "Очистка стеклянных поверхностей с контролем результата." },
    { bold: "Мойка металлических фасадов и композитных покрытий", desc: "Правильное давление и средства во избежание окисления металла." },
    { bold: "Удаление солевого слоя и растительности", desc: "Зимние солевые остатки, лишайники и водоросли - удаляем всё." },
    { bold: "Мойка фасадов высотных зданий с подъёмниками и альпинистским снаряжением", desc: "Безопасный и профессиональный доступ для зданий высотой 20+ этажей." },
  ],
  reasonsTitle: "Почему выбрать SPS Grupp партнёром по мойке фасадов?",
  reasons: [
    { title: "Индивидуальный подход к поверхности", desc: "Штукатурка требует деликатности, клинкер выдерживает большее давление, стекло требует специальных средств. Мы не используем один метод для всех." },
    { title: "Специалисты по высотным зданиям", desc: "Подъёмники, альпинистское снаряжение, телескопические штанги. Работаем и на зданиях масштаба Ülemiste City." },
    { title: "Экологичные средства", desc: "Подбираем чистящее средство по поверхности и рабочей зоне, защищаем согласованное озеленение и окружающие поверхности." },
    { title: "Застрахованная услуга", desc: "Ответственность и страховое покрытие определяются договором, обстоятельствами и условиями страхования." },
  ],
  priceTitle: "Как определяется стоимость мойки фасадов?",
  priceIntro: "Цена зависит от площади поверхности, типа фасада, степени загрязнения и сложности доступа.",
  priceCards: [
    { size: "Штукатурный фасад", area: "Среднее давление", price: "2 €/м²", period: "от", highlight: true },
    { size: "Каменный фасад", area: "Специальные средства", price: "2 €/м²", period: "от" },
    { size: "Стеклянный фасад", area: "С контролем результата", price: "0,9 €/м²", period: "от" },
  ],
  priceNote: "Регулярный осмотр помогает планировать мойку вовремя и сохранять состояние поверхности. Мойка высотных зданий (альпинистским снаряжением): доплата.",
  serviceInfoBlock: {
    tag: "Подготовка к работе",
    title: "О чём мы договариваемся перед мойкой фасада?",
    intro: "Материал фасада, состояние, тип загрязнения и доступ определяют подходящий метод. Рассматриваем эти вопросы до начала работ.",
    items: [
      { title: "Поверхность и тип загрязнения", description: "Выясняем материал, отделку и повреждения фасада, оцениваем масштаб мха, сажи, солей или других загрязнений. При необходимости делаем пробную очистку." },
      { title: "Доступ и рабочая зона", description: "Согласовываем подходящую технику доступа, водо- и электроснабжение, а также защиту окон, вентиляционных отверстий и озеленения." },
      { title: "Объём работ и последующий уход", description: "Определяем очищаемые поверхности и ожидаемый результат. Решаем, нужны ли ремонтные работы до мойки или защитная обработка после." },
    ],
  },
  footerTitle: "Обновите внешний вид вашего здания",
  footerDescription: "Приедем, оценим состояние фасада и составим индивидуальное предложение. Бесплатно и без обязательств.",
  faq: [
    { q: "Как часто следует мыть фасад коммерческого здания?", a: "Частота зависит от материала, цвета, расположения, транспортной нагрузки и фактического загрязнения. После осмотра рекомендуем подходящий график обслуживания." },
    { q: "Повредит ли мойка фасада отделку здания?", a: "Сначала оцениваем материал и состояние фасада, затем выбираем подходящее давление, чистящее средство и метод. При необходимости делаем пробную очистку." },
    { q: "В какое время года лучше заказывать мойку фасада?", a: "Весной (апрель–май) после зимы и пыльцы или осенью (сентябрь–октябрь) до морозов. Температура должна быть не ниже +5°C." },
    { q: "Моете ли вы фасады высотных зданий?", a: "Да. Имеем соответствующее оборудование и опыт высотных работ. Выполняли мойку фасадов зданий высотой 20+ этажей." },
    { q: "Нужно ли защитное покрытие?", a: "Необходимость защитного покрытия зависит от материала, состояния и расположения фасада. Подходящая защитная обработка может помочь результату сохраняться дольше." },
  ],
}


export const serviceDetail: ServiceDetailDefs = {
  et: { data: et, seo: {"serviceName":"Fassaadipesu","serviceDescription":"Professionaalne fassaadipesu ärihoonetele Tallinnas. Survepesu, keemiline puhastus, kõrghooned."}, tooprotsess: {"title":"Kuidas SPS fassaadipesu ette valmistab?","intro":"SPS alustab objekti ülevaatusest, et töömeetod, sagedus ja tehnika vastaksid tegelikule vajadusele.","steps":[["Materjali hindamine","Selgitame välja fassaadi tüübi ja seisundi."],["Mustuse hindamine","Vaatame üle sool, samblik, saaste ja üldmäärdumine."],["Meetodi valik","Valime surve, vahendi ja ligipääsu."],["Töö teostus","Puhastame pinna kokkulepitud ulatuses."],["Kaitse soovitus","Vajadusel soovitame kaitsekihti pikema tulemuse jaoks."]]}, breadcrumbs: [{"name":"Avaleht","etPath":"/"},{"name":"Koristusteenus","etPath":"/koristusteenus"},{"name":"Välikoristus","etPath":"/koristusteenus/valikoristus"},{"name":"Fassaadipesu","etPath":"/koristusteenus/valikoristus/fassaadipesu"}] },
  en: { data: en, seo: {"serviceName":"Facade cleaning","serviceDescription":"Professional facade cleaning for commercial buildings in Tallinn. Pressure washing, chemical cleaning, high-rise."}, tooprotsess: {"title":"How does SPS prepare facade cleaning?","intro":"SPS starts with a site assessment so the method, frequency and equipment match actual needs.","steps":[["Material assessment","We determine the facade type and condition."],["Soiling assessment","We inspect salt, moss, pollution and general soiling."],["Method selection","We choose pressure, cleaning agent and access."],["Work execution","We clean the surface to the agreed extent."],["Protection recommendation","We recommend a protective coating for longer-lasting results where needed."]]}, breadcrumbs: [{"name":"Home","etPath":"/"},{"name":"Cleaning","etPath":"/koristusteenus"},{"name":"Outdoor cleaning","etPath":"/koristusteenus/valikoristus"},{"name":"Facade cleaning","etPath":"/koristusteenus/valikoristus/fassaadipesu"}] },
  ru: { data: ru, seo: {"serviceName":"Мойка фасадов","serviceDescription":"Профессиональная мойка фасадов в Таллинне. Мойка под давлением, химическая очистка, высотные здания."}, tooprotsess: {"title":"Как SPS готовит мойку фасадов?","intro":"SPS начинает с осмотра объекта, чтобы метод, частота и оборудование соответствовали реальным потребностям.","steps":[["Оценка материала","Выясняем тип и состояние фасада."],["Оценка загрязнения","Осматриваем соль, мох, загрязнение."],["Выбор метода","Выбираем давление, средство и доступ."],["Выполнение работ","Очищаем поверхность в согласованном объёме."],["Рекомендация защиты","При необходимости рекомендуем защитное покрытие."]]}, breadcrumbs: [{"name":"Главная","etPath":"/"},{"name":"Уборка","etPath":"/koristusteenus"},{"name":"Уборка территорий","etPath":"/koristusteenus/valikoristus"},{"name":"Мойка фасадов","etPath":"/koristusteenus/valikoristus/fassaadipesu"}] },
}
