-- Rename Assessments columns to match the report card's CA1/CA2 naming.
-- Uses RENAME COLUMN (not drop+add) so existing scores are preserved.
ALTER TABLE "Assessments" RENAME COLUMN "assignment" TO "ca_one";
ALTER TABLE "Assessments" RENAME COLUMN "assessment" TO "ca_two";
