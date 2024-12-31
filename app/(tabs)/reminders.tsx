'use client'

import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, Switch, Alert } from 'react-native'
import ReminderList from '../../components/ReminderList'
import AddReminderForm from '../../components/AddReminderForm'
import { getData, storeData, STORAGE_KEYS, Reminder } from '../../utils/storage'
import { scheduleNotification, cancelNotification } from '../../utils/notificationService'

export default function RemindersScreen() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  useEffect(() => {
    loadReminders()
  }, [])

  const loadReminders = async () => {
    try {
      const savedReminders = await getData(STORAGE_KEYS.REMINDERS)
      if (savedReminders) {
        setReminders(savedReminders)
      }
    } catch (error) {
      console.error('加载提醒设置失败:', error)
    }
  }

  const addReminder = async (time: string) => {
    try {
      const [hours, minutes] = time.split(':').map(Number)
      const newReminder: Reminder = {
        id: Date.now().toString(),
        hour: hours,
        minute: minutes,
        enabled: true
      }

      const updatedReminders = [...reminders, newReminder]
      await storeData(STORAGE_KEYS.REMINDERS, updatedReminders)
      setReminders(updatedReminders)

      if (notificationsEnabled) {
        await scheduleNotification(newReminder)
      }

      Alert.alert('提示', `提醒已设置: ${time}`)
    } catch (error) {
      console.error('添加提醒失败:', error)
      Alert.alert('错误', '添加提醒失败')
    }
  }

  const toggleReminder = async (id: string) => {
    try {
      const updatedReminders = reminders.map(reminder => {
        if (reminder.id === id) {
          const updated = { ...reminder, enabled: !reminder.enabled }
          if (updated.enabled && notificationsEnabled) {
            scheduleNotification(updated)
          } else {
            cancelNotification(id)
          }
          return updated
        }
        return reminder
      })
      
      await storeData(STORAGE_KEYS.REMINDERS, updatedReminders)
      setReminders(updatedReminders)
    } catch (error) {
      console.error('更新提醒状态失败:', error)
      Alert.alert('错误', '更新提醒状态失败')
    }
  }

  const deleteReminder = async (id: string) => {
    try {
      await cancelNotification(id)
      const updatedReminders = reminders.filter(r => r.id !== id)
      await storeData(STORAGE_KEYS.REMINDERS, updatedReminders)
      setReminders(updatedReminders)
    } catch (error) {
      console.error('删除提醒失败:', error)
      Alert.alert('错误', '删除提醒失败')
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>提醒设置</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>通知设置</Text>
        <View style={styles.switchContainer}>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
          <Text style={styles.switchLabel}>启用通知</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>提醒时间</Text>
        <ReminderList 
          reminders={reminders}
          onToggle={toggleReminder}
          onDelete={deleteReminder}
        />
        <AddReminderForm onAdd={addReminder} />
      </View>
    </ScrollView>
  )
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
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4B5563',
  },
})

