-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ROOT', 'ADMIN', 'STAFF', 'PARENT');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "school_uuid" TEXT,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "contact" TEXT,
    "alt_contact" TEXT,
    "profile" TEXT,
    "address" TEXT,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact" TEXT,
    "profile" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "zip" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "school_uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact" TEXT,
    "profile" TEXT,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "parent_uuid" TEXT NOT NULL,
    "branch_uuid" TEXT NOT NULL,
    "class_uuid" TEXT NOT NULL,
    "reg_number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profile" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "branch_uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "class_uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grade" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "branch_uuid" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "grade" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Result" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "student_uuid" TEXT NOT NULL,
    "class_name" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessments" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "result_uuid" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "assignment" DOUBLE PRECISION NOT NULL,
    "assesment" DOUBLE PRECISION NOT NULL,
    "examination" DOUBLE PRECISION NOT NULL,
    "overall" DOUBLE PRECISION NOT NULL,
    "grade" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assessments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_school_uuid_email_role_key" ON "User"("school_uuid", "email", "role");

-- CreateIndex
CREATE UNIQUE INDEX "School_uuid_key" ON "School"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "School_token_key" ON "School"("token");

-- CreateIndex
CREATE UNIQUE INDEX "School_email_key" ON "School"("email");

-- CreateIndex
CREATE UNIQUE INDEX "School_slug_key" ON "School"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_uuid_key" ON "Branch"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Student_uuid_key" ON "Student"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Student_branch_uuid_reg_number_key" ON "Student"("branch_uuid", "reg_number");

-- CreateIndex
CREATE UNIQUE INDEX "Class_uuid_key" ON "Class"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_uuid_key" ON "Subject"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Grade_uuid_key" ON "Grade"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Result_uuid_key" ON "Result"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Assessments_uuid_key" ON "Assessments"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Assessments_result_uuid_subject_key" ON "Assessments"("result_uuid", "subject");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_school_uuid_fkey" FOREIGN KEY ("school_uuid") REFERENCES "School"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_school_uuid_fkey" FOREIGN KEY ("school_uuid") REFERENCES "School"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_parent_uuid_fkey" FOREIGN KEY ("parent_uuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_branch_uuid_fkey" FOREIGN KEY ("branch_uuid") REFERENCES "Branch"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_class_uuid_fkey" FOREIGN KEY ("class_uuid") REFERENCES "Class"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_branch_uuid_fkey" FOREIGN KEY ("branch_uuid") REFERENCES "Branch"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_class_uuid_fkey" FOREIGN KEY ("class_uuid") REFERENCES "Class"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_branch_uuid_fkey" FOREIGN KEY ("branch_uuid") REFERENCES "Branch"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_student_uuid_fkey" FOREIGN KEY ("student_uuid") REFERENCES "Student"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessments" ADD CONSTRAINT "Assessments_result_uuid_fkey" FOREIGN KEY ("result_uuid") REFERENCES "Result"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
