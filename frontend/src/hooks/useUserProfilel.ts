import { useState, useEffect } from "react";
import { FetchUser } from "@/api/getUser";

export function useUserProfile() {
  const [perfil, setPerfil] = useState<any>({});

  useEffect(() => {
    async function FetchLogUser() {
      try {
        const perfil = await FetchUser();
        setPerfil(perfil);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    }
    FetchLogUser();
  }, []);

  return perfil;
}