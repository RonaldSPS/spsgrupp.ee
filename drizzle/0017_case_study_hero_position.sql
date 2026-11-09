-- Kliendiloo hero-pildi joondus (top/center/bottom) administ valitav.
-- NULL = vaikimisi "center" (praegune object-cover käitumine jääb samaks).

ALTER TABLE case_study_edits ADD COLUMN IF NOT EXISTS hero_position text;
