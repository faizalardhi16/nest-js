/*
  Warnings:

  - You are about to drop the column `fullName` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "fullName",
ADD COLUMN     "firstName" TEXT,
ALTER COLUMN "createdAt" SET DEFAULT NOW() + interval '7 hours';
