-- CreateTable
CREATE TABLE "Professor" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "phone" VARCHAR,
    "courseId" INTEGER NOT NULL,
    "imageUrl" VARCHAR,

    CONSTRAINT "Professor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Professor_email_key" ON "Professor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Professor_phone_key" ON "Professor"("phone");

-- AddForeignKey
ALTER TABLE "Professor" ADD CONSTRAINT "Professor_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
