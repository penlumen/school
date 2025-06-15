/*
  Warnings:

  - Added the required column `school_uuid` to the `BranchAccess` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BranchAccess" ADD COLUMN     "school_uuid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "BranchAccess" ADD CONSTRAINT "BranchAccess_school_uuid_fkey" FOREIGN KEY ("school_uuid") REFERENCES "School"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchAccess" ADD CONSTRAINT "BranchAccess_branch_uuid_fkey" FOREIGN KEY ("branch_uuid") REFERENCES "Branch"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
