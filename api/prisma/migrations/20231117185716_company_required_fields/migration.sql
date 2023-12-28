/*
  Warnings:

  - Made the column `cityId` on table `company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cnpj` on table `company` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "company" ALTER COLUMN "cityId" SET NOT NULL,
ALTER COLUMN "cnpj" SET NOT NULL;
