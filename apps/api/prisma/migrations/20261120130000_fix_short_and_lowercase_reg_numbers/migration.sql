-- Follow-up to 20261120110000_reg_numbers_from_1001, which only caught
-- four-digit numbers starting with 0. Some schools have shorter numbers
-- (OOA/c/p/25/070) and lowercase letters in the prefix. For every student
-- whose number uses their own branch's prefix (ignoring case), followed by
-- an optional 2-digit year and a number:
--   * a number under 1000 moves up by 1000, like before: 070 -> 1070
--   * the prefix part is written as the branch has it, in capitals:
--     OOA/c/p -> OOA/C/P
-- So OOA/c/p/25/070 becomes OOA/C/P/25/1070. Nothing else in the number
-- changes, and numbers in any other format are left alone.

CREATE TEMP TABLE reg_fix AS
SELECT s.uuid,
       s.branch_uuid,
       s.reg_number AS old_number,
       b.reg_prefix
         || substr(s.reg_number, length(b.reg_prefix) + 1,
                   length(s.reg_number) - length(b.reg_prefix) - length(substring(s.reg_number from '(\d+)$')))
         || CASE
              WHEN substring(s.reg_number from '(\d+)$')::int < 1000
                THEN (substring(s.reg_number from '(\d+)$')::int + 1000)::text
              ELSE substring(s.reg_number from '(\d+)$')
            END AS new_number
  FROM "Student" s
  JOIN "Branch" b ON b.uuid = s.branch_uuid
 WHERE b.reg_prefix IS NOT NULL
   AND s.reg_number ~* ('^' || b.reg_prefix || '/(\d{2}/)?\d{1,4}$');

DELETE FROM reg_fix WHERE new_number = old_number;

-- Stop (changing nothing) if a new number is already taken in the branch,
-- or two old numbers would end up the same (e.g. .../070 and .../0070).
DO $$
DECLARE
  clash TEXT;
BEGIN
  SELECT string_agg(f.old_number || ' -> ' || f.new_number, ', ')
    INTO clash
    FROM reg_fix f
   WHERE EXISTS (
           SELECT 1 FROM "Student" o
            WHERE o.branch_uuid = f.branch_uuid
              AND o.uuid <> f.uuid
              AND o.reg_number = f.new_number
              AND o.uuid NOT IN (SELECT uuid FROM reg_fix))
      OR (SELECT count(*) FROM reg_fix g
           WHERE g.branch_uuid = f.branch_uuid AND g.new_number = f.new_number) > 1;
  IF clash IS NOT NULL THEN
    RAISE EXCEPTION 'Registration numbers would clash, fix these by hand first: %', clash;
  END IF;
END $$;

UPDATE "Student" s
   SET reg_number = f.new_number
  FROM reg_fix f
 WHERE s.uuid = f.uuid;

DROP TABLE reg_fix;
