/*
  Warnings:

  - You are about to drop the column `advisorId` on the `Advisor` table. All the data in the column will be lost.
  - You are about to drop the column `advisorfristName` on the `Advisor` table. All the data in the column will be lost.
  - You are about to drop the column `advisorlastName` on the `Advisor` table. All the data in the column will be lost.
  - Added the required column `teacherId` to the `Advisor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherfristName` to the `Advisor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherlastName` to the `Advisor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Advisor" DROP CONSTRAINT "Advisor_advisorId_advisorfristName_advisorlastName_fkey";

-- AlterTable
ALTER TABLE "Advisor" DROP COLUMN "advisorId",
DROP COLUMN "advisorfristName",
DROP COLUMN "advisorlastName",
ADD COLUMN     "teacherId" INTEGER NOT NULL,
ADD COLUMN     "teacherfristName" TEXT NOT NULL,
ADD COLUMN     "teacherlastName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Advisor" ADD CONSTRAINT "Advisor_teacherId_teacherfristName_teacherlastName_fkey" FOREIGN KEY ("teacherId", "teacherfristName", "teacherlastName") REFERENCES "Teacher"("T_id", "T_fristname", "T_lastname") ON DELETE RESTRICT ON UPDATE CASCADE;
