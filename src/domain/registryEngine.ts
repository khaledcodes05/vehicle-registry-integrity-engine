export interface OwnerRecord {
  id: string;
  fullName: string;
  city: string;
}

export interface CarRecord {
  id: string;
  make: string;
  wheels: number;
  licensePlate: string;
  model: string;
  year: number;
  ownerId: string | null;
}

export interface RegistryState {
  owners: OwnerRecord[];
  cars: CarRecord[];
}

export type ValidationStatus =
  | 'success'
  | 'foreign_key_violation'
  | 'duplicate_id'
  | 'not_found'
  | 'invalid_input';

export interface OperationResult {
  ok: boolean;
  status: ValidationStatus;
  title: string;
  message: string;
  javaCall: string;
  affectedCarIds: string[];
  nextState: RegistryState;
}

export function createInitialRegistryState(): RegistryState {
  return {
    owners: [
      { id: 'OWN-101', fullName: 'Elena Vance', city: 'Munich, DE' },
      { id: 'OWN-102', fullName: 'Marcus Lindqvist', city: 'Gothenburg, SE' },
      { id: 'OWN-103', fullName: 'Kenji Takahashi', city: 'Yokohama, JP' },
    ],
    cars: [
      {
        id: 'CAR-01',
        make: 'Porsche',
        wheels: 4,
        licensePlate: 'M-PV-911',
        model: '911 Carrera',
        year: 2025,
        ownerId: 'OWN-101',
      },
      {
        id: 'CAR-02',
        make: 'Porsche',
        wheels: 4,
        licensePlate: 'M-PV-402',
        model: 'Taycan 4S',
        year: 2024,
        ownerId: 'OWN-101',
      },
      {
        id: 'CAR-03',
        make: 'Volvo',
        wheels: 4,
        licensePlate: 'GBG-884',
        model: 'V60 Recharge',
        year: 2024,
        ownerId: 'OWN-102',
      },
      {
        id: 'CAR-04',
        make: 'Mazda',
        wheels: 4,
        licensePlate: 'YKH-305',
        model: 'MX-5 Miata',
        year: 2023,
        ownerId: 'OWN-103',
      },
      {
        id: 'CAR-05',
        make: 'BMW',
        wheels: 4,
        licensePlate: 'M-UN-005',
        model: 'M3 Touring',
        year: 2025,
        ownerId: null,
      },
    ],
  };
}

export function addOwner(
  state: RegistryState,
  input: { id: string; fullName: string; city: string }
): OperationResult {
  const id = input.id.trim();
  const fullName = input.fullName.trim();
  const city = input.city.trim();
  const javaCall = `registry.addOwner(new Owner("${id}", "${fullName}", "${city}"));`;

  if (!id || !fullName || !city) {
    return {
      ok: false,
      status: 'invalid_input',
      title: 'Missing Required Owner Fields',
      message: 'Owner ID, full name, and city must all be non-blank strings.',
      javaCall,
      affectedCarIds: [],
      nextState: state,
    };
  }

  if (state.owners.some((owner) => owner.id === id)) {
    return {
      ok: false,
      status: 'duplicate_id',
      title: 'Duplicate Primary Key Rejected',
      message: `Owner ID "${id}" already exists in the parent Owner registry. Primary keys must remain unique.`,
      javaCall,
      affectedCarIds: [],
      nextState: state,
    };
  }

  return {
    ok: true,
    status: 'success',
    title: 'Owner Added',
    message: `Inserted parent Owner "${id}" (${fullName}). Child Car records may now reference "${id}".`,
    javaCall,
    affectedCarIds: [],
    nextState: {
      owners: [...state.owners, { id, fullName, city }],
      cars: state.cars,
    },
  };
}

export function addCar(
  state: RegistryState,
  input: {
    id: string;
    make: string;
    wheels: number;
    licensePlate: string;
    model: string;
    year: number;
    ownerId: string | null;
  }
): OperationResult {
  const id = input.id.trim();
  const make = input.make.trim();
  const licensePlate = input.licensePlate.trim();
  const model = input.model.trim();
  const normalizedOwnerId =
    input.ownerId === null || input.ownerId.trim() === '' ? null : input.ownerId.trim();

  const ownerArg = normalizedOwnerId === null ? 'null' : `"${normalizedOwnerId}"`;
  const javaCall = `registry.addCar(new Car("${id}", "${make}", ${input.wheels}, "${licensePlate}", "${model}", ${input.year}, ${ownerArg}));`;

  if (!id || !make || !licensePlate || !model) {
    return {
      ok: false,
      status: 'invalid_input',
      title: 'Missing Required Car Fields',
      message: 'Car ID, make, license plate, and model are required.',
      javaCall,
      affectedCarIds: [],
      nextState: state,
    };
  }

  if (!Number.isFinite(input.wheels) || input.wheels < 3 || input.wheels > 18) {
    return {
      ok: false,
      status: 'invalid_input',
      title: 'Invalid Wheel Count',
      message: 'RoadVehicle wheels must be between 3 and 18.',
      javaCall,
      affectedCarIds: [],
      nextState: state,
    };
  }

  if (!Number.isFinite(input.year) || input.year < 1886 || input.year > 2030) {
    return {
      ok: false,
      status: 'invalid_input',
      title: 'Invalid Model Year',
      message: 'Car year must be between 1886 and 2030.',
      javaCall,
      affectedCarIds: [],
      nextState: state,
    };
  }

  if (state.cars.some((car) => car.id === id)) {
    return {
      ok: false,
      status: 'duplicate_id',
      title: 'Duplicate Car ID Rejected',
      message: `Car ID "${id}" already exists in the Car registry. Duplicate primary keys are rejected.`,
      javaCall,
      affectedCarIds: [],
      nextState: state,
    };
  }

  if (
    normalizedOwnerId !== null &&
    !state.owners.some((owner) => owner.id === normalizedOwnerId)
  ) {
    return {
      ok: false,
      status: 'foreign_key_violation',
      title: 'Foreign-Key Violation Rejected',
      message: `Cannot insert Car "${id}": ownerId "${normalizedOwnerId}" does not match any parent Owner record.`,
      javaCall,
      affectedCarIds: [],
      nextState: state,
    };
  }

  const newCar: CarRecord = {
    id,
    make,
    wheels: input.wheels,
    licensePlate,
    model,
    year: input.year,
    ownerId: normalizedOwnerId,
  };

  return {
    ok: true,
    status: 'success',
    title: 'Car Added',
    message:
      normalizedOwnerId === null
        ? `Inserted Car "${id}" (${make} ${model}) with ownerId = null (valid nullable foreign key).`
        : `Inserted Car "${id}" (${make} ${model}) linked to parent Owner "${normalizedOwnerId}".`,
    javaCall,
    affectedCarIds: [id],
    nextState: {
      owners: state.owners,
      cars: [...state.cars, newCar],
    },
  };
}

