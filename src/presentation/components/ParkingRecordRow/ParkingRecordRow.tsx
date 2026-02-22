import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {ParkingRecordWithDetails} from '../../../domain/entities/ParkingRecordWithDetails';
import {parkingRecordRowStyles} from './ParkingRecordRow.styles';

interface ParkingRecordRowProps {
  record: ParkingRecordWithDetails;
  onPress: () => void;
}

export function ParkingRecordRow({record, onPress}: ParkingRecordRowProps) {
  return (
    <TouchableOpacity style={parkingRecordRowStyles.row} onPress={onPress} activeOpacity={0.7}>
      <Text style={parkingRecordRowStyles.placa}>{record.placa}</Text>
      <Text style={parkingRecordRowStyles.text}>{record.clientName} - {record.clientPhone}</Text>
      <Text style={parkingRecordRowStyles.textSecondary}>
        {record.vehicleType} | {record.vehicleColor} | Ingreso: {record.horaIngreso}
      </Text>
      <Text style={parkingRecordRowStyles.text}>
        {record.estadoPago === 'PAGADO'
          ? `S/ ${record.soles} ✓ Pagado`
          : `S/ ${record.paidAmount} de S/ ${record.soles} — Debe S/ ${(record.soles - record.paidAmount).toFixed(2)}`}
      </Text>
    </TouchableOpacity>
  );
}
