-- Telefoni-/otse-e-posti päringute käsitsi logimine + müügitoru (26.10.2026
-- tegevuskava punkt 7): kanal (form/phone/email), teenuse liik ja müügistaatus.
-- Võidetud lepingute väärtus käib olemasolevatesse fee/profit veergudesse.
ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "channel" text DEFAULT 'form' NOT NULL;
ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "service_kind" text DEFAULT '' NOT NULL;
ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "sales_status" text DEFAULT '' NOT NULL;
