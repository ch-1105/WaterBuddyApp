import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';

interface SettingsMenuProps {
  dailyGoal: number;
  onGoalChange: (goal: number) => void;
  onReset: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ 
  dailyGoal, 
  onGoalChange, 
  onReset 
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Daily Goal (ml)</Text>
        <TextInput
          style={styles.input}
          value={String(dailyGoal)}
          onChangeText={(text) => onGoalChange(Number(text.replace(/[^0-9]/g, '')))}
          keyboardType="numeric"
          placeholder="Enter daily goal"
        />
      </View>
      <TouchableOpacity
        style={styles.resetButton}
        onPress={onReset}
      >
        <Text style={styles.resetButtonText}>Reset Progress</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#EF4444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsMenu;