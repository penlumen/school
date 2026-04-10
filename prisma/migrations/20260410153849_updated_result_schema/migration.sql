/*
  Warnings:

  - A unique constraint covering the columns `[calendar_uuid,class_name,student_uuid]` on the table `Result` will be added. If there are existing duplicate values, this will fail.
  - Made the column `calendar_uuid` on table `Result` required. This step will fail if there are existing NULL values in that column.
  - Made the column `class_uuid` on table `Result` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Result_class_name_student_uuid_key";

-- AlterTable
ALTER TABLE "Result" ALTER COLUMN "calendar_uuid" SET NOT NULL,
ALTER COLUMN "class_uuid" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Result_calendar_uuid_class_name_student_uuid_key" ON "Result"("calendar_uuid", "class_name", "student_uuid");
