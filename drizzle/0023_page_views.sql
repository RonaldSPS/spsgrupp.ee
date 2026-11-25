-- Privacy-friendly, cookieless page-view analytics (25.11.2026).
-- No persistent user identifiers, no IP address storage.
-- daily_visitor_hash is a transient hash of IP + user-agent + date + salt,
-- used only to count daily unique visitors and session-level metrics.

CREATE TABLE IF NOT EXISTS page_views (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  path TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT '',
  referrer_host TEXT NOT NULL DEFAULT '',
  utm_source TEXT NOT NULL DEFAULT '',
  utm_medium TEXT NOT NULL DEFAULT '',
  utm_campaign TEXT NOT NULL DEFAULT '',
  utm_term TEXT NOT NULL DEFAULT '',
  utm_content TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  region TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  device_type TEXT NOT NULL DEFAULT '',
  browser TEXT NOT NULL DEFAULT '',
  os TEXT NOT NULL DEFAULT '',
  screen_width INTEGER,
  screen_height INTEGER,
  language TEXT NOT NULL DEFAULT '',
  daily_visitor_hash TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS page_views_created_at_idx ON page_views(created_at);
CREATE INDEX IF NOT EXISTS page_views_path_idx ON page_views(path);
CREATE INDEX IF NOT EXISTS page_views_daily_hash_idx ON page_views(daily_visitor_hash);
CREATE INDEX IF NOT EXISTS page_views_referrer_idx ON page_views(referrer_host);
