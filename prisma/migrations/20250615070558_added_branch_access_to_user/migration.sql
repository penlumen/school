-- AddForeignKey
ALTER TABLE "BranchAccess" ADD CONSTRAINT "BranchAccess_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
