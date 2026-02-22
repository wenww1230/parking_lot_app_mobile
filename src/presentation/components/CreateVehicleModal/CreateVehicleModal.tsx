import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {vehicleUseCase} from '../../../di/UseCaseContainer';
import {VehicleType} from '../../../domain/entities/VehicleType';
import {createVehicleModalStyles} from './CreateVehicleModal.styles';

interface CreateVehicleModalProps {
  onSave: (typeId: number, color: string, placa: string, marca: string) => void;
  onCancel: () => void;
}

export function CreateVehicleModal({onSave, onCancel}: CreateVehicleModalProps) {
  const [types, setTypes] = useState<VehicleType[]>([]);
  const [typeId, setTypeId] = useState<number | null>(null);
  const [color, setColor] = useState('');
  const [placa, setPlaca] = useState('');
  const [marca, setMarca] = useState('');

  useEffect(() => {
    vehicleUseCase.getVehicleTypes().then(setTypes);
  }, []);

  useEffect(() => {
    if (types.length > 0 && typeId === null) {
      setTypeId(types[0].id);
    }
  }, [types, typeId]);

  const handleSave = () => {
    if (typeId === null || !placa.trim()) return;
    onSave(typeId, color.trim() || '-', placa.trim(), marca.trim() || '-');
  };

  return (
    <Modal visible transparent animationType="fade">
      <View style={createVehicleModalStyles.overlay}>
        <ScrollView contentContainerStyle={createVehicleModalStyles.modal}>
          <Text style={createVehicleModalStyles.title}>Nuevo vehículo</Text>
          <Text style={{color: '#374151', marginBottom: 8}}>Tipo</Text>
          <View style={createVehicleModalStyles.picker}>
            {types.map((t) => (
              <TouchableOpacity
                key={t.id}
                onPress={() => setTypeId(t.id)}
                style={{padding: 4}}
              >
                <Text style={{fontWeight: typeId === t.id ? '700' : '400', color: '#1f2937'}}>
                  {t.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={createVehicleModalStyles.input}
            placeholder="Placa"
            placeholderTextColor="#6b7280"
            value={placa}
            onChangeText={setPlaca}
          />
          <TextInput
            style={createVehicleModalStyles.input}
            placeholder="Color"
            placeholderTextColor="#6b7280"
            value={color}
            onChangeText={setColor}
          />
          <TextInput
            style={createVehicleModalStyles.input}
            placeholder="Marca"
            placeholderTextColor="#6b7280"
            value={marca}
            onChangeText={setMarca}
          />
          <View style={createVehicleModalStyles.row}>
            <TouchableOpacity
              style={[createVehicleModalStyles.button, createVehicleModalStyles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={createVehicleModalStyles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[createVehicleModalStyles.button, createVehicleModalStyles.saveButton]}
              onPress={handleSave}
              disabled={!placa.trim()}
            >
              <Text style={createVehicleModalStyles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
