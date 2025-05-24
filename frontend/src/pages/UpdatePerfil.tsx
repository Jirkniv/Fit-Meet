import CustomInput from '@/components/ui/CustomInput'
import { Link } from 'react-router-dom'
import { Deactivate } from '../components/ui/deactivate'
import {ChevronLeft} from 'lucide-react'
import Header from '../components/ui/header'
const UpdatePerfil = () => {


  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <div className='w-[98vw] '> 
        <Header/>
      </div>

      <div className='w-[384px] items-center justify-center gap-4'>
        <Link className='text-subTitle font-bold hover:underline flex justify-start' to={'/profile'}>
        <ChevronLeft />
        Voltar para o Perfil</Link>
        
      </div>

      <CustomInput fields={['email','password','name','cpf','update','avatar' ]}></CustomInput>

      <Deactivate/>
        
      
    </div>
  )
}

export default UpdatePerfil
