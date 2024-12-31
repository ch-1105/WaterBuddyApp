import * as Notifications from 'expo-notifications';
import { Alert, Platform } from 'react-native';
import { handleError } from './errorHandler';
import { Reminder } from './storage';

// 配置通知行为
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermissions = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      Alert.alert(
        '通知权限',
        '需要通知权限才能发送饮水提醒。请在设置中开启通知权限。',
        [
          { text: '取消', style: 'cancel' },
          { 
            text: '去设置', 
            onPress: () => Platform.OS === 'ios' 
              ? Notifications.openSettings() 
              : null 
          }
        ]
      );
      return false;
    }
    
    return true;
  } catch (error) {
    handleError(error as Error, 'requestNotificationPermissions');
    return false;
  }
};

export const scheduleNotification = async (reminder: Reminder) => {
  try {
    if (!reminder.enabled) return null;

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return null;

    // 取消已存在的通知
    await cancelNotification(reminder.id);

    // 设置每日重复的通知
    const identifier = await Notifications.scheduleNotificationAsync({
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

    return identifier;
  } catch (error) {
    handleError(error as Error, 'scheduleNotification');
    return null;
  }
};

export const cancelNotification = async (id: string) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (error) {
    handleError(error as Error, 'cancelNotification');
  }
};