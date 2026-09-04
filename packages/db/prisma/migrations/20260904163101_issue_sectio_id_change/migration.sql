-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_sectionId_fkey";

-- AlterTable
ALTER TABLE "Issue" ALTER COLUMN "sectionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE SET NULL ON UPDATE CASCADE;
