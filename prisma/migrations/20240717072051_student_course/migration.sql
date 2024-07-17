/*
  Warnings:

  - You are about to drop the column `category` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `creditUnits` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `creditUnitsCategory` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `groupCourseEnglish` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `groupCourseThai` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `mandatorySubjects` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `nameEnglish` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `nameThai` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `responsibleInstructorId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `semester` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the `CourseInstructor` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[majorId]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[categoryId]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[groupId]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[courseId]` on the table `StudentPlan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseCode` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseNameENG` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseNameTH` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseUnit` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseYear` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupId` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `majorId` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseId` to the `StudentPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentPlanName` to the `StudentPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentPlanYear` to the `StudentPlan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_responsibleInstructorId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "category",
DROP COLUMN "creditUnits",
DROP COLUMN "creditUnitsCategory",
DROP COLUMN "groupCourseEnglish",
DROP COLUMN "groupCourseThai",
DROP COLUMN "mandatorySubjects",
DROP COLUMN "nameEnglish",
DROP COLUMN "nameThai",
DROP COLUMN "responsibleInstructorId",
DROP COLUMN "semester",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "courseCode" TEXT NOT NULL,
ADD COLUMN     "courseNameENG" TEXT NOT NULL,
ADD COLUMN     "courseNameTH" TEXT NOT NULL,
ADD COLUMN     "courseUnit" INTEGER NOT NULL,
ADD COLUMN     "courseYear" TEXT NOT NULL,
ADD COLUMN     "groupId" INTEGER NOT NULL,
ADD COLUMN     "majorId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "StudentPlan" ADD COLUMN     "courseId" INTEGER NOT NULL,
ADD COLUMN     "studentPlanName" TEXT NOT NULL,
ADD COLUMN     "studentPlanYear" TEXT NOT NULL;

-- DropTable
DROP TABLE "CourseInstructor";

-- CreateTable
CREATE TABLE "Major" (
    "id" SERIAL NOT NULL,
    "major" TEXT NOT NULL,
    "majorNameTH" TEXT NOT NULL,
    "majorNameENG" TEXT NOT NULL,
    "majorYear" TEXT NOT NULL,
    "majorUnit" TEXT NOT NULL,
    "majorStatus" TEXT NOT NULL,
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
    "majorId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_majorId_key" ON "Category"("majorId");

-- CreateIndex
CREATE UNIQUE INDEX "Group_majorId_key" ON "Group"("majorId");

-- CreateIndex
CREATE UNIQUE INDEX "Group_categoryId_key" ON "Group"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_majorId_key" ON "Course"("majorId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_categoryId_key" ON "Course"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_groupId_key" ON "Course"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentPlan_courseId_key" ON "StudentPlan"("courseId");

-- AddForeignKey
ALTER TABLE "StudentPlan" ADD CONSTRAINT "StudentPlan_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "Major"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "Major"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "Major"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
