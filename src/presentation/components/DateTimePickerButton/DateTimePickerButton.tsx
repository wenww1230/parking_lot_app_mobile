import React, {useState} from 'react';
import {Platform, TouchableOpacity, Text} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {dateTimePickerButtonStyles} from './DateTimePickerButton.styles';

function formatDateTime(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}`;
}

interface DateTimePickerButtonProps {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export function DateTimePickerButton({
  value,
  placeholder,
  onChange,
}: DateTimePickerButtonProps) {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<'date' | 'time' | 'datetime'>('date');
  const [tempDate, setTempDate] = useState<Date>(() => {
    if (value) {
      const [datePart, timePart] = value.split(' ');
      const [y, m, d] = (datePart || '').split('-').map(Number);
      const [h = 0, min = 0] = (timePart || '').split(':').map(Number);
      return new Date(y, (m || 1) - 1, d || 1, h, min);
    }
    return new Date();
  });

  const handlePress = () => {
    setTempDate(value ? (() => {
      const [datePart, timePart] = value.split(' ');
      const [y, m, d] = (datePart || '').split('-').map(Number);
      const [h = 0, min = 0] = (timePart || '').split(':').map(Number);
      return new Date(y, (m || 1) - 1, d || 1, h, min);
    })() : new Date());
    if (Platform.OS === 'ios') {
      setMode('datetime');
      setShow(true);
    } else {
      setMode('date');
      setShow(true);
    }
  };

  const handleChange = (_: any, selectedDate?: Date) => {
    if (Platform.OS === 'android' && mode !== 'time') {
      setShow(false);
    }
    if (!selectedDate) return;
    if (Platform.OS === 'ios' && mode === 'datetime') {
      onChange(formatDateTime(selectedDate));
      setShow(false);
      return;
    }
    if (Platform.OS === 'android' && mode === 'date') {
      setTempDate(selectedDate);
      setMode('time');
      setShow(true);
      return;
    }
    if (Platform.OS === 'android' && mode === 'time') {
      setShow(false);
      const combined = new Date(tempDate);
      combined.setHours(selectedDate.getHours(), selectedDate.getMinutes());
      onChange(formatDateTime(combined));
      setMode('date');
      return;
    }
    onChange(formatDateTime(selectedDate));
  };

  const displayValue = value || placeholder;

  return (
    <>
      <TouchableOpacity
        style={dateTimePickerButtonStyles.touchable}
        onPress={handlePress}
      >
        <Text
          style={[
            dateTimePickerButtonStyles.text,
            !value && dateTimePickerButtonStyles.placeholder,
          ]}
        >
          {displayValue}
        </Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={tempDate}
          mode={Platform.OS === 'ios' ? 'datetime' : mode}
          display={Platform.OS === 'ios' ? 'default' : 'default'}
          onChange={handleChange}
        />
      )}
    </>
  );
}
