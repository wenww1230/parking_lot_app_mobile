import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {Client} from '../../../domain/entities/Client';
import {ClientVehicleWithDetails} from '../../../domain/repositories/IClientVehicleRepository';
import {clientUseCase, vehicleUseCase, parkingRecordUseCase, tariffUseCase} from '../../../di/UseCaseContainer';
import {ClientSelectorModal} from '../../components/ClientSelectorModal/ClientSelectorModal';
import {CreateClientModal} from '../../components/CreateClientModal/CreateClientModal';
import {CreateVehicleModal} from '../../components/CreateVehicleModal/CreateVehicleModal';
import {addParkingRecordScreenStyles} from './AddParkingRecordScreen.styles';

interface AddParkingRecordScreenProps {
  onComplete: () => void;
  onCancel: () => void;
}

export function AddParkingRecordScreen({onComplete, onCancel}: AddParkingRecordScreenProps) {
  const [showClientSelector, setShowClientSelector] = useState(false);
  const [showCreateClient, setShowCreateClient] = useState(false);
  const [showCreateVehicle, setShowCreateVehicle] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [vehicles, setVehicles] = useState<ClientVehicleWithDetails[]>([]);
  const [selectedClientVehicleId, setSelectedClientVehicleId] = useState<number | null>(null);
  const [detalle, setDetalle] = useState('');
  const [soles, setSoles] = useState('');
  const [pagoAlMomento, setPagoAlMomento] = useState('');

  useEffect(() => {
    if (showClientSelector) {
      clientUseCase.searchClients(clientSearch).then(setClients);
    }
  }, [showClientSelector, clientSearch]);

  useEffect(() => {
    if (selectedClient) {
      vehicleUseCase.getVehiclesByClientId(selectedClient.id).then(setVehicles);
      setSelectedClientVehicleId(null);
    } else {
      setVehicles([]);
      setSelectedClientVehicleId(null);
    }
  }, [selectedClient]);

  useEffect(() => {
    if (!selectedClientVehicleId) return;
    const cv = vehicles.find((v) => v.id === selectedClientVehicleId);
    if (cv) {
      tariffUseCase.getByVehicleTypeId(cv.vehicle.typeId).then((t) => {
        if (t) setSoles((prev) => (prev === '' ? String(t.amount) : prev));
      });
    }
  }, [selectedClientVehicleId, vehicles]);

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setShowClientSelector(false);
  };

  const handleCreateClient = async (name: string, phone: string) => {
    const newClient = await clientUseCase.createClient(name, phone);
    setSelectedClient(newClient);
    setShowCreateClient(false);
    setShowClientSelector(false);
  };

  const handleCreateVehicle = async (
    typeId: number,
    color: string,
    placa: string,
    marca: string
  ) => {
    if (!selectedClient) return;
    const vehicle = await vehicleUseCase.createVehicle(typeId, color, placa, marca);
    const cv = await vehicleUseCase.assignVehicleToClient(selectedClient.id, vehicle.id);
    setVehicles((prev) => [...prev, cv]);
    setSelectedClientVehicleId(cv.id);
    setShowCreateVehicle(false);
  };

  const handleSave = async () => {
    if (!selectedClientVehicleId) return;
    const amount = parseFloat(soles) || 0;
    const pago = parseFloat(pagoAlMomento) || 0;
    await parkingRecordUseCase.addRecord(
      selectedClientVehicleId,
      detalle.trim() || '',
      amount,
      undefined,
      pago > 0 ? pago : undefined
    );
    onComplete();
  };

  const canSave = !!selectedClientVehicleId;

  return (
    <Modal visible animationType="slide" transparent>
      <View style={addParkingRecordScreenStyles.overlay}>
        <View style={addParkingRecordScreenStyles.sheet}>
          <View style={addParkingRecordScreenStyles.header}>
            <Text style={addParkingRecordScreenStyles.title}>Nuevo registro</Text>
            <TouchableOpacity onPress={onCancel}>
              <Text style={addParkingRecordScreenStyles.closeText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={addParkingRecordScreenStyles.content}>
            <Text style={addParkingRecordScreenStyles.label}>Cliente</Text>
            <TouchableOpacity
              style={addParkingRecordScreenStyles.clientButton}
              onPress={() => setShowClientSelector(true)}
            >
              <Text style={addParkingRecordScreenStyles.clientButtonText}>
                {selectedClient ? `${selectedClient.name} - ${selectedClient.phone}` : 'Elegir cliente'}
              </Text>
            </TouchableOpacity>

            {selectedClient ? (
              <>
                <Text style={addParkingRecordScreenStyles.label}>Vehículo (tipo - placa)</Text>
                {vehicles.map((cv) => (
                  <TouchableOpacity
                    key={cv.id}
                    style={[
                      addParkingRecordScreenStyles.clientButton,
                      selectedClientVehicleId === cv.id && {borderColor: '#16a34a', backgroundColor: '#f0fdf4'},
                    ]}
                    onPress={() => setSelectedClientVehicleId(cv.id)}
                  >
                    <Text style={addParkingRecordScreenStyles.clientButtonText}>
                      <Text style={{fontWeight: '700'}}>{cv.vehicle.placa}</Text> - {cv.vehicleType.name}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={addParkingRecordScreenStyles.clientButton}
                  onPress={() => setShowCreateVehicle(true)}
                >
                  <Text style={addParkingRecordScreenStyles.clientButtonText}>+ Crear vehículo</Text>
                </TouchableOpacity>
              </>
            ) : null}

            <Text style={addParkingRecordScreenStyles.label}>Detalle</Text>
            <TextInput
              style={addParkingRecordScreenStyles.input}
              placeholder="Detalle"
              placeholderTextColor="#6b7280"
              value={detalle}
              onChangeText={setDetalle}
            />
            <Text style={addParkingRecordScreenStyles.label}>Tarifa (S/)</Text>
            <TextInput
              style={addParkingRecordScreenStyles.input}
              placeholder="0.00"
              placeholderTextColor="#6b7280"
              value={soles}
              onChangeText={setSoles}
              keyboardType="decimal-pad"
            />
            <Text style={addParkingRecordScreenStyles.label}>Pago al momento (opcional)</Text>
            <TextInput
              style={addParkingRecordScreenStyles.input}
              placeholder="0.00 - total, parcial o nada"
              placeholderTextColor="#6b7280"
              value={pagoAlMomento}
              onChangeText={setPagoAlMomento}
              keyboardType="decimal-pad"
            />
            <TouchableOpacity
              style={addParkingRecordScreenStyles.saveButton}
              onPress={handleSave}
              disabled={!canSave}
            >
              <Text style={addParkingRecordScreenStyles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      <ClientSelectorModal
        visible={showClientSelector}
        clients={clients}
        searchQuery={clientSearch}
        onSearchChange={setClientSearch}
        onSelectClient={handleSelectClient}
        onClose={() => setShowClientSelector(false)}
        onAddNew={() => {
          setShowClientSelector(false);
          setShowCreateClient(true);
        }}
      />
      {showCreateClient && (
        <CreateClientModal
          onSave={handleCreateClient}
          onCancel={() => setShowCreateClient(false)}
        />
      )}
      {showCreateVehicle && selectedClient && (
        <CreateVehicleModal
          onSave={handleCreateVehicle}
          onCancel={() => setShowCreateVehicle(false)}
        />
      )}
    </Modal>
  );
}
