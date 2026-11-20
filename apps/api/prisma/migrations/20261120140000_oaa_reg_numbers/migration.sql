-- The OAA school's registration numbers (OAA/C/P/25/070). Some were typed
-- as OOA instead of OAA, some have lowercase letters, and many are below
-- 1000. A branch prefix set to OOA becomes OAA. For every student number
-- that starts with OOA/ or OAA/ (any case):
--   * a leading OOA becomes OAA:          OOA/C/P/25/070 -> OAA/C/P/25/070
--   * letters are written in capitals:    OAA/c/p/...    -> OAA/C/P/...
--   * a final number under 1000 moves up by 1000, like every other school
--     (20261120110000):                   .../25/070     -> .../25/1070
-- So OOA/c/p/25/070 becomes OAA/C/P/25/1070. Only numbers starting with
-- OOA/ or OAA/ are touched, whatever the branch's prefix setting. If a new
-- number is already taken, or two would end up the same, it stops and
-- changes nothing.

-- A branch prefix typed as OOA becomes OAA too, so new numbers come out
-- right (OOA/C/P -> OAA/C/P).
UPDATE "Branch"
   SET reg_prefix = 'OAA' || substr(reg_prefix, 4)
 WHERE reg_prefix ~* '^ooa(/|-|$)';

CREATE TEMP TABLE oaa_fix AS
WITH base AS (
  SELECT uuid,
         branch_uuid,
         reg_number AS old_number,
         regexp_replace(reg_number, '^ooa/', 'OAA/', 'i') AS renamed
    FROM "Student"
   WHERE reg_number ~* '^(ooa|oaa)/'
), parts AS (
  SELECT *, substring(renamed from '(\d+)$') AS num FROM base
)
SELECT uuid,
       branch_uuid,
       old_number,
       CASE
         WHEN num IS NULL THEN upper(renamed)
         ELSE upper(left(renamed, length(renamed) - length(num)))
              || CASE
                   WHEN length(ltrim(num, '0')) <= 3
                     THEN (coalesce(nullif(ltrim(num, '0'), ''), '0')::int + 1000)::text
                   ELSE num
                 END
       END AS new_number
  FROM parts;

DELETE FROM oaa_fix WHERE new_number = old_number;

DO $$
DECLARE
  clash TEXT;
BEGIN
  SELECT string_agg(f.old_number || ' -> ' || f.new_number, ', ')
    INTO clash
    FROM oaa_fix f
   WHERE EXISTS (
           SELECT 1 FROM "Student" o
            WHERE o.branch_uuid = f.branch_uuid
              AND o.reg_number = f.new_number
              AND o.uuid NOT IN (SELECT uuid FROM oaa_fix))
      OR (SELECT count(*) FROM oaa_fix g
           WHERE g.branch_uuid = f.branch_uuid AND g.new_number = f.new_number) > 1;
  IF clash IS NOT NULL THEN
    RAISE EXCEPTION 'Registration numbers would clash, fix these by hand first: %', clash;
  END IF;
END $$;

UPDATE "Student" s
   SET reg_number = f.new_number
  FROM oaa_fix f
 WHERE s.uuid = f.uuid;

DROP TABLE oaa_fix;
