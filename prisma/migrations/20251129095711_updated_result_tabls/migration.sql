/*
  Warnings:

  - You are about to drop the column `grade` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `remark` on the `Result` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ResultStatus" AS ENUM ('APPROVED', 'PENDING', 'REJECTED');

-- AlterTable
ALTER TABLE "Result" DROP COLUMN "grade",
DROP COLUMN "remark",
ADD COLUMN     "overall" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "principal_remark" TEXT,
ADD COLUMN     "status" "ResultStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "teacher_remark" TEXT;
