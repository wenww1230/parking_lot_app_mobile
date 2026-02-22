import React, {useState} from 'react';
import {Modal, View, Text, TextInput, TouchableOpacity} from 'react-native';
import {Tariff} from '../../../domain/entities/Tariff';
import {editTariffModalStyles} from './EditTariffModal.styles';

interface EditTariffModalProps {
  tariff: Tariff;
  onSave: (amount: number) => void;
  onCancel: () => void;
}

export function EditTariffModal({tariff, onSave, onCancel}: EditTariffModalProps) {
  const [amount, setAmount] = useState(String(tariff.amount));

  return (
    <Modal visible transparent animationType="fade">
      <View style={editTariffModalStyles.overlay}>
        <View style={editTariffModalStyles.modal}>
          <Text style={editTariffModalStyles.title}>
            Tarifa: {tariff.vehicleTypeName}
          </Text>
          <TextInput
            style={editTariffModalStyles.input}
            placeholder="Soles"
            placeholderTextColor="#6b7280"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
          <View style={editTariffModalStyles.row}>
            <TouchableOpacity
              style={[editTariffModalStyles.button, editTariffModalStyles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={editTariffModalStyles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[editTariffModalStyles.button, editTariffModalStyles.saveButton]}
              onPress={() => onSave(parseFloat(amount) || 0)}
            >
              <Text style={editTariffModalStyles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
