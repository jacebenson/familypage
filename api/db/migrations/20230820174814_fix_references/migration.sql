-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "url" TEXT,
    "status" TEXT NOT NULL,
    "busyStatus" TEXT NOT NULL,
    "organizer" TEXT NOT NULL,
    "attendees" TEXT,
    "start" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "geo" TEXT,
    "familyId" TEXT,
    CONSTRAINT "Event_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("attendees", "busyStatus", "description", "duration", "geo", "id", "location", "organizer", "start", "status", "title", "url") SELECT "attendees", "busyStatus", "description", "duration", "geo", "id", "location", "organizer", "start", "status", "title", "url" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
