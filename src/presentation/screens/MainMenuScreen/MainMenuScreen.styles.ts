import {StyleSheet} from 'react-native';

export const mainMenuScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    padding: 16,
    paddingTop: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  logoutText: {
    color: '#2563eb',
    fontSize: 14,
  },
  scroll: {
    flex: 1,
  },
});
