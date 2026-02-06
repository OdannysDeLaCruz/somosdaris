-- AlterEnum
ALTER TYPE "ReservationStatus" ADD VALUE 'in_progress';

-- AlterTable
ALTER TABLE "users" ADD COLUMN "identificationNumber" TEXT;