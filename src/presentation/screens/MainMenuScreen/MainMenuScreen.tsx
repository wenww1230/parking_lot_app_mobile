import React, {useContext} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../../contexts/AuthContext';
import {MenuCard} from '../../components/MenuCard/MenuCard';
import {mainMenuScreenStyles} from './MainMenuScreen.styles';

export function MainMenuScreen() {
  const auth = useContext(AuthContext);
  const navigation = useNavigation<any>();

  return (
    <View style={mainMenuScreenStyles.container}>
      <View style={mainMenuScreenStyles.header}>
        <Text style={mainMenuScreenStyles.title}>Menú Principal</Text>
        <TouchableOpacity onPress={() => auth?.logout()}>
          <Text style={mainMenuScreenStyles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={mainMenuScreenStyles.scroll}>
        <MenuCard
          title="Parte Diario"
          subtitle="Historial de parkeos, agregar y editar registros"
          onPress={() => navigation.navigate('ParteDiario')}
        />
        <MenuCard
          title="Clientes y Vehículos"
          subtitle="Gestionar clientes y sus vehículos"
          onPress={() => navigation.navigate('ClientVehicle')}
        />
        <MenuCard
          title="Clientes que más deben"
          subtitle="Ver deuda pendiente por cliente"
          onPress={() => navigation.navigate('ClientesQueDeben')}
        />
        <MenuCard
          title="Tarifas"
          subtitle="Tipos de vehículo y tarifas"
          onPress={() => navigation.navigate('Tarifas')}
        />
      </ScrollView>
    </View>
  );
}
