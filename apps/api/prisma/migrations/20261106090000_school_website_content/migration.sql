-- AlterTable
ALTER TABLE "School" ADD COLUMN     "about" TEXT,
ADD COLUMN     "features" JSONB,
ADD COLUMN     "mission" TEXT,
ADD COLUMN     "subtext" TEXT,
ADD COLUMN     "values" JSONB,
ADD COLUMN     "vision" TEXT;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "SchoolFacility" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "school_uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolFacility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryCategory" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "school_uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryImage" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "school_uuid" TEXT NOT NULL,
    "category_uuid" TEXT,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SchoolFacility_uuid_key" ON "SchoolFacility"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "GalleryCategory_uuid_key" ON "GalleryCategory"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "GalleryImage_uuid_key" ON "GalleryImage"("uuid");

-- AddForeignKey
ALTER TABLE "SchoolFacility" ADD CONSTRAINT "SchoolFacility_school_uuid_fkey" FOREIGN KEY ("school_uuid") REFERENCES "School"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryCategory" ADD CONSTRAINT "GalleryCategory_school_uuid_fkey" FOREIGN KEY ("school_uuid") REFERENCES "School"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryImage" ADD CONSTRAINT "GalleryImage_school_uuid_fkey" FOREIGN KEY ("school_uuid") REFERENCES "School"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryImage" ADD CONSTRAINT "GalleryImage_category_uuid_fkey" FOREIGN KEY ("category_uuid") REFERENCES "GalleryCategory"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

