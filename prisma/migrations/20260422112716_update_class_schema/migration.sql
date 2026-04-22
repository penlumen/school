-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_teacher_uuid_fkey";

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_teacher_uuid_fkey" FOREIGN KEY ("teacher_uuid") REFERENCES "User"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
