import React, { useState } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Platform,
  Modal,
  Pressable 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

interface AddReminderFormProps {
  onAdd: (time: string) => void;
}

const AddReminderForm: React.FC<AddReminderFormProps> = ({ onAdd }) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);

    // Android
    if (Platform.OS === 'android') {  
      setShow(false);
      if (event.type !== 'dismissed' && selectedDate) {
        const hours = selectedDate.getHours().toString().padStart(2, '0');
        const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
        onAdd(`${hours}:${minutes}`);
      }
    }
  };

  const handleDone = () => {
    setShow(false);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    onAdd(`${hours}:${minutes}`);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShow(true)}
      >
        <View style={styles.buttonContent}>
          <Ionicons name="add-circle" size={24} color="#3B82F6" />
          <Text style={styles.addButtonText}>添加提醒</Text>
        </View>
      </TouchableOpacity>

      {Platform.OS === 'ios' ? (
        <Modal
          visible={show}
          transparent={true}
          animationType="slide"
        >
          <Pressable 
            style={styles.modalOverlay}
            onPress={() => setShow(false)}
          >
            <Pressable style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity 
                  onPress={() => setShow(false)}
                  style={styles.modalButton}
                >
                  <Text style={styles.cancelText}>取消</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>选择提醒时间</Text>
                <TouchableOpacity 
                  onPress={handleDone}
                  style={styles.modalButton}
                >
                  <Text style={styles.doneText}>确定</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={date}
                mode="time"
                display="spinner"
                onChange={onChange}
                style={styles.picker}
                textColor="#000000"
                locale="zh-CN"
              />
            </Pressable>
          </Pressable>
        </Modal>
      ) : (
        show && (
          <DateTimePicker
            value={date}
            mode="time"
            is24Hour={true}
            display="spinner"
            onChange={onChange}
            positiveButton={{ label: '确定', textColor: '#3B82F6' }}
            negativeButton={{ label: '取消', textColor: '#6B7280' }}
          />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  addButton: {
    backgroundColor: '#EBF5FF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalButton: {
    minWidth: 60,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
  },
  cancelText: {
    fontSize: 17,
    color: '#6B7280',
  },
  doneText: {
    fontSize: 17,
    color: '#3B82F6',
    fontWeight: '600',
    textAlign: 'right',
  },
  picker: {
    height: 216,
    backgroundColor: 'white',
  },
});

export default AddReminderForm;