-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FamilyMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "familyId" TEXT NOT NULL,
    "userId" TEXT,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "inviteCode" TEXT NOT NULL,
    CONSTRAINT "FamilyMember_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FamilyMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FamilyMember" ("admin", "familyId", "id", "inviteCode", "userId") SELECT "admin", "familyId", "id", "inviteCode", "userId" FROM "FamilyMember";
DROP TABLE "FamilyMember";
ALTER TABLE "new_FamilyMember" RENAME TO "FamilyMember";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
