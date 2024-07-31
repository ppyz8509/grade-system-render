/*
  Warnings:

  - You are about to drop the `StudentInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentPlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
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
    "S_id" TEXT NOT NULL,
    "S_firstname" TEXT NOT NULL,
    "S_lastname" TEXT NOT NULL,
    "S_password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "S_phone" TEXT,
    "S_email" TEXT,
    "room" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("S_id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "T_id" SERIAL NOT NULL,
    "T_firstname" TEXT NOT NULL,
    "T_lastname" TEXT NOT NULL,
    "T_username" TEXT NOT NULL,
    "T_password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADVISOR',
    "T_phone" INTEGER,
    "T_email" TEXT,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("T_id","T_firstname","T_lastname")
);

-- CreateTable
CREATE TABLE "Classroom" (
    "roomname" TEXT NOT NULL,

    CONSTRAINT "Classroom_pkey" PRIMARY KEY ("roomname")
);

-- CreateTable
CREATE TABLE "Advisor" (
    "Advisor_id" SERIAL NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "teacherfirstName" TEXT NOT NULL,
    "teacherlastName" TEXT NOT NULL,
    "roomName" TEXT NOT NULL,

    CONSTRAINT "Advisor_pkey" PRIMARY KEY ("Advisor_id")
);

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_room_fkey" FOREIGN KEY ("room") REFERENCES "Classroom"("roomname") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Advisor" ADD CONSTRAINT "Advisor_teacherId_teacherfirstName_teacherlastName_fkey" FOREIGN KEY ("teacherId", "teacherfirstName", "teacherlastName") REFERENCES "Teacher"("T_id", "T_firstname", "T_lastname") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Advisor" ADD CONSTRAINT "Advisor_roomName_fkey" FOREIGN KEY ("roomName") REFERENCES "Classroom"("roomname") ON DELETE RESTRICT ON UPDATE CASCADE;
