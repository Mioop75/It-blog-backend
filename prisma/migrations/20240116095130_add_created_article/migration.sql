/*
  Warnings:

  - The values [Seller] on the enum `Role_Names` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_Names_new" AS ENUM ('Admin', 'User');
ALTER TABLE "Role" ALTER COLUMN "name" TYPE "Role_Names_new" USING ("name"::text::"Role_Names_new");
ALTER TYPE "Role_Names" RENAME TO "Role_Names_old";
ALTER TYPE "Role_Names_new" RENAME TO "Role_Names";
DROP TYPE "Role_Names_old";
COMMIT;

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
