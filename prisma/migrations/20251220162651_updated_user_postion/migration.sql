/*
  Warnings:

  - The `position` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Position" AS ENUM ('ADMINISTRATIVE', 'ACARDEMIC', 'GUARDIAN', 'PARENT');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "position",
ADD COLUMN     "position" "Position" NOT NULL DEFAULT 'GUARDIAN';
