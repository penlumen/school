-- Allow multiple academic staff to access a class while retaining teacher_uuid as the main class teacher.
ALTER TABLE "Class" ADD COLUMN "teachers_uuid" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Track whether a teacher explicitly requested administrator approval for a result.
ALTER TABLE "Result" ADD COLUMN "approval_requested" BOOLEAN NOT NULL DEFAULT false;

-- Backfill the main class teacher into the additional staff access list so existing
-- class teachers retain access without requiring an admin to edit every class.
UPDATE "Class"
SET "teachers_uuid" = ARRAY["teacher_uuid"]::TEXT[]
WHERE "teacher_uuid" IS NOT NULL AND cardinality("teachers_uuid") = 0;
