import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {createClientModalStyles} from './CreateClientModal.styles';

interface CreateClientModalProps {
  onSave: (name: string, phone: string) => void;
  onCancel: () => void;
}

export function CreateClientModal({onSave, onCancel}: CreateClientModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <Modal visible transparent animationType="fade">
      <View style={createClientModalStyles.overlay}>
        <View style={createClientModalStyles.modal}>
          <Text style={createClientModalStyles.title}>Nuevo cliente</Text>
          <TextInput
            style={createClientModalStyles.input}
            placeholder="Nombre"
            placeholderTextColor="#6b7280"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={createClientModalStyles.input}
            placeholder="Teléfono"
            placeholderTextColor="#6b7280"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <View style={createClientModalStyles.row}>
            <TouchableOpacity
              style={[createClientModalStyles.button, createClientModalStyles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={createClientModalStyles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[createClientModalStyles.button, createClientModalStyles.saveButton]}
              onPress={() => onSave(name, phone)}
              disabled={!name.trim()}
            >
              <Text style={createClientModalStyles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
