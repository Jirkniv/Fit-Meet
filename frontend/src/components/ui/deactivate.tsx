import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"
import { deleteUser } from "@/api/deleteUser"
import { useUser } from "@/hooks/useUser"

export function Deactivate() {

  const user = useUser()
  
    const handleDelete = async () => {
    
          try {
            await deleteUser(user.token!)
          } catch (error) {
            console.error("Erro ao deletar a conta:", error)
          }
    
      }

  return (
    <Dialog>
      <DialogTrigger asChild>
      <Button type='button' className='bg-white  text-[var(--danger-color)] w-[250px] hover:text-white hover:cursor-pointer' variant={'destructive'}>
        <Trash2 />
          Desativar minha conta
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[300px]  md:max-w-[572px]  md:h-[296px]  p-12">
        <DialogHeader className="justify-center ">
          <DialogTitle className="font-title  font-bold text-align-center m-auto mt-2 text-center">TEM CERTEZA QUE DESEJA DESATIVAR SUA CONTA?</DialogTitle>
          <DialogDescription className="font-default text-align-left justify-start">
        
          </DialogDescription>
        </DialogHeader>
        <div className="text-left p-1 md:p-0">
          <p>Ao desativar sua conta, todos os seus dados e histórico de atividades serão permanentemente removidos.</p>
          <p className="font-bold">Esta ação é irreversível e não poderá ser desfeita.</p>
        </div>
        <div className="flex md:justify-end gap-2">
          <div className="">
           <Button className="text-[var(--title-color)] border-[var(--title-color)]" variant={'outline'} onClick={() => window.location.reload()}>
           Cancelar
           </Button>
          </div>
          <div className="">
           <Button className="hover:cursor-pointer bg-[var(--danger-color)]" variant={'destructive'} onClick={handleDelete}> 
            Desativar
           </Button>
          </div>
        </div>
        <DialogFooter>
         
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
