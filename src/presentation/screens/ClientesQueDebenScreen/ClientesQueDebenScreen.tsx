import React, {useState, useCallback} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {debtReportUseCase, paymentUseCase} from '../../../di/UseCaseContainer';
import {ClientDebt} from '../../../domain/repositories/IDebtReportRepository';
import {RegisterPaymentModal} from '../../components/RegisterPaymentModal/RegisterPaymentModal';
import {clientesQueDebenScreenStyles} from './ClientesQueDebenScreen.styles';

export function ClientesQueDebenScreen() {
  const navigation = useNavigation<any>();
  const [data, setData] = useState<ClientDebt[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientDebt | null>(null);

  const load = useCallback(async () => {
    const list = await debtReportUseCase.getClientsByDebt();
    setData(list);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleRegisterPayment = async (amount: number, detalle: string) => {
    if (!selectedClient) return;
    await paymentUseCase.registerPayment(selectedClient.clientId, amount, detalle);
    setSelectedClient(null);
    load();
  };

  return (
    <View style={clientesQueDebenScreenStyles.container}>
      <View style={clientesQueDebenScreenStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={clientesQueDebenScreenStyles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={clientesQueDebenScreenStyles.title}>Clientes que más deben</Text>
      </View>
      <FlatList
        style={clientesQueDebenScreenStyles.list}
        data={data}
        keyExtractor={(item) => String(item.clientId)}
        renderItem={({item}) => (
          <TouchableOpacity
            style={clientesQueDebenScreenStyles.card}
            onPress={() => setSelectedClient(item)}
            activeOpacity={0.8}
          >
            <Text style={clientesQueDebenScreenStyles.clientName}>{item.clientName}</Text>
            <Text style={clientesQueDebenScreenStyles.clientPhone}>{item.clientPhone}</Text>
            <Text style={clientesQueDebenScreenStyles.debtAmount}>S/ {item.totalDebt}</Text>
            <Text style={clientesQueDebenScreenStyles.pendingCount}>
              {item.pendingCount} registros pendientes
            </Text>
            <Text style={clientesQueDebenScreenStyles.tapHint}>Toca para registrar pago</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={clientesQueDebenScreenStyles.empty}>No hay clientes con deuda pendiente</Text>
        }
      />
      {selectedClient && (
        <RegisterPaymentModal
          visible={!!selectedClient}
          client={selectedClient}
          onConfirm={handleRegisterPayment}
          onCancel={() => setSelectedClient(null)}
        />
      )}
    </View>
  );
}
