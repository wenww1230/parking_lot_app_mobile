import React, {useState, useCallback} from 'react';
import {View, Text, TextInput, TouchableOpacity, FlatList} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {parkingRecordUseCase} from '../../../di/UseCaseContainer';
import {ParkingRecordWithDetails} from '../../../domain/entities/ParkingRecordWithDetails';
import {ParkingRecordRow} from '../../components/ParkingRecordRow/ParkingRecordRow';
import {DateTimePickerButton} from '../../components/DateTimePickerButton/DateTimePickerButton';
import {AddParkingRecordScreen} from '../AddParkingRecordScreen/AddParkingRecordScreen';
import {EditParkingRecordScreen} from '../EditParkingRecordScreen/EditParkingRecordScreen';
import {parteDiarioScreenStyles} from './ParteDiarioScreen.styles';

const PAGE_SIZE = 10;

export function ParteDiarioScreen() {
  const navigation = useNavigation<any>();
  const [records, setRecords] = useState<ParkingRecordWithDetails[]>([]);
  const [page, setPage] = useState(0);
  const [clientFilter, setClientFilter] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const loadRecords = useCallback(async () => {
    const filters = {
      clientQuery: clientFilter || undefined,
      vehicleQuery: vehicleFilter || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    };
    const list = await parkingRecordUseCase.getRecords(PAGE_SIZE, page * PAGE_SIZE, filters);
    setRecords(list);
  }, [page, clientFilter, vehicleFilter, dateFrom, dateTo]);

  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, [loadRecords])
  );

  const handleRecordPress = (record: ParkingRecordWithDetails) => {
    setEditId(record.id);
  };

  const handleAddComplete = () => {
    setShowAdd(false);
    setPage(0);
    loadRecords();
  };

  const handleEditComplete = () => {
    setEditId(null);
    loadRecords();
  };

  return (
    <View style={parteDiarioScreenStyles.container}>
      <View style={parteDiarioScreenStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={parteDiarioScreenStyles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={parteDiarioScreenStyles.headerTitle}>Parte Diario</Text>
      </View>
      <View style={parteDiarioScreenStyles.filterSection}>
        <View style={parteDiarioScreenStyles.filterRow}>
          <TextInput
            style={parteDiarioScreenStyles.input}
            placeholder="Filtrar cliente"
            placeholderTextColor="#6b7280"
            value={clientFilter}
            onChangeText={setClientFilter}
          />
          <TextInput
            style={parteDiarioScreenStyles.input}
            placeholder="Filtrar vehículo/placa"
            placeholderTextColor="#6b7280"
            value={vehicleFilter}
            onChangeText={setVehicleFilter}
          />
        </View>
        <View style={parteDiarioScreenStyles.filterRow2}>
          <DateTimePickerButton
            value={dateFrom}
            placeholder="Fecha desde"
            onChange={setDateFrom}
          />
          <DateTimePickerButton
            value={dateTo}
            placeholder="Fecha hasta"
            onChange={setDateTo}
          />
          <TouchableOpacity style={parteDiarioScreenStyles.addButton} onPress={() => setShowAdd(true)}>
            <Text style={parteDiarioScreenStyles.addButtonText}>+ Agregar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        style={parteDiarioScreenStyles.list}
        data={records}
        keyExtractor={(item) => String(item.id)}
        renderItem={({item}) => (
          <ParkingRecordRow record={item} onPress={() => handleRecordPress(item)} />
        )}
        ListEmptyComponent={<Text style={parteDiarioScreenStyles.empty}>Sin registros</Text>}
      />
      <View style={parteDiarioScreenStyles.pagination}>
        <TouchableOpacity onPress={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
          <Text style={parteDiarioScreenStyles.pageText}>Anterior</Text>
        </TouchableOpacity>
        <Text style={parteDiarioScreenStyles.pageText}>Pág. {page + 1}</Text>
        <TouchableOpacity
          onPress={() => setPage((p) => (records.length === PAGE_SIZE ? p + 1 : p))}
          disabled={records.length < PAGE_SIZE}
        >
          <Text style={parteDiarioScreenStyles.pageText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
      {showAdd && (
        <AddParkingRecordScreen
          onComplete={handleAddComplete}
          onCancel={() => setShowAdd(false)}
        />
      )}
      {editId !== null && (
        <EditParkingRecordScreen
          recordId={editId}
          onComplete={handleEditComplete}
          onCancel={() => setEditId(null)}
        />
      )}
    </View>
  );
}
