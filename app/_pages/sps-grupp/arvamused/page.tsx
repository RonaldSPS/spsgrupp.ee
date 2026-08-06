import ReviewsPageContent, { type ReviewsPageText } from "./ReviewsPageContent"
import { getTestimonialsForLocale, groupTestimonials } from "@/lib/testimonials"
import type { Locale } from "@/lib/slug-map"

const textByLocale: Record<Locale, ReviewsPageText> = {
  et: {
    serviceName: "Arvamused ja klientide tagasiside",
    serviceDescription: "Loe meie klientide arvamusi ja tagasisidet. SPS Grupp pakub professionaalseid koristus-, puhastus- ja hooldusteenuseid äriklientidele Tallinnas ja Harjumaal.",
    home: "Avaleht",
    spsGroup: "SPS Grupp",
    reviews: "Arvamused",
    heroLine1: "Klientide",
    heroLine2: "arvamused ja tagasiside",
    heroDescription: "Meie klientide rahulolu on parim tunnustus.",
    heroCta: "Soovid sama tulemust? Küsi pakkumist",
    sectionTag: "Arvamused teenuste kaupa",
    sectionHeading: "Mida ütlevad meie kliendid",
    viewService: "Vaata teenust",
    videoTag: "Video",
    videoHeading: "Kliendilugu: Tehnikakõrgkool",
    videoDescription: "Vaata, kuidas aitasime 2800 õpilasega koolil luua tervislikuma õpikeskkonna.",
    footerTitle: "Liitu rahulolevate klientidega!",
    footerDescription: "Esmane konsultatsioon ja vajaduste kaardistamine. Võtame teiega üldjuhul ühe tööpäeva jooksul ühendust.",
    cardCta: "Soovid sama tulemust? Küsi pakkumist",
  },
  en: {
    serviceName: "Reviews and client feedback",
    serviceDescription: "Read what SPS Grupp clients say about our cleaning, maintenance and property services for business clients in Tallinn and Harjumaa.",
    home: "Home",
    spsGroup: "SPS Grupp",
    reviews: "Reviews",
    heroLine1: "Client",
    heroLine2: "reviews and feedback",
    heroDescription: "Client satisfaction is our best recognition.",
    heroCta: "Want the same result? Request a quote",
    sectionTag: "Reviews by service",
    sectionHeading: "What our clients say",
    viewService: "View service",
    videoTag: "Video",
    videoHeading: "Client story: Tallinn University of Applied Sciences",
    videoDescription: "See how we helped a school with 2800 students create a healthier learning environment.",
    footerTitle: "Join our satisfied clients!",
    footerDescription: "Initial consultation and needs assessment. We generally contact you within one business day.",
    cardCta: "Want the same result? Request a quote",
  },
  ru: {
    serviceName: "Отзывы и обратная связь клиентов",
    serviceDescription: "Читайте отзывы клиентов SPS Grupp о профессиональной уборке, обслуживании и уходе за недвижимостью для бизнес-клиентов в Таллинне и Харьюмаа.",
    home: "Главная",
    spsGroup: "SPS Grupp",
    reviews: "Отзывы",
    heroLine1: "Отзывы",
    heroLine2: "клиентов и обратная связь",
    heroDescription: "Удовлетворенность клиентов - наше лучшее признание.",
    heroCta: "Хотите такой же результат? Запросите предложение",
    sectionTag: "Отзывы по услугам",
    sectionHeading: "Что говорят наши клиенты",
    viewService: "Смотреть услугу",
    videoTag: "Видео",
    videoHeading: "История клиента: Таллиннский технический колледж",
    videoDescription: "Посмотрите, как мы помогли школе с 2800 учениками создать более здоровую учебную среду.",
    footerTitle: "Присоединяйтесь к довольным клиентам!",
    footerDescription: "Первичная консультация и оценка потребностей. Обычно мы связываемся с Вами в течение одного рабочего дня.",
    cardCta: "Хотите такой же результат? Запросите предложение",
  },
}

export default async function ArvamusedPage() {
  return <ReviewsPage locale="et" />
}

export async function ReviewsPage({ locale }: { locale: Locale }) {
  const testimonials = await getTestimonialsForLocale(locale)
  const categories = groupTestimonials(testimonials)
  return <ReviewsPageContent locale={locale} categories={categories} text={textByLocale[locale]} />
}
