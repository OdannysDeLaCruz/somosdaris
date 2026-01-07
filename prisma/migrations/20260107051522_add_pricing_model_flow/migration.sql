-- CreateEnum
CREATE TYPE "PricingModel" AS ENUM ('PACKAGE_BASED', 'FORMULA_BASED', 'ITEM_BASED');

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_packageId_fkey";

-- AlterTable
ALTER TABLE "reservations" ADD COLUMN     "finalPrice" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "pricingData" JSONB,
ADD COLUMN     "pricingOptionId" TEXT,
ALTER COLUMN "packageId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "pricingModel" "PricingModel" NOT NULL DEFAULT 'PACKAGE_BASED';

-- CreateTable
CREATE TABLE "pricing_options" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "basePrice" DECIMAL(10,2) NOT NULL,
    "metadata" JSONB,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pricing_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formula_variables" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "options" JSONB,
    "minValue" INTEGER,
    "maxValue" INTEGER,
    "defaultValue" TEXT,
    "multiplier" DECIMAL(10,2),
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "formula_variables_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pricing_options_serviceId_isActive_idx" ON "pricing_options"("serviceId", "isActive");

-- CreateIndex
CREATE INDEX "formula_variables_serviceId_idx" ON "formula_variables"("serviceId");

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_pricingOptionId_fkey" FOREIGN KEY ("pricingOptionId") REFERENCES "pricing_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pricing_options" ADD CONSTRAINT "pricing_options_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formula_variables" ADD CONSTRAINT "formula_variables_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
