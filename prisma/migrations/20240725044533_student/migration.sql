/*
  Warnings:

  - You are about to drop the column `courseId` on the `StudentPlan` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudentPlan" DROP CONSTRAINT "StudentPlan_courseId_fkey";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "studentPlanId" INTEGER;

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "studentPlanId" INTEGER;

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "studentPlanId" INTEGER;

-- AlterTable
ALTER TABLE "StudentPlan" DROP COLUMN "courseId";

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_studentPlanId_fkey" FOREIGN KEY ("studentPlanId") REFERENCES "StudentPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_studentPlanId_fkey" FOREIGN KEY ("studentPlanId") REFERENCES "StudentPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_studentPlanId_fkey" FOREIGN KEY ("studentPlanId") REFERENCES "StudentPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
