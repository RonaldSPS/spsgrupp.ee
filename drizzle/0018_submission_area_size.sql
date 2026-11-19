-- 19.11.2026: contact-form area size (m²) for lead qualification.
ALTER TABLE form_submissions ADD COLUMN area_size text NOT NULL DEFAULT '';
