import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Reminder } from '../utils/storage';

interface ReminderListProps {
  reminders: Reminder[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ReminderList({ reminders, onToggle, onDelete }: ReminderListProps) {
  return (
    <View style={styles.container}>
      {reminders.map(reminder => (
        <View key={reminder.id} style={styles.reminderItem}>
          <Text style={styles.reminderTime}>
            {`${reminder.hour.toString().padStart(2, '0')}:${reminder.minute.toString().padStart(2, '0')}`}
          </Text>
          <View style={styles.reminderActions}>
            <Switch
              value={reminder.enabled}
              onValueChange={() => onToggle(reminder.id)}
            />
            <Text 
              style={styles.deleteButton}
              onPress={() => onDelete(reminder.id)}
            >
              删除
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  reminderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  reminderTime: {
    fontSize: 16,
    fontWeight: '500',
  },
  reminderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    marginLeft: 16,
    color: '#EF4444',
  },
});

