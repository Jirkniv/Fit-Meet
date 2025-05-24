// src/components/activityModal/ActivityActions.tsx
import React, {useState} from "react";
import { Button } from "@/components/ui/button";
import { Ban, Check, Flag, CalendarOff } from "lucide-react";
import EditActivityModal from "./editActivityModal";
import { Input } from "./input";



interface ActivityActionsProps {
  activityId: string;
  isCreator: boolean;
  isSubscribed: boolean;
  isConfirmed: boolean;
  subscriptionStatus: string;
  timeLeft: number;
  updateLoading: boolean;
  deletedAt?: string | null; 
  completedAt?: string | null; 
  confirmationCode: string; 
  onSubscribe: () => void;
  onUnsubscribe: () => void;
  onCheckIn: (code: string) => void; 
  onConclude: () => void;
}

const ActivityActions: React.FC<ActivityActionsProps> = ({
  activityId,
  isCreator,
  isSubscribed,
  isConfirmed,
  subscriptionStatus,
  timeLeft,
  updateLoading,
  confirmationCode, 
  deletedAt, 
  completedAt,
  onSubscribe,
  onUnsubscribe,
  onCheckIn, 
  onConclude,
}) => {
  const [confirmationCodeInput, setConfirmationCodeInput] = useState("");
  const handleConfirmationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmationCodeInput(e.target.value);
  }

  return (
    <div>
      {isCreator && timeLeft > 30 ? (
        <EditActivityModal activityId={activityId} />
      ) : deletedAt != null ? (
      <Button
        disabled
        className="bg-red-600 text-white hover:bg-red-800  rounded-lg h-10 w-[20vw] mt-5"
      >
        <CalendarOff />
        Atividade cancelada
      </Button>
    ) : completedAt != null ? (
      <Button
        disabled
        variant={"outline"}
        className="border-gray-500 text-gray-500 h-10 w-[20vw] mt-5"
      >
        Atividade encerrada
      </Button>
    ) :  subscriptionStatus === "REJECTED" ? (
        <Button
          disabled
          className="bg-red-600 text-white hover:bg-red-800 rounded-lg h-10 md:w-[224px] mt-5"
        >
          <Ban />
          Inscrição negada
        </Button>
      ) : timeLeft <= 30 && isCreator ? (
        <Button
          disabled={updateLoading}
          className="bg-[var(--primary-color-500)] text-white hover:bg-[var(--primary-color-600)] h-10 md:w-[224px] mt-5 w-[150px] "
          onClick={onConclude}
        >
          <Flag />
          Encerrar atividade
        </Button>
      ) : timeLeft < 0 && !isCreator && !isSubscribed ? (
        <Button
        disabled
        className="bg-white text-[var(--text-color)] h-10 md:w-[224px] mt-5 w-[150px] "  
      >
      Atividade em Andamento
      </Button>

      ) : subscriptionStatus === "WAITING" ? (
        <Button className="bg-[var(--primary-color-500)] text-white hover:bg-[var(--primary-color-600)] h-10 w-[224px] mt-5">
          Aguardando Aprovação
        </Button>
      ) : isConfirmed ? (
        <div className="h-[120px]">
          <h1 className="text-label">FAÇA SEU CHECK-IN</h1>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Button
              disabled={true}
              className="bg-[var(--primary-color-500)] text-white hover:bg-[var(--primary-color-600)]  h-[48px] md:w-[224px] mt-5"
            >
              <Check />
            </Button>
          </div>
        </div>
      ) : timeLeft <= 30 && isSubscribed ? (
        <div className="h-[120px]">
          <h1 className="text-label">FAÇA SEU CHECK-IN</h1>
          <Input
            type="text"
            placeholder="Código de confirmação"
            value={confirmationCodeInput}
            onChange={handleConfirmationCodeChange} 
            disabled={updateLoading}
          />
          <Button
            disabled={updateLoading || !confirmationCodeInput} 
            className="bg-[var(--primary-color-500)] text-white hover:bg-[var(--primary-color-600)]  h-10 w-[224px] mt-5"
            onClick={() => onCheckIn(confirmationCodeInput)} 
          >
            Confirmar
          </Button>
        </div>
      ) : isSubscribed &&
        (subscriptionStatus === "APPROVED" || subscriptionStatus === undefined) ? (
        <Button
          disabled={updateLoading}
          variant={"destructive"}
          className="bg-white border-2 border-red-500 text-red-500 hover:bg-red-600 hover:text-white h-10 md:w-[224px] mt-5"
          onClick={onUnsubscribe}
        >
          Desinscrever
        </Button>
      ) : (
        <Button
          disabled={updateLoading}
          className="bg-[var(--primary-color-500)] text-white hover:bg-[var(--primary-color-600)]  h-10 md:w-[224px] mt-5"
          onClick={onSubscribe}
        >
          Participar
        </Button>
      )}
    </div>
  );
};

export default ActivityActions;
