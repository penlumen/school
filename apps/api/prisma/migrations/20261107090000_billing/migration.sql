-- CreateEnum
CREATE TYPE "BillingTemplateStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('PENDING', 'PART_PAYMENT', 'FULL_PAYMENT', 'CANCELLED', 'REFUNDED');

-- CreateTable
CREATE TABLE "BillingTemplate" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "branch_uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "BillingTemplateStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillingTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillingTemplateItem" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "template_uuid" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillingTemplateItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "branch_uuid" TEXT NOT NULL,
    "student_uuid" TEXT NOT NULL,
    "template_uuid" TEXT,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'PENDING',
    "total" DECIMAL(12,2) NOT NULL,
    "paid" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "issued_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_at" DATE,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceItem" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "invoice_uuid" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "amount" DECIMAL(12,2) NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceStatusChange" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "invoice_uuid" TEXT NOT NULL,
    "status" "InvoiceStatus" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "description" TEXT,
    "created_by_uuid" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvoiceStatusChange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BillingTemplate_uuid_key" ON "BillingTemplate"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "BillingTemplateItem_uuid_key" ON "BillingTemplateItem"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_uuid_key" ON "Invoice"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_number_key" ON "Invoice"("number");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceItem_uuid_key" ON "InvoiceItem"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceStatusChange_uuid_key" ON "InvoiceStatusChange"("uuid");

-- AddForeignKey
ALTER TABLE "BillingTemplate" ADD CONSTRAINT "BillingTemplate_branch_uuid_fkey" FOREIGN KEY ("branch_uuid") REFERENCES "Branch"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingTemplateItem" ADD CONSTRAINT "BillingTemplateItem_template_uuid_fkey" FOREIGN KEY ("template_uuid") REFERENCES "BillingTemplate"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_branch_uuid_fkey" FOREIGN KEY ("branch_uuid") REFERENCES "Branch"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_student_uuid_fkey" FOREIGN KEY ("student_uuid") REFERENCES "Student"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_template_uuid_fkey" FOREIGN KEY ("template_uuid") REFERENCES "BillingTemplate"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_invoice_uuid_fkey" FOREIGN KEY ("invoice_uuid") REFERENCES "Invoice"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceStatusChange" ADD CONSTRAINT "InvoiceStatusChange_invoice_uuid_fkey" FOREIGN KEY ("invoice_uuid") REFERENCES "Invoice"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

