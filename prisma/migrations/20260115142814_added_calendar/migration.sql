-- AlterTable
ALTER TABLE "Result" ADD COLUMN     "calendar_uuid" TEXT,
ADD COLUMN     "class_uuid" TEXT;

-- CreateTable
CREATE TABLE "Calendar" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "branch_uuid" TEXT NOT NULL,
    "session" TEXT NOT NULL,
    "term" TEXT,
    "open_date" TIMESTAMP(3) NOT NULL,
    "close_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Calendar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Calendar_uuid_key" ON "Calendar"("uuid");

-- AddForeignKey
ALTER TABLE "Calendar" ADD CONSTRAINT "Calendar_branch_uuid_fkey" FOREIGN KEY ("branch_uuid") REFERENCES "Branch"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_calendar_uuid_fkey" FOREIGN KEY ("calendar_uuid") REFERENCES "Calendar"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
