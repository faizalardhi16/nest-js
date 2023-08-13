-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" TEXT,
ALTER COLUMN "createdAt" SET DEFAULT NOW() + interval '7 hours';
