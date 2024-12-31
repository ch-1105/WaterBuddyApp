import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface QuickAddButtonProps {
  onAdd: () => void;
}

const QuickAddButton: React.FC<QuickAddButtonProps> = ({ onAdd }) => {
  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={onAdd}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>Add Water (250ml)</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuickAddButton;