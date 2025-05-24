import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useActivityTypesContext } from "@/context/activityTypeContext"
import { useState, useEffect } from "react"
import { PlusCircle , Pencil} from "lucide-react"
import { handleDelete } from "../../api/deleteActivity"
import Map from "@/components/ui/Map"


type Props = {
  activityId?: string 
}

export default function NewActivityModal({ activityId }: Props) {
  const { activityTypes } = useActivityTypesContext()
  const [formData, setFormData] = useState({
    image: null as File | null,
    title: "",
    description: "",
    typeId: "",
    approvalRequired: false,
    address: {
      latitude: -19.82853362565354, //Coordenadadas da minha cidade ;-;
      longitude: -43.087692260742195,
    },
    scheduledDate: "",
  })
  const token = localStorage.getItem("token")
  const [imagePreview, setImagePreview] = useState<string | null>(null) 

  const handleMarkerChange = (latitude: number, longitude: number) => {
    setFormData((prev) => ({
      ...prev,
      address: { latitude, longitude },
    }));
  };

 
  useEffect(() => {
    if (activityId) {
      async function fetchActivityData() {
        try {
          setImagePreview(null)
          const response = await fetch(`http://localhost:3000/activities/${activityId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (!response.ok) {
            throw new Error("Erro ao carregar dados da atividade")
          }

          const data = await response.json()
          setFormData({
            image: null, 
            title: data.title,
            description: data.description,
            typeId: data.typeId,
            approvalRequired: data.private,
            address: data.address,
            scheduledDate: data.scheduledDate,
          })
        } catch (error) {
          console.error("Erro ao carregar dados da atividade:", error)
        }
      }

      fetchActivityData()
    }
  }, [activityId, token])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target
    const { name, value, type } = target
    const checked = (target as HTMLInputElement).checked 
    setFormData({
      ...formData,
      [name]: name === "scheduledDate" ? new Date(value).toISOString() : type === "checkbox" ? checked : value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        image: e.target.files[0],
      })

      setImagePreview(URL.createObjectURL(e.target.files[0]))
    }
  }

  const handleSubmit = async () => {
    const formDataToSend = new FormData()
    formDataToSend.append("image", formData.image as Blob)
    formDataToSend.append("title", formData.title)
    formDataToSend.append("description", formData.description)
    formDataToSend.append("typeId", formData.typeId)
    formDataToSend.append(
      "address",
      JSON.stringify({
        latitude: formData.address.latitude,
        longitude: formData.address.longitude,
      })
    )
    formDataToSend.append("scheduledDate", formData.scheduledDate)
    formDataToSend.append("private", String(formData.approvalRequired))

    try {
      const url = activityId
        ? `http://localhost:3000/activities/${activityId}/update`
        : "http://localhost:3000/activities/new"

      const method = activityId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error(activityId ? "Erro ao editar atividade" : "Erro ao criar atividade")
      }

      alert(activityId ? "Atividade editada com sucesso!" : "Atividade criada com sucesso!")
    } catch (error) {
      console.error(error)
      alert(activityId ? "Erro ao editar atividade" : "Erro ao criar atividade")
    }
  }

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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[var(--primary-color-500)] text-white hover:bg-[var(--primary-color-600)] rounded-lg h-10 w-[10vw]">
          {activityId ? <> <Pencil /> Editar Atividade</> : <><PlusCircle /> Criar Atividade</>}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[784px] h-[720px]">
        <DialogHeader>
          <DialogTitle>{activityId ? "Editar Atividade" : "Nova Atividade"}</DialogTitle>
          <DialogDescription>
            
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          
          <div>
            {/* Imagem */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="image">Imagem</Label>
                <span className="text-red-500">*</span>
              </div>
              <div
                className="w-full h-[200px] border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer"
                onClick={() => document.getElementById("image")?.click()} // Aciona o input de arquivo
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <span className="text-gray-400">Clique para selecionar uma imagem</span>
                )}
              </div>
              <Input
                type="file"
                accept="image/*"
                id="image"
                name="image"
                className="hidden" // Oculta o input
                onChange={handleFileChange}
              />
            </div>
            
            {/* Título */}
            <div className="flex flex-col gap-2 col-span-2">
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
            <div className="flex flex-col gap-2 col-span-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="description">Descrição</Label>
                <span className="text-red-500">*</span>
              </div>
              <textarea
                id="description"
                name="description"
                placeholder="Como será a atividade? Quais as regras?"
                value={formData.description}
                onChange={handleInputChange}
                className="p-2 border rounded-md resize-none h-24"
              />
            </div>

            {/* Data */}
            <div className="flex flex-col gap-2 col-span-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="scheduledDate">Data</Label>
                <span className="text-red-500">*</span>
              </div>
              <Input
                type="datetime-local"
                id="scheduledDate"
                name="scheduledDate"
                value={formData.scheduledDate.slice(0, 16)} 
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
              <div className="grid grid-cols-4 gap-2">
                {activityTypes.map((activityType) => (
                  <button
                    key={activityType.id}
                    type="button"
                    className={`p-2 border rounded-lg ${
                      formData.typeId === activityType.id
                        ? "border-[var(--primary-color-500)]"
                        : "border-gray-300"
                    }`}
                    onClick={() => setFormData({ ...formData, typeId: activityType.id })}
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
              <div className="flex items-center gap-1">
                <Label>Ponto de Encontro</Label>
                <span className="text-red-500">*</span>
                </div>
                <Map locked={false} onMarkerChange={handleMarkerChange}
                 initialPosition={[
                  formData.address.latitude,
                  formData.address.longitude,
                ]} 
                />
            </div>
  
            {/* Requer Aprovação */}
            <div className="flex flex-col gap-2 col-span-2">
              <div className="flex items-center gap-1">
                <Label>Requer aprovação para participar?</Label>
                <span className="text-red-500">*</span>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="approvalRequired"
                    value="true"
                    checked={formData.approvalRequired === true}
                    onChange={() => setFormData({ ...formData, approvalRequired: true })}
                  />
                  Sim
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="approvalRequired"
                    value="false"
                    checked={formData.approvalRequired === false}
                    onChange={() => setFormData({ ...formData, approvalRequired: false })}
                  />
                  Não
                </label>
              </div>
            </div>
</div>
        </div>
        <DialogFooter>
          {activityId && (
            <Button className="w-[200px] bg-white border hover:cursor-pointer hover:text-white border-red-500 text-red-500" type="button" variant="destructive" onClick={handleDeleteClick}>
            Cancelar
            </Button>
          )} 
           <Button className="w-[200px] " type="button" onClick={handleSubmit}>
            {activityId ? "Confirmar" : "Criar"}
          </Button>
        
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}