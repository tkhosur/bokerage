/*
  Warnings:

  - You are about to drop the column `imagesId` on the `SavedPost` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SavedPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SavedPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SavedPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SavedPost" ("created_at", "id", "postId", "userId") SELECT "created_at", "id", "postId", "userId" FROM "SavedPost";
DROP TABLE "SavedPost";
ALTER TABLE "new_SavedPost" RENAME TO "SavedPost";
CREATE UNIQUE INDEX "SavedPost_userId_key" ON "SavedPost"("userId");
CREATE UNIQUE INDEX "SavedPost_postId_key" ON "SavedPost"("postId");
CREATE UNIQUE INDEX "SavedPost_userId_postId_key" ON "SavedPost"("userId", "postId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
