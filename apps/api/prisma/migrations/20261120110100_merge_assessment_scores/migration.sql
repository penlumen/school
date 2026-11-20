-- CA 1 and CA 2 become a single assessment score. Existing scores are added
-- together, so totals, grades and positions stay exactly the same.
ALTER TABLE "Assessments" ADD COLUMN "assessment" DECIMAL(5,2) NOT NULL DEFAULT 0;
UPDATE "Assessments" SET "assessment" = "ca_one" + "ca_two";
ALTER TABLE "Assessments" DROP COLUMN "ca_one",
DROP COLUMN "ca_two";

-- Score limits per subject, set on the Grade settings page.
ALTER TABLE "Branch" ADD COLUMN "assessment_max" INTEGER NOT NULL DEFAULT 40,
ADD COLUMN "examination_max" INTEGER NOT NULL DEFAULT 60;
