/**
 * Built-in auto-reply templates (ET/EN/RU) for the contact + career forms.
 * Used as runtime fallbacks in lib/actions.ts when no admin setting exists,
 * and seeded into system_settings by scripts/seed-autoreply-settings.ts so
 * they are visible/editable in /spsadmn/seaded/ ("Automaatvastused").
 * `{name}` is replaced with the submitter's (escaped) name.
 */

export type AutoReplyLocale = "et" | "en" | "ru"

export interface AutoReplyText {
  subject: string
  body: string
}

export const AUTOREPLY_DEFAULTS: Record<AutoReplyLocale, { contact: AutoReplyText; career: AutoReplyText }> = {
  et: {
    contact: {
      subject: "Teie päring on saadetud – SPS Grupp",
      body: `Tere, {name}!

Aitäh, et pöördusid SPS Grupi poole. Sinu päring on meile jõudnud ja võtame sinuga ühendust esimesel võimalusel, tavaliselt ühe tööpäeva jooksul.

Kui soovid midagi lisada, vasta lihtsalt sellele e-kirjale.

Lugupidamisega,
SPS Grupp
info@spsgrupp.ee · spsgrupp.ee`,
    },
    career: {
      subject: "Sinu tööavaldus on saadetud – SPS Grupp",
      body: `Tere, {name}!

Aitäh avalduse eest! Sinu tööavaldus on meile jõudnud ning vaatame selle üle. Kui sinu profiil sobib meie meeskonda, võtame sinuga ühendust.

Lisaküsimuste korral võid vastata sellele e-kirjale.

Lugupidamisega,
SPS Grupp personalitiim
personal@spsgrupp.ee · spsgrupp.ee`,
    },
  },
  en: {
    contact: {
      subject: "Your inquiry has been sent – SPS Grupp",
      body: `Hello {name},

Thank you for contacting SPS Grupp. We have received your inquiry and will get back to you as soon as possible, usually within one business day.

If you would like to add anything, simply reply to this e-mail.

Kind regards,
SPS Grupp
info@spsgrupp.ee · spsgrupp.ee`,
    },
    career: {
      subject: "Your job application has been sent – SPS Grupp",
      body: `Hello {name},

Thank you for your application! We have received it and will review it. If your profile matches our team, we will contact you.

If you have any questions, simply reply to this e-mail.

Kind regards,
SPS Grupp HR team
personal@spsgrupp.ee · spsgrupp.ee`,
    },
  },
  ru: {
    contact: {
      subject: "Ваша заявка отправлена – SPS Grupp",
      body: `Здравствуйте, {name}!

Благодарим за обращение в SPS Grupp. Мы получили вашу заявку и свяжемся с вами при первой возможности, как правило, в течение одного рабочего дня.

Если хотите что-то добавить, просто ответьте на это письмо.

С уважением,
SPS Grupp
info@spsgrupp.ee · spsgrupp.ee`,
    },
    career: {
      subject: "Ваша заявка о трудоустройстве отправлена – SPS Grupp",
      body: `Здравствуйте, {name}!

Спасибо за вашу заявку! Мы её получили и рассмотрим. Если ваш профиль подойдёт нашей команде, мы свяжемся с вами.

По любым вопросам можно просто ответить на это письмо.

С уважением,
Команда по персоналу SPS Grupp
personal@spsgrupp.ee · spsgrupp.ee`,
    },
  },
}
