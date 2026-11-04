-- Päringu kvaliteedi väli (04.11.2026): hot | warm | cold | "" (määramata).
-- Admini hinnang päringu kvaliteedile paringud-lehelt; müügitoru ja
-- raportite tarbeks. Google Ads'i negatiivset signaali EI saadeta
-- (kliendi otsus 04.11.2026) — Ads'i läheb endiselt ainult konversioon +
-- Tasu-veeru väärtus (conversionValue, restatement sama transactionId-ga).
ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "lead_quality" text DEFAULT '' NOT NULL;
