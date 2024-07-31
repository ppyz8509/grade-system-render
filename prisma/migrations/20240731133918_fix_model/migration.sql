-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STUDENT', 'ADVISOR', 'COURSE_INSTRUCTOR');

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
    "parentGroupId" INTEGER,

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
    "categoryId" INTEGER NOT NULL,
    "groupId" INTEGER,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_room_fkey" FOREIGN KEY ("room") REFERENCES "Classroom"("roomname") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Advisor" ADD CONSTRAINT "Advisor_teacherId_teacherfirstName_teacherlastName_fkey" FOREIGN KEY ("teacherId", "teacherfirstName", "teacherlastName") REFERENCES "Teacher"("T_id", "T_firstname", "T_lastname") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Advisor" ADD CONSTRAINT "Advisor_roomName_fkey" FOREIGN KEY ("roomName") REFERENCES "Classroom"("roomname") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "Major"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_parentGroupId_fkey" FOREIGN KEY ("parentGroupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "Major"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
