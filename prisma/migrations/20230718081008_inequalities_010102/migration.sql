-- CreateTable
CREATE TABLE "v_inequalities_010102" (
    "id" TEXT NOT NULL,
    "b" INTEGER NOT NULL,
    "c" INTEGER NOT NULL,
    "d" INTEGER NOT NULL,
    "e" INTEGER NOT NULL,
    "signCase" INTEGER NOT NULL,
    "idx" INTEGER NOT NULL,
    "checked" BOOLEAN NOT NULL DEFAULT false,
    "flagged" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "v_inequalities_010102_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "v_inequalities_010102_idx_key" ON "v_inequalities_010102"("idx");
