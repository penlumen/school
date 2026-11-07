-- CreateEnum
CREATE TYPE "OnlinePaymentStatus" AS ENUM ('PENDING', 'AWAITING_CONFIRMATION', 'SUCCESS', 'FAILED', 'REJECTED');

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "allow_part_payment" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "parent_pays_fees" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "payments_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paystack_public_key" TEXT,
ADD COLUMN     "paystack_secret_key" TEXT;

-- CreateTable
CREATE TABLE "OnlinePayment" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "school_uuid" TEXT NOT NULL,
    "branch_uuid" TEXT NOT NULL,
    "invoice_uuid" TEXT NOT NULL,
    "user_uuid" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "fee" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "OnlinePaymentStatus" NOT NULL DEFAULT 'PENDING',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "channel" TEXT,
    "note" TEXT,
    "confirmed_by_uuid" TEXT,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnlinePayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OnlinePayment_uuid_key" ON "OnlinePayment"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "OnlinePayment_reference_key" ON "OnlinePayment"("reference");

-- CreateIndex
CREATE INDEX "OnlinePayment_branch_uuid_status_idx" ON "OnlinePayment"("branch_uuid", "status");

-- AddForeignKey
ALTER TABLE "OnlinePayment" ADD CONSTRAINT "OnlinePayment_school_uuid_fkey" FOREIGN KEY ("school_uuid") REFERENCES "School"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnlinePayment" ADD CONSTRAINT "OnlinePayment_branch_uuid_fkey" FOREIGN KEY ("branch_uuid") REFERENCES "Branch"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnlinePayment" ADD CONSTRAINT "OnlinePayment_invoice_uuid_fkey" FOREIGN KEY ("invoice_uuid") REFERENCES "Invoice"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnlinePayment" ADD CONSTRAINT "OnlinePayment_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "User"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

