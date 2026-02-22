import React, {useState} from 'react';
import {Modal, View, Text, TextInput, TouchableOpacity} from 'react-native';
import {Client} from '../../../domain/entities/Client';
import {editClientModalStyles} from './EditClientModal.styles';

interface EditClientModalProps {
  client: Client;
  onSave: (name: string, phone: string) => void;
  onCancel: () => void;
}

export function EditClientModal({client, onSave, onCancel}: EditClientModalProps) {
  const [name, setName] = useState(client.name);
  const [phone, setPhone] = useState(client.phone);

  return (
    <Modal visible transparent animationType="fade">
      <View style={editClientModalStyles.overlay}>
        <View style={editClientModalStyles.modal}>
          <Text style={editClientModalStyles.title}>Editar cliente</Text>
          <TextInput
            style={editClientModalStyles.input}
            placeholder="Nombre"
            placeholderTextColor="#6b7280"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={editClientModalStyles.input}
            placeholder="Teléfono"
            placeholderTextColor="#6b7280"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <View style={editClientModalStyles.row}>
            <TouchableOpacity
              style={[editClientModalStyles.button, editClientModalStyles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={editClientModalStyles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[editClientModalStyles.button, editClientModalStyles.saveButton]}
              onPress={() => onSave(name, phone)}
              disabled={!name.trim()}
            >
              <Text style={editClientModalStyles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
