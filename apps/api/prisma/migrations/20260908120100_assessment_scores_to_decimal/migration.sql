-- Change Assessments score columns from double precision to Decimal(5,2)
-- for exact score arithmetic. USING casts existing values in place.
ALTER TABLE "Assessments" ALTER COLUMN "ca_one" TYPE DECIMAL(5,2) USING "ca_one"::DECIMAL(5,2);
ALTER TABLE "Assessments" ALTER COLUMN "ca_one" SET DEFAULT 0;

ALTER TABLE "Assessments" ALTER COLUMN "ca_two" TYPE DECIMAL(5,2) USING "ca_two"::DECIMAL(5,2);
ALTER TABLE "Assessments" ALTER COLUMN "ca_two" SET DEFAULT 0;

ALTER TABLE "Assessments" ALTER COLUMN "examination" TYPE DECIMAL(5,2) USING "examination"::DECIMAL(5,2);
ALTER TABLE "Assessments" ALTER COLUMN "examination" SET DEFAULT 0;

ALTER TABLE "Assessments" ALTER COLUMN "overall" TYPE DECIMAL(5,2) USING "overall"::DECIMAL(5,2);
ALTER TABLE "Assessments" ALTER COLUMN "overall" SET DEFAULT 0;
