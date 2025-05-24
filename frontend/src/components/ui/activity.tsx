import React from 'react'
import { Lock, CalendarRange } from 'lucide-react'
import { Separator } from './separator'
import ParticipantFrame from '../../assets/images/participantsFrame.svg'

interface ActivityProps {
  id: string
  title: string
  image: string
  type: string
  private: boolean
  participantCount: number
  scheduledDate: string
}

const  Activity = ({ title, image, type, private: isPrivate, participantCount, scheduledDate }: ActivityProps) => {
  return (
    <div className="w-72 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      <div className="relative w-full h-40">
        <img
          src={image || '/default-image.jpg'}
          alt="Imagem da Atividade"
          className="w-full h-full object-cover rounded-md"
        />
        {isPrivate && (
          <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-[var(--primary-color-600)] flex items-center justify-center">
            <Lock className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 mt-4 text-left">
        <h1 className="text-label">{title}</h1>
        <div className="flex items-center justify-start text-sm text-[var(--text-color)]">
          <CalendarRange className="text-[var(--primary-color-600)] w-4 h-4" />
          <p className="ml-1 text-small">
          {new Date(scheduledDate).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })}
        </p>
          <Separator
            orientation="vertical"
            className="mx-2 h-4 w-px bg-[var(--separator-color)]"
            decorative={false}
          />
         <img src={ParticipantFrame} alt="" />
          <p className="ml-1 text-small">{participantCount} participantes</p>
        </div>
      </div>
    </div>
  )
}

export default Activity