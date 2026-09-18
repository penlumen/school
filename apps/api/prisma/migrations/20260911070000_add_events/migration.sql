-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "calendar_uuid" TEXT NOT NULL,
    "branch_uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" DATE NOT NULL,
    "start_time" TEXT,
    "end_time" TEXT,
    "location" TEXT,
    "tag_all_staff" BOOLEAN NOT NULL DEFAULT false,
    "tag_all_parents" BOOLEAN NOT NULL DEFAULT false,
    "created_by_uuid" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventTag" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "event_uuid" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "tag_type" TEXT NOT NULL,

    CONSTRAINT "EventTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_uuid_key" ON "Event"("uuid");
CREATE UNIQUE INDEX "EventTag_uuid_key" ON "EventTag"("uuid");
CREATE UNIQUE INDEX "EventTag_event_uuid_user_uuid_tag_type_key" ON "EventTag"("event_uuid", "user_uuid", "tag_type");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_calendar_uuid_fkey" FOREIGN KEY ("calendar_uuid") REFERENCES "Calendar"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Event" ADD CONSTRAINT "Event_branch_uuid_fkey" FOREIGN KEY ("branch_uuid") REFERENCES "Branch"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Event" ADD CONSTRAINT "Event_created_by_uuid_fkey" FOREIGN KEY ("created_by_uuid") REFERENCES "User"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "EventTag" ADD CONSTRAINT "EventTag_event_uuid_fkey" FOREIGN KEY ("event_uuid") REFERENCES "Event"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventTag" ADD CONSTRAINT "EventTag_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
