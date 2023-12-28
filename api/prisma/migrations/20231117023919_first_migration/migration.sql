/*
  Warnings:

  - The `degree` column on the `education` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `job` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `job_application` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `level` column on the `language` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `level` column on the `skill` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EducationDegreeEnum" AS ENUM ('Ensino Médio', 'Ensino Técnico', 'Ensino Superior', 'Pós-Graduação');

-- CreateEnum
CREATE TYPE "JobApplicationStatusEnum" AS ENUM ('Em andamento', 'Entrevista', 'Finalizado');

-- CreateEnum
CREATE TYPE "JobStatusEnum" AS ENUM ('open', 'closed');

-- CreateEnum
CREATE TYPE "LanguageLevelEnum" AS ENUM ('Básico', 'Intermediário', 'Avançado', 'Fluente');

-- CreateEnum
CREATE TYPE "SkillLevelEnum" AS ENUM ('Básico', 'Intermediário', 'Avançado');

-- AlterTable
ALTER TABLE "area" RENAME CONSTRAINT "PK_39d5e4de490139d6535d75f42ff" TO "area_pkey";

-- AlterTable
ALTER TABLE "education" DROP COLUMN "degree",
ADD COLUMN     "degree" "EducationDegreeEnum" NOT NULL DEFAULT 'Ensino Médio';

-- AlterTable
ALTER TABLE "job" DROP COLUMN "status",
ADD COLUMN     "status" "JobStatusEnum" NOT NULL DEFAULT 'open';

-- AlterTable
ALTER TABLE "job_application" DROP COLUMN "status",
ADD COLUMN     "status" "JobApplicationStatusEnum" NOT NULL DEFAULT 'Em andamento';

-- AlterTable
ALTER TABLE "language" DROP COLUMN "level",
ADD COLUMN     "level" "LanguageLevelEnum" NOT NULL DEFAULT 'Básico';

-- AlterTable
ALTER TABLE "skill" DROP COLUMN "level",
ADD COLUMN     "level" "SkillLevelEnum" NOT NULL DEFAULT 'Básico';

-- DropEnum
DROP TYPE "education_degree_enum";

-- DropEnum
DROP TYPE "job_application_status_enum";

-- DropEnum
DROP TYPE "job_status_enum";

-- DropEnum
DROP TYPE "language_level_enum";

-- DropEnum
DROP TYPE "skill_level_enum";

-- RenameIndex
ALTER INDEX "REL_43fa98877aae7cb691a3ab1dc1" RENAME TO "UQ_43fa98877aae7cb691a3ab1dc1b";
