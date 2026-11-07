-- CreateTable
CREATE TABLE "AffectiveTrait" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "branch_uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AffectiveTrait_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffectiveRating" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "result_uuid" TEXT NOT NULL,
    "trait_uuid" TEXT,
    "trait_name" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AffectiveRating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AffectiveTrait_uuid_key" ON "AffectiveTrait"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "AffectiveRating_uuid_key" ON "AffectiveRating"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "AffectiveRating_result_uuid_trait_uuid_key" ON "AffectiveRating"("result_uuid", "trait_uuid");

-- AddForeignKey
ALTER TABLE "AffectiveTrait" ADD CONSTRAINT "AffectiveTrait_branch_uuid_fkey" FOREIGN KEY ("branch_uuid") REFERENCES "Branch"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffectiveRating" ADD CONSTRAINT "AffectiveRating_result_uuid_fkey" FOREIGN KEY ("result_uuid") REFERENCES "Result"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffectiveRating" ADD CONSTRAINT "AffectiveRating_trait_uuid_fkey" FOREIGN KEY ("trait_uuid") REFERENCES "AffectiveTrait"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;


-- Give every existing branch the standard traits that were previously hard-coded on the report card.
INSERT INTO "AffectiveTrait" ("uuid", "branch_uuid", "name", "position", "updated_at")
SELECT gen_random_uuid()::text, b."uuid", t.name, t.position, CURRENT_TIMESTAMP
FROM "Branch" b
CROSS JOIN (VALUES ('Punctuality', 0), ('Neatness', 1), ('Politeness', 2), ('Honesty', 3), ('Leadership', 4)) AS t(name, position);
