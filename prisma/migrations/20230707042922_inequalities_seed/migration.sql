/*
  Warnings:

  - You are about to drop the column `sign` on the `v_inequalities_example` table. All the data in the column will be lost.
  - Added the required column `signCase` to the `v_inequalities_example` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "v_inequalities_example" DROP COLUMN "sign",
ADD COLUMN     "signCase" INTEGER NOT NULL;
