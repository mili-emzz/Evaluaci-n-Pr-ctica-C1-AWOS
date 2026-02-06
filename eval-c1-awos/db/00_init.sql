-- Init: extensions and DB-level helpers
-- Run at container startup to ensure required extensions exist

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- You can add other extensions here if needed
-- e.g. CREATE EXTENSION IF NOT EXISTS "uuid-ossp";