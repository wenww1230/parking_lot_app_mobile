import {StyleSheet} from 'react-native';

export const clientSelectorModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    maxHeight: '80%',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  closeText: {
    color: '#2563eb',
    fontSize: 14,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    margin: 16,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#fff',
  },
  list: {
    maxHeight: 300,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  itemPhone: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  addNewButton: {
    margin: 16,
    padding: 14,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    alignItems: 'center',
  },
  addNewButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
