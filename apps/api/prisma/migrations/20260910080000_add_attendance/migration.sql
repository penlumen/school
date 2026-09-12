-- Face descriptors for client-side face-api.js matching (additive, safe defaults)
ALTER TABLE "User" ADD COLUMN "face_descriptor" DOUBLE PRECISION[] NOT NULL DEFAULT ARRAY[]::DOUBLE PRECISION[];
ALTER TABLE "Student" ADD COLUMN "face_descriptor" DOUBLE PRECISION[] NOT NULL DEFAULT ARRAY[]::DOUBLE PRECISION[];

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PENDING', 'PRESENT', 'ABSENT');

-- CreateTable
CREATE TABLE "StudentAttendance" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "student_uuid" TEXT NOT NULL,
    "branch_uuid" TEXT NOT NULL,
    "class_uuid" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'PRESENT',
    "marked_by_uuid" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffAttendance" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "staff_uuid" TEXT NOT NULL,
    "branch_uuid" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'PRESENT',
    "marked_by_uuid" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentAttendance_uuid_key" ON "StudentAttendance"("uuid");
CREATE UNIQUE INDEX "StudentAttendance_student_uuid_date_key" ON "StudentAttendance"("student_uuid", "date");
CREATE UNIQUE INDEX "StaffAttendance_uuid_key" ON "StaffAttendance"("uuid");
CREATE UNIQUE INDEX "StaffAttendance_staff_uuid_date_key" ON "StaffAttendance"("staff_uuid", "date");

-- AddForeignKey
ALTER TABLE "StudentAttendance" ADD CONSTRAINT "StudentAttendance_student_uuid_fkey" FOREIGN KEY ("student_uuid") REFERENCES "Student"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudentAttendance" ADD CONSTRAINT "StudentAttendance_branch_uuid_fkey" FOREIGN KEY ("branch_uuid") REFERENCES "Branch"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudentAttendance" ADD CONSTRAINT "StudentAttendance_class_uuid_fkey" FOREIGN KEY ("class_uuid") REFERENCES "Class"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudentAttendance" ADD CONSTRAINT "StudentAttendance_marked_by_uuid_fkey" FOREIGN KEY ("marked_by_uuid") REFERENCES "User"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "StaffAttendance" ADD CONSTRAINT "StaffAttendance_staff_uuid_fkey" FOREIGN KEY ("staff_uuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StaffAttendance" ADD CONSTRAINT "StaffAttendance_branch_uuid_fkey" FOREIGN KEY ("branch_uuid") REFERENCES "Branch"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StaffAttendance" ADD CONSTRAINT "StaffAttendance_marked_by_uuid_fkey" FOREIGN KEY ("marked_by_uuid") REFERENCES "User"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
