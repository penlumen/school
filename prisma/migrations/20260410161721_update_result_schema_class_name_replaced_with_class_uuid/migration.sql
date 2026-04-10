/*
  Warnings:

  - A unique constraint covering the columns `[calendar_uuid,class_uuid,student_uuid]` on the table `Result` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Result_calendar_uuid_class_name_student_uuid_key";

-- CreateIndex
CREATE UNIQUE INDEX "Result_calendar_uuid_class_uuid_student_uuid_key" ON "Result"("calendar_uuid", "class_uuid", "student_uuid");
