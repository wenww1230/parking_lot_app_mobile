import React, {useState, useContext} from 'react';
import {View, Text} from 'react-native';
import {AuthContext} from '../../contexts/AuthContext';
import {LoginForm} from '../../components/LoginForm/LoginForm';
import {loginScreenStyles} from './LoginScreen.styles';

export function LoginScreen() {
  const auth = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await auth!.login(username, password);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al iniciar sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={loginScreenStyles.container}>
      <Text style={loginScreenStyles.title}>Parking Lot Admin</Text>
      <LoginForm
        username={username}
        password={password}
        error={error}
        isLoading={isSubmitting}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
      />
    </View>
  );
}
