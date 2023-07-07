/*
  Warnings:

  - You are about to drop the column `checked` on the `v2022p1q1` table. All the data in the column will be lost.
  - You are about to drop the column `flagged` on the `v2022p1q1` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idx]` on the table `v2022p1q1` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idx` to the `v2022p1q1` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "v2022p1q1" DROP COLUMN "checked",
DROP COLUMN "flagged",
ADD COLUMN     "idx" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "v_inequalities_example" (
    "id" TEXT NOT NULL,
    "a" INTEGER NOT NULL,
    "b" INTEGER NOT NULL,
    "c" INTEGER NOT NULL,
    "d" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    "sign" TEXT NOT NULL,
    "idx" INTEGER NOT NULL,

    CONSTRAINT "v_inequalities_example_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "v_inequalities_example_idx_key" ON "v_inequalities_example"("idx");

-- CreateIndex
CREATE UNIQUE INDEX "v2022p1q1_idx_key" ON "v2022p1q1"("idx");
