/*
  Warnings:

  - You are about to drop the column `assesment` on the `Assessments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Assessments" DROP COLUMN "assesment",
ADD COLUMN     "assessment" DOUBLE PRECISION NOT NULL DEFAULT 0;
