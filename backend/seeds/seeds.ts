import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { uploadImage } from "../services/s3Service";
import { createAchievements } from "../services/achievementsService";

const prisma = new PrismaClient();
let defaultAvatar: string;
async function countActivityTypes() {
  return await prisma.activityTypes.count(); 
}
async function seedActivityTypes() {

   async function checkActivityTypes(activityTypes: any[]) {
    const activityTypesCount = await countActivityTypes();
    if (activityTypes.length === activityTypesCount) return;
  
    
  


  // Caminho para a imagem local
  const futebolPath = path.join(__dirname, "../assets/images/futebol.jpg");
  const  calisteniaPath = path.join(__dirname, "../assets/images/calistenia.jpg");
  const basquetePath = path.join(__dirname, "../assets/images/basquete.png");
  const corridaPath = path.join(__dirname, "../assets/images/corrida.jpg");

  
  const futebolBuffer = fs.readFileSync(futebolPath);
  const calisteniaBuffer = fs.readFileSync(calisteniaPath);
  const basqueteBuffer = fs.readFileSync(basquetePath);
  const corridaBuffer = fs.readFileSync(corridaPath);
  // Cria um objeto que simula um arquivo do multer
  const futebolFile = {
    originalname: "futebol.jpg",
    buffer: futebolBuffer,
    mimetype: "image/jpeg"
  } as Express.Multer.File;
  
  const calisteniaFile = {
    originalname: "calistenia.jpg",
    buffer: calisteniaBuffer,
    mimetype: "image/jpeg"
  } as Express.Multer.File;
  
  const basqueteFile = {
    originalname: "basquete.png",
    buffer: basqueteBuffer,
    mimetype: "image/png"
  } as Express.Multer.File;
  
  const corridaFile = {
    originalname: "corrida.jpg",
    buffer: corridaBuffer,
    mimetype: "image/jpeg"
  } as Express.Multer.File;

  const futebolImageUrl = await uploadImage(futebolFile);
  const calisteniaImageUrl = await uploadImage(calisteniaFile);
  const basqueteImageUrl = await uploadImage(basqueteFile);
  const corridaImageUrl = await uploadImage(corridaFile);

  await prisma.activityTypes.createMany({
    data: [
      { 
        id: uuidv4(),
        name: "Futebol",
        image: futebolImageUrl,
        description: "Atividades relacionadas ao futebol"
      },
      { 
        id: uuidv4(),
        name: "Calistenia",
        image: calisteniaImageUrl,
        description: "Pratica de atividades fisicas utilizando peso do próprio corpo"
      },
      { 
        id: uuidv4(),
        name: "Basquete",
        image: basqueteImageUrl,
        description: "Atividades relaciondas a basquete"
      },
      { 
        id: uuidv4(),
        name: "Corrida",
        image: corridaImageUrl,
        description: "Atividades relacionadas ao corrida"
      }
    ],
    skipDuplicates: true,
  });
  
  console.log("Seed de Activity Types concluída.");
  console.log(futebolImageUrl, calisteniaImageUrl, basqueteImageUrl, corridaImageUrl);
  }
}


  async function seedAchievements() {
  
  createAchievements(
     [
        { 
       
         id: uuidv4(),     
          name: "Your Own Way",
          criterion: "Create your first activity"
        },
        { 
          
          id: uuidv4(),
          name: "Starting",
          criterion: "Subscribe on a activity"
        },
        {   
           
            id: uuidv4(),
            name: "High Level",
            criterion: "Level up to the level 5"
        },
        { 
          id: uuidv4(),
          name: "Leveling Up",
          criterion: "Level up for the first time"  
        }  
       ]
);
    
    console.log("Seed dos Achievements concluída.");
  }

  async function seedDefaultAvatar() {
        const avatarPath = path.resolve(__dirname, "../assets/images/github.png");
   
    const avatarBuffer = fs.readFileSync(avatarPath);
    const avatarFile = {
      originalname: "github.png",
      buffer: avatarBuffer,
      mimetype: "image/png",
    } as Express.Multer.File;
  

    const existingUsersWithDefaultAvatar = await prisma.user.findFirst({
      where: { avatar: { contains: "github.png" } },
    });
  
    if (existingUsersWithDefaultAvatar) {
           defaultAvatar = existingUsersWithDefaultAvatar.avatar!;
      return;
    }
  
    
    const avatarImageUrl = await uploadImage(avatarFile);
  
 
    await prisma.user.updateMany({
      where: { OR: [{ avatar: null }, { avatar: "" }] },
      data: { avatar: avatarImageUrl },
    });
  
    console.log("Seed de Avatar Padrão concluída.");
    console.log(avatarImageUrl);
    defaultAvatar = avatarImageUrl;
  }

export { seedActivityTypes, seedAchievements, seedDefaultAvatar, defaultAvatar };