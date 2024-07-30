/*
  Warnings:

  - You are about to drop the `StudentPlan` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_groupId_fkey";

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

-- DropTable
DROP TABLE "StudentPlan";

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
