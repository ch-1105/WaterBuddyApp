import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import WaterProgress from '../../components/WaterProgress';
import QuickAddButton from '../../components/QuickAddButton';
import SettingsMenu from '../../components/SettingsMenu';
import { getData, storeData, updateWaterRecord, STORAGE_KEYS } from '../../utils/storage';
import { updateProgress } from '../../utils/achievementService';
import { handleError } from '../../utils/errorHandler';

export default function HomeScreen() {
  const [waterConsumed, setWaterConsumed] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [todayRecords, setTodayRecords] = useState<WaterRecord[]>([]);
  const [streak, setStreak] = useState(0);
  const [totalConsumed, setTotalConsumed] = useState(0);

  // 加载保存的数据
  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      // 加载每日目标
      const savedGoal = await getData(STORAGE_KEYS.DAILY_GOAL);
      if (savedGoal) setDailyGoal(savedGoal);

      // 加载用户统计数据
      const userStats = await getData(STORAGE_KEYS.USER_STATS) || {
        totalConsumed: 0,
        streak: 0,
        lastRecordDate: ''
      };
      setStreak(userStats.streak);
      setTotalConsumed(userStats.totalConsumed);

      // 加载今日记录
      const today = new Date().toISOString().split('T')[0];
      const records = await getData(STORAGE_KEYS.WATER_RECORDS) || {};
      const todayData = records[today] || [];
      setTodayRecords(todayData);
      
      // 确保今日饮水量不超过目标值
      const totalToday = todayData.reduce((sum: number, record: WaterRecord) => 
        sum + record.amount, 0);
      setWaterConsumed(Math.min(totalToday, dailyGoal));

      // 更新连续天数
      if (userStats.lastRecordDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (userStats.lastRecordDate === yesterdayStr) {
          const newStreak = userStats.streak + 1;
          await storeData(STORAGE_KEYS.USER_STATS, {
            ...userStats,
            streak: newStreak,
            lastRecordDate: today
          });
          setStreak(newStreak);
        } else {
          await storeData(STORAGE_KEYS.USER_STATS, {
            ...userStats,
            streak: 1,
            lastRecordDate: today
          });
          setStreak(1);
        }
      }
    } catch (error) {
      handleError(error as Error, 'loadSavedData');
    }
  };

  const addWater = async (amount: number) => {
    try {
      // 检查是否会超过每日目标
      if (waterConsumed + amount > dailyGoal) {
        const remainingAmount = dailyGoal - waterConsumed;
        if (remainingAmount <= 0) {
          Alert.alert('提示', '今日饮水目标已达成！');
          return;
        }
        amount = remainingAmount;
        Alert.alert('提示', `已调整添加量至${amount}ml以符合每日目标`);
      }

      const updatedRecords = await updateWaterRecord(amount);
      setTodayRecords(updatedRecords);
      const newTotal = Math.min(waterConsumed + amount, dailyGoal);
      setWaterConsumed(newTotal);

      // 更新总饮水量
      const newTotalConsumed = totalConsumed + amount;
      setTotalConsumed(newTotalConsumed);

      // 更新用户统计数据
      const userStats = await getData(STORAGE_KEYS.USER_STATS) || {
        totalConsumed: 0,
        streak: 0,
        lastRecordDate: ''
      };
      
      await storeData(STORAGE_KEYS.USER_STATS, {
        ...userStats,
        totalConsumed: newTotalConsumed,
      });

      // 更新成就
      const { newAchievements } = await updateProgress(
        newTotal,
        streak,
        newTotalConsumed
      );

      // 显示成就通知
      if (newAchievements.length > 0) {
        newAchievements.forEach(achievement => {
          Alert.alert(
            '🎉 解锁新成就',
            `恭喜获得「${achievement.name}」成就！\n${achievement.description}`
          );
        });
      }
    } catch (error) {
      handleError(error as Error, 'addWater');
    }
  };

  const updateDailyGoal = async (newGoal: number) => {
    try {
      await storeData(STORAGE_KEYS.DAILY_GOAL, newGoal);
      setDailyGoal(newGoal);
    } catch (error) {
      Alert.alert('错误', '更新目标失败');
    }
  };

  const resetProgress = async () => {
    try {
      // 获取今天的日期
      const today = new Date().toISOString().split('T')[0];
      
      // 获取所有记录
      const records = await getData(STORAGE_KEYS.WATER_RECORDS) || {};
      
      // 获取当前的用户统计数据
      const userStats = await getData(STORAGE_KEYS.USER_STATS) || {
        totalConsumed: 0,
        streak: 0,
        lastRecordDate: ''
      };

      // 计算需要减去的今日总量
      const todayTotal = records[today]?.reduce((sum: number, record: WaterRecord) => 
        sum + record.amount, 0) || 0;

      // 更新用户统计数据
      await storeData(STORAGE_KEYS.USER_STATS, {
        ...userStats,
        totalConsumed: Math.max(0, userStats.totalConsumed - todayTotal),
      });

      // 清空今日记录
      records[today] = [];
      await storeData(STORAGE_KEYS.WATER_RECORDS, records);

      // 重置状态
      setWaterConsumed(0);
      setTodayRecords([]);
      setTotalConsumed(prev => Math.max(0, prev - todayTotal));

      Alert.alert('提示', '今日进度已重置');
    } catch (error) {
      handleError(error as Error, 'resetProgress');
      Alert.alert('错误', '重置失败');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Water Buddy</Text>
      <WaterProgress consumed={waterConsumed} goal={dailyGoal} />
      <View style={styles.achievementContainer}>
        <View style={styles.achievementHeader}>
          <Text style={styles.achievementTitle}>成就进度</Text>
          <Text style={styles.achievementProgress}>3 / 10</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <QuickAddButton onAdd={() => addWater(250)} />
      </View>
      <SettingsMenu 
        dailyGoal={dailyGoal}
        onGoalChange={updateDailyGoal}
        onReset={resetProgress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F3F4F6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 16,
  },
  achievementContainer: {
    marginVertical: 8,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementProgress: {
    fontSize: 14,
    color: '#6B7280',
  },
  buttonContainer: {
    marginVertical: 16,
  },
});