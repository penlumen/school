-- CreateTable
CREATE TABLE "BranchAccess" (
    "id" SERIAL NOT NULL,
    "role" "Role" NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "branch_uuid" TEXT NOT NULL,

    CONSTRAINT "BranchAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BranchAccess_user_uuid_branch_uuid_role_key" ON "BranchAccess"("user_uuid", "branch_uuid", "role");
