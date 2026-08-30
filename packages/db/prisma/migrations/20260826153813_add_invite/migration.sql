-- CreateTable
CREATE TABLE "Invite" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "invitedBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invite_email_orgId_key" ON "Invite"("email", "orgId");

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
