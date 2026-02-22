import React, {useState} from 'react';
import {Modal, View, Text, TextInput, TouchableOpacity} from 'react-native';
import {createVehicleTypeModalStyles} from './CreateVehicleTypeModal.styles';

interface CreateVehicleTypeModalProps {
  onSave: (name: string, amount: number) => void;
  onCancel: () => void;
}

export function CreateVehicleTypeModal({onSave, onCancel}: CreateVehicleTypeModalProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  return (
    <Modal visible transparent animationType="fade">
      <View style={createVehicleTypeModalStyles.overlay}>
        <View style={createVehicleTypeModalStyles.modal}>
          <Text style={createVehicleTypeModalStyles.title}>Nuevo tipo de vehículo</Text>
          <TextInput
            style={createVehicleTypeModalStyles.input}
            placeholder="Nombre (ej: Moto lineal)"
            placeholderTextColor="#6b7280"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={createVehicleTypeModalStyles.input}
            placeholder="Tarifa (soles)"
            placeholderTextColor="#6b7280"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
          <View style={createVehicleTypeModalStyles.row}>
            <TouchableOpacity
              style={[createVehicleTypeModalStyles.button, createVehicleTypeModalStyles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={createVehicleTypeModalStyles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[createVehicleTypeModalStyles.button, createVehicleTypeModalStyles.saveButton]}
              onPress={() => onSave(name.trim(), parseFloat(amount) || 0)}
              disabled={!name.trim()}
            >
              <Text style={createVehicleTypeModalStyles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
