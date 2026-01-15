/*
  Warnings:

  - The values [ACARDEMIC] on the enum `Position` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Position_new" AS ENUM ('ADMINISTRATIVE', 'ACADEMIC', 'GUARDIAN', 'PARENT');
ALTER TABLE "public"."User" ALTER COLUMN "position" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "position" TYPE "Position_new" USING ("position"::text::"Position_new");
ALTER TYPE "Position" RENAME TO "Position_old";
ALTER TYPE "Position_new" RENAME TO "Position";
DROP TYPE "public"."Position_old";
ALTER TABLE "User" ALTER COLUMN "position" SET DEFAULT 'GUARDIAN';
COMMIT;
