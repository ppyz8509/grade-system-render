-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STUDENT', 'ADVISOR', 'COURSE_INSTRUCTOR');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentInfo" (
    "id" SERIAL NOT NULL,
    "studentsId" INTEGER NOT NULL,
    "studentIdcard" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "room" INTEGER NOT NULL,

    CONSTRAINT "StudentInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentPlan" (
    "id" SERIAL NOT NULL,
    "studentsId" INTEGER NOT NULL,

    CONSTRAINT "StudentPlan_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "StudentInfo_studentsId_key" ON "StudentInfo"("studentsId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentPlan_studentsId_key" ON "StudentPlan"("studentsId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseInstructor_username_key" ON "CourseInstructor"("username");

-- AddForeignKey
ALTER TABLE "StudentInfo" ADD CONSTRAINT "StudentInfo_studentsId_fkey" FOREIGN KEY ("studentsId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentPlan" ADD CONSTRAINT "StudentPlan_studentsId_fkey" FOREIGN KEY ("studentsId") REFERENCES "StudentInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_responsibleInstructorId_fkey" FOREIGN KEY ("responsibleInstructorId") REFERENCES "CourseInstructor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
