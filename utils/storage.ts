import AsyncStorage from '@react-native-async-storage/async-storage';
import { WaterRecord } from '../types/water';

// 定义存储键
export const STORAGE_KEYS = {
  WATER_RECORDS: 'waterRecords',
  DAILY_GOAL: 'dailyGoal',
  USER_STATS: 'userStats',
  ACHIEVEMENTS: 'achievements',
  REMINDERS: 'reminders',
  SETTINGS: 'settings'
};

// 定义数据类型
export interface UserStats {
  totalConsumed: number;
  streak: number;
  lastRecordDate: string;
}

export interface Reminder {
  id: string;
  hour: number;
  minute: number;
  enabled: boolean;
}

// 存储方法
export const storeData = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('保存数据失败:', e);
    throw e;
  }
};

// 读取方法
export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? JSON.parse(value) : null;
  } catch (e) {
    console.error('读取数据失败:', e);
    throw e;
  }
};

// 更新首页的饮水记录
export const updateWaterRecord = async (amount: number) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const records = await getData(STORAGE_KEYS.WATER_RECORDS) || {};
    
    if (!records[today]) {
      records[today] = [];
    }
    
    records[today].push({
      id: Date.now().toString(),
      amount,
      timestamp: Date.now()
    });
    
    await storeData(STORAGE_KEYS.WATER_RECORDS, records);
    return records[today];
  } catch (e) {
    console.error('更新饮水记录失败:', e);
    throw e;
  }
};