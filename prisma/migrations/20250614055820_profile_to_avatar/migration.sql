/*
  Warnings:

  - You are about to drop the column `profile` on the `Branch` table. All the data in the column will be lost.
  - You are about to drop the column `profile` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `profile` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `profile` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Branch" DROP COLUMN "profile",
ADD COLUMN     "avatar" TEXT;

-- AlterTable
ALTER TABLE "School" DROP COLUMN "profile",
ADD COLUMN     "avatar" TEXT;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "profile",
ADD COLUMN     "avatar" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "profile",
ADD COLUMN     "avatar" TEXT;
