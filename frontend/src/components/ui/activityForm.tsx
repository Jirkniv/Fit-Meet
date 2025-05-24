// src/components/ActivityForm.tsx
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Map from "@/components/ui/Map";
import { Button } from "@/components/ui/button";
import { useActivityTypesContext } from "@/context/activityTypeContext"
import {handleDelete} from "../../api/deleteActivity"
import { Image } from "lucide-react"; 

export interface Address {
  latitude: number;
  longitude: number;
}

export interface ActivityFormData {
  image: File | null;
  title: string;
  description: string;
  typeId: string;
  approvalRequired: boolean;
  address: Address;
  scheduledDate: string;
}

interface ActivityFormProps {
  initialData?: Partial<ActivityFormData>; 
  onSubmit: (data: ActivityFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
  activityId?: string; 
}

export const ActivityForm: React.FC<ActivityFormProps> = ({
  initialData,
  onSubmit,
  onDelete,
  activityId,
}) => {
  const [formData, setFormData] = useState<ActivityFormData>({
    image: null,
    title: "",
    description: "",
    typeId: "",
    approvalRequired: false,
    address: {
      latitude: -19.82853362565354, // valor padrão
      longitude: -43.087692260742195,
    },
    scheduledDate: "",
    ...initialData,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { activityTypes } = useActivityTypesContext()



  const handleMarkerChange = (latitude: number, longitude: number) => {
    setFormData((prev) => ({
      ...prev,
      address: { latitude, longitude },
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]:
        name === "scheduledDate"
          ? new Date(value).toISOString()
          : type === "checkbox"
          ? checked
          : value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        image: e.target.files[0],
      });
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  
  const formattedScheduledDate =
    formData.scheduledDate && formData.scheduledDate.length > 0
      ? formData.scheduledDate.slice(0, 16)
      : "";

      const token = localStorage.getItem("token")
      const handleDeleteClick = async () => {
        if (!activityId) return
    
        try {
          await handleDelete(activityId, token!)
          window.location.reload()
          alert("Atividade deletada com sucesso!")
        } catch (error) {
          console.error("Erro ao deletar atividade:", error)
        }
      }
console.log(formData.typeId)

  return (
    <div>
        <div className="grid grid-cols-2 gap-12 py-4">
          <div>
            {/* Imagem */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="image">Imagem</Label>
                <span className="text-red-500">*</span>
              </div>
              <div
                className="w-full h-[200px] border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer"
                onClick={() => document.getElementById("image")?.click()}
              >
               {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : formData.image ? (
   
                    typeof formData.image === "string" ? (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <img
                        src={URL.createObjectURL(formData.image)}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-md"
                      />
                    )
                  ) : (
                    
                    <span className="text-gray-400">
                      <Image className="opacity-40" />
                    </span>
                )}
              </div>
              <Input
                type="file"
                accept="image/*"
                id="image"
                name="image"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            {/* Título */}
            <div className="flex flex-col gap-2 col-span-2 pt-4">
              <div className="flex items-center gap-1">
                <Label htmlFor="title">Título</Label>
                <span className="text-red-500">*</span>
              </div>
              <Input
                id="title"
                name="title"
                placeholder="Ex: Aula de Yoga"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            {/* Descrição */}
            <div className="flex flex-col gap-2 col-span-2 pt-4">
              <div className="flex items-center gap-1">
                <Label htmlFor="description">Descrição</Label>
                <span className="text-red-500">*</span>
              </div>
              <textarea
                id="description"
                name="description"
                placeholder="Como será a atividade? Quais as regras? O que é necessário para participar?"
                value={formData.description}
                onChange={handleInputChange}
                className="p-2 border rounded-md resize-none h-24"
              />
            </div>
            {/* Data */}
            <div className="flex flex-col gap-2 col-span-2 pt-4">
              <div className="flex items-center gap-1">
                <Label className="sm:w-100" htmlFor="scheduledDate">Data</Label>
                <span className="text-red-500">*</span>
              </div>
              <Input
                type="datetime-local"
                id="scheduledDate"
                name="scheduledDate"
                value={formattedScheduledDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div>
            {/* Tipo da Atividade */}
            <div className="flex flex-col gap-2">
  <div className="flex items-center gap-1">
    <Label>Tipo da Atividade</Label>
    <span className="text-red-500">*</span>
  </div>
  <div className="grid grid-cols-4 gap-2 justify-items-center">
    {activityTypes.map((activityType) => (
      <button
        key={activityType.id}
        type="button"
        className={`p-2 border rounded-lg hover:cursor-pointer ${
          formData.typeId === activityType.id
            ? "border-[var(--primary-color-500)] "
            : "border-gray-900"
        }`}
        onClick={() =>
          setFormData({ ...formData, typeId: activityType.id })
        }
      >
        <img
          src={activityType.image}
          alt={activityType.name}
          className="w-12 h-12 object-cover rounded-full"
        />
        <p className="text-center text-sm">{activityType.name}</p>
      </button>
    ))}
  </div>
</div>
            {/* Ponto de Encontro */}
            <div className="flex flex-col gap-2 col-span-2">
              <div className="flex items-center gap-1 pt-4">
                <Label>Ponto de Encontro</Label>
                <span className="text-red-500">*</span>
              </div>
              <Map
                locked={false}
                onMarkerChange={handleMarkerChange}
                initialPosition={[formData.address.latitude, formData.address.longitude]}
              />
            </div>
            {/* Requer Aprovação */}
            <div className="flex flex-col gap-2 col-span-2">
              <div className="flex items-center gap-1 pt-4">
                <Label>Requer aprovação para participar?</Label>
                <span className="text-red-500">*</span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md border font-medium hover:cursor-pointer ${
                    formData.approvalRequired === true
                      ? "bg-[var(--text-color)] text-white border-[var(--text-color)]"
                      : "bg-white text-[var(--text-color)] border-zinc-300"
                  }`}
                  onClick={() => setFormData({ ...formData, approvalRequired: true })}
                >
                  Sim
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md border font-medium hover:cursor-pointer ${
                    formData.approvalRequired === false
                       ? "bg-[var(--text-color)] text-white border-[var(--text-color)]"
                      : "bg-white text-[var(--text-color)] border-zinc-300"
                  }`}
                  onClick={() => setFormData({ ...formData, approvalRequired: false })}
                >
                  Não
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-4 max-sm:justify-items-center ">
          {activityId && (
            <Button
              className="w-[100px] md:w-[224px] bg-white border hover:cursor-pointer hover:text-white border-red-500 text-red-500"
              type="button"
              variant="destructive"
              onClick={handleDeleteClick}
            >
              Cancelar
            </Button>
          )}
          <Button className="w-[100px]  sm:w-[224px]" type="button" onClick={() => onSubmit(formData)}>
            {activityId ? "Confirmar" : "Criar"}
          </Button>
        </div>
    </div>
  );
};
