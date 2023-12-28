/*
  Warnings:

  - A unique constraint covering the columns `[studentId]` on the table `resume` will be added. If there are existing duplicate values, this will fail.
  - Made the column `studentId` on table `resume` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "resume" ALTER COLUMN "studentId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "resume_studentId_key" ON "resume"("studentId");
