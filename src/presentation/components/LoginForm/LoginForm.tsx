import React, {useState} from 'react';
import {View, TextInput, Text, TouchableOpacity} from 'react-native';
import {loginFormStyles} from './LoginForm.styles';

interface LoginFormProps {
  username: string;
  password: string;
  error: string | null;
  isLoading: boolean;
  onUsernameChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: () => void;
}

export function LoginForm({
  username,
  password,
  error,
  isLoading,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={loginFormStyles.container}>
      {error ? <Text style={loginFormStyles.error}>{error}</Text> : null}
      <TextInput
        style={loginFormStyles.input}
        placeholder="Usuario"
        placeholderTextColor="#6b7280"
        value={username}
        onChangeText={onUsernameChange}
        autoCapitalize="none"
        editable={!isLoading}
      />
      <View style={loginFormStyles.passwordWrapper}>
        <TextInput
          style={loginFormStyles.inputPassword}
          placeholder="Contraseña"
          placeholderTextColor="#6b7280"
          value={password}
          onChangeText={onPasswordChange}
          secureTextEntry={!showPassword}
          editable={!isLoading}
        />
        <TouchableOpacity
          style={loginFormStyles.eyeButton}
          onPress={() => setShowPassword((v) => !v)}
          disabled={isLoading}
        >
          <Text style={loginFormStyles.eyeText}>{showPassword ? 'Ocultar' : 'Ver'}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[loginFormStyles.button, isLoading && loginFormStyles.buttonDisabled]}
        onPress={onSubmit}
        disabled={isLoading}
      >
        <Text style={loginFormStyles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}
