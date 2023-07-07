-- AlterTable
ALTER TABLE "v_inequalities_example" ADD COLUMN     "checked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "flagged" BOOLEAN NOT NULL DEFAULT false;
