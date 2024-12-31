import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUserProgress } from '../../utils/achievementService';
import { UserProgress, Achievement } from '../../types/achievement';

export default function AchievementsScreen() {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    loadUserProgress();
  }, []);

  const loadUserProgress = async () => {
    const progress = await getUserProgress();
    setUserProgress(progress);
  };

  const renderAchievement = (achievement: Achievement) => (
    <View key={achievement.id} style={styles.achievementCard}>
      <View style={styles.achievementHeader}>
        <Text style={styles.achievementIcon}>{achievement.icon}</Text>
        <View style={styles.achievementInfo}>
          <Text style={styles.achievementName}>{achievement.name}</Text>
          <Text style={styles.achievementDescription}>
            {achievement.description}
          </Text>
        </View>
        <Ionicons 
          name={achievement.completed ? "checkmark-circle" : "checkmark-circle-outline"} 
          size={24} 
          color={achievement.completed ? "#10B981" : "#9CA3AF"} 
        />
      </View>
    </View>
  );

  if (!userProgress) {
    return (
      <View style={styles.container}>
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>成就与奖励</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>用户等级</Text>
        <View style={styles.levelContainer}>
          <Text style={styles.levelText}>等级 {userProgress.level}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {userProgress.level < 5 ? '水滴新手' : 
               userProgress.level < 10 ? '水滴达人' : '水滴大师'}
            </Text>
          </View>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${((userProgress.experience % 1000) / 1000) * 100}%` 
              }
            ]} 
          />
        </View>
        <Text style={styles.experienceText}>
          距离下一级还需 {1000 - (userProgress.experience % 1000)} 点经验
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>成就列表</Text>
        {userProgress.achievements.map(renderAchievement)}
      </View>
    </ScrollView>
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
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  badge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  badgeText: {
    color: '#4B5563',
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  experienceText: {
    fontSize: 14,
    color: '#6B7280',
  },
  achievementCard: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  achievementInfo: {
    flex: 1,
  },
});

