import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Reminder } from './storage';

export const scheduleNotification = async (reminder: Reminder) => {
  if (!reminder.enabled) return;

  // 取消已存在的通知
  await cancelNotification(reminder.id);

  // 设置每日重复的通知
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '喝水提醒',
      body: '该喝水啦！保持健康饮水习惯 💧',
      sound: true,
    },
    trigger: {
      hour: reminder.hour,
      minute: reminder.minute,
      repeats: true,
    },
    identifier: reminder.id,
  });
};

export const cancelNotification = async (id: string) => {
  await Notifications.cancelScheduledNotificationAsync(id);
};

export const setupNotifications = async () => {
  // 请求通知权限
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    return false;
  }

  // 配置通知行为
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  return true;
};