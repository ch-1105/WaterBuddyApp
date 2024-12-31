import { getData, STORAGE_KEYS } from './storage';
import { WaterRecord } from '../types/water';

interface StatisticsData {
  date: string;
  consumed: number;
}

export const getStatistics = async (period: 'daily' | 'weekly' | 'monthly') => {
  try {
    const records = await getData(STORAGE_KEYS.WATER_RECORDS) || {};
    const dates = Object.keys(records).sort();
    
    if (dates.length === 0) {
      return {
        chartData: [],
        summary: {
          totalConsumed: 0,
          averageConsumed: 0,
          goalAchievement: 0,
          streak: 0,
        }
      };
    }

    let chartData: StatisticsData[] = [];
    let totalConsumed = 0;

    switch (period) {
      case 'daily':
        // 获取最近7天的数据
        chartData = dates.slice(-7).map(date => ({
          date,
          consumed: records[date].reduce((sum: number, record: WaterRecord) => 
            sum + record.amount, 0)
        }));
        break;

      case 'weekly':
        // 按周分组数据
        const weeklyData = new Map<string, number>();
        dates.forEach(date => {
          const week = getWeekNumber(new Date(date));
          const weekKey = `${week[0]}-W${week[1]}`;
          const dayTotal = records[date].reduce((sum: number, record: WaterRecord) => 
            sum + record.amount, 0);
          weeklyData.set(weekKey, (weeklyData.get(weekKey) || 0) + dayTotal);
        });
        chartData = Array.from(weeklyData.entries())
          .slice(-4)
          .map(([date, consumed]) => ({ date, consumed }));
        break;

      case 'monthly':
        // 按月分组数据
        const monthlyData = new Map<string, number>();
        dates.forEach(date => {
          const monthKey = date.substring(0, 7); // YYYY-MM
          const dayTotal = records[date].reduce((sum: number, record: WaterRecord) => 
            sum + record.amount, 0);
          monthlyData.set(monthKey, (monthlyData.get(monthKey) || 0) + dayTotal);
        });
        chartData = Array.from(monthlyData.entries())
          .slice(-4)
          .map(([date, consumed]) => ({ date, consumed }));
        break;
    }

    // 计算总摄入量
    totalConsumed = Object.values(records).reduce((sum: number, dayRecords: WaterRecord[]) => 
      sum + dayRecords.reduce((daySum: number, record: WaterRecord) => daySum + record.amount, 0), 0);

    // 计算平均值
    const averageConsumed = Math.round(totalConsumed / dates.length);

    // 获取目标完成率
    const dailyGoal = await getData(STORAGE_KEYS.DAILY_GOAL) || 2000;
    const goalAchievement = Math.round((averageConsumed / dailyGoal) * 100);

    // 获取连续天数
    const userStats = await getData(STORAGE_KEYS.USER_STATS) || { streak: 0 };

    return {
      chartData,
      summary: {
        totalConsumed,
        averageConsumed,
        goalAchievement,
        streak: userStats.streak,
      }
    };
  } catch (error) {
    console.error('获取统计数据失败:', error);
    return {
      chartData: [],
      summary: {
        totalConsumed: 0,
        averageConsumed: 0,
        goalAchievement: 0,
        streak: 0,
      }
    };
  }
};

// 辅助函数：获取日期所在的周数
function getWeekNumber(date: Date): [number, number] {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return [
    d.getUTCFullYear(),
    Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  ];
}