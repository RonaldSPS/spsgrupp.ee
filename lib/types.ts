export interface Announcement {
  id: string
  title: string
  subtitle: string
  publishedDate: string
  offerNumber: string
  company: string
  registryCode: string
  website: string
  companyDescription: string
  tasks: string
  requirements: string
  benefits: string
  location: string
  vacancies: number
  salary: number
  salaryUnit: string
  salaryDetails: string
  workTime: string
  workTimeDetails: string
  startDate: string
  applicationDeadline: string
  contactName: string
  contactRole: string
  contactPhone: string
  contactPhone2: string
  contactEmail: string
  active: boolean
  slug: string
  createdAt?: Date | null
  updatedAt?: Date | null
}

export interface Testimonial {
  id: string
  categoryTitle: string
  categoryHref: string
  quote: string
  shortQuote: string
  author: string
  initials: string
  logo: string
  active: boolean
  sortOrder: number
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
}
