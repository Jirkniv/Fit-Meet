import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {  X, Check, UserRoundCheck } from "lucide-react"
import { useEffect, useState } from "react"
import Participant from "@/components/ui/participant"
import { postSubscription } from "../../api/postActivitySubscribe"
import { handleUnsubscribe } from "../../api/deleteActivityUnsubscribe"
import { fetchParticipants } from "../../api/getParticipants"
import { handleApprove } from "@/api/putActivityApprove"
import { handleCheckIn } from "@/api/putActivityCheckIn"
import { handleConclude } from "@/api/putActivityConclude"
import Map from "@/components/ui/Map"
import ActivityActions from "./activityActions"
import ActivityDetails from "./activityDetails"

interface Activity {
  id: string
  image: string
  title: string
  description: string
  scheduledDate: string
  confirmationCode: string
  private: boolean
  address: {
    latitude: number
    longitude: number
  }
  participantCount: number
  deletedAt?: string | null
  completedAt?: string | null
  userSubscriptionStatus: string
  creator: {
    id: string
    name: string
    avatar: string
  }
}

interface ActivityModalProps {
  activityId: string
  onClose: () => void
  activityData: Activity  
}

interface ParticipantProps {
  id: string
  userId: string
  name: string
  avatar: string
  userSubscriptionStatus: string
  confirmedAt: Date | null
}

export default function ActivityModal({ activityId, onClose, activityData }: ActivityModalProps) {
 
  const activity = activityData

  useEffect(() => {
    console.log("Confirmation Code:", activity.confirmationCode); 
  }, [activity]);

  const [participants, setParticipants] = useState<ParticipantProps[]>([])
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isCreator, setIsCreator] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [updateLoading] = useState(false)

  const token = localStorage.getItem("token") || ""
  const dateNow = new Date()
  const timeLeft = ((Date.parse(activity.scheduledDate) - dateNow.getTime() )/ 60000 )
  const hours = Math.floor(timeLeft / 60);
  const minutes = Math.floor(timeLeft % 60);
 // console.log(`Faltam ${hours}h e ${minutes}min`);

  useEffect(() => {
    async function loadParticipants() {
      try {
        const data = await fetchParticipants(activityId, token)
        setParticipants(data)

     
        const isUserSubscribed = data.some((participant) => participant.userId === localStorage.getItem("userId"))
        setIsSubscribed(isUserSubscribed)

        const confirmed = data.some((participant) => participant.confirmedAt != null)
        setIsConfirmed(confirmed) 

       
        if (activity.creator.id === localStorage.getItem("userId")) {
          setIsCreator(true)
        }
      } catch (error) {
        console.error(error)
      }
    }

    loadParticipants()
  }, [activityId, activity.creator.id, token])

  const handleSubscribeClick = async () => {
    try {
      await postSubscription(activityId, token, activity.private)
  
      const updatedParticipants = await fetchParticipants(activityId, token)
      setParticipants(updatedParticipants)
  
      const isUserSubscribed = updatedParticipants.some(
        (participant) =>
          participant.userId === localStorage.getItem("userId") &&
          participant.userSubscriptionStatus === "APPROVED"
      )
      setIsSubscribed(isUserSubscribed)
    } catch (error) {
      console.error(error)
    }
  }

  const handleUnsubscribeClick = async () => {
    try {
      await handleUnsubscribe(activityId, token)
      setIsSubscribed(false)
      const updatedParticipants = await fetchParticipants(activityId, token)
      setParticipants(updatedParticipants)
    } catch (error) {
      console.error(error)
    }
  }

  // const handleEditClick = async () => {
  //   try {
  //     const updatedData = { title: "Novo Título" } 
  //     await handleEdit(activityId, token, updatedData)
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }
 
const approval = async (participantId: string, status: "APPROVED" | "REJECTED") => {
  try {
const isApproved = status === "APPROVED" ? true : status === "REJECTED" ? false : null;
   

    const updatedData = {
      participantId,
      approved: isApproved!,  
    };

    await handleApprove(activityId, token, updatedData);
   // console.log(`Participante ${participantId} foi ${status}`);
    window.location.reload();
  } catch (error) {
    console.error("Erro ao aprovar/rejeitar participante:", error);
  }
};
const [confirmationCodeInput, setConfirmationCodeInput] = useState("")
  
