-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "parentGroupId" INTEGER;

-- CreateTable
CREATE TABLE "StudentPlan" (
    "id" SERIAL NOT NULL,
    "studentPlanName" TEXT NOT NULL,
    "studentPlanYear" TEXT NOT NULL,
    "studentsId" INTEGER,
    "categoryId" INTEGER,
    "categoryName" TEXT,
    "groupId" INTEGER,
    "groupName" TEXT,
    "courseId" INTEGER,
    "courseName" TEXT,

    CONSTRAINT "StudentPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentPlan_studentsId_key" ON "StudentPlan"("studentsId");

-- AddForeignKey
ALTER TABLE "StudentPlan" ADD CONSTRAINT "StudentPlan_studentsId_fkey" FOREIGN KEY ("studentsId") REFERENCES "StudentInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentPlan" ADD CONSTRAINT "StudentPlan_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentPlan" ADD CONSTRAINT "StudentPlan_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentPlan" ADD CONSTRAINT "StudentPlan_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_parentGroupId_fkey" FOREIGN KEY ("parentGroupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
