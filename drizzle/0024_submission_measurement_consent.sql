-- Store the visitor's measurement choices with each contact inquiry.
-- Empty string means unknown (legacy rows and manual phone/email entries).
-- Only rows with ads_consent = 'granted' may be uploaded as Ads offline conversions.

ALTER TABLE "form_submissions"
  ADD COLUMN IF NOT EXISTS "analytics_consent" text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "ads_consent" text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "consent_recorded_at" timestamp with time zone,
  ADD COLUMN IF NOT EXISTS "consent_version" text NOT NULL DEFAULT '';

COMMENT ON COLUMN "form_submissions"."analytics_consent" IS 'GA4 consent at submission: granted | denied | empty (unknown)';
COMMENT ON COLUMN "form_submissions"."ads_consent" IS 'Google Ads measurement/offline consent at submission: granted | denied | empty (unknown)';
COMMENT ON COLUMN "form_submissions"."consent_recorded_at" IS 'When the visitor made the choice; never inferred from created_at';
COMMENT ON COLUMN "form_submissions"."consent_version" IS 'Consent text version shown when the visitor made the choice';
