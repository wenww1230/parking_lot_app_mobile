import {StyleSheet} from 'react-native';

export const tarifasScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5e7eb',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  backText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  list: {
    flex: 1,
    padding: 12,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  typeName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1f2937',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563eb',
    marginTop: 4,
  },
  empty: {
    padding: 32,
    textAlign: 'center',
    color: '#6b7280',
  },
});
