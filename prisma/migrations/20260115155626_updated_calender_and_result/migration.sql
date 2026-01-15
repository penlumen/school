/*
  Warnings:

  - A unique constraint covering the columns `[class_name,student_uuid]` on the table `Result` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Calendar" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Result_class_name_student_uuid_key" ON "Result"("class_name", "student_uuid");
