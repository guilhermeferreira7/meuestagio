/*
  Warnings:

  - The values [Ensino Medio,Ensino Tecnico,Ensino Superior,Pos-Graduação] on the enum `EducationDegreeEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [Em andamento] on the enum `JobApplicationStatusEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EducationDegreeEnum_new" AS ENUM ('EnsinoMedio', 'EnsinoTecnico', 'EnsinoSuperior', 'PosGraduacao');
ALTER TABLE "education" ALTER COLUMN "degree" DROP DEFAULT;
ALTER TABLE "education" ALTER COLUMN "degree" TYPE "EducationDegreeEnum_new" USING ("degree"::text::"EducationDegreeEnum_new");
ALTER TYPE "EducationDegreeEnum" RENAME TO "EducationDegreeEnum_old";
ALTER TYPE "EducationDegreeEnum_new" RENAME TO "EducationDegreeEnum";
DROP TYPE "EducationDegreeEnum_old";
ALTER TABLE "education" ALTER COLUMN "degree" SET DEFAULT 'EnsinoMedio';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "JobApplicationStatusEnum_new" AS ENUM ('EmAndamento', 'Entrevista', 'Finalizado');
ALTER TABLE "job_application" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "job_application" ALTER COLUMN "status" TYPE "JobApplicationStatusEnum_new" USING ("status"::text::"JobApplicationStatusEnum_new");
ALTER TYPE "JobApplicationStatusEnum" RENAME TO "JobApplicationStatusEnum_old";
ALTER TYPE "JobApplicationStatusEnum_new" RENAME TO "JobApplicationStatusEnum";
DROP TYPE "JobApplicationStatusEnum_old";
ALTER TABLE "job_application" ALTER COLUMN "status" SET DEFAULT 'EmAndamento';
COMMIT;

-- AlterTable
ALTER TABLE "education" ALTER COLUMN "degree" SET DEFAULT 'EnsinoMedio';

-- AlterTable
ALTER TABLE "job_application" ALTER COLUMN "status" SET DEFAULT 'EmAndamento';
