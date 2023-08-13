-- AlterTable
ALTER TABLE "assessments" ALTER COLUMN "file_name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "createdAt" SET DEFAULT NOW() + interval '7 hours';
