/*
  Warnings:

  - A unique constraint covering the columns `[IBGECityCode]` on the table `city` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "city_IBGECityCode_key" ON "city"("IBGECityCode");