const handleCheckInClick = async () => {
  console.log(" Inputado: " + confirmationCodeInput)
  console.log("Esperado: " + activity.confirmationCode)
  if (confirmationCodeInput === activity.confirmationCode) {
    try {
      await handleCheckIn(activityId, token, confirmationCodeInput)
      alert("Check-in realizado com sucesso!")
      window.location.reload();
    } catch (error) {
      console.error("Erro ao realizar o check-in:", error)
      alert("Erro ao realizar o check-in. Tente novamente.")
    }
  } else {
    alert("Código de confirmação inválido. Tente novamente.")
  }
}
  
  const Conclude = async () => {
    try {
      await handleConclude(activityId, token);
      alert("Atividade encerrada com sucesso!")
    } catch (error) {
      console.error("Erro ao encerrar a atividade:", error);
    }
  };
 // console.log(activity.title)
 // console.log("userSubscriptionStatus:", activity.userSubscriptionStatus);

  return (
    <Dialog open onOpenChange={onClose}>
    <DialogHeader>
      <DialogTitle>Detalhes da Atividade</DialogTitle>
      <DialogDescription>Mostra os detalhes da atividade</DialogDescription>
    </DialogHeader>
    <DialogContent className="sm:max-w-[800px]">
      <div className="grid grid-cols-2 gap-12 py-4">
        <div>
          <ActivityDetails
            image={activity.image}
            title={activity.title}
            description={activity.description}
            scheduledDate={activity.scheduledDate}
            private={activity.private}
            participantCount={activity.participantCount}
            
          />
          <ActivityActions
            activityId={activity.id}
            isCreator={isCreator}
            isSubscribed={isSubscribed}
            isConfirmed={isConfirmed}
            subscriptionStatus={activity.userSubscriptionStatus}
            timeLeft={timeLeft}
            updateLoading={updateLoading}
            confirmationCode={activity.confirmationCode}
            onSubscribe={handleSubscribeClick}
            deletedAt={activity.deletedAt} 
            completedAt={activity.completedAt} 
            onUnsubscribe={handleUnsubscribeClick}
            onCheckIn={handleCheckInClick}
            onConclude={Conclude}
          />
        </div>
        <div>
          <div className="">
            <h1 className="text-subTitle font-bold">PONTO DE ENCONTRO</h1>
            <Map locked={true} initialPosition={[activity.address.latitude, activity.address.longitude]} />
            </div>
          {/* Participantes */}
          <div className="col-span-2 mt-10">
            <h1 className="text-subTitle font-bold">PARTICIPANTES</h1>
            <ScrollArea className="h-40">
            <div className="flex flex-col gap-2">
  <Participant
    name={activity.creator.name}
    avatar={activity.creator.avatar || ""}
    level={1}
    id={activity.creator.id}
    organizer
  />
  {participants.map((participant) => (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center" key={participant.id}>
      <Participant
        name={participant.name}
        avatar={participant.avatar || ""}
        level={1}
        id={participant.id}
      />
      {isCreator && timeLeft > 30 && (
        <div className="flex gap-2 mt-3 sm:mt-0 justify-center sm:justify-end">
          <Button
            variant={"secondary"}
            className="bg-white border-2 border-red-500 text-red-500 hover:bg-red-600 hover:text-white h-10 w-10 rounded-full"
            onClick={() => approval(participant.id, "REJECTED")}
          >
            <X />
          </Button>
          <Button
            variant={"secondary"}
            className="bg-[var(--primary-color-500)] text-white hover:bg-[var(--primary-color-600)] rounded-lg h-10 w-10"
            onClick={() => approval(participant.id, "APPROVED")}
          >
            <Check />
          </Button>
        </div>
      )}
    </div>
  ))}
</div>

            </ScrollArea>
            {isCreator && timeLeft <= 30 && (
              <div className="w-[120px] md:w-[280px]  sm:w-[250px] bg-gray-50 p-6">
                <UserRoundCheck className="text-[var(--primary-color-500)] inline" />
                <p className="inline"> Seu código de check-in</p>
                <h1 className="text-title mt-[12px]">{activity.confirmationCode}</h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);
}
