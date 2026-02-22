import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AuthProvider} from './src/presentation/contexts/AuthContext';
import {AppNavigator} from './src/presentation/navigation/AppNavigator';
import {initDatabase} from './src/data/datasources/SqliteDatabase';

function AppContent() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    initDatabase()
      .then(() => setDbReady(true))
      .catch(() => setDbReady(true));
  }, []);

  if (!dbReady) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
        <Text style={{marginTop: 12, color: '#1f2937'}}>Cargando...</Text>
      </View>
    );
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
