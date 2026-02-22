import {StyleSheet} from 'react-native';

export const loginFormStyles = StyleSheet.create({
  container: {
    padding: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#fff',
  },
  passwordWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  inputPassword: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    paddingRight: 70,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#fff',
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  eyeText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#dc2626',
    marginBottom: 12,
    fontSize: 14,
  },
});
