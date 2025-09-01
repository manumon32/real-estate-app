import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useTheme} from '@theme/ThemeProvider';
import {Button} from 'react-native-paper';

interface DateTimeModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: any) => void;
}

const DateTimeModal: React.FC<DateTimeModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const [showPicker, setShowPicker] = useState(true);
  const {theme} = useTheme();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 2);

  const onChange = (event: any, date?: Date) => {
    if (!date) return;
    if (date) {
      setSelectedDate(date);
    }
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
  };

  const handleNext = () => {
    if (mode === 'date') {
      setMode('time');
      setShowPicker(true);
    } else {
      console.log(selectedDate.toISOString());
      onConfirm(selectedDate.toISOString());
      setMode('date');
      onClose();
    }
  };

  useEffect(() => {
    setShowPicker(visible);
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View
          style={[styles.modal, {backgroundColor: theme.colors.background}]}>
          <Text style={[styles.title, {color: theme.colors.text}]}>
            {mode === 'date' ? 'Select a Date' : 'Select a Time'}
          </Text>

          <Text
            style={[styles.title, {color: theme.colors.text, fontSize: 14}]}>
            {new Date(selectedDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              dayPeriod: 'long',
              hour12: true,
            })}
          </Text>

          {showPicker && (
            <DateTimePicker
              value={selectedDate}
              mode={mode}
              minimumDate={new Date()} // ✅ restrict past dates
              maximumDate={maxDate}
              onChange={onChange}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            />
          )}
          {!showPicker && (
            <Button
              onPress={() => {
                setMode('date');
                setShowPicker(true);
              }}>
              {' '}
              Select Date time{' '}
            </Button>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => {
                setMode('date');
                onClose();
              }}
              style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleNext();
              }}
              style={styles.okBtn}>
              <Text style={styles.okText}>
                {mode === 'date' ? 'Select Time' : 'Book'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    backgroundColor: '#2d2c2cff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  title: {fontSize: 18, fontWeight: '600', marginBottom: 15},
  actions: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#eee',
    alignItems: 'center',
  },
  okBtn: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#2f7e6f',
    alignItems: 'center',
  },
  cancelText: {color: '#333', fontSize: 16},
  okText: {color: '#fff', fontSize: 16, fontWeight: '600'},
});

export default DateTimeModal;
