-- Rename "Assessments" to "ResultAssessments". Renames only (no drop and
-- recreate), so every score is kept. Constraints, indexes and the id
-- sequence get the names Prisma expects for the new table.
ALTER TABLE "Assessments" RENAME TO "ResultAssessments";
ALTER TABLE "ResultAssessments" RENAME CONSTRAINT "Assessments_pkey" TO "ResultAssessments_pkey";
ALTER TABLE "ResultAssessments" RENAME CONSTRAINT "Assessments_result_uuid_fkey" TO "ResultAssessments_result_uuid_fkey";
ALTER INDEX "Assessments_uuid_key" RENAME TO "ResultAssessments_uuid_key";
ALTER INDEX "Assessments_result_uuid_subject_key" RENAME TO "ResultAssessments_result_uuid_subject_key";
ALTER SEQUENCE "Assessments_id_seq" RENAME TO "ResultAssessments_id_seq";
