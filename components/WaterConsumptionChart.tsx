import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface DataPoint {
  date: string;
  consumed: number;
}

interface WaterConsumptionChartProps {
  data: DataPoint[];
  period: 'daily' | 'weekly' | 'monthly';
}

const WaterConsumptionChart: React.FC<WaterConsumptionChartProps> = ({ 
  data,
  period 
}) => {
  const chartData = {
    labels: data.map(item => {
      switch (period) {
        case 'daily':
          return item.date.slice(-2); // 显示日期的天数
        case 'weekly':
          return `W${item.date.slice(-2)}`; // 显示周数
        case 'monthly':
          return item.date.slice(-2); // 显示月份
      }
    }),
    datasets: [{
      data: data.map(item => item.consumed),
    }]
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - 32} // 考虑边距
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default WaterConsumptionChart;