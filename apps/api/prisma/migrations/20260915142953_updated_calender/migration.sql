-- AlterTable
ALTER TABLE "Calendar" ALTER COLUMN "next_term_resumption_date" DROP NOT NULL,
ALTER COLUMN "close_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "face_descriptor" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "face_descriptor" DROP DEFAULT;
