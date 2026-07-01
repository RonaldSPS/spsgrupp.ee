## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in the values:

| Variable | Required | Description |
|---|---|---|
| `ADMIN_PASSWORD` | Yes | Password for the `/spsadmn` admin panel |
| `SMTP_HOST` | Yes | SMTP server hostname (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | Yes | SMTP port (`587` for STARTTLS, `465` for SSL) |
| `SMTP_USER` | Yes | SMTP authentication username / email |
| `SMTP_PASS` | Yes | SMTP authentication password or app-specific password |
| `SMTP_FROM` | No | From address for outgoing emails (defaults to `SMTP_USER`) |

## Contact & Career Forms

Form submissions are handled via Server Actions and sent as plain-text email:

- **Contact form** — submissions go to `info@spsgrupp.ee`
- **Career form** — submissions go to `personal@spsgrupp.ee`

Both forms include honeypot spam protection, duplicate submission prevention, server-side validation, and accessible loading/error states.
