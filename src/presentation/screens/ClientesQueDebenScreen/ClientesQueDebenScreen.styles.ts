import {StyleSheet} from 'react-native';

export const clientesQueDebenScreenStyles = StyleSheet.create({
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
  clientName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1f2937',
  },
  clientPhone: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  debtAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#dc2626',
    marginTop: 8,
  },
  pendingCount: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 2,
  },
  tapHint: {
    fontSize: 12,
    color: '#2563eb',
    marginTop: 8,
  },
  empty: {
    padding: 32,
    textAlign: 'center',
    color: '#6b7280',
  },
});
