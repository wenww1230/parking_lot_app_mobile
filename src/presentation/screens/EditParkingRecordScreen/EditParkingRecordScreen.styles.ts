import {StyleSheet} from 'react-native';

export const editParkingRecordScreenStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeText: {
    color: '#2563eb',
  },
  content: {
    padding: 16,
  },
  readOnly: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#fff',
  },
  estadoButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  estadoButtonActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  estadoButtonPaid: {
    borderColor: '#16a34a',
    backgroundColor: '#f0fdf4',
  },
  estadoButtonText: {
    color: '#6b7280',
  },
  estadoButtonTextActive: {
    color: '#1f2937',
    fontWeight: '600',
  },
  paidButton: {
    backgroundColor: '#16a34a',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  paidButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
