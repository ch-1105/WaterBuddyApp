import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import WaterConsumptionChart from '../../components/WaterConsumptionChart';
import WaterConsumptionSummary from '../../components/WaterConsumptionSummary';
import { getStatistics } from '../../utils/statisticsService';
import { handleError } from '../../utils/errorHandler';
import { useFocusEffect } from '@react-navigation/native';

export default function StatisticsScreen() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<{
    chartData: any[];
    summary: {
      totalConsumed: number;
      averageConsumed: number;
      goalAchievement: number;
      streak: number;
    };
  }>({
    chartData: [],
    summary: {
      totalConsumed: 0,
      averageConsumed: 0,
      goalAchievement: 0,
      streak: 0,
    }
  });

  useFocusEffect(
    React.useCallback(() => {
      loadStatistics();
    }, [activeTab])
  );

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const data = await getStatistics(activeTab);
      setStatistics(data);
    } catch (error) {
      handleError(error as Error, 'loadStatistics');
    } finally {
      setLoading(false);
    }
  };

  const renderTabButton = (tab: 'daily' | 'weekly' | 'monthly', label: string) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>饮水统计</Text>

      <View style={styles.card}>
        <WaterConsumptionSummary {...statistics.summary} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>饮水趋势</Text>
        <View style={styles.tabsContainer}>
          {renderTabButton('daily', '日')}
          {renderTabButton('weekly', '周')}
          {renderTabButton('monthly', '月')}
        </View>
        {statistics.chartData.length > 0 ? (
          <WaterConsumptionChart 
            data={statistics.chartData} 
            period={activeTab}
          />
        ) : (
          <Text style={styles.noDataText}>暂无数据</Text>
        )}
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
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTabButton: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activeTabText: {
    color: '#2563EB',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    textAlign: 'center',
    color: '#6B7280',
    marginVertical: 20,
  },
});

