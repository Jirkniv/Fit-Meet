// src/components/CreateActivityModal.tsx
import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ActivityForm, ActivityFormData } from "./activityForm";
import { PlusCircle } from "lucide-react";
import { createActivityService } from "../../api/postActivityNew";

const CreateActivityModal: React.FC = () => {
  const token = localStorage.getItem("token");

  const handleSubmit = async (formData: ActivityFormData) => {
    try {
      const response = await createActivityService(formData, token!);
      alert("Atividade criada com sucesso!");
      // Faça qualquer ação necessária pós-criação
    } catch (error) {
      console.error(error);
      alert("Erro ao criar atividade");
    }
  };

  return (

      <Dialog >
        <DialogTrigger asChild>
          <Button className=" lg:w-50 md:w-50 bg-[var(--primary-color-500)] text-white hover:bg-[var(--primary-color-600)] rounded-lg h-10 ">
            <PlusCircle /> Criar Atividade
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[784px]">
          <DialogHeader>
            <DialogTitle>Nova Atividade</DialogTitle>
          </DialogHeader>
          <ActivityForm onSubmit={handleSubmit} />
        </DialogContent>
      </Dialog>
  );
};

export default CreateActivityModal;
