import React, {useState} from 'react';
import {Modal, View, Text, TextInput, TouchableOpacity} from 'react-native';
import {ClientDebt} from '../../../domain/repositories/IDebtReportRepository';
import {registerPaymentModalStyles} from './RegisterPaymentModal.styles';

interface RegisterPaymentModalProps {
  visible: boolean;
  client: ClientDebt;
  onConfirm: (amount: number, detalle: string) => void;
  onCancel: () => void;
}

export function RegisterPaymentModal({
  visible,
  client,
  onConfirm,
  onCancel,
}: RegisterPaymentModalProps) {
  const [amount, setAmount] = useState(String(client.totalDebt));
  const [detalle, setDetalle] = useState('Pago de deuda');

  const handleConfirm = () => {
    onConfirm(parseFloat(amount) || 0, detalle.trim() || 'Pago de deuda');
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={registerPaymentModalStyles.overlay}>
        <View style={registerPaymentModalStyles.modal}>
          <Text style={registerPaymentModalStyles.title}>Registrar pago</Text>
          <Text style={registerPaymentModalStyles.debtInfo}>
            {client.clientName} - Deuda: S/ {client.totalDebt}
          </Text>
          <TextInput
            style={registerPaymentModalStyles.input}
            placeholder="Monto (soles)"
            placeholderTextColor="#6b7280"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
          <TextInput
            style={registerPaymentModalStyles.input}
            placeholder="Detalle"
            placeholderTextColor="#6b7280"
            value={detalle}
            onChangeText={setDetalle}
          />
          <View style={registerPaymentModalStyles.row}>
            <TouchableOpacity
              style={[registerPaymentModalStyles.button, registerPaymentModalStyles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={registerPaymentModalStyles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[registerPaymentModalStyles.button, registerPaymentModalStyles.confirmButton]}
              onPress={handleConfirm}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              <Text style={registerPaymentModalStyles.confirmButtonText}>Confirmar pago</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
