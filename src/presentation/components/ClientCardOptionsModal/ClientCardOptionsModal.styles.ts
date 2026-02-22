import {StyleSheet} from 'react-native';

export const clientCardOptionsModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 32,
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  optionText: {
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'center',
  },
  optionTextDanger: {
    color: '#dc2626',
  },
  cancel: {
    marginTop: 8,
    padding: 16,
  },
  cancelText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});
