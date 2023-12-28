/*
  Warnings:

  - Made the column `cityId` on table `student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `institutionId` on table `student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `courseId` on table `student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cityId` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "student" ALTER COLUMN "cityId" SET NOT NULL,
ALTER COLUMN "institutionId" SET NOT NULL,
ALTER COLUMN "courseId" SET NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "cityId" SET NOT NULL;
