/*
  Warnings:

  - A unique constraint covering the columns `[class_uuid,name]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `AccessControl` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccessControl" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "delete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "write" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Subject_class_uuid_name_key" ON "Subject"("class_uuid", "name");
