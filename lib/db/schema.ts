import { pgTable, integer, text, boolean, timestamp, real, serial, numeric, uniqueIndex } from "drizzle-orm/pg-core"

export const blogEdits = pgTable("blog_edits", {
  id: integer("id").primaryKey(),
  title: text("title"),
  slug: text("slug"),
  contentHtml: text("content_html"),
  featuredImage: text("featured_image"),
  excerpt: text("excerpt"),
  active: boolean("active").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const blogTranslations = pgTable("blog_translations", {
  id: serial("id").primaryKey(),
  blogId: integer("blog_id").notNull(),
  language: text("language").notNull(),
  title: text("title"),
  slug: text("slug"),
  excerpt: text("excerpt"),
  contentHtml: text("content_html"),
  sourceHash: text("source_hash"),
  status: text("status").notNull().default("auto"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  unique: uniqueIndex("blog_trans_blog_lang_idx").on(table.blogId, table.language),
}))

export const jobTranslations = pgTable("job_translations", {
  id: serial("id").primaryKey(),
  jobId: text("job_id").notNull(),
  language: text("language").notNull(),
  title: text("title"),
  subtitle: text("subtitle"),
  companyDescription: text("company_description"),
  tasks: text("tasks"),
  requirements: text("requirements"),
  benefits: text("benefits"),
  location: text("location"),
  salaryDetails: text("salary_details"),
  workTime: text("work_time"),
  workTimeDetails: text("work_time_details"),
  contactRole: text("contact_role"),
  slug: text("slug"),
  sourceHash: text("source_hash"),
  status: text("status").notNull().default("auto"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  unique: uniqueIndex("job_trans_job_lang_idx").on(table.jobId, table.language),
}))

export const jobAnnouncements = pgTable("job_announcements", {
  id: text("id").primaryKey(),
  title: text("title").notNull().default(""),
  subtitle: text("subtitle").notNull().default(""),
  publishedDate: text("published_date").notNull().default(""),
  offerNumber: text("offer_number").notNull().default(""),
  company: text("company").notNull().default(""),
  registryCode: text("registry_code").notNull().default(""),
  website: text("website").notNull().default(""),
  companyDescription: text("company_description").notNull().default(""),
  tasks: text("tasks").notNull().default(""),
  requirements: text("requirements").notNull().default(""),
  benefits: text("benefits").notNull().default(""),
  location: text("location").notNull().default(""),
  vacancies: integer("vacancies").notNull().default(1),
  salary: real("salary").notNull().default(0),
  salaryUnit: text("salary_unit").notNull().default("EUR"),
  salaryDetails: text("salary_details").notNull().default(""),
  workTime: text("work_time").notNull().default(""),
  workTimeDetails: text("work_time_details").notNull().default(""),
  startDate: text("start_date").notNull().default(""),
  applicationDeadline: text("application_deadline").notNull().default(""),
  contactName: text("contact_name").notNull().default(""),
  contactRole: text("contact_role").notNull().default(""),
  contactPhone: text("contact_phone").notNull().default(""),
  contactPhone2: text("contact_phone2").notNull().default(""),
  contactEmail: text("contact_email").notNull().default(""),
  active: boolean("active").notNull().default(true),
  slug: text("slug").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const testimonials = pgTable("testimonials", {
  id: text("id").primaryKey(),
  categoryTitle: text("category_title").notNull().default(""),
  categoryHref: text("category_href").notNull().default(""),
  quote: text("quote").notNull().default(""),
  shortQuote: text("short_quote").notNull().default(""),
  author: text("author").notNull().default(""),
  initials: text("initials").notNull().default(""),
  logo: text("logo").notNull().default(""),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const testimonialTranslations = pgTable("testimonial_translations", {
  id: serial("id").primaryKey(),
  testimonialId: text("testimonial_id").notNull(),
  language: text("language").notNull(),
  categoryTitle: text("category_title"),
  quote: text("quote"),
  shortQuote: text("short_quote"),
  sourceHash: text("source_hash"),
  status: text("status").notNull().default("auto"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  unique: uniqueIndex("testimonial_trans_testimonial_lang_idx").on(table.testimonialId, table.language),
}))

export const systemSettings = pgTable("system_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name").notNull().default(""),
  role: text("role").notNull().default("manager"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const formSubmissions = pgTable("form_submissions", {
  id: serial("id").primaryKey(),
  form: text("form").notNull(),
  locale: text("locale").notNull().default(""),
  name: text("name").notNull().default(""),
  email: text("email").notNull().default(""),
  phone: text("phone").notNull().default(""),
  company: text("company").notNull().default(""),
  message: text("message").notNull().default(""),
  region: text("region").notNull().default(""),
  workload: text("workload").notNull().default(""),
  workTime: text("work_time").notNull().default(""),
  attachmentName: text("attachment_name").notNull().default(""),
  fee: numeric("fee", { precision: 12, scale: 2 }),
  profit: numeric("profit", { precision: 12, scale: 2 }),
  notes: text("notes").notNull().default(""),
  isSpam: boolean("is_spam").notNull().default(false),
  pageUrl: text("page_url").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})
