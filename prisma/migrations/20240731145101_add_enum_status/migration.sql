/*
  Warnings:

  - You are about to drop the column `majorStatus` on the `Major` table. All the data in the column will be lost.
  - Added the required column `status` to the `Major` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Major" DROP COLUMN "majorStatus",
ADD COLUMN     "status" "Status" NOT NULL;
