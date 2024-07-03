-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STUDENT', 'ADVISOR', 'COURSE_INSTRUCTOR');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "year" INTEGER,
    "room" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseInstructor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "CourseInstructor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "nameThai" TEXT NOT NULL,
    "nameEnglish" TEXT NOT NULL,
    "creditUnits" INTEGER NOT NULL,
    "responsibleInstructorId" INTEGER,
    "category" TEXT NOT NULL,
    "creditUnitsCategory" INTEGER NOT NULL,
    "groupCourseThai" TEXT NOT NULL,
    "groupCourseEnglish" TEXT NOT NULL,
    "semester" TEXT NOT NULL,
    "mandatorySubjects" TEXT[],

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "CourseInstructor_username_key" ON "CourseInstructor"("username");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_responsibleInstructorId_fkey" FOREIGN KEY ("responsibleInstructorId") REFERENCES "CourseInstructor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
