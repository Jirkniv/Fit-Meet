import * as achievementRepository from "../repositories/achievementsRepository";

export async function createAchievements(achievements: any[]) {
  const achievementsCount = await achievementRepository.getCount();
  if (achievements.length === achievementsCount) return;

  await achievementRepository.createMany(achievements);
}
export async function getAchievementByName(name: string) {
    return await achievementRepository.findByName(name);
  }

export async function grantAchievement(
    achievementName: string,
    userId: string
  ) {
    const achievement = await getAchievementByName(
      achievementName
    );
  
    const userAchievement = await achievementRepository.hasAchievement(userId, achievement!.id);
  
    if (userAchievement) return;
  
    await achievementRepository.create({
      achievementId: achievement?.id,
      userId,
    });
  }
  
  export async function getUserAchievements(userId: string) {
    return await achievementRepository.findAchievementsByUserId(userId);
}
