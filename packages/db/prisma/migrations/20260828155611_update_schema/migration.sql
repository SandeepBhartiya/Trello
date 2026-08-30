/*
  Warnings:

  - The primary key for the `Board` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Board` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Comment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Issue` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Issue` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `IssuesMapping` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `IssuesMapping` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Membership` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Membership` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Org` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Org` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Section` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Section` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[userId,issueId]` on the table `IssuesMapping` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,orgId]` on the table `Membership` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `organizationId` on the `Board` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `issueId` on the `Comment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `Comment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `orgId` on the `Invite` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `boardId` on the `Issue` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `sectionId` on the `Issue` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `IssuesMapping` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `issueId` on the `IssuesMapping` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `Membership` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `orgId` on the `Membership` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `boardId` on the `Section` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Board" DROP CONSTRAINT "Board_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_issueId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_orgId_fkey";

-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_boardId_fkey";

-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "IssuesMapping" DROP CONSTRAINT "IssuesMapping_issueId_fkey";

-- DropForeignKey
ALTER TABLE "IssuesMapping" DROP CONSTRAINT "IssuesMapping_userId_fkey";

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_orgId_fkey";

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_userId_fkey";

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_boardId_fkey";

-- AlterTable
ALTER TABLE "Board" DROP CONSTRAINT "Board_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "organizationId",
ADD COLUMN     "organizationId" INTEGER NOT NULL,
ADD CONSTRAINT "Board_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "issueId",
ADD COLUMN     "issueId" INTEGER NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "Comment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Invite" DROP COLUMN "orgId",
ADD COLUMN     "orgId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "boardId",
ADD COLUMN     "boardId" INTEGER NOT NULL,
DROP COLUMN "sectionId",
ADD COLUMN     "sectionId" INTEGER NOT NULL,
ADD CONSTRAINT "Issue_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "IssuesMapping" DROP CONSTRAINT "IssuesMapping_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "issueId",
ADD COLUMN     "issueId" INTEGER NOT NULL,
ADD CONSTRAINT "IssuesMapping_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "orgId",
ADD COLUMN     "orgId" INTEGER NOT NULL,
ADD CONSTRAINT "Membership_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Org" DROP CONSTRAINT "Org_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Org_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Section" DROP CONSTRAINT "Section_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "boardId",
ADD COLUMN     "boardId" INTEGER NOT NULL,
ADD CONSTRAINT "Section_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Invite_email_orgId_key" ON "Invite"("email", "orgId");

-- CreateIndex
CREATE UNIQUE INDEX "IssuesMapping_userId_issueId_key" ON "IssuesMapping"("userId", "issueId");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_orgId_key" ON "Membership"("userId", "orgId");

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Org"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssuesMapping" ADD CONSTRAINT "IssuesMapping_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssuesMapping" ADD CONSTRAINT "IssuesMapping_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
