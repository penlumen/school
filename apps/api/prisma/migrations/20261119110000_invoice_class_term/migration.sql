-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "calendar_uuid" TEXT,
ADD COLUMN     "class_uuid" TEXT;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_class_uuid_fkey" FOREIGN KEY ("class_uuid") REFERENCES "Class"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_calendar_uuid_fkey" FOREIGN KEY ("calendar_uuid") REFERENCES "Calendar"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- Backfill existing invoices: the student's current class, and the branch
-- term whose dates contain the issue date (else the latest term opened by then).
UPDATE "Invoice" i
SET "class_uuid" = s."class_uuid"
FROM "Student" s
WHERE s."uuid" = i."student_uuid" AND i."class_uuid" IS NULL;

UPDATE "Invoice" i
SET "calendar_uuid" = (
  SELECT c."uuid" FROM "Calendar" c
  WHERE c."branch_uuid" = i."branch_uuid"
    AND c."open_date" IS NOT NULL
    AND c."open_date" <= i."issued_at"
  ORDER BY
    (c."close_date" IS NOT NULL AND i."issued_at" <= c."close_date") DESC,
    c."open_date" DESC
  LIMIT 1
)
WHERE i."calendar_uuid" IS NULL;
