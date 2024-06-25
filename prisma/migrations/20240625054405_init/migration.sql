/*
  Warnings:

  - The values [USER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `CourseEnrollment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'STUDENT', 'ADVISOR', 'COURSE_INSTRUCTOR');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'STUDENT';
COMMIT;

-- DropForeignKey
ALTER TABLE "CourseEnrollment" DROP CONSTRAINT "CourseEnrollment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseEnrollment" DROP CONSTRAINT "CourseEnrollment_studentId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'STUDENT';

-- DropTable
DROP TABLE "CourseEnrollment";
