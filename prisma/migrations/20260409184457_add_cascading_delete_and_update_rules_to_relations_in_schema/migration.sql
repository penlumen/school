-- DropForeignKey
ALTER TABLE "AccessControl" DROP CONSTRAINT "AccessControl_branch_uuid_fkey";

-- DropForeignKey
ALTER TABLE "AccessControl" DROP CONSTRAINT "AccessControl_user_uuid_fkey";

-- DropForeignKey
ALTER TABLE "Assessments" DROP CONSTRAINT "Assessments_result_uuid_fkey";

-- DropForeignKey
ALTER TABLE "Branch" DROP CONSTRAINT "Branch_school_uuid_fkey";

-- DropForeignKey
ALTER TABLE "BranchAccess" DROP CONSTRAINT "BranchAccess_branch_uuid_fkey";

-- DropForeignKey
ALTER TABLE "BranchAccess" DROP CONSTRAINT "BranchAccess_school_uuid_fkey";

-- DropForeignKey
ALTER TABLE "BranchAccess" DROP CONSTRAINT "BranchAccess_user_uuid_fkey";

-- DropForeignKey
ALTER TABLE "Calendar" DROP CONSTRAINT "Calendar_branch_uuid_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_branch_uuid_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_teacher_uuid_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_branch_uuid_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_calendar_uuid_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_student_uuid_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_branch_uuid_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_class_uuid_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_parent_uuid_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_class_uuid_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_school_uuid_fkey";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_school_uuid_fkey" FOREIGN KEY ("school_uuid") REFERENCES "School"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessControl" ADD CONSTRAINT "AccessControl_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessControl" ADD CONSTRAINT "AccessControl_branch_uuid_fkey" FOREIGN KEY ("branch_uuid") REFERENCES "Branch"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_school_uuid_fkey" FOREIGN KEY ("school_uuid") REFERENCES "School"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchAccess" ADD CONSTRAINT "BranchAccess_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchAccess" ADD CONSTRAINT "BranchAccess_school_uuid_fkey" FOREIGN KEY ("school_uuid") REFERENCES "School"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchAccess" ADD CONSTRAINT "BranchAccess_branch_uuid_fkey" FOREIGN KEY ("branch_uuid") REFERENCES "Branch"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calendar" ADD CONSTRAINT "Calendar_branch_uuid_fkey" FOREIGN KEY ("branch_uuid") REFERENCES "Branch"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_parent_uuid_fkey" FOREIGN KEY ("parent_uuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_branch_uuid_fkey" FOREIGN KEY ("branch_uuid") REFERENCES "Branch"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_class_uuid_fkey" FOREIGN KEY ("class_uuid") REFERENCES "Class"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_branch_uuid_fkey" FOREIGN KEY ("branch_uuid") REFERENCES "Branch"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_teacher_uuid_fkey" FOREIGN KEY ("teacher_uuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_class_uuid_fkey" FOREIGN KEY ("class_uuid") REFERENCES "Class"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_branch_uuid_fkey" FOREIGN KEY ("branch_uuid") REFERENCES "Branch"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_calendar_uuid_fkey" FOREIGN KEY ("calendar_uuid") REFERENCES "Calendar"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_student_uuid_fkey" FOREIGN KEY ("student_uuid") REFERENCES "Student"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessments" ADD CONSTRAINT "Assessments_result_uuid_fkey" FOREIGN KEY ("result_uuid") REFERENCES "Result"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
