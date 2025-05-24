// src/components/EditActivityModal.tsx
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger , DialogDescription} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ActivityForm, ActivityFormData } from "./activityForm";
import { Pencil } from "lucide-react";
import { editActivityService } from "../../api/putActivityEdit";
import { fetchActivities } from "../../api/getActitvities"; 
import { FetchActivitiesTypes } from "../../api/getActivityType";

interface EditActivityModalProps {
  activityId: string;
}

const EditActivityModal: React.FC<EditActivityModalProps> = ({ activityId }) => {
  const token = localStorage.getItem("token");
  const [initialData, setInitialData] = useState<Partial<ActivityFormData>>({});

  
  useEffect(() => {
    async function loadActivity() {
      try {
        const data = await fetchActivities();
        const activity = data.activities.find((act: any) => act.id === activityId);

        if (!activity) throw new Error("Atividade não encontrada");

        const activityTypes = await FetchActivitiesTypes();

         const matchedType = activityTypes.find(
          (type: any) => type.name === activity.type
        );

        setInitialData({
          title: activity.title,
          description: activity.description,
          typeId: matchedType ? matchedType.id : "", 
          approvalRequired: activity.private,
          address: activity.address,
          scheduledDate: activity.scheduledDate,
          image: activity.image,
        });
      } catch (error) {
        console.error("Erro ao carregar atividade:", error);
      }
    }
    loadActivity();
  }, [activityId, token]);
  const handleSubmit = async (formData: ActivityFormData) => {
    try {
      await editActivityService(activityId, formData, token!);
      alert("Atividade editada com sucesso!");

    } catch (error) {
      console.error("Erro ao editar atividade:", error);
      alert("Erro ao editar atividade");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-white text-black hover:bg-gray-100 border-2  h-10 md:w-[224px] mt-5">
          <Pencil /> Editar Atividade
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[784px]">
        <DialogHeader>
          <DialogTitle>Editar Atividade</DialogTitle>
          <DialogDescription>

          </DialogDescription>
        </DialogHeader>
        <ActivityForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onDelete={undefined}
          activityId={activityId}
        />
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditActivityModal;
