-- The OAA school's registration numbers (OAA/C/P/25/070). Some were typed
-- as OOA instead of OAA, some have lowercase letters, and many are below
-- 1000. A branch prefix set to OOA becomes OAA. For every student number
-- that starts with OOA/ or OAA/ (any case):
--   * a leading OOA becomes OAA:          OOA/C/P/25/070 -> OAA/C/P/25/070
--   * letters are written in capitals:    OAA/c/p/...    -> OAA/C/P/...
--   * a final number under 1000 moves up by 1000, like every other school
--     (20261120110000):                   .../25/070     -> .../25/1070
-- So OOA/c/p/25/070 becomes OAA/C/P/25/1070. Only numbers starting with
-- OOA/ or OAA/ are touched, whatever the branch's prefix setting.
--
-- Clashes: when a number typed as OOA would end up the same as another
-- student's (e.g. OOA/C/P/25/1068 and OAA/C/P/25/068 both becoming
-- OAA/C/P/25/1068), the OAA student keeps it and the OOA student gets the
-- next free number at the end of that series instead (OAA/C/P/25/1092,
-- 1093, ... in order of their old numbers); these students need telling.
-- Any clash still left after that is skipped: those students keep their
-- numbers as they are and everything else is fixed. Prisma doesn't show
-- the NOTICEs, but afterwards skipped ones are the only OOA/OAA numbers
-- that still start with OOA/, have lowercase letters or a number under
-- 1000, so this lists them (it also catches numbers that end in letters):
--
--   SELECT b.name AS branch, s.name, s.reg_number
--     FROM "Student" s JOIN "Branch" b ON b.uuid = s.branch_uuid
--    WHERE s.reg_number ~* '^(ooa|oaa)/'
--      AND (s.reg_number ~ '^OOA/' OR s.reg_number ~ '[a-z]'
--           OR length(ltrim(substring(s.reg_number from '(\d+)$'), '0')) <= 3)
--    ORDER BY b.name, s.reg_number;

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

-- A number typed as OOA that clashes moves to the end of its series: the
-- next number after the highest one used (or planned) with the same stem.
DO $$
DECLARE
  r RECORD;
  stem TEXT;
  highest BIGINT;
  moved TEXT := '';
BEGIN
  FOR r IN
    SELECT f.uuid, f.branch_uuid, f.old_number, f.new_number
      FROM oaa_fix f
     WHERE f.old_number ~* '^ooa/'
       AND f.new_number ~ '\d$'
       AND (EXISTS (SELECT 1 FROM "Student" o
                     WHERE o.branch_uuid = f.branch_uuid
                       AND o.reg_number = f.new_number
                       AND o.uuid NOT IN (SELECT uuid FROM oaa_fix))
            OR EXISTS (SELECT 1 FROM oaa_fix g
                        WHERE g.branch_uuid = f.branch_uuid
                          AND g.new_number = f.new_number
                          AND g.uuid <> f.uuid
                          AND g.old_number !~* '^ooa/'))
     ORDER BY f.branch_uuid, f.old_number
  LOOP
    stem := substring(r.new_number from '^(.*[^0-9])[0-9]+$');
    SELECT max(substring(n from '([0-9]+)$')::bigint)
      INTO highest
      FROM (
        SELECT o.reg_number AS n FROM "Student" o
         WHERE o.branch_uuid = r.branch_uuid
           AND o.uuid NOT IN (SELECT uuid FROM oaa_fix)
        UNION ALL
        SELECT g.new_number FROM oaa_fix g WHERE g.branch_uuid = r.branch_uuid
      ) used
     WHERE left(n, length(stem)) = stem
       AND substring(n from length(stem) + 1) ~ '^[0-9]{1,9}$';
    UPDATE oaa_fix
       SET new_number = stem || (coalesce(highest, 1000) + 1)::text
     WHERE uuid = r.uuid;
    moved := moved || r.old_number || ' -> ' || stem || (coalesce(highest, 1000) + 1)::text || '; ';
  END LOOP;
  IF moved <> '' THEN
    RAISE NOTICE 'Given new numbers: %', moved;
  END IF;
END $$;

-- Drop clashing rows (they keep their current numbers). Repeat, since a
-- skipped student keeps a number another row might have moved onto.
DO $$
DECLARE
  removed INT;
  skipped TEXT := '';
BEGIN
  LOOP
    WITH clashing AS (
      SELECT f.uuid
        FROM oaa_fix f
       WHERE EXISTS (
               SELECT 1 FROM "Student" o
                WHERE o.branch_uuid = f.branch_uuid
                  AND o.reg_number = f.new_number
                  AND o.uuid NOT IN (SELECT uuid FROM oaa_fix))
          OR (SELECT count(*) FROM oaa_fix g
               WHERE g.branch_uuid = f.branch_uuid AND g.new_number = f.new_number) > 1
    ), gone AS (
      DELETE FROM oaa_fix f USING clashing c WHERE f.uuid = c.uuid
      RETURNING f.old_number, f.new_number
    )
    SELECT count(*), coalesce(string_agg(old_number || ' (would be ' || new_number || ')', ', '), '')
      INTO removed, skipped
      FROM gone;
    EXIT WHEN removed = 0;
    RAISE NOTICE 'Skipped, would clash: %', skipped;
  END LOOP;
END $$;

UPDATE "Student" s
   SET reg_number = f.new_number
  FROM oaa_fix f
 WHERE s.uuid = f.uuid;

DROP TABLE oaa_fix;
