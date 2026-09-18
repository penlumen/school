-- Add User.last_branch_uuid to remember each user's last-used branch,
-- replacing the forced branch-selection page. Nullable + SET NULL on
-- delete, so removing a branch never blocks or cascades into deleting users.
ALTER TABLE "User" ADD COLUMN "last_branch_uuid" TEXT;

ALTER TABLE "User" ADD CONSTRAINT "User_last_branch_uuid_fkey"
  FOREIGN KEY ("last_branch_uuid") REFERENCES "Branch"("uuid")
  ON DELETE SET NULL ON UPDATE CASCADE;
