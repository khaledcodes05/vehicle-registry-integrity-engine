export interface CodeSnippetTab {
  id: string;
  label: string;
  subtitle: string;
  filename: string;
  code: string;
}

export const JAVA_CODE_TABS: CodeSnippetTab[] = [
  {
    id: 'registry-entity',
    label: 'RegistryEntity',
    subtitle: 'Abstract root entity holding the shared primary key id.',
    filename: 'RegistryEntity.java',
    code: `public abstract class RegistryEntity {
    private String id;

    protected RegistryEntity(String id) {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("Entity id cannot be null or blank.");
        }
        this.id = id.trim();
    }

    public String getId() {
        return id;
    }

    // Package-private so only VehicleRegistry updates parent keys safely
    void setId(String newId) {
        if (newId == null || newId.isBlank()) {
            throw new IllegalArgumentException("New id cannot be null or blank.");
        }
        this.id = newId.trim();
    }
}`,
  },
  {
    id: 'owner',
    label: 'Owner',
    subtitle: 'Parent registry entity referenced by Car.ownerId.',
    filename: 'Owner.java',
    code: `public class Owner extends RegistryEntity {
    private final String fullName;
    private final String city;

    public Owner(String id, String fullName, String city) {
        super(id); // Explicit forwarding to RegistryEntity(id)
        if (fullName == null || fullName.isBlank() || city == null || city.isBlank()) {
            throw new IllegalArgumentException("Owner fullName and city are required.");
        }
        this.fullName = fullName.trim();
        this.city = city.trim();
    }

    public String getFullName() {
        return fullName;
    }

    public String getCity() {
        return city;
    }
}`,
  },
  {
    id: 'vehicle',
    label: 'Vehicle',
    subtitle: 'Level 2 abstract class adding manufacturer make.',
    filename: 'Vehicle.java',
    code: `public abstract class Vehicle extends RegistryEntity {
    private final String make;

    protected Vehicle(String id, String make) {
        super(id); // Pass id up to RegistryEntity
        if (make == null || make.isBlank()) {
            throw new IllegalArgumentException("Vehicle make cannot be blank.");
        }
        this.make = make.trim();
    }

    public String getMake() {
        return make;
    }
}`,
  },
  {
    id: 'road-vehicle',
    label: 'RoadVehicle',
    subtitle: 'Level 3 abstract class forwarding super(id, make) to Vehicle.',
    filename: 'RoadVehicle.java',
    code: `public abstract class RoadVehicle extends Vehicle {
    private final int wheels;
    private final String licensePlate;

    protected RoadVehicle(String id, String make, int wheels, String licensePlate) {
        super(id, make); // Explicit parameter passing to Vehicle(id, make)
        if (wheels < 3 || wheels > 18) {
            throw new IllegalArgumentException("RoadVehicle wheels must be between 3 and 18.");
        }
        if (licensePlate == null || licensePlate.isBlank()) {
            throw new IllegalArgumentException("License plate cannot be blank.");
        }
        this.wheels = wheels;
        this.licensePlate = licensePlate.trim();
    }

    public int getWheels() {
        return wheels;
    }

    public String getLicensePlate() {
        return licensePlate;
    }
}`,
  },
  {
    id: 'car',
    label: 'Car',
    subtitle: 'Concrete leaf class with a nullable ownerId foreign key.',
    filename: 'Car.java',
    code: `public class Car extends RoadVehicle {
    private final String model;
    private final int year;
    private String ownerId; // Nullable foreign key referencing Owner.id

    public Car(
            String id,
            String make,
            int wheels,
            String licensePlate,
            String model,
            int year,
            String ownerId) {
        super(id, make, wheels, licensePlate); // Explicit forwarding to RoadVehicle
        if (model == null || model.isBlank()) {
            throw new IllegalArgumentException("Car model cannot be blank.");
        }
        if (year < 1886 || year > 2030) {
            throw new IllegalArgumentException("Car year must be between 1886 and 2030.");
        }
        this.model = model.trim();
        this.year = year;
        this.ownerId = (ownerId == null || ownerId.isBlank()) ? null : ownerId.trim();
    }

    public String getModel() {
        return model;
    }

    public int getYear() {
        return year;
    }

    public String getOwnerId() {
        return ownerId;
    }

    // Package-private so VehicleRegistry enforces ON UPDATE SET NULL
    void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }
}`,
  },
  {
    id: 'add-car',
    label: 'VehicleRegistry.addCar',
    subtitle: 'Rejects duplicate car IDs and non-existent parent ownerId values.',
    filename: 'VehicleRegistry.java (addCar)',
    code: `public void addCar(Car car) {
    if (car == null) {
        throw new IllegalArgumentException("Car cannot be null.");
    }
    if (cars.containsKey(car.getId())) {
        throw new RegistryIntegrityException(
            "Duplicate Car ID rejected: " + car.getId()
        );
    }

    String ownerId = car.getOwnerId();
    // Enforce FOREIGN KEY (ownerId) REFERENCES Owner(id) when non-null
    if (ownerId != null && !owners.containsKey(ownerId)) {
        throw new RegistryIntegrityException(
            "Foreign-key violation: Owner ID '" + ownerId + "' does not exist."
        );
    }

    cars.put(car.getId(), car);
}`,
  },
  {
    id: 'update-owner-id',
    label: 'VehicleRegistry.updateOwnerId',
    subtitle: 'Implements ON UPDATE SET NULL across dependent Car records.',
    filename: 'VehicleRegistry.java (updateOwnerId)',
    code: `public void updateOwnerId(String oldId, String newId) {
    if (!owners.containsKey(oldId)) {
        throw new RegistryIntegrityException("Owner not found: " + oldId);
    }
    if (newId == null || newId.isBlank()) {
        throw new IllegalArgumentException("New Owner ID cannot be blank.");
    }
    String cleanNewId = newId.trim();
    if (owners.containsKey(cleanNewId)) {
        throw new RegistryIntegrityException(
            "Duplicate Owner ID rejected: " + cleanNewId
        );
    }

    // Move parent record to the new primary key
    Owner owner = owners.remove(oldId);
    owner.setId(cleanNewId);
    owners.put(cleanNewId, owner);

    // SQL-style ON UPDATE SET NULL for every child Car referencing oldId
    for (Car car : cars.values()) {
        if (oldId.equals(car.getOwnerId())) {
            car.setOwnerId(null);
        }
    }
}`,
  },
  {
    id: 'delete-owner',
    label: 'VehicleRegistry.deleteOwner',
    subtitle: 'Implements ON DELETE CASCADE by deleting child Car records.',
    filename: 'VehicleRegistry.java (deleteOwner)',
    code: `public void deleteOwner(String ownerId) {
    if (!owners.containsKey(ownerId)) {
        throw new RegistryIntegrityException("Owner not found: " + ownerId);
    }

    // Remove parent Owner record
    owners.remove(ownerId);

    // SQL-style ON DELETE CASCADE: remove every Car referencing ownerId
    cars.values().removeIf(car -> ownerId.equals(car.getOwnerId()));
}`,
  },
  {
    id: 'full-registry',
    label: 'Full VehicleRegistry',
    subtitle: 'Complete in-memory registry class with Map storage and custom exception.',
    filename: 'VehicleRegistry.java',
    code: `import java.util.Collection;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

public class VehicleRegistry {
    private final Map<String, Owner> owners = new LinkedHashMap<>();
    private final Map<String, Car> cars = new LinkedHashMap<>();

    public static class RegistryIntegrityException extends RuntimeException {
        public RegistryIntegrityException(String message) {
            super(message);
        }
    }

    public void addOwner(Owner owner) {
        if (owner == null) {
            throw new IllegalArgumentException("Owner cannot be null.");
        }
        if (owners.containsKey(owner.getId())) {
            throw new RegistryIntegrityException(
                "Duplicate Owner ID rejected: " + owner.getId()
            );
        }
        owners.put(owner.getId(), owner);
    }

    public void addCar(Car car) {
        if (car == null) {
            throw new IllegalArgumentException("Car cannot be null.");
        }
        if (cars.containsKey(car.getId())) {
            throw new RegistryIntegrityException(
                "Duplicate Car ID rejected: " + car.getId()
            );
        }
        String ownerId = car.getOwnerId();
        if (ownerId != null && !owners.containsKey(ownerId)) {
            throw new RegistryIntegrityException(
                "Foreign-key violation: Owner ID '" + ownerId + "' does not exist."
            );
        }
        cars.put(car.getId(), car);
    }

    public void updateOwnerId(String oldId, String newId) {
        if (!owners.containsKey(oldId)) {
            throw new RegistryIntegrityException("Owner not found: " + oldId);
        }
        if (newId == null || newId.isBlank()) {
            throw new IllegalArgumentException("New Owner ID cannot be blank.");
        }
        String cleanNewId = newId.trim();
        if (owners.containsKey(cleanNewId)) {
            throw new RegistryIntegrityException(
                "Duplicate Owner ID rejected: " + cleanNewId
            );
        }

        Owner owner = owners.remove(oldId);
        owner.setId(cleanNewId);
        owners.put(cleanNewId, owner);

        // ON UPDATE SET NULL
        for (Car car : cars.values()) {
            if (oldId.equals(car.getOwnerId())) {
                car.setOwnerId(null);
            }
        }
    }

    public void deleteOwner(String ownerId) {
        if (!owners.containsKey(ownerId)) {
            throw new RegistryIntegrityException("Owner not found: " + ownerId);
        }
        owners.remove(ownerId);

        // ON DELETE CASCADE
        cars.values().removeIf(car -> ownerId.equals(car.getOwnerId()));
    }

    public Collection<Owner> getOwners() {
        return Collections.unmodifiableCollection(owners.values());
    }

    public Collection<Car> getCars() {
        return Collections.unmodifiableCollection(cars.values());
    }
}`,
  },
];
