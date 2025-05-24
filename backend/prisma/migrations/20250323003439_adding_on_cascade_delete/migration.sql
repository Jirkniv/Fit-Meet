-- DropForeignKey
ALTER TABLE "ActivityAddresses" DROP CONSTRAINT "ActivityAddresses_activityId_fkey";

-- DropForeignKey
ALTER TABLE "ActivityParticipants" DROP CONSTRAINT "ActivityParticipants_activityId_fkey";

-- AddForeignKey
ALTER TABLE "ActivityAddresses" ADD CONSTRAINT "ActivityAddresses_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityParticipants" ADD CONSTRAINT "ActivityParticipants_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
