import DateTimePicker from '@react-native-community/datetimepicker';
import React, {useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {AnimatedSwitch} from '../atoms';

interface Reminder {
  enabled: boolean; // Whether the reminder is enabled
  date: string | null; // Selected date in ISO format (e.g., "2025-04-11")
  time: string | null; // Selected time in "HH:mm" format (e.g., "14:30")
}

interface DateRangePickerProps {
  initialReminder: Reminder; // Initial reminder state
  onReminderChange: (reminder: Reminder) => void; // Callback to handle reminder changes
}
const DateRangePicker: React.FC<DateRangePickerProps> = ({
  initialReminder,
  onReminderChange,
}) => {
  const [reminderEnabled, setReminderEnabled] = useState(!!initialReminder);
  const [selectedDate, setSelectedDate] = useState(
    initialReminder?.date ? new Date(initialReminder.date) : null,
  );
  const [selectedTime, setSelectedTime] = useState(
    initialReminder?.time
      ? new Date(`2000-01-01T${initialReminder.time}`)
      : null,
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleToggleReminder = () => {
    setReminderEnabled(!reminderEnabled);
    if (!reminderEnabled) {
      // Reminder is being enabled, you might want to set default date/time
      if (!selectedDate) setSelectedDate(new Date());
      if (!selectedTime) setSelectedTime(new Date());
    } else {
      // Reminder is being disabled, clear date/time
      setSelectedDate(null);
      setSelectedTime(null);
    }
    onReminderChange({
      enabled: !reminderEnabled,
      date:
        !reminderEnabled && selectedDate
          ? selectedDate.toISOString().split('T')[0]
          : null,
      time:
        !reminderEnabled && selectedTime
          ? selectedTime.toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
            })
          : null,
    });
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const showTimepicker = () => {
    setShowTimePicker(true);
  };

  const hideDatePicker = () => {
    setShowDatePicker(false);
  };

  const hideTimePicker = () => {
    setShowTimePicker(false);
  };

  const handleDateChange = (_event: any, date: Date | undefined) => {
    hideDatePicker();
    if (date) {
      setSelectedDate(date);
      onReminderChange({
        enabled: reminderEnabled,
        date: date.toISOString().split('T')[0],
        time:
          selectedTime?.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
          }) || null,
      });
    }
  };

  const handleTimeChange = (_event: any, time: Date | undefined) => {
    hideTimePicker();
    if (time) {
      setSelectedTime(time);
      onReminderChange({
        enabled: reminderEnabled,
        date: selectedDate?.toISOString().split('T')[0] || null,
        time: time.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
    }
  };

  const clearReminder = () => {
    setReminderEnabled(false);
    setSelectedDate(null);
    setSelectedTime(null);
    onReminderChange({enabled: false, date: null, time: null});
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium">Reminder</Text>
        <AnimatedSwitch
          value={reminderEnabled}
          onValueChange={handleToggleReminder}
        />
      </View>

      {reminderEnabled && (
        <View style={styles.options}>
          <Button
            mode="outlined"
            onPress={showDatepicker}
            labelStyle={{color: '#4B5563'}}
            style={styles.button}
            icon="calendar-month-outline">
            {selectedDate ? selectedDate.toLocaleDateString() : 'Select Date'}
          </Button>

          <Button
            mode="outlined"
            onPress={showTimepicker}
            style={styles.button}
            labelStyle={{color: '#4B5563'}}
            icon="clock-outline">
            {selectedTime
              ? selectedTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Select Time'}
          </Button>

          {(selectedDate || selectedTime) && (
            <Button
              textColor="#DC2626"
              onPress={clearReminder}
              labelStyle={{fontSize: 18}}
              style={styles.clearButton}>
              Clear Reminder
            </Button>
          )}

          {Platform.OS === 'ios' && showDatePicker && (
            <DateTimePicker
              testID="datePicker"
              value={selectedDate || new Date()}
              mode="date"
              display="compact"
              onChange={handleDateChange}
            />
          )}

          {Platform.OS === 'ios' && showTimePicker && (
            <DateTimePicker
              testID="timePicker"
              value={selectedTime || new Date()}
              mode="time"
              is24Hour={false}
              display="clock"
              onChange={handleTimeChange}
            />
          )}
        </View>
      )}

      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker
          testID="datePicker"
          value={selectedDate || new Date()}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
        />
      )}

      {Platform.OS === 'android' && showTimePicker && (
        <DateTimePicker
          testID="timePicker"
          value={selectedTime || new Date()}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
    marginBottom: 16,
  },
  options: {
    paddingHorizontal: 0,
  },
  button: {
    marginBottom: 8,
    alignItems: 'flex-start', // Align text to the left within the button
    borderColor: 'transparent',
    paddingVertical: 4,
    backgroundColor: '#F3F4F6',
    color: '#4B5563',
  },
  clearButton: {
    marginTop: 10,
  },
});

export default DateRangePicker;
