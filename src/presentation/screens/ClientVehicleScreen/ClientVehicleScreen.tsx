import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {Client} from '../../../domain/entities/Client';
import {ClientVehicleWithDetails} from '../../../domain/repositories/IClientVehicleRepository';
import {clientUseCase, vehicleUseCase} from '../../../di/UseCaseContainer';
import {ClientCardOptionsModal} from '../../components/ClientCardOptionsModal/ClientCardOptionsModal';
import {EditClientModal} from '../../components/EditClientModal/EditClientModal';
import {AddVehicleForClientModal} from '../../components/AddVehicleForClientModal/AddVehicleForClientModal';
import {clientVehicleScreenStyles} from './ClientVehicleScreen.styles';

interface ClientWithVehicles {
  client: Client;
  vehicles: ClientVehicleWithDetails[];
}

export function ClientVehicleScreen() {
  const navigation = useNavigation<any>();
  const [data, setData] = useState<ClientWithVehicles[]>([]);
  const [selectedItem, setSelectedItem] = useState<ClientWithVehicles | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);

  const load = useCallback(async () => {
    const clients = await clientUseCase.getAllClients();
    const result: ClientWithVehicles[] = [];
    for (const client of clients) {
      const vehicles = await vehicleUseCase.getVehiclesByClientId(client.id);
      result.push({client, vehicles});
    }
    setData(result);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleCardPress = (item: ClientWithVehicles) => {
    setSelectedItem(item);
  };

  const handleEdit = () => {
    if (selectedItem) setShowEditModal(true);
  };

  const handleAddVehicle = () => {
    if (selectedItem) setShowAddVehicleModal(true);
  };

  const handleDelete = () => {
    if (!selectedItem) return;
    Alert.alert(
      'Eliminar cliente',
      `¿Eliminar a ${selectedItem.client.name}? Se borrarán también sus vehículos e historial de parkeos.`,
      [
        {text: 'Cancelar', style: 'cancel', onPress: () => setSelectedItem(null)},
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await clientUseCase.deleteClient(selectedItem.client.id);
            setSelectedItem(null);
            load();
          },
        },
      ]
    );
  };

  const handleEditSave = async (name: string, phone: string) => {
    if (!selectedItem) return;
    await clientUseCase.updateClient(selectedItem.client.id, name, phone);
    setShowEditModal(false);
    setSelectedItem(null);
    load();
  };

  return (
    <View style={clientVehicleScreenStyles.container}>
      <View style={clientVehicleScreenStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={clientVehicleScreenStyles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={clientVehicleScreenStyles.title}>Clientes y Vehículos</Text>
      </View>
      <FlatList
        style={clientVehicleScreenStyles.list}
        data={data}
        keyExtractor={(item) => String(item.client.id)}
        renderItem={({item}) => (
          <TouchableOpacity
            style={clientVehicleScreenStyles.card}
            onPress={() => handleCardPress(item)}
            activeOpacity={0.7}
          >
            <Text style={clientVehicleScreenStyles.clientName}>{item.client.name}</Text>
            <Text style={clientVehicleScreenStyles.clientPhone}>{item.client.phone}</Text>
            <Text style={clientVehicleScreenStyles.vehicleCount}>
              {item.vehicles.length} {item.vehicles.length === 1 ? 'vehículo' : 'vehículos'}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={clientVehicleScreenStyles.empty}>Sin clientes</Text>}
      />

      <ClientCardOptionsModal
        visible={selectedItem !== null && !showEditModal && !showAddVehicleModal}
        clientName={selectedItem?.client.name ?? ''}
        onEdit={handleEdit}
        onAddVehicle={handleAddVehicle}
        onDelete={handleDelete}
        onCancel={() => setSelectedItem(null)}
      />

      {showEditModal && selectedItem && (
        <EditClientModal
          client={selectedItem.client}
          onSave={handleEditSave}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedItem(null);
          }}
        />
      )}
      {showAddVehicleModal && selectedItem && (
        <AddVehicleForClientModal
          clientId={selectedItem.client.id}
          onComplete={() => {
            setShowAddVehicleModal(false);
            setSelectedItem(null);
            load();
          }}
          onCancel={() => {
            setShowAddVehicleModal(false);
          }}
        />
      )}
    </View>
  );
}
