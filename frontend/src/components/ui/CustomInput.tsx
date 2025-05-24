import { useState, useEffect } from 'react'
import { Input } from './input.tsx'
import { Eye, EyeOff , Camera} from 'lucide-react'
import { z } from 'zod'
import { Button } from './button.tsx'
import { useNavigate } from 'react-router'
import { handleUpdateAvatar } from '@/api/putUserAvatar.ts'
import { FetchUser } from '@/api/getUser.ts'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUser } from '@/hooks/useUser.ts'

// Schema base com todos os campos
const baseSchema = z.object({
  email: z.string().email("E-mail inválido").nonempty("O campo e-mail é obrigatório"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  name: z.string().nonempty("O campo nome é obrigatório").min(5, "O nome deve ter pelo menos 5 caracteres"),
  cpf: z.string().nonempty("O campo CPF é obrigatório").regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
})

const getDynamicSchema = (fields: string[]) => {
  if (fields.includes('register')) {
    return z.object({
      email: z.string().email("E-mail inválido").nonempty("O campo e-mail é obrigatório"),
      password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
      name: z.string().nonempty("O campo nome é obrigatório").min(5, "O nome deve ter pelo menos 5 caracteres"),
      cpf: z.string().nonempty("O campo CPF é obrigatório").regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
    })
  }
  if (fields.includes('login')) {
    return z.object({
      email: z.string().email("E-mail inválido").nonempty("O campo e-mail é obrigatório"),
      password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    })
  }
  return baseSchema;
}




type FormValues = z.infer<typeof baseSchema>

type CustomInputProps = {
  fields: string[]; // Exemplo: ['email', 'password', 'update']
};

const CustomInput = ({ fields }: CustomInputProps) => {
  const navigate = useNavigate()
  
  const [showPassword, setShowPassword] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const user = useUser()
  
  useEffect(() => {
    if (fields.includes('update')) {
      async function getUserData() {
        try {
          const fetchedUser = await FetchUser()
          if (fetchedUser) {
            console.log("Dados do usuário:", fetchedUser)
            setUserData(fetchedUser)
          }
        } catch (error) {
          console.error("Erro ao buscar usuário:", error)
        }
      }
      getUserData()
    }
  }, [fields])
  
  const dynamicSchema = getDynamicSchema(fields)
  
  const form = useForm({
    resolver: zodResolver(dynamicSchema),
    defaultValues: {
      email: fields.includes('update') && userData ? userData.email : "",
      password: "",
      name: fields.includes('update') && userData ? userData.name : "",
      cpf: fields.includes('update') && userData ? userData.cpf : "",
    },
  })
  
  useEffect(() => {
    if (fields.includes('update') && userData) {
      form.reset({
        email: userData.email,
        password: "",
        name: userData.name,
        cpf: userData.cpf,
      })
    }
  }, [userData, fields, form])
  
  async function onSubmit(data: any) {
    console.log('Dados do formulário:', data);
    console.log('Arquivo de avatar:', avatarFile); // Certifique-se de que o arquivo está sendo capturado
  
    if (fields.includes('update')) {
      try {
        setUpdateLoading(true);
  
        // Prepara os dados para o endpoint user/update
        const updatedData = {
          name: data.name,
          email: data.email,
          password: data.password || "", // Envia a senha apenas se fornecida
        };
  
        // Faz a requisição para atualizar o perfil (user/update)
        const response = await fetch(`http://localhost:3000/user/update`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        });
  
        if (!response.ok) {
          throw new Error("Erro ao atualizar o perfil");
        }
  
        const result = await response.json();
        console.log("Perfil atualizado com sucesso:", result);
  
        // Atualiza o localStorage com os novos dados
        localStorage.setItem("userName", data.name);
  
        // Verifica se o avatar foi fornecido
        if (avatarFile) {
          // Faz a requisição para atualizar o avatar (user/avatar)
          const avatarUrl = await handleUpdateAvatar(user.userId || '', user.token || '', avatarFile);
          localStorage.setItem("userAvatar", avatarUrl); // Atualiza o avatar no localStorage
        } else {
          console.log("Nenhum arquivo de imagem foi enviado para o avatar.");
        }
  
        alert("Perfil atualizado com sucesso!");
        navigate('/profile');
      } catch (error: any) {
        console.error("Erro ao atualizar o perfil:", error);
        alert("Erro ao atualizar o perfil. Tente novamente.");
      } finally {
        setUpdateLoading(false);
      }
    }
  }
  async function handleRegisterSubmission(data: any) {
    console.log("handleRegisterSubmission called with data:", data);
    const { email, password, name, cpf } = data
    try {
      const response = await fetch(`http://localhost:3000/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name, cpf }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.error("Erro da API:", errorData)
        throw new Error(`Erro ao realizar o registro: ${response.status}`)
      }
      const result = await response.json()
      console.log("Registro bem-sucedido:", result)
      navigate('/')
    } catch (error: any) {
      console.error("Erro ao fazer registro:", error)
      alert("Erro ao realizar o registro. Verifique os dados inseridos.")
    }
  }
  
  async function handleLoginSubmission(data: any) {
    const { email, password } = data
    try {
      const response = await fetch(`http://localhost:3000/auth/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
      if (!response.ok) {
        throw new Error(`Erro ao realizar o login: ${response.status}`)
      }
      const result = await response.json()
      localStorage.setItem("token", result.token)
      localStorage.setItem("userId", result.id)
      localStorage.setItem("userName", result.name)
      localStorage.setItem("userLevel", result.level)
      localStorage.setItem("userAvatar", result.avatar)
      console.log("Login bem-sucedido:", result)
      navigate('/home')
    } catch (error: any) {
      console.error("Erro ao fazer login:", error)
      alert("Erro ao realizar o login. Verifique suas credenciais.")
    }
  }
  
  async function clearInputFields() {
    form.reset()
  }
  
  let submitHandler: (data: any) => Promise<void>;
  if (fields.includes("register")) {
    submitHandler = async (data) => {
      console.log("submitHandler for update called with data:", data);
      await handleRegisterSubmission(data); // Passa o arquivo de avatar
    };
    
  } else if (fields.includes("login")) {
    submitHandler = async (data) => {
      console.log("submitHandler for login called with data:", data);
      await handleLoginSubmission(data);
    };
  } else if (fields.includes("update")) {
    submitHandler = async (data) => {
      console.log("submitHandler for update called with data:", data);
      await onSubmit(data, avatarFile);
    };
  } else {
    submitHandler = async (data) => {
      console.log("submitHandler called with no matching fields:", data);
    };
  }
  
  return (
    <Form {...form}>
      <form
        className="grid w-full max-w-sm gap-4"
        onSubmit={(e) => {
          console.log("Form submitted");
          form.handleSubmit(submitHandler)(e);
        }}
      >
{fields.includes('avatar') && (
      <FormField
        control={form.control}
        name="avatar"
        render={({ field }) => (
          <FormItem >
            <FormLabel className="flex items-center gap-1"></FormLabel>
            <FormControl>
            <div className="relative w-[384px] h-[214px] flex justify-center ">
          <div className='relative flex justify-center w-[192px] h-[192px] '>
          <img
            src={user.avatar!}
            alt="Avatar"
            className="w-full h-full rounded-full object-cover"
          />

        
          <Button
            type="button"
            className="w-12 h-12 absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md flex items-center justify-center"
            onClick={() => document.getElementById("avatarInput")?.click()} // Aciona o input de arquivo
          >
            <Camera className="w-4 h-4 text-gray-600" />
          </Button>
         </div>
        {/* Input de Arquivo Oculto */}
        <Input
          type="file"
          accept="image/*"
          id="avatarInput"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setAvatarFile(file); // Atualiza o estado com o arquivo selecionado
          }}
        />
      </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
  )}    {fields.includes('name') && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className='mt-6'>
                <FormLabel className="flex items-center gap-1">
                  Nome Completo <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Ex: Jober Junior..."
                    className="p-2 border rounded-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
  
        {fields.includes('cpf') && (
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  CPF <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Ex: 123.456.789-10"
                    className="p-2 border rounded-md"
                    disabled={fields.includes('update')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
  
        {fields.includes('email') && (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className='mb-4'>
                <FormLabel className="flex items-center gap-1">
                  E-mail <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Ex: junior@gmail.com"
                    className="p-2 border rounded-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
  
        {fields.includes('password') && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className='mb-6 mt-[-12px]'>
                <FormLabel className="flex items-center gap-1">
                  Senha <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Ex: junior123"
                      className="pr-10 p-2 border rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
  
        {/* Botões de ação */}
        {fields.includes('register') && (
          <div>
            <Button type="submit" className="w-[200px] h-[6vh] lg:w-[400px]">
              Cadastrar
            </Button>
          </div>
        )}
  
        {fields.includes('login') && (
          <div>
            <Button type="submit" className="w-[200px] h-[6vh] lg:w-[400px]">
              Entrar
            </Button>
          </div>
        )}
  
        {fields.includes('update') && (
          <div className="flex gap-4 w-[384px] h-[44px] justify-center">
            <div>
              <Button type="submit" disabled={!userData || updateLoading} className="w-[100px] h-[6vh]">
                Editar
              </Button>
            </div>
            <div>
              <Button
                variant="ghost"
                type="button"
                onClick={clearInputFields}
                className="w-[100px] h-[6vh] border-3"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </form>
    </Form>
  )
}
  
export default CustomInput
