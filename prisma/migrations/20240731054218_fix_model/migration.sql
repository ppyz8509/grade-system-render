/*
  Warnings:

  - You are about to drop the `StudentInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentPlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_groupId_fkey";

-- DropForeignKey
ALTER TABLE "StudentInfo" DROP CONSTRAINT "StudentInfo_studentsId_fkey";

-- DropForeignKey
ALTER TABLE "StudentPlan" DROP CONSTRAINT "StudentPlan_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "StudentPlan" DROP CONSTRAINT "StudentPlan_courseId_fkey";

-- DropForeignKey
ALTER TABLE "StudentPlan" DROP CONSTRAINT "StudentPlan_groupId_fkey";

-- DropForeignKey
ALTER TABLE "StudentPlan" DROP CONSTRAINT "StudentPlan_studentsId_fkey";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "categoryId" INTEGER NOT NULL,
ALTER COLUMN "groupId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "parentGroupId" INTEGER;

-- DropTable
DROP TABLE "StudentInfo";

-- DropTable
DROP TABLE "StudentPlan";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Admin" (
    "Admin_id" SERIAL NOT NULL,
    "A_fristname" TEXT NOT NULL,
    "A_lastname" TEXT NOT NULL,
    "A_username" TEXT NOT NULL,
    "A_password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "A_phone" INTEGER,
    "A_email" TEXT,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("Admin_id")
);

-- CreateTable
CREATE TABLE "COURSE_INSTRUCTOR" (
    "C_id" SERIAL NOT NULL,
    "C_fristname" TEXT NOT NULL,
    "C_lastname" TEXT NOT NULL,
    "C_username" TEXT NOT NULL,
    "C_password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'COURSE_INSTRUCTOR',
    "C_phone" INTEGER,
    "C_email" TEXT,

    CONSTRAINT "COURSE_INSTRUCTOR_pkey" PRIMARY KEY ("C_id")
);

-- CreateTable
CREATE TABLE "Student" (
    "S_id" INTEGER NOT NULL,
    "S_fristname" TEXT NOT NULL,
    "S_lastname" TEXT NOT NULL,
    "S_username" TEXT NOT NULL,
    "S_password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "S_phone" INTEGER,
    "S_email" TEXT,
    "room" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("S_id","S_username")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "T_id" SERIAL NOT NULL,
    "T_fristname" TEXT NOT NULL,
    "T_lastname" TEXT NOT NULL,
    "T_username" TEXT NOT NULL,
    "T_password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADVISOR',
    "T_phone" INTEGER,
    "T_email" TEXT,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("T_id","T_fristname","T_lastname")
);

-- CreateTable
CREATE TABLE "Classroom" (
    "roomname" TEXT NOT NULL,

    CONSTRAINT "Classroom_pkey" PRIMARY KEY ("roomname")
);

-- CreateTable
CREATE TABLE "Advisor" (
    "Advisor_id" SERIAL NOT NULL,
    "advisorId" INTEGER NOT NULL,
    "advisorfristName" TEXT NOT NULL,
    "advisorlastName" TEXT NOT NULL,
    "roomName" TEXT NOT NULL,

    CONSTRAINT "Advisor_pkey" PRIMARY KEY ("Advisor_id")
);

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_room_fkey" FOREIGN KEY ("room") REFERENCES "Classroom"("roomname") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Advisor" ADD CONSTRAINT "Advisor_advisorId_advisorfristName_advisorlastName_fkey" FOREIGN KEY ("advisorId", "advisorfristName", "advisorlastName") REFERENCES "Teacher"("T_id", "T_fristname", "T_lastname") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Advisor" ADD CONSTRAINT "Advisor_roomName_fkey" FOREIGN KEY ("roomName") REFERENCES "Classroom"("roomname") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_parentGroupId_fkey" FOREIGN KEY ("parentGroupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
