-- CreateTable
CREATE TABLE "AccessControl" (
    "id" SERIAL NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "branch_uuid" TEXT NOT NULL,
    "access" TEXT NOT NULL,

    CONSTRAINT "AccessControl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccessControl_user_uuid_branch_uuid_access_key" ON "AccessControl"("user_uuid", "branch_uuid", "access");

-- AddForeignKey
ALTER TABLE "AccessControl" ADD CONSTRAINT "AccessControl_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessControl" ADD CONSTRAINT "AccessControl_branch_uuid_fkey" FOREIGN KEY ("branch_uuid") REFERENCES "Branch"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
