-- ============================================================================
-- Tarmo (Tehnikakõrgkooli arendusprorektor) arvamuse uus sõnastus
-- Kuupäev: 11.08.2026
--
-- KASUTAMINE:
--   1. Ava Supabase Dashboard → SQL Editor → New query
--   2. Kleebi kogu see fail sisse ja klõpsa "Run"
--   3. Kontrolli lõpus oleva SELECT-i väljundit (peab näitama uut teksti)
--
-- Mida skript teeb:
--   a) Uuendab ET tsitaadi tabelis "testimonials"
--   b) Uuendab/loob EN ja RU tõlked tabelis "testimonial_translations"
--      koos uue source_hash väärtusega (vastab uuele ET tekstile), nii et
--      tõlked ei jää "stale" staatusse ega kao EN/RU arvamuste lehelt.
--
-- Pärast käivitamist jooksuta arendusmasinas veel:
--   npx tsx scripts/sync-translation-fallbacks.ts
-- (uusuendab data/*.json varukoopiad DB seisuga)
-- ============================================================================

begin;

-- a) ET põhitekst
update public.testimonials
set
  quote       = 'Pidev koristuskvaliteedi jälgimine aitab hoida puhta ja meeldiva õpikeskkonna.',
  short_quote = 'Pidev koristuskvaliteedi jälgimine aitab hoida puhta ja meeldiva õpikeskkonna.',
  updated_at  = now()
where id = 'koolide-koristamine-tehnikakorgkooli-arendusprorektor-tarmo-101';

-- b) EN tõlge
insert into public.testimonial_translations
  (testimonial_id, language, category_title, quote, short_quote, source_hash, status, updated_at)
values
  (
    'koolide-koristamine-tehnikakorgkooli-arendusprorektor-tarmo-101',
    'en',
    'School cleaning',
    'Continuous monitoring of cleaning quality also helps maintain a clean and pleasant learning environment.',
    'Continuous monitoring of cleaning quality helps maintain a clean and pleasant learning environment.',
    '29cacb430962a66bae654654',
    'auto',
    now()
  )
on conflict (testimonial_id, language) do update set
  category_title = excluded.category_title,
  quote          = excluded.quote,
  short_quote    = excluded.short_quote,
  source_hash    = excluded.source_hash,
  status         = excluded.status,
  updated_at     = excluded.updated_at;

-- c) RU tõlge
insert into public.testimonial_translations
  (testimonial_id, language, category_title, quote, short_quote, source_hash, status, updated_at)
values
  (
    'koolide-koristamine-tehnikakorgkooli-arendusprorektor-tarmo-101',
    'ru',
    'Уборка школ',
    'Постоянный контроль качества уборки также помогает поддерживать чистую и приятную учебную среду.',
    'Постоянный контроль качества уборки помогает поддерживать чистую и приятную учебную среду.',
    '29cacb430962a66bae654654',
    'auto',
    now()
  )
on conflict (testimonial_id, language) do update set
  category_title = excluded.category_title,
  quote          = excluded.quote,
  short_quote    = excluded.short_quote,
  source_hash    = excluded.source_hash,
  status         = excluded.status,
  updated_at     = excluded.updated_at;

commit;

-- Kontroll: peab tagastama 1 rea uue ET tekstiga + 2 tõlkerida staatusega "auto"
select id, quote, short_quote, updated_at
from public.testimonials
where id = 'koolide-koristamine-tehnikakorgkooli-arendusprorektor-tarmo-101';

select testimonial_id, language, quote, short_quote, source_hash, status, updated_at
from public.testimonial_translations
where testimonial_id = 'koolide-koristamine-tehnikakorgkooli-arendusprorektor-tarmo-101'
order by language;
