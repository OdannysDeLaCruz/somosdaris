-- AlterTable
ALTER TABLE "reservations" ADD COLUMN     "allyId" TEXT;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_allyId_fkey" FOREIGN KEY ("allyId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
