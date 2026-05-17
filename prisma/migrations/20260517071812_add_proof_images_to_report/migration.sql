-- AlterTable
ALTER TABLE "handyman_profiles" ADD COLUMN     "pausedUntil" TIMESTAMP(3),
ADD COLUMN     "warningCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "actionNote" TEXT,
ADD COLUMN     "proofImages" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "warnings" (
    "id" TEXT NOT NULL,
    "handymanId" TEXT NOT NULL,
    "adminId" TEXT,
    "reportId" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "warnings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "warnings" ADD CONSTRAINT "warnings_handymanId_fkey" FOREIGN KEY ("handymanId") REFERENCES "handyman_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warnings" ADD CONSTRAINT "warnings_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
