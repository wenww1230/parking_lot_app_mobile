import React, {useContext} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthContext} from '../contexts/AuthContext';
import {LoginScreen} from '../screens/LoginScreen/LoginScreen';
import {MainMenuScreen} from '../screens/MainMenuScreen/MainMenuScreen';
import {ParteDiarioScreen} from '../screens/ParteDiarioScreen/ParteDiarioScreen';
import {ClientVehicleScreen} from '../screens/ClientVehicleScreen/ClientVehicleScreen';
import {ClientesQueDebenScreen} from '../screens/ClientesQueDebenScreen/ClientesQueDebenScreen';
import {TarifasScreen} from '../screens/TarifasScreen/TarifasScreen';

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  const auth = useContext(AuthContext);

  if (auth?.isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!auth?.user) {
    return <LoginScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="MainMenu" component={MainMenuScreen} />
        <Stack.Screen name="ParteDiario" component={ParteDiarioScreen} />
        <Stack.Screen name="ClientVehicle" component={ClientVehicleScreen} />
        <Stack.Screen name="ClientesQueDeben" component={ClientesQueDebenScreen} />
        <Stack.Screen name="Tarifas" component={TarifasScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
