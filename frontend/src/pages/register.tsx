import React from 'react'
import LoginBg from '../assets/images/loginBg.png'
import Logo from '@/components/ui/logo'
import CustomInput from '@/components/ui/CustomInput'
import { Link } from 'react-router-dom'

const register = () => {
  
  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-[185px] h-screen">
      {/* Imagem de fundo */}
      <div className="w-full h-full p-3 ">
        <img className="w-full h-full object-cover rounded-2xl" src={LoginBg} alt="Background" />
      </div>

      {/* Conteúdo do formulário */}
      <div className="flex flex-col justify-center items-center lg:items-start w-full lg:w-1/2 h-full bg-white px-6 lg:px-16">
        <Logo />

        <h1 className="text-title text-center lg:text-left w-full lg:w-[33vw] mt-4">
        CRIE SUA CONTA
        </h1>
        <p className="text-default text-center lg:text-left w-full lg:w-[33vw] mt-6">
        Cadastre-se para encontrar parceiros de treino e começar a se exercitar ao ar livre. Vamos juntos! 💪
        </p>
        

        <CustomInput fields={['name','cpf','email', 'password','register']} />


        <p className="text-default text-center lg:text-left w-full lg:w-[33vw] mt-8">
          Já tem uma conta?{' '}
          <Link to="/" className="text-default font-bold hover:Cursor-pointer hover:text-gray-800">
            Faça Login
          </Link>
         
        </p>
      </div>
    </div>
  )
}

export default register