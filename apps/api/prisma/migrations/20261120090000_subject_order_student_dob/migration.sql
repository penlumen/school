-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "date_of_birth" DATE,
ALTER COLUMN "parent_uuid" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0;

-- Existing subjects keep the order they were added in.
UPDATE "Subject" s
SET "position" = o.rn
FROM (
  SELECT "uuid", ROW_NUMBER() OVER (PARTITION BY "class_uuid" ORDER BY "created_at", "id") - 1 AS rn
  FROM "Subject"
) o
WHERE o."uuid" = s."uuid";
