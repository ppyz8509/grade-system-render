/*
  Warnings:

  - You are about to drop the column `studentPlanId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `studentPlanId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `studentPlanId` on the `Group` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_studentPlanId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_studentPlanId_fkey";

-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_studentPlanId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "studentPlanId";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "studentPlanId";

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "studentPlanId";

-- AlterTable
ALTER TABLE "StudentPlan" ADD COLUMN     "categoryId" INTEGER,
ADD COLUMN     "courseId" INTEGER,
ADD COLUMN     "groupId" INTEGER;

-- AddForeignKey
ALTER TABLE "StudentPlan" ADD CONSTRAINT "StudentPlan_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentPlan" ADD CONSTRAINT "StudentPlan_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentPlan" ADD CONSTRAINT "StudentPlan_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
