import {StyleSheet, Platform} from 'react-native';

export const dateTimePickerButtonStyles = StyleSheet.create({
  touchable: {
    width: '48%',
    minWidth: 140,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 14,
    color: '#1f2937',
  },
  placeholder: {
    color: '#6b7280',
  },
});
