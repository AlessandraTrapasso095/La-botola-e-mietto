-- Local Colima validation can pause PostgreSQL I/O for longer than the
-- original three-second anonymous-role budget during checkpoints. Catalog
-- plans remain measured in milliseconds; eight seconds matches the existing
-- authenticated-role ceiling without disabling the safety boundary.
alter role anon set statement_timeout = '8s';

