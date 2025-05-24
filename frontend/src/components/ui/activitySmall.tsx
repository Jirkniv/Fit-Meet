import Participants from '../../assets/images/participantsFrame.svg'
import { Lock, CalendarRange } from 'lucide-react'
import { Separator } from './separator'
interface ActivityProps {
  id: string
  title: string
  image: string
  type: string
  private: boolean
  participantCount: number
  scheduledDate: string
}

const activitySmall = ({ title, image, private: isPrivate, participantCount, scheduledDate }: ActivityProps) => {
  

    return (
            <div className='w-72 bg-white rounded-lg shadow-md overflow-hidden flex flex-row hover:cursor-pointer'>
                <div className='relative w-22 h-22'>
                    <img
                        src={image}
                        alt="Imagem da Atividade"
                        className='w-22 h-22 object-cover rounded-md'
                    />
                    {isPrivate && (
                        <div className='absolute top-2 left-2 rounded-full bg-[var(--primary-color-600)] flex items-center justify-center w-5.5 h-5.5'>
                            <Lock className='w-3.5 h-3.5 text-white' />
                        </div>
                    )}
                </div>
                <div className='flex flex-col gap-2 mt-4 ml-3 text-left '>
                    <h1 className='text-label h-10 w-46.5'>{title}</h1>
                    <div className='flex items-center justify-start text-sm text-[var(--text-color)]'>
                        <CalendarRange className='text-[var(--primary-color-600)] w-4 h-4' />
                        <p className="ml-1 text-small">
                        {new Date(scheduledDate).toLocaleString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                        </p>
                        <Separator orientation='vertical' className='mx-2 h-2.5 w-px bg-[var(--separator-color)] ' decorative={false} />
                        <img src={Participants} alt="Participants" className='w-4 h-4' />
                        <p className='ml-1 text-small'>{participantCount}</p>
                    </div>
                </div>
            </div>

    )
}

export default activitySmall
