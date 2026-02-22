import React, {useState, useCallback} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {tariffUseCase, vehicleUseCase} from '../../../di/UseCaseContainer';
import {Tariff} from '../../../domain/entities/Tariff';
import {EditTariffModal} from '../../components/EditTariffModal/EditTariffModal';
import {CreateVehicleTypeModal} from '../../components/CreateVehicleTypeModal/CreateVehicleTypeModal';
import {tarifasScreenStyles} from './TarifasScreen.styles';

export function TarifasScreen() {
  const navigation = useNavigation<any>();
  const [data, setData] = useState<Tariff[]>([]);
  const [editingTariff, setEditingTariff] = useState<Tariff | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(async () => {
    const list = await tariffUseCase.getAll();
    setData(list);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleSaveTariff = async (amount: number) => {
    if (!editingTariff) return;
    await tariffUseCase.setTariff(editingTariff.vehicleTypeId, amount);
    setEditingTariff(null);
    load();
  };

  const handleCreateType = async (name: string, amount: number) => {
    const vt = await vehicleUseCase.createVehicleType(name);
    await tariffUseCase.setTariff(vt.id, amount);
    setShowCreate(false);
    load();
  };

  return (
    <View style={tarifasScreenStyles.container}>
      <View style={tarifasScreenStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={tarifasScreenStyles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={tarifasScreenStyles.title}>Tarifas</Text>
        <TouchableOpacity
          onPress={() => setShowCreate(true)}
          style={{marginLeft: 'auto'}}
        >
          <Text style={tarifasScreenStyles.backText}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={tarifasScreenStyles.list}
        data={data}
        keyExtractor={(item) => `${item.vehicleTypeId}`}
        renderItem={({item}) => (
          <TouchableOpacity
            style={tarifasScreenStyles.card}
            onPress={() => setEditingTariff(item)}
          >
            <Text style={tarifasScreenStyles.typeName}>{item.vehicleTypeName}</Text>
            <Text style={tarifasScreenStyles.amount}>S/ {item.amount}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={tarifasScreenStyles.empty}>Sin tarifas</Text>}
      />
      {editingTariff && (
        <EditTariffModal
          tariff={editingTariff}
          onSave={handleSaveTariff}
          onCancel={() => setEditingTariff(null)}
        />
      )}
      {showCreate && (
        <CreateVehicleTypeModal
          onSave={handleCreateType}
          onCancel={() => setShowCreate(false)}
        />
      )}
    </View>
  );
}
