-- Rename the school-set resumption date field (data preserved).
ALTER TABLE "Calendar" RENAME COLUMN "open_date" TO "next_term_resumption_date";

-- New derived open_date: when this term actually opened, taken from the
-- previous term's next_term_resumption_date. Nullable - the first term
-- for a branch has no predecessor to derive it from.
ALTER TABLE "Calendar" ADD COLUMN "open_date" TIMESTAMP(3);

-- Backfill existing rows: each term's open_date = the immediately
-- preceding term's (same branch) next_term_resumption_date, using
-- creation order as "previous term".
WITH ordered AS (
  SELECT
    id,
    LAG("next_term_resumption_date") OVER (
      PARTITION BY "branch_uuid" ORDER BY "created_at" ASC
    ) AS derived_open_date
  FROM "Calendar"
)
UPDATE "Calendar" c
SET "open_date" = ordered.derived_open_date
FROM ordered
WHERE c.id = ordered.id;

-- CreateEnum
CREATE TYPE "CalendarStatus" AS ENUM ('ACTIVE', 'INACTIVE');

ALTER TABLE "Calendar" ADD COLUMN "status" "CalendarStatus" NOT NULL DEFAULT 'INACTIVE';

-- Backfill: mark each branch's most recently created term as ACTIVE, so the
-- "only one active term" invariant holds immediately after migrating,
-- instead of leaving every branch with zero active terms.
WITH latest AS (
  SELECT DISTINCT ON ("branch_uuid") id
  FROM "Calendar"
  ORDER BY "branch_uuid", "created_at" DESC
)
UPDATE "Calendar" c
SET "status" = 'ACTIVE'
FROM latest
WHERE c.id = latest.id;

-- Enforce "only one active term per branch" at the database level too, not
-- just in application code (Prisma's schema DSL can't express partial
-- indexes, so this constraint only exists here in raw SQL).
CREATE UNIQUE INDEX "Calendar_one_active_per_branch"
  ON "Calendar" ("branch_uuid")
  WHERE "status" = 'ACTIVE';
