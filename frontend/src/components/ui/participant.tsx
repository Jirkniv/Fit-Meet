import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

interface ParticipantProps {
    name: string;
    avatar: string;
    level: number;
    id: string;
    organizer?: boolean;
}

const Participant = ({ name, avatar, level, organizer }: ParticipantProps ) => {
   

    return (
        <div className="flex items-center space-x-2 bg-white  rounded-lg  w-34 h-14.5">
            <div className="relative">
                <Avatar className="w-13 h-13 border-2 border-[var(--primary-color-600)] rounded-full">
                    <AvatarImage aria-label='img' className="w-12 h-12" src={avatar} />
                    <AvatarFallback>OFF</AvatarFallback>
                </Avatar>
                <div className="absolute top-10 right-3 bg-[var(--primary-color-600)] text-white text-default   w-7 h-4.5 rounded-xs flex items-center justify-center">
                    {level}
                </div>
            </div>
            <div className="flex flex-col">
                <h1 className="text-label font-semibold text-gray-800">{name}</h1>
                {organizer && (
                    <p className="text-small text-gray-600">Organizador</p>
                )}
            </div>
        </div>
    )
}

export default Participant