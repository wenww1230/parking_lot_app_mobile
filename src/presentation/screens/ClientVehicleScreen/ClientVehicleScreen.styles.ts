import {StyleSheet} from 'react-native';

export const clientVehicleScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  clientName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1f2937',
  },
  clientPhone: {
    fontSize: 15,
    color: '#6b7280',
    marginTop: 4,
  },
  vehicleCount: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 6,
  },
  empty: {
    padding: 24,
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 15,
  },
});
