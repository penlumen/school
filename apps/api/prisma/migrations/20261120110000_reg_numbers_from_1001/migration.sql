-- Registration numbers now start at 1001. Move numbers generated in the old
-- 0001 series up by 1000 (NPR/SS/26/0001 -> NPR/SS/26/1001, 0042 -> 1042),
-- keeping their order. Only numbers that use their own branch's prefix and
-- end in four digits starting with 0 change; anything else is left alone.
-- Prefixes only contain A-Z, 0-9, / and -, so they are safe inside a regex.

-- Stop (changing nothing) if a new number is already taken in that branch.
DO $$
DECLARE
  clash TEXT;
BEGIN
  SELECT string_agg(s.reg_number || ' -> ' || regexp_replace(s.reg_number, '0(\d{3})$', '1\1'), ', ')
    INTO clash
    FROM "Student" s
    JOIN "Branch" b ON b.uuid = s.branch_uuid
   WHERE b.reg_prefix IS NOT NULL
     AND s.reg_number ~* ('^' || b.reg_prefix || '/(\d{2}/)?0\d{3}$')
     AND EXISTS (
       SELECT 1 FROM "Student" o
        WHERE o.branch_uuid = s.branch_uuid
          AND o.reg_number = regexp_replace(s.reg_number, '0(\d{3})$', '1\1')
     );
  IF clash IS NOT NULL THEN
    RAISE EXCEPTION 'Registration numbers already in use, fix these by hand first: %', clash;
  END IF;
END $$;

UPDATE "Student" s
   SET reg_number = regexp_replace(s.reg_number, '0(\d{3})$', '1\1')
  FROM "Branch" b
 WHERE b.uuid = s.branch_uuid
   AND b.reg_prefix IS NOT NULL
   AND s.reg_number ~* ('^' || b.reg_prefix || '/(\d{2}/)?0\d{3}$');
