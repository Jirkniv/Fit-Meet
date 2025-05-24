import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { defineUserPreferences } from "../../api/postUserPreferences";
import { useActivityTypesContext } from "@/context/activityTypeContext";
import Category from "./category"; 
import {getUserPreferences} from "../../api/getUserPrefereces"; 

export function Preferences() {

  const { activityTypes } = useActivityTypesContext()
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false) 

  useEffect(() => {
    async function fetchPreferences() {
      try {
        const token = localStorage.getItem("token") || ""
        const preferences = await getUserPreferences(token)
  
        console.log("Preferências retornadas:", preferences)
  
     
        const preferenceIds = preferences.map((pref) => pref.typeId)
        console.log("Preferências Ids:", preferenceIds)
  
        if (preferenceIds.length === 0) {
          setIsDialogOpen(true)
        } else {
          setSelectedPreferences(preferenceIds) 
        }
      } catch (error) {
        console.error("Erro ao carregar preferências:", error)
      }
    }
  
    fetchPreferences()
  }, [])
  const togglePreference = (id: string) => {
    setSelectedPreferences((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((prefId) => prefId !== id)
        : [...prevSelected, id]
    );
  };

  async function postPreferences() {
    try {
      const token = localStorage.getItem("token") || "";
      
      const response = await defineUserPreferences(token, selectedPreferences);
      console.log("Preferências definidas com sucesso:", response);
      setIsDialogOpen(false)
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
      <Button className="hidden">Abrir Preferências</Button>
      </DialogTrigger>
      <DialogContent className="w-[528px] h-[544px]">
        <DialogHeader>
          <DialogTitle className="text-title font-light text-center">SELECIONE AS SUAS ATIVIDADES PREFERIDAS</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {activityTypes.map((activityType) => (
              <div 
                key={activityType.id} 
                onClick={() => togglePreference(activityType.id)} className="cursor-pointer">
                <Category {...activityType} selected={selectedPreferences.includes(activityType.id)} />
              </div>
            ))}
          </div>
        </div>
        <DialogFooter className="md:gap-2	flex md:flex-row flex-col  md:justify-between  items-center">  
          <Button className=" md:w-[212px]  h-[48px] w-[200px]" type="submit" onClick={postPreferences}>
            Save changes
          </Button>
          <DialogClose>
            <Button className=" md:w-[212px] h-[48px] w-[200px]" variant={"outline"}>Pular</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
