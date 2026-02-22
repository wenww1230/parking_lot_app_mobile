import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import {Client} from '../../../domain/entities/Client';
import {clientSelectorModalStyles} from './ClientSelectorModal.styles';

interface ClientSelectorModalProps {
  visible: boolean;
  clients: Client[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectClient: (client: Client) => void;
  onClose: () => void;
  onAddNew: () => void;
}

export function ClientSelectorModal({
  visible,
  clients,
  searchQuery,
  onSearchChange,
  onSelectClient,
  onClose,
  onAddNew,
}: ClientSelectorModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={clientSelectorModalStyles.overlay}>
        <View style={clientSelectorModalStyles.modal}>
          <View style={clientSelectorModalStyles.header}>
            <Text style={clientSelectorModalStyles.title}>Elegir cliente</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={clientSelectorModalStyles.closeText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={clientSelectorModalStyles.searchInput}
            placeholder="Buscar por nombre o teléfono"
            placeholderTextColor="#6b7280"
            value={searchQuery}
            onChangeText={onSearchChange}
          />
          <FlatList
            style={clientSelectorModalStyles.list}
            data={clients}
            keyExtractor={(item) => String(item.id)}
            renderItem={({item}) => (
              <TouchableOpacity
                style={clientSelectorModalStyles.item}
                onPress={() => onSelectClient(item)}
              >
                <Text style={clientSelectorModalStyles.itemName}>{item.name}</Text>
                <Text style={clientSelectorModalStyles.itemPhone}>{item.phone}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={clientSelectorModalStyles.addNewButton} onPress={onAddNew}>
            <Text style={clientSelectorModalStyles.addNewButtonText}>+ Crear nuevo cliente</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
