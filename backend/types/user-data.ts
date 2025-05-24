type userData = {
    name: string;
    email: string;
    cpf: string;
    password: string;
    avatar?: string; 
    xp?: number;       
    level?: number;    
    deletedAts?: Date | null; 
  };
  
  export default userData;