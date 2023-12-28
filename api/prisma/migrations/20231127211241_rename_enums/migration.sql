/*
  Warnings:

  - The values [Ensino Médio,Ensino Técnico,Pós-Graduação] on the enum `EducationDegreeEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [Básico,Intermediário,Avançado] on the enum `LanguageLevelEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [Básico,Intermediário,Avançado] on the enum `SkillLevelEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EducationDegreeEnum_new" AS ENUM ('Ensino Medio', 'Ensino Tecnico', 'Ensino Superior', 'Pos-Graduação');
ALTER TABLE "education" ALTER COLUMN "degree" DROP DEFAULT;
ALTER TABLE "education" ALTER COLUMN "degree" TYPE "EducationDegreeEnum_new" USING ("degree"::text::"EducationDegreeEnum_new");
ALTER TYPE "EducationDegreeEnum" RENAME TO "EducationDegreeEnum_old";
ALTER TYPE "EducationDegreeEnum_new" RENAME TO "EducationDegreeEnum";
DROP TYPE "EducationDegreeEnum_old";
ALTER TABLE "education" ALTER COLUMN "degree" SET DEFAULT 'Ensino Medio';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "LanguageLevelEnum_new" AS ENUM ('Basico', 'Intermediario', 'Avancado', 'Fluente');
ALTER TABLE "language" ALTER COLUMN "level" DROP DEFAULT;
ALTER TABLE "language" ALTER COLUMN "level" TYPE "LanguageLevelEnum_new" USING ("level"::text::"LanguageLevelEnum_new");
ALTER TYPE "LanguageLevelEnum" RENAME TO "LanguageLevelEnum_old";
ALTER TYPE "LanguageLevelEnum_new" RENAME TO "LanguageLevelEnum";
DROP TYPE "LanguageLevelEnum_old";
ALTER TABLE "language" ALTER COLUMN "level" SET DEFAULT 'Basico';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "SkillLevelEnum_new" AS ENUM ('Basico', 'Intermediario', 'Avancado');
ALTER TABLE "skill" ALTER COLUMN "level" DROP DEFAULT;
ALTER TABLE "skill" ALTER COLUMN "level" TYPE "SkillLevelEnum_new" USING ("level"::text::"SkillLevelEnum_new");
ALTER TYPE "SkillLevelEnum" RENAME TO "SkillLevelEnum_old";
ALTER TYPE "SkillLevelEnum_new" RENAME TO "SkillLevelEnum";
DROP TYPE "SkillLevelEnum_old";
ALTER TABLE "skill" ALTER COLUMN "level" SET DEFAULT 'Basico';
COMMIT;

-- AlterTable
ALTER TABLE "education" ALTER COLUMN "degree" SET DEFAULT 'Ensino Medio';

-- AlterTable
ALTER TABLE "language" ALTER COLUMN "level" SET DEFAULT 'Basico';

-- AlterTable
ALTER TABLE "skill" ALTER COLUMN "level" SET DEFAULT 'Basico';
