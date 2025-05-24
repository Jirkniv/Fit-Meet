import {useState} from 'react'
import Logo from './logo'
import { Link } from 'react-router-dom'
import NewActivityModal from '@/components/ui/newActivity'
import Participant from './participant'
import {useUser } from "../../hooks/useUser"
import CreateActivityModal from './createActivityModal'
const header = () => {
   
    const user = useUser();
    
  return (
  
      <div className="flex justify-between">

        <Link to={'/home'}>
            <Logo />
        </Link>
        <div className="flex gap-3 items-center">
        <CreateActivityModal/>
          
        <Link to={'/profile'}>
          <Participant id={user.userId!} name={user.name!} avatar={user.avatar!} level={user.level}  />
        </Link>
        </div>
      </div>
  )
}

export default header
