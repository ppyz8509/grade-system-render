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
    "studentPlanName" TEXT NOT NULL,
    "studentPlanYear" TEXT NOT NULL,
    "studentsId" INTEGER,
    "categoryId" INTEGER,
    "categoryName" TEXT,
    "groupId" INTEGER,
    "groupName" TEXT,
    "courseId" INTEGER,
    "courseName" TEXT,

    CONSTRAINT "StudentPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Major" (
    "id" SERIAL NOT NULL,
    "majorNameTH" TEXT NOT NULL,
    "majorNameENG" TEXT NOT NULL,
    "majorYear" TEXT NOT NULL,
    "majorUnit" TEXT NOT NULL,
    "majorStatus" TEXT NOT NULL,
    "majorCode" TEXT NOT NULL,
    "majorSupervisor" TEXT NOT NULL,

    CONSTRAINT "Major_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "categoryName" TEXT NOT NULL,
    "categoryUnit" TEXT NOT NULL,
    "majorId" INTEGER NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "groupName" TEXT NOT NULL,
    "groupUnit" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "courseCode" TEXT NOT NULL,
    "courseNameTH" TEXT NOT NULL,
    "courseNameENG" TEXT NOT NULL,
    "courseYear" TEXT NOT NULL,
    "courseUnit" INTEGER NOT NULL,
    "majorId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "StudentInfo_studentsId_key" ON "StudentInfo"("studentsId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentPlan_studentsId_key" ON "StudentPlan"("studentsId");

-- AddForeignKey
ALTER TABLE "StudentInfo" ADD CONSTRAINT "StudentInfo_studentsId_fkey" FOREIGN KEY ("studentsId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentPlan" ADD CONSTRAINT "StudentPlan_studentsId_fkey" FOREIGN KEY ("studentsId") REFERENCES "StudentInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentPlan" ADD CONSTRAINT "StudentPlan_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentPlan" ADD CONSTRAINT "StudentPlan_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentPlan" ADD CONSTRAINT "StudentPlan_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "Major"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "Major"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
