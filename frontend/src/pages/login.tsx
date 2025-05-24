import React, { useEffect } from 'react'
import LoginBg from '../assets/images/loginBg.png'
import Logo from '@/components/ui/logo'
import CustomInput from '@/components/ui/CustomInput'
import { Link } from 'react-router-dom'


 function login () {
 const bg = LoginBg
 
  return (
    <div className="w-full h-screen flex justify-between ">
      <div className="w-full h-full p-3 ">
        <img className="w-full h-full object-cover rounded-2xl" src={bg} alt="Background" />
      </div>

      {/* Conteúdo do formulário */}
      <div className="flex flex-col justify-center lg:items-start w-1/2 lg:w-1/2 h-full bg-white px-6 lg:px-16">
        <Logo />

        <h1 className="text-title text-center lg:text-left w-full lg:w-[33vw] mt-8">
          BEM-VINDO DE VOLTA!
        </h1>
        <p className="text-default text-center lg:text-left w-full lg:w-[33vw] mt-4">
          Encontre parceiros para treinar ao ar livre.
        </p>
        <p className="text-default text-center lg:text-left w-full lg:w-[33vw] mb-6">
          Conecte-se e comece agora! 💪
        </p>

        <CustomInput fields={['email', 'password','login']} />

    

        <p className=" text-default text-center lg:text-left w-full lg:w-[33vw] mt-8">
          Ainda não tem uma conta?{' '}
          <Link to="/register" className=" text-default font-bold hover:Cursor-pointer hover:text-gray-800">
            Cadastre-se
          </Link>
         
        </p>
      </div>
    </div>
  )
}
export default login