export function updateOwnerId(
  state: RegistryState,
  oldIdRaw: string,
  newIdRaw: string
): OperationResult {
  const oldId = oldIdRaw.trim();
  const newId = newIdRaw.trim();
  const javaCall = `registry.updateOwnerId("${oldId}", "${newId}");`;

  if (!oldId || !newId) {
    return {
      ok: false,
      status: 'invalid_input',
      title: 'Missing Owner ID',
      message: 'Both the existing Owner ID and the new Owner ID must be non-blank.',
      javaCall,
      affectedCarIds: [],
      nextState: state,
    };
  }

  const existingIndex = state.owners.findIndex((owner) => owner.id === oldId);
  if (existingIndex === -1) {
    return {
      ok: false,
      status: 'not_found',
      title: 'Owner Not Found',
      message: `No parent Owner found with ID "${oldId}".`,
      javaCall,
      affectedCarIds: [],
      nextState: state,
    };
  }

  if (oldId === newId) {
    return {
      ok: false,
      status: 'invalid_input',
      title: 'Unchanged Owner ID',
      message: `New Owner ID "${newId}" is identical to the current ID.`,
      javaCall,
      affectedCarIds: [],
      nextState: state,
    };
  }

  if (state.owners.some((owner) => owner.id === newId)) {
    return {
      ok: false,
      status: 'duplicate_id',
      title: 'Duplicate Owner ID Rejected',
      message: `Cannot rename "${oldId}" to "${newId}" because "${newId}" is already assigned to another Owner.`,
      javaCall,
      affectedCarIds: [],
      nextState: state,
    };
  }

  const affectedCarIds = state.cars
    .filter((car) => car.ownerId === oldId)
    .map((car) => car.id);

  const nextOwners = state.owners.map((owner) =>
    owner.id === oldId ? { ...owner, id: newId } : owner
  );

  const nextCars = state.cars.map((car) =>
    car.ownerId === oldId ? { ...car, ownerId: null } : car
  );

  const carSummary =
    affectedCarIds.length > 0
      ? `ON UPDATE SET NULL cleared ownerId to null on ${affectedCarIds.length} child car(s): ${affectedCarIds.join(', ')}.`
      : 'No child cars referenced the old ID, so zero car rows required NULL assignment.';

  return {
    ok: true,
    status: 'success',
    title: 'Owner ID Updated (ON UPDATE SET NULL)',
    message: `Renamed Owner "${oldId}" to "${newId}". ${carSummary}`,
    javaCall,
    affectedCarIds,
    nextState: {
      owners: nextOwners,
      cars: nextCars,
    },
  };
}

export function deleteOwner(state: RegistryState, ownerIdRaw: string): OperationResult {
  const ownerId = ownerIdRaw.trim();
  const javaCall = `registry.deleteOwner("${ownerId}");`;

  if (!ownerId) {
    return {
      ok: false,
      status: 'invalid_input',
      title: 'Missing Owner ID',
      message: 'Please select or enter an Owner ID to delete.',
      javaCall,
      affectedCarIds: [],
      nextState: state,
    };
  }

  const existingOwner = state.owners.find((owner) => owner.id === ownerId);
  if (!existingOwner) {
    return {
      ok: false,
      status: 'not_found',
      title: 'Owner Not Found',
      message: `No parent Owner exists with ID "${ownerId}".`,
      javaCall,
      affectedCarIds: [],
      nextState: state,
    };
  }

  const deletedCarIds = state.cars
    .filter((car) => car.ownerId === ownerId)
    .map((car) => car.id);

  const nextOwners = state.owners.filter((owner) => owner.id !== ownerId);
  const nextCars = state.cars.filter((car) => car.ownerId !== ownerId);

  const cascadeSummary =
    deletedCarIds.length > 0
      ? `ON DELETE CASCADE removed ${deletedCarIds.length} dependent car(s): ${deletedCarIds.join(', ')}.`
      : 'This owner had no assigned cars, so zero child rows were cascaded.';

  return {
    ok: true,
    status: 'success',
    title: 'Owner Deleted (ON DELETE CASCADE)',
    message: `Removed Owner "${ownerId}" (${existingOwner.fullName}). ${cascadeSummary}`,
    javaCall,
    affectedCarIds: deletedCarIds,
    nextState: {
      owners: nextOwners,
      cars: nextCars,
    },
  };
}
