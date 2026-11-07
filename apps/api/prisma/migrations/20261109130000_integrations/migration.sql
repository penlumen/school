-- CreateEnum
CREATE TYPE "WebhookStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "IntegrationApp" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "school_uuid" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "app_url" TEXT,
    "redirect_uris" TEXT[],
    "client_id" TEXT NOT NULL,
    "client_secret_hash" TEXT,
    "client_secret_hint" TEXT,
    "webhook_url" TEXT,
    "webhook_secret" TEXT,
    "webhook_events" TEXT[],
    "disabled_branch_uuids" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntegrationApp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OidcCode" (
    "id" SERIAL NOT NULL,
    "code_hash" TEXT NOT NULL,
    "app_uuid" TEXT NOT NULL,
    "subject_uuid" TEXT NOT NULL,
    "subject_type" TEXT NOT NULL,
    "redirect_uri" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "nonce" TEXT,
    "code_challenge" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OidcCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OidcToken" (
    "id" SERIAL NOT NULL,
    "token_hash" TEXT NOT NULL,
    "app_uuid" TEXT NOT NULL,
    "subject_uuid" TEXT,
    "subject_type" TEXT,
    "scope" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OidcToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OidcKey" (
    "id" SERIAL NOT NULL,
    "kid" TEXT NOT NULL,
    "private_key" TEXT NOT NULL,
    "public_jwk" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OidcKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookDelivery" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "app_uuid" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "WebhookStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "response_status" INTEGER,
    "error" TEXT,
    "delivered_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationApp_uuid_key" ON "IntegrationApp"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationApp_client_id_key" ON "IntegrationApp"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationApp_school_uuid_key_key" ON "IntegrationApp"("school_uuid", "key");

-- CreateIndex
CREATE UNIQUE INDEX "OidcCode_code_hash_key" ON "OidcCode"("code_hash");

-- CreateIndex
CREATE UNIQUE INDEX "OidcToken_token_hash_key" ON "OidcToken"("token_hash");

-- CreateIndex
CREATE INDEX "OidcToken_app_uuid_idx" ON "OidcToken"("app_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "OidcKey_kid_key" ON "OidcKey"("kid");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookDelivery_uuid_key" ON "WebhookDelivery"("uuid");

-- CreateIndex
CREATE INDEX "WebhookDelivery_app_uuid_created_at_idx" ON "WebhookDelivery"("app_uuid", "created_at");

-- AddForeignKey
ALTER TABLE "IntegrationApp" ADD CONSTRAINT "IntegrationApp_school_uuid_fkey" FOREIGN KEY ("school_uuid") REFERENCES "School"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OidcCode" ADD CONSTRAINT "OidcCode_app_uuid_fkey" FOREIGN KEY ("app_uuid") REFERENCES "IntegrationApp"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OidcToken" ADD CONSTRAINT "OidcToken_app_uuid_fkey" FOREIGN KEY ("app_uuid") REFERENCES "IntegrationApp"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebhookDelivery" ADD CONSTRAINT "WebhookDelivery_app_uuid_fkey" FOREIGN KEY ("app_uuid") REFERENCES "IntegrationApp"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

