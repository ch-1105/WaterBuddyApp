import AsyncStorage from '@react-native-async-storage/async-storage';
import { Achievement, UserProgress } from '../types/achievement';
import { handleError } from './errorHandler';

const STORAGE_KEY = 'userProgress';

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 1,
    name: "初次启程",
    description: "完成第一天的饮水目标",
    completed: false,
    icon: "🌱",
    requiredValue: 2000,
    type: 'daily'
  },
  {
    id: 2,
    name: "一周坚持",
    description: "连续7天达成饮水目标",
    completed: false,
    icon: "🔥",
    requiredValue: 7,
    type: 'streak'
  },
  {
    id: 3,
    name: "水中健将",
    description: "累计饮水量达到100升",
    completed: false,
    icon: "🏆",
    requiredValue: 100000,
    type: 'total'
  },
];

export const calculateExperience = (consumed: number): number => {
  return Math.floor(consumed / 100); // 每100ml获得1点经验
};

export const calculateLevel = (experience: number): number => {
  return Math.floor(experience / 1000) + 1; // 每1000经验升一级
};

export const getUserProgress = async (): Promise<UserProgress> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return {
      level: 1,
      experience: 0,
      totalConsumed: 0,
      streak: 0,
      achievements: ACHIEVEMENTS,
    };
  } catch (error) {
    handleError(error as Error, 'getUserProgress');
    return {
      level: 1,
      experience: 0,
      totalConsumed: 0,
      streak: 0,
      achievements: ACHIEVEMENTS,
    };
  }
};

export const updateProgress = async (
  dailyConsumed: number,
  streak: number,
  totalConsumed: number
): Promise<{
  newAchievements: Achievement[];
  currentProgress: UserProgress;
}> => {
  try {
    const progress = await getUserProgress();
    const newExperience = calculateExperience(dailyConsumed);
    const updatedProgress = {
      ...progress,
      experience: progress.experience + newExperience,
      totalConsumed: totalConsumed,
      streak: streak,
    };

    // 检查成就
    const newAchievements: Achievement[] = [];
    updatedProgress.achievements = progress.achievements.map(achievement => {
      if (!achievement.completed) {
        let completed = false;
        switch (achievement.type) {
          case 'daily':
            completed = dailyConsumed >= achievement.requiredValue;
            break;
          case 'streak':
            completed = streak >= achievement.requiredValue;
            break;
          case 'total':
            completed = totalConsumed >= achievement.requiredValue;
            break;
        }
        if (completed) {
          newAchievements.push(achievement);
          return { ...achievement, completed: true };
        }
      }
      return achievement;
    });

    // 更新等级
    updatedProgress.level = calculateLevel(updatedProgress.experience);

    // 保存进度
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProgress));

    return {
      newAchievements,
      currentProgress: updatedProgress,
    };
  } catch (error) {
    handleError(error as Error, 'updateProgress');
    return {
      newAchievements: [],
      currentProgress: await getUserProgress(),
    };
  }
};

