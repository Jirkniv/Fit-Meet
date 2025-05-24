// src/hooks/useUser.ts

import { useState, useEffect } from "react";

export interface User {
  userId: string | null;
  avatar: string | null;
  name: string | null;
  level: number;
  token: string | null;
}


export function useUser(): User {
  const [user, setUser] = useState<User>({
    userId: localStorage.getItem("userId"),
    avatar: localStorage.getItem("userAvatar"),
    name: localStorage.getItem("userName"),
    level: Number(localStorage.getItem("userLevel")) || 0,
    token: localStorage.getItem("token"),
  });


  const updateUserFromLocalStorage = () => {
    setUser({
      userId: localStorage.getItem("userId"),
      avatar: localStorage.getItem("userAvatar"),
      name: localStorage.getItem("userName"),
      level: Number(localStorage.getItem("userLevel")) || 0,
      token: localStorage.getItem("token"),
    });
  };

  useEffect(() => {
    const handleStorageChange = () => {
      updateUserFromLocalStorage();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return user;
}
