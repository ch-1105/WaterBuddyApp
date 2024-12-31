import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WaterConsumptionSummaryProps {
  totalConsumed: number;
  averageConsumed: number;
  goalAchievement: number;
  streak: number;
}

const WaterConsumptionSummary: React.FC<WaterConsumptionSummaryProps> = ({
  totalConsumed,
  averageConsumed,
  goalAchievement,
  streak,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="water" size={24} color="#3B82F6" />
        <Text style={styles.label}>总饮水量</Text>
        <Text style={styles.value}>{totalConsumed}ml</Text>
      </View>

      <View style={styles.card}>
        <Ionicons name="calculator" size={24} color="#3B82F6" />
        <Text style={styles.label}>日均饮水</Text>
        <Text style={styles.value}>{averageConsumed}ml</Text>
      </View>

      <View style={styles.card}>
        <Ionicons name="trophy" size={24} color="#3B82F6" />
        <Text style={styles.label}>目标达成</Text>
        <Text style={styles.value}>{goalAchievement}%</Text>
      </View>

      <View style={styles.card}>
        <Ionicons name="flame" size={24} color="#3B82F6" />
        <Text style={styles.label}>连续天数</Text>
        <Text style={styles.value}>{streak}天</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 8,
  },
  card: {
    width: '48%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB',
    marginTop: 4,
  },
});

export default WaterConsumptionSummary;