## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in the values:

| Variable | Required | Description |
|---|---|---|
| `ADMIN_PASSWORD` | Yes | Password for the `/spsadmn` admin panel |
| `DATABASE_URL` | Yes | Supabase pooled PostgreSQL connection string |
| `DEEPSEEK_API_KEY` | Yes | Deepseek API key for admin translations |
| `RESEND_API_KEY` | Yes | Resend API key for form emails (https://resend.com/api-keys). `Resend_API` is also accepted. |
| `EMAIL_FROM` | No | From address for outgoing emails (defaults to `SPS Grupp <info@spsgrupp.ee>`). The domain must be verified in Resend. |

## Contact & Career Forms

Form submissions are handled via Server Actions and sent as plain-text email through the Resend API (`lib/email.ts`):

- **Contact form** — submissions go to `info@spsgrupp.ee`
- **Career form** — submissions go to `personal@spsgrupp.ee`

Both forms include honeypot spam protection, duplicate submission prevention, server-side validation, and accessible loading/error states.
