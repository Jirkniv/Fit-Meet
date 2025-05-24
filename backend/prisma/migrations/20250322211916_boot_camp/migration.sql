/*
  Warnings:

  - Made the column `scheduledDate` on table `Activities` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Activities" ALTER COLUMN "scheduledDate" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
