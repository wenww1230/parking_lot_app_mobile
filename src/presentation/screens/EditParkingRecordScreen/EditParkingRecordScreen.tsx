import React, {useState, useEffect} from 'react';
import {View, Text, Modal, TouchableOpacity, TextInput} from 'react-native';
import {parkingRecordUseCase} from '../../../di/UseCaseContainer';
import {getPeruLimaNow} from '../../../utils/dateUtils';
import {EstadoPago} from '../../../domain/entities/ParkingRecordWithDetails';
import {editParkingRecordScreenStyles} from './EditParkingRecordScreen.styles';

interface EditParkingRecordScreenProps {
  recordId: number;
  onComplete: () => void;
  onCancel: () => void;
}

export function EditParkingRecordScreen({
  recordId,
  onComplete,
  onCancel,
}: EditParkingRecordScreenProps) {
  const [detalle, setDetalle] = useState('');
  const [soles, setSoles] = useState('');
  const [estadoPago, setEstadoPago] = useState<EstadoPago>('DEUDA');
  const [abonar, setAbonar] = useState('');
  const [loading, setLoading] = useState(true);
  const [debtSummary, setDebtSummary] = useState<{
    currentRecordDebt: number;
    historicalDebt: number;
  } | null>(null);

  const loadData = async () => {
    const [record, summary] = await Promise.all([
      parkingRecordUseCase.getRecordById(recordId),
      parkingRecordUseCase.getDebtSummaryForRecord(recordId),
    ]);
    if (record) {
      setDetalle(record.detalle);
      setSoles(String(record.soles));
      setEstadoPago(record.estadoPago);
    }
    setDebtSummary(summary ?? null);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [recordId]);

  const handleSave = async () => {
    const horaSalida = getPeruLimaNow();
    const solesNum = parseFloat(soles) || 0;
    const abonarNum = parseFloat(abonar) || 0;
    await parkingRecordUseCase.updateRecord(
      recordId,
      horaSalida,
      detalle,
      solesNum,
      estadoPago,
      abonarNum > 0 ? abonarNum : undefined
    );
    onComplete();
  };

  const handleMarkPaid = async () => {
    await parkingRecordUseCase.markAsPaid(recordId);
    setEstadoPago('PAGADO');
    onComplete();
  };

  if (loading) {
    return (
      <Modal visible transparent animationType="slide">
        <View style={editParkingRecordScreenStyles.overlay}>
          <View style={editParkingRecordScreenStyles.sheet}>
            <Text>Cargando...</Text>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible animationType="slide" transparent>
      <View style={editParkingRecordScreenStyles.overlay}>
        <View style={editParkingRecordScreenStyles.sheet}>
          <View style={editParkingRecordScreenStyles.header}>
            <Text style={editParkingRecordScreenStyles.title}>Editar registro</Text>
            <TouchableOpacity onPress={onCancel}>
              <Text style={editParkingRecordScreenStyles.closeText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
          <View style={editParkingRecordScreenStyles.content}>
            {debtSummary && (
              <View
                style={{
                  backgroundColor: '#f3f4f6',
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 16,
                }}
              >
                <Text
                  style={[editParkingRecordScreenStyles.label, {fontWeight: '700', marginBottom: 8}]}
                >
                  Resumen de deuda
                </Text>
                <Text style={editParkingRecordScreenStyles.label}>
                  Deuda este aparcamiento: S/ {debtSummary.currentRecordDebt.toFixed(2)}
                </Text>
                <Text style={editParkingRecordScreenStyles.label}>
                  Deuda histórica (cliente): S/ {debtSummary.historicalDebt.toFixed(2)}
                </Text>
                <Text
                  style={[editParkingRecordScreenStyles.label, {fontWeight: '700', marginTop: 8}]}
                >
                  Total a cobrar: S/{' '}
                  {(debtSummary.currentRecordDebt + debtSummary.historicalDebt).toFixed(2)}
                </Text>
              </View>
            )}
            <Text style={editParkingRecordScreenStyles.label}>Detalle</Text>
            <TextInput
              style={editParkingRecordScreenStyles.input}
              placeholder="Detalle"
              placeholderTextColor="#6b7280"
              value={detalle}
              onChangeText={setDetalle}
            />
            <Text style={editParkingRecordScreenStyles.label}>Soles</Text>
            <TextInput
              style={editParkingRecordScreenStyles.input}
              placeholder="0.00"
              placeholderTextColor="#6b7280"
              value={soles}
              onChangeText={setSoles}
              keyboardType="decimal-pad"
            />
            <Text style={editParkingRecordScreenStyles.label}>Abonar (opcional)</Text>
            <TextInput
              style={editParkingRecordScreenStyles.input}
              placeholder="0.00"
              placeholderTextColor="#6b7280"
              value={abonar}
              onChangeText={setAbonar}
              keyboardType="decimal-pad"
            />
            <Text style={editParkingRecordScreenStyles.label}>Estado pago</Text>
            <View style={{flexDirection: 'row', gap: 12, marginBottom: 16}}>
              <TouchableOpacity
                style={[
                  editParkingRecordScreenStyles.estadoButton,
                  estadoPago === 'DEUDA' && editParkingRecordScreenStyles.estadoButtonActive,
                ]}
                onPress={() => setEstadoPago('DEUDA')}
              >
                <Text
                  style={[
                    editParkingRecordScreenStyles.estadoButtonText,
                    estadoPago === 'DEUDA' && editParkingRecordScreenStyles.estadoButtonTextActive,
                  ]}
                >
                  Deuda
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  editParkingRecordScreenStyles.estadoButton,
                  estadoPago === 'PAGADO' && editParkingRecordScreenStyles.estadoButtonPaid,
                ]}
                onPress={() => setEstadoPago('PAGADO')}
              >
                <Text
                  style={[
                    editParkingRecordScreenStyles.estadoButtonText,
                    estadoPago === 'PAGADO' && editParkingRecordScreenStyles.estadoButtonTextActive,
                  ]}
                >
                  Pagado
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={editParkingRecordScreenStyles.paidButton}
              onPress={handleMarkPaid}
            >
              <Text style={editParkingRecordScreenStyles.paidButtonText}>Marcar como pagado</Text>
            </TouchableOpacity>
            <TouchableOpacity style={editParkingRecordScreenStyles.saveButton} onPress={handleSave}>
              <Text style={editParkingRecordScreenStyles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
