import React from 'react';
import {Modal, View, Text, TouchableOpacity} from 'react-native';
import {clientCardOptionsModalStyles} from './ClientCardOptionsModal.styles';

interface ClientCardOptionsModalProps {
  visible: boolean;
  clientName: string;
  onEdit: () => void;
  onAddVehicle: () => void;
  onDelete: () => void;
  onCancel: () => void;
}

export function ClientCardOptionsModal({
  visible,
  clientName,
  onEdit,
  onAddVehicle,
  onDelete,
  onCancel,
}: ClientCardOptionsModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={clientCardOptionsModalStyles.overlay}>
        <TouchableOpacity
          style={{flex: 1}}
          activeOpacity={1}
          onPress={onCancel}
        />
        <View style={clientCardOptionsModalStyles.sheet}>
          <View style={clientCardOptionsModalStyles.option}>
            <Text style={clientCardOptionsModalStyles.optionText}>{clientName}</Text>
          </View>
          <TouchableOpacity style={clientCardOptionsModalStyles.option} onPress={onEdit}>
            <Text style={clientCardOptionsModalStyles.optionText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={clientCardOptionsModalStyles.option} onPress={onAddVehicle}>
            <Text style={clientCardOptionsModalStyles.optionText}>Agregar vehículo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={clientCardOptionsModalStyles.option} onPress={onDelete}>
            <Text style={[clientCardOptionsModalStyles.optionText, clientCardOptionsModalStyles.optionTextDanger]}>
              Eliminar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={clientCardOptionsModalStyles.cancel} onPress={onCancel}>
            <Text style={clientCardOptionsModalStyles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
