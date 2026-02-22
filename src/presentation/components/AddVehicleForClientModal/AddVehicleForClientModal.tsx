import React from 'react';
import {vehicleUseCase} from '../../../di/UseCaseContainer';
import {CreateVehicleModal} from '../CreateVehicleModal/CreateVehicleModal';

interface AddVehicleForClientModalProps {
  clientId: number;
  onComplete: () => void;
  onCancel: () => void;
}

export function AddVehicleForClientModal({
  clientId,
  onComplete,
  onCancel,
}: AddVehicleForClientModalProps) {
  const handleSave = async (
    typeId: number,
    color: string,
    placa: string,
    marca: string
  ) => {
    const vehicle = await vehicleUseCase.createVehicle(typeId, color, placa, marca);
    await vehicleUseCase.assignVehicleToClient(clientId, vehicle.id);
    onComplete();
  };

  return (
    <CreateVehicleModal
      onSave={handleSave}
      onCancel={onCancel}
    />
  );
}
