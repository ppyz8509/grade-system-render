-- CreateTable
CREATE TABLE "Studentinfo" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "Studentinfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClassToStudentinfo" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Studentinfo_studentId_key" ON "Studentinfo"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "_ClassToStudentinfo_AB_unique" ON "_ClassToStudentinfo"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassToStudentinfo_B_index" ON "_ClassToStudentinfo"("B");

-- AddForeignKey
ALTER TABLE "Studentinfo" ADD CONSTRAINT "Studentinfo_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToStudentinfo" ADD CONSTRAINT "_ClassToStudentinfo_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToStudentinfo" ADD CONSTRAINT "_ClassToStudentinfo_B_fkey" FOREIGN KEY ("B") REFERENCES "Studentinfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
