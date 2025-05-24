// src/components/activityModal/ActivityDetails.tsx
import React from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarRange, Lock, LockOpen } from "lucide-react";
import ParticipantFrame from "../../assets/images/participantsFrame.svg"


export interface ActivityDetailsProps {
  image: string;
  title: string;
  description: string;
  scheduledDate: string;
  private: boolean;
  participantCount: number;
}

const ActivityDetails: React.FC<ActivityDetailsProps> = ({
  image,
  title,
  description,
  scheduledDate,
  private: isPrivate,
  participantCount,
}) => {
  return (
    <div>
      <img  src={image} alt={title} className="min-md:w-[384px] min-md:h-[224px] h-[200px] w-[200px] rounded-md" />
      <CardHeader>
        <CardTitle className="text-title font-light mt-6">{title.toUpperCase()}</CardTitle>
        <CardDescription className="w-full max-h-50 overflow-auto break-words whitespace-normal">{description}</CardDescription>
      </CardHeader>
      <div className="flex flex-col gap-2 mt-6">
        {/* Data */}
        <div className="flex items-center text-small">
          <CalendarRange className="mr-2 text-[var(--primary-color-600)]" />
          <span>
            {new Date(scheduledDate).toLocaleString("default", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Participantes */}
        <div className="flex items-center text-small">
          <img src={ParticipantFrame} alt="Ícone do participante" className="mr-2.5" />
          <span>{participantCount} participantes</span>
        </div>

        {/* Status de Aprovação */}
        <div className="flex items-center text-small">
          {isPrivate ? (
            <>
              <Lock className="mr-2 text-[var(--primary-color-600)]" />
              <span>Mediante aprovação</span>
            </>
          ) : (
            <>
              <LockOpen className="mr-2 text-[var(--primary-color-600)]" />
              <span>Aberta</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityDetails;
