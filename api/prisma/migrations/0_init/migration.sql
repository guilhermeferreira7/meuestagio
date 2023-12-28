-- CreateEnum
CREATE TYPE "education_degree_enum" AS ENUM ('Ensino Médio', 'Ensino Técnico', 'Ensino Superior', 'Pós-Graduação');

-- CreateEnum
CREATE TYPE "job_application_status_enum" AS ENUM ('Em andamento', 'Entrevista', 'Finalizado');

-- CreateEnum
CREATE TYPE "job_status_enum" AS ENUM ('open', 'closed');

-- CreateEnum
CREATE TYPE "language_level_enum" AS ENUM ('Básico', 'Intermediário', 'Avançado', 'Fluente');

-- CreateEnum
CREATE TYPE "skill_level_enum" AS ENUM ('Básico', 'Intermediário', 'Avançado');

-- CreateTable
CREATE TABLE "area" (
    "id" SERIAL NOT NULL,
    "cnpqId" INTEGER NOT NULL,
    "title" VARCHAR NOT NULL,

    CONSTRAINT "PK_39d5e4de490139d6535d75f42ff" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "city" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "state" VARCHAR NOT NULL,
    "regionId" INTEGER NOT NULL,
    "IBGECityCode" INTEGER NOT NULL,

    CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "phone" VARCHAR,
    "emailVerified" BOOLEAN,
    "phoneVerified" BOOLEAN,
    "cityId" INTEGER,
    "cnpj" VARCHAR,
    "imageUrl" VARCHAR,

    CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "institutionId" INTEGER NOT NULL,
    "areaId" INTEGER NOT NULL,

    CONSTRAINT "PK_bf95180dd756fd204fb01ce4916" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education" (
    "id" SERIAL NOT NULL,
    "school" VARCHAR NOT NULL,
    "degree" "education_degree_enum" NOT NULL DEFAULT 'Ensino Médio',
    "fieldOfStudy" VARCHAR NOT NULL,
    "startDate" VARCHAR NOT NULL,
    "endDate" VARCHAR NOT NULL,
    "resumeId" INTEGER NOT NULL,

    CONSTRAINT "PK_bf3d38701b3030a8ad634d43bd6" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experience" (
    "id" SERIAL NOT NULL,
    "company" VARCHAR NOT NULL,
    "position" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "startDate" TIMESTAMP(6) NOT NULL,
    "endDate" VARCHAR NOT NULL,
    "currentJob" BOOLEAN NOT NULL,
    "resumeId" INTEGER NOT NULL,

    CONSTRAINT "PK_5e8d5a534100e1b17ee2efa429a" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institution" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "cityId" INTEGER NOT NULL,

    CONSTRAINT "PK_f60ee4ff0719b7df54830b39087" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job" (
    "id" SERIAL NOT NULL,
    "status" "job_status_enum" NOT NULL DEFAULT 'open',
    "title" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "salary" INTEGER,
    "cityId" INTEGER NOT NULL,
    "regionId" INTEGER NOT NULL,
    "state" VARCHAR NOT NULL,
    "remote" BOOLEAN NOT NULL DEFAULT false,
    "companyId" INTEGER NOT NULL,
    "keywords" VARCHAR NOT NULL,
    "areaId" INTEGER NOT NULL,

    CONSTRAINT "PK_98ab1c14ff8d1cf80d18703b92f" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_application" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "message" VARCHAR,
    "resumeId" INTEGER NOT NULL,
    "jobId" INTEGER NOT NULL,
    "status" "job_application_status_enum" NOT NULL DEFAULT 'Em andamento',

    CONSTRAINT "PK_c0b8f6b6341802967369b5d70f5" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "language" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "level" "language_level_enum" NOT NULL DEFAULT 'Básico',
    "resumeId" INTEGER NOT NULL,

    CONSTRAINT "PK_cc0a99e710eb3733f6fb42b1d4c" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "region" (
    "id" SERIAL NOT NULL,
    "IBGECode" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,
    "state" VARCHAR NOT NULL,

    CONSTRAINT "PK_5f48ffc3af96bc486f5f3f3a6da" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER,

    CONSTRAINT "PK_7ff05ea7599e13fac01ac812e48" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "level" "skill_level_enum" NOT NULL DEFAULT 'Básico',
    "resumeId" INTEGER NOT NULL,

    CONSTRAINT "PK_a0d33334424e64fb78dc3ce7196" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "phone" VARCHAR,
    "emailVerified" BOOLEAN,
    "phoneVerified" BOOLEAN,
    "cityId" INTEGER,
    "about" VARCHAR,
    "institutionId" INTEGER,
    "courseId" INTEGER,
    "resumeId" INTEGER,
    "imageUrl" VARCHAR,

    CONSTRAINT "PK_3d8016e1cb58429474a3c041904" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "phone" VARCHAR,
    "emailVerified" BOOLEAN,
    "phoneVerified" BOOLEAN,
    "cityId" INTEGER,
    "imageUrl" VARCHAR,

    CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UQ_f794f0ecffbb32ce35789ef25f0" ON "area"("cnpqId");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_b0fc567cf51b1cf717a9e8046a1" ON "company"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_e53ef0697f9d5d933fa075be1c3" ON "company"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_b55d9c6e6adfa3c6de735c5a2eb" ON "company"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_d218ad3566afa9e396f184fd7d5" ON "institution"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_202c13e0659a61976a78003c8a7" ON "region"("IBGECode");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_0f49a593960360f6f85b692aca8" ON "skill"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_a56c051c91dbe1068ad683f536e" ON "student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_bdd296b786640a32e5b7b0966b5" ON "student"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "REL_43fa98877aae7cb691a3ab1dc1" ON "student"("resumeId");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_e12875dfb3b1d92d7d7c5377e22" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_8e1f623798118e629b46a9e6299" ON "user"("phone");

-- AddForeignKey
ALTER TABLE "city" ADD CONSTRAINT "FK_a702dde63cef536819298d776b5" FOREIGN KEY ("regionId") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "company" ADD CONSTRAINT "FK_d37b1b0cc9656c160b5464ac4f3" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "FK_8fa9f33441d0e7cb28c5d934bc4" FOREIGN KEY ("institutionId") REFERENCES "institution"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "FK_d43d51e738645bda6c1afca405b" FOREIGN KEY ("areaId") REFERENCES "area"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "education" ADD CONSTRAINT "FK_0f65a811d17b239cbcd6afdcc58" FOREIGN KEY ("resumeId") REFERENCES "resume"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "experience" ADD CONSTRAINT "FK_9bfd4060e7f71a77c6b82b1745b" FOREIGN KEY ("resumeId") REFERENCES "resume"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "institution" ADD CONSTRAINT "FK_e5a41c16e4f91031eead1c9ce02" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "FK_5f511592fb74953c5756705aa9c" FOREIGN KEY ("areaId") REFERENCES "area"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "FK_900c4db1616cff0cecefa427a9b" FOREIGN KEY ("regionId") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "FK_cb7d0a23f9c31ad2f9e213d89b5" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "FK_e66170573cabd565dab1132727d" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "job_application" ADD CONSTRAINT "FK_2489e8c185ca6249e02460be5dd" FOREIGN KEY ("resumeId") REFERENCES "resume"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "job_application" ADD CONSTRAINT "FK_941485e9ff0e23eca1263bfd24d" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "job_application" ADD CONSTRAINT "FK_d0452612ad9cb0e20f6f320ebc0" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "language" ADD CONSTRAINT "FK_d461521e55cf56e648410b218b3" FOREIGN KEY ("resumeId") REFERENCES "resume"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "skill" ADD CONSTRAINT "FK_fa2b5ae9b6fd6021d111c823aca" FOREIGN KEY ("resumeId") REFERENCES "resume"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "FK_0c67f4cf7cf70a1fb68110b8339" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "FK_1829558ab114be65a7aa1dc950b" FOREIGN KEY ("institutionId") REFERENCES "institution"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "FK_43fa98877aae7cb691a3ab1dc1b" FOREIGN KEY ("resumeId") REFERENCES "resume"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "FK_a29d066e554ba135f0d9408c1b3" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "FK_beb5846554bec348f6baf449e83" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

