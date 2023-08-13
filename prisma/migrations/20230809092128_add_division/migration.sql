/*
  Warnings:

  - Added the required column `division` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pc` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "division" TEXT NOT NULL,
ADD COLUMN     "pc" INTEGER NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT NOW() + interval '7 hours';
