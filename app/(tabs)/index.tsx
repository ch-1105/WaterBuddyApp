import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import WaterProgress from '../../components/WaterProgress';
import QuickAddButton from '../../components/QuickAddButton';
import SettingsMenu from '../../components/SettingsMenu';
import { scheduleNotification, cancelAllNotifications } from '../../utils/notificationService';

export default function HomeScreen() {
  const [waterConsumed, setWaterConsumed] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    if (notificationsEnabled) {
      // 启用通知
      scheduleNotification('09:00');
      scheduleNotification('13:00');
      scheduleNotification('18:00');
    } else {
      // 取消所有通知
      cancelAllNotifications();
    }
  }, [notificationsEnabled]);

  const addWater = (amount: number) => {
    setWaterConsumed((prev) => Math.min(prev + amount, dailyGoal));
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
        onGoalChange={setDailyGoal}
        onReset={() => setWaterConsumed(0)}
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