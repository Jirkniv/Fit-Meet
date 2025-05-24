import prisma from "../prismaClient";

export async function createMany(data: any[]) {
  await prisma.achievements.createMany({
    data,
  });
}



export async function getCount() {
  return await prisma.achievements.count();
}

export async function create(data: any) {
    await prisma.userAchievements.create({
      data,
    });
  }
  
  export async function findAchievementsByUserId(userId: string) {
    return await prisma.userAchievements.findMany({
      where: {
        userId,
      },
      include: {
        achievement: true,
      },
    });
  }
  export async function hasAchievement(userId: string, achievementId: string) {
    const existing = await prisma.userAchievements.findFirst({
      where: {
        userId,
        achievementId
      }
    });
    return !!existing;
  }

  export async function findByName(name: string) {
    return await prisma.achievements.findFirst({
      where: {
        name,
      },
    });
  }

//   export async function findByAchievementIdAndUserId(
//     achievementId: string,
//     userId: string
//   ) {
//     return await prisma.userAchievements.findUnique({
//       where: {
//         userId_achievementId: {
//           userId,
//           achievementId,
//         },
//       },
//     });
//   }