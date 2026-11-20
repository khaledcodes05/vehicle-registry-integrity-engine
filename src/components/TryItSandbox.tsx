import { FormEvent, useState } from 'react';
import {
  AlertTriangle,
  Car as CarIcon,
  CheckCircle2,
  Pencil,
  Plus,
  RotateCcw,
  ShieldAlert,
  Trash2,
  UserPlus,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  OperationResult,
  RegistryState,
  addCar,
  addOwner,
  createInitialRegistryState,
  deleteOwner,
  updateOwnerId,
} from '../domain/registryEngine';

type SandboxAction = 'add-owner' | 'add-car' | 'update-owner' | 'delete-owner';

interface LogEntry {
  id: number;
  ok: boolean;
  title: string;
  javaCall: string;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const SANDBOX_TABS: { id: SandboxAction; label: string; icon: typeof UserPlus }[] = [
  { id: 'add-owner', label: 'Add Owner', icon: UserPlus },
  { id: 'add-car', label: 'Add Car', icon: CarIcon },
  { id: 'update-owner', label: 'Update Owner ID', icon: Pencil },
  { id: 'delete-owner', label: 'Delete Owner', icon: Trash2 },
];

export function TryItSandbox() {
  const [registry, setRegistry] = useState<RegistryState>(() => createInitialRegistryState());
  const [activeTab, setActiveTab] = useState<SandboxAction>('add-car');
  const [lastResult, setLastResult] = useState<OperationResult | null>(null);
  const [history, setHistory] = useState<LogEntry[]>([]);

  // Add Owner form state
  const [ownerId, setOwnerId] = useState('OWN-104');
  const [ownerName, setOwnerName] = useState('Clara Lindholm');
  const [ownerCity, setOwnerCity] = useState('Stuttgart, DE');

  // Add Car form state
  const [carId, setCarId] = useState('CAR-06');
  const [carMake, setCarMake] = useState('Audi');
  const [carModel, setCarModel] = useState('RS6 Avant');
  const [carYear, setCarYear] = useState('2025');
  const [carWheels, setCarWheels] = useState('4');
  const [carPlate, setCarPlate] = useState('S-RS-600');
  const [carOwnerId, setCarOwnerId] = useState('OWN-101');

  // Update Owner ID form state
  const [updateOldId, setUpdateOldId] = useState('OWN-101');
  const [updateNewId, setUpdateNewId] = useState('OWN-901');

  // Delete Owner form state
  const [deleteTargetId, setDeleteTargetId] = useState('OWN-101');

  const recordOutcome = (result: OperationResult) => {
    setLastResult(result);
    if (result.ok) {
      setRegistry(result.nextState);

      if (result.nextState.owners.length > 0) {
        const stillHasUpdateTarget = result.nextState.owners.some((o) => o.id === updateOldId);
        if (!stillHasUpdateTarget) {
          setUpdateOldId(result.nextState.owners[0].id);
        }
        const stillHasDeleteTarget = result.nextState.owners.some((o) => o.id === deleteTargetId);
        if (!stillHasDeleteTarget) {
          setDeleteTargetId(result.nextState.owners[0].id);
        }
      }
    }

    setHistory((prev) => [
      {
        id: Date.now() + Math.random(),
        ok: result.ok,
        title: result.title,
        javaCall: result.javaCall,
      },
      ...prev.slice(0, 3),
    ]);
  };

  const handleAddOwner = (e: FormEvent) => {
    e.preventDefault();
    const res = addOwner(registry, {
      id: ownerId,
      fullName: ownerName,
      city: ownerCity,
    });
    recordOutcome(res);
    if (res.ok) {
      const nextNum = registry.owners.length + 102;
      setOwnerId(`OWN-${nextNum}`);
      setOwnerName('');
      setOwnerCity('');
    }
  };

  const handleAddCar = (e: FormEvent) => {
    e.preventDefault();
    const res = addCar(registry, {
      id: carId,
      make: carMake,
      wheels: Number(carWheels),
      licensePlate: carPlate,
      model: carModel,
      year: Number(carYear),
      ownerId: carOwnerId.trim() === '' ? null : carOwnerId.trim(),
    });
    recordOutcome(res);
    if (res.ok) {
      const nextIndex = registry.cars.length + 2;
      setCarId(`CAR-0${nextIndex}`);
    }
  };

  const handleUpdateOwner = (e: FormEvent) => {
    e.preventDefault();
    const res = updateOwnerId(registry, updateOldId, updateNewId);
    recordOutcome(res);
  };

  const handleDeleteOwner = (e: FormEvent) => {
    e.preventDefault();
    const res = deleteOwner(registry, deleteTargetId);
    recordOutcome(res);
  };

  const handleResetAll = () => {
    const fresh = createInitialRegistryState();
    setRegistry(fresh);
    setLastResult(null);
    setHistory([]);
    setOwnerId('OWN-104');
    setOwnerName('Clara Lindholm');
    setOwnerCity('Stuttgart, DE');
    setCarId('CAR-06');
    setCarMake('Audi');
    setCarModel('RS6 Avant');
    setCarYear('2025');
    setCarWheels('4');
    setCarPlate('S-RS-600');
    setCarOwnerId('OWN-101');
    setUpdateOldId('OWN-101');
    setUpdateNewId('OWN-901');
    setDeleteTargetId('OWN-101');
  };

  return (
    <section
      id="try-it"
      aria-labelledby="try-it-heading"
      className="relative border-b border-slate-200 bg-slate-50 bg-light-dot-grid"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold text-blue-700">Interactive Browser Sandbox</div>
            <h2
              id="try-it-heading"
              className="mt-2 text-balance text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
            >
              Try It:{' '}
              <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                Live Registry Console
              </span>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
              Add owners, insert cars with valid or invalid foreign keys, rename owner IDs, or
              cascade-delete owners. Everything runs in memory inside your browser.
            </p>
          </div>

          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleResetAll}
            className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Reset Sample Registry</span>
          </motion.button>
        </div>

        {/* Animated Validation Feedback Banner */}
        <AnimatePresence mode="wait">
          {lastResult && (
            <motion.div
              key={`${lastResult.title}-${lastResult.javaCall}`}
              initial={{ opacity: 0, y: -8, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: EASE_OUT }}
              role="status"
              aria-live="polite"
              className={`mt-6 rounded-xl border p-4 shadow-xs ${
                lastResult.ok
                  ? 'border-emerald-300 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-950'
                  : 'border-rose-300 bg-gradient-to-r from-rose-50 to-red-50 text-rose-950'
              }`}
            >
              <div className="flex items-start gap-3">
                {lastResult.ok ? (
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700"
                    aria-hidden="true"
                  />
                ) : (
                  <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-rose-700" aria-hidden="true" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-semibold">{lastResult.title}</span>
                    <span className="font-mono text-[11px] font-semibold opacity-85">
                      {lastResult.ok ? 'Committed' : 'Rejected (No State Change)'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed">{lastResult.message}</p>
                  <div className="mt-2 overflow-x-auto rounded-lg border border-black/10 bg-white/80 px-2.5 py-1.5 font-mono text-[11px] text-slate-900">
                    {lastResult.javaCall}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-start">
          {/* Left: Interactive Forms */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-5">
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />
            <div className="p-5">
              {/* Operation Tabs with animated layoutId */}
              <div
                role="tablist"
                aria-label="Registry operations"
                className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 sm:grid-cols-4 lg:grid-cols-2"
              >
                {SANDBOX_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative inline-flex min-h-[38px] items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                        isActive ? 'text-blue-800' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="sandbox-active-tab"
                          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                          className="absolute inset-0 rounded-lg bg-white shadow-xs"
                        />
                      )}
                      <Icon className="relative z-10 h-3.5 w-3.5" aria-hidden="true" />
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                {/* Form 1: Add Owner */}
                {activeTab === 'add-owner' && (
                  <motion.form
                    key="form-add-owner"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.16, ease: EASE_OUT }}
                    onSubmit={handleAddOwner}
                    className="mt-5 space-y-4"
                  >
                    <div>
                      <label
                        htmlFor="owner-id-input"
                        className="block text-xs font-semibold text-slate-800"
                      >
                        Owner ID (Primary Key)
                      </label>
                      <input
                        id="owner-id-input"
                        type="text"
                        value={ownerId}
                        onChange={(e) => setOwnerId(e.target.value)}
                        placeholder="e.g. OWN-104"
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="owner-name-input"
                        className="block text-xs font-semibold text-slate-800"
                      >
                        Full Name
                      </label>
                      <input
                        id="owner-name-input"
                        type="text"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="e.g. Clara Lindholm"
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="owner-city-input"
                        className="block text-xs font-semibold text-slate-800"
                      >
                        City
                      </label>
                      <input
                        id="owner-city-input"
                        type="text"
                        value={ownerCity}
                        onChange={(e) => setOwnerCity(e.target.value)}
                        placeholder="e.g. Stuttgart, DE"
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <motion.button
                        type="submit"
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex min-h-[40px] items-center gap-1.5 whitespace-nowrap rounded-lg bg-gradient-to-r from-blue-700 to-indigo-700 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:from-blue-800 hover:to-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Add Owner</span>
                      </motion.button>
                      <button
                        type="button"
                        onClick={() => {
                          setOwnerId(registry.owners[0]?.id ?? 'OWN-101');
                          setOwnerName('Duplicate Test');
                          setOwnerCity('Berlin, DE');
                        }}
                        className="inline-flex min-h-[40px] items-center whitespace-nowrap rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                      >
                        Test Duplicate ID
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* Form 2: Add Car */}
                {activeTab === 'add-car' && (
                  <motion.form
                    key="form-add-car"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.16, ease: EASE_OUT }}
                    onSubmit={handleAddCar}
                    className="mt-5 space-y-3.5"
                  >
                    {/* Quick test presets */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="text-[11px] font-semibold text-slate-600">
                        Quick Test Cases
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setCarId(`CAR-0${registry.cars.length + 1}`);
                            setCarOwnerId('OWN-999');
                          }}
                          className="rounded-md border border-rose-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-rose-800 transition-colors hover:bg-rose-50"
                        >
                          Invalid ownerId (OWN-999)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCarId(`CAR-0${registry.cars.length + 1}`);
                            setCarOwnerId('');
                          }}
                          className="rounded-md border border-amber-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-amber-900 transition-colors hover:bg-amber-50"
                        >
                          Nullable (null)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCarId(registry.cars[0]?.id ?? 'CAR-01');
                            setCarOwnerId(registry.owners[0]?.id ?? 'OWN-101');
                          }}
                          className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                        >
                          Duplicate Car ID
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="car-id-input"
                          className="block text-xs font-semibold text-slate-800"
                        >
                          Car ID (PK)
                        </label>
                        <input
                          id="car-id-input"
                          type="text"
                          value={carId}
                          onChange={(e) => setCarId(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="car-make-input"
                          className="block text-xs font-semibold text-slate-800"
                        >
                          Make (Vehicle)
                        </label>
                        <input
                          id="car-make-input"
                          type="text"
                          value={carMake}
                          onChange={(e) => setCarMake(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="car-model-input"
                          className="block text-xs font-semibold text-slate-800"
                        >
                          Model (Car)
                        </label>
                        <input
                          id="car-model-input"
                          type="text"
                          value={carModel}
                          onChange={(e) => setCarModel(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="car-year-input"
                          className="block text-xs font-semibold text-slate-800"
                        >
                          Year
                        </label>
                        <input
                          id="car-year-input"
                          type="number"
                          value={carYear}
                          onChange={(e) => setCarYear(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="car-wheels-input"
                          className="block text-xs font-semibold text-slate-800"
                        >
                          Wheels (RoadVehicle)
                        </label>
                        <input
                          id="car-wheels-input"
                          type="number"
                          value={carWheels}
                          onChange={(e) => setCarWheels(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="car-plate-input"
                          className="block text-xs font-semibold text-slate-800"
                        >
                          License Plate
                        </label>
                        <input
                          id="car-plate-input"
                          type="text"
                          value={carPlate}
                          onChange={(e) => setCarPlate(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="car-owner-input"
                        className="block text-xs font-semibold text-slate-800"
                      >
                        ownerId (Nullable FK — leave blank for null)
                      </label>
                      <div className="mt-1 flex gap-2">
                        <input
                          id="car-owner-input"
                          type="text"
                          value={carOwnerId}
                          onChange={(e) => setCarOwnerId(e.target.value)}
                          placeholder="null (unassigned) or OWN-101"
                          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                        />
                        <select
                          aria-label="Pick existing owner ID"
                          value={
                            registry.owners.some((o) => o.id === carOwnerId)
                              ? carOwnerId
                              : carOwnerId === ''
                                ? '__null__'
                                : '__custom__'
                          }
                          onChange={(e) => {
                            if (e.target.value === '__null__') {
                              setCarOwnerId('');
                            } else if (e.target.value !== '__custom__') {
                              setCarOwnerId(e.target.value);
                            }
                          }}
                          className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-2 font-mono text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                        >
                          <option value="__null__">null</option>
                          {registry.owners.map((owner) => (
                            <option key={owner.id} value={owner.id}>
                              {owner.id}
                            </option>
                          ))}
                          {!registry.owners.some((o) => o.id === carOwnerId) &&
                            carOwnerId !== '' && (
                              <option value="__custom__">Custom ({carOwnerId})</option>
                            )}
                        </select>
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex min-h-[40px] w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-gradient-to-r from-blue-700 to-indigo-700 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:from-blue-800 hover:to-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Add Car to Registry</span>
                    </motion.button>
                  </motion.form>
                )}

                {/* Form 3: Update Owner ID */}
                {activeTab === 'update-owner' && (
                  <motion.form
                    key="form-update-owner"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.16, ease: EASE_OUT }}
                    onSubmit={handleUpdateOwner}
                    className="mt-5 space-y-4"
                  >
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-950">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />
                        <span>Rule: ON UPDATE SET NULL</span>
                      </div>
                      <p className="mt-1">
                        Renaming an owner&apos;s ID updates the parent row and sets{' '}
                        <code className="font-mono">ownerId = null</code> on any cars pointing to
                        the old ID.
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="update-old-id"
                        className="block text-xs font-semibold text-slate-800"
                      >
                        Existing Owner ID
                      </label>
                      <select
                        id="update-old-id"
                        value={updateOldId}
                        onChange={(e) => setUpdateOldId(e.target.value)}
                        disabled={registry.owners.length === 0}
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-600 focus:outline-none disabled:bg-slate-100"
                      >
                        {registry.owners.length === 0 ? (
                          <option value="">No owners available</option>
                        ) : (
                          registry.owners.map((owner) => (
                            <option key={owner.id} value={owner.id}>
                              {owner.id} — {owner.fullName}
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="update-new-id"
                        className="block text-xs font-semibold text-slate-800"
                      >
                        New Owner ID
                      </label>
                      <input
                        id="update-new-id"
                        type="text"
                        value={updateNewId}
                        onChange={(e) => setUpdateNewId(e.target.value)}
                        placeholder="e.g. OWN-901"
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={registry.owners.length === 0}
                      className="inline-flex min-h-[40px] w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:from-amber-700 hover:to-orange-700 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-400"
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Update Owner ID (Set Child FKs to NULL)</span>
                    </motion.button>
                  </motion.form>
                )}

                {/* Form 4: Delete Owner */}
                {activeTab === 'delete-owner' && (
                  <motion.form
                    key="form-delete-owner"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.16, ease: EASE_OUT }}
                    onSubmit={handleDeleteOwner}
                    className="mt-5 space-y-4"
                  >
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs leading-relaxed text-rose-950">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <Trash2 className="h-3.5 w-3.5 text-rose-700" aria-hidden="true" />
                        <span>Rule: ON DELETE CASCADE</span>
                      </div>
                      <p className="mt-1">
                        Deleting an owner removes the parent row and cascade-deletes every car
                        currently referencing that owner.
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="delete-owner-select"
                        className="block text-xs font-semibold text-slate-800"
                      >
                        Select Owner to Delete
                      </label>
                      <select
                        id="delete-owner-select"
                        value={deleteTargetId}
                        onChange={(e) => setDeleteTargetId(e.target.value)}
                        disabled={registry.owners.length === 0}
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-600 focus:outline-none disabled:bg-slate-100"
                      >
                        {registry.owners.length === 0 ? (
                          <option value="">No owners available</option>
                        ) : (
                          registry.owners.map((owner) => {
                            const ownedCount = registry.cars.filter(
                              (c) => c.ownerId === owner.id
                            ).length;
                            return (
                              <option key={owner.id} value={owner.id}>
                                {owner.id} — {owner.fullName} ({ownedCount} cars)
                              </option>
                            );
                          })
                        )}
                      </select>
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={registry.owners.length === 0}
                      className="inline-flex min-h-[40px] w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-gradient-to-r from-rose-700 to-red-700 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:from-rose-800 hover:to-red-800 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Delete Owner &amp; Cascade Cars</span>
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Live Registry Tables with Animated Row Updates */}
          <div className="space-y-5 lg:col-span-7">
            {/* Live Owners Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-50 to-emerald-50/50 px-4 py-3">
                <h3 className="text-xs font-semibold text-slate-900">
                  Live Owners Table (Parent Rows)
                </h3>
                <span className="font-mono text-xs font-medium text-emerald-800 tabular-nums">
                  {registry.owners.length} records
                </span>
              </div>

              {registry.owners.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-slate-500">
                  No Owner records in memory. Add an Owner or click &ldquo;Reset Sample
                  Registry&rdquo;.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500">
                        <th className="px-4 py-2.5 font-medium">id (PK)</th>
                        <th className="px-4 py-2.5 font-medium">fullName</th>
                        <th className="px-4 py-2.5 font-medium">city</th>
                        <th className="px-4 py-2.5 font-medium text-right">Assigned Cars</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <AnimatePresence initial={false}>
                        {registry.owners.map((owner) => {
                          const count = registry.cars.filter((c) => c.ownerId === owner.id).length;
                          return (
                            <motion.tr
                              key={owner.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              transition={{ duration: 0.2, ease: EASE_OUT }}
                              className="transition-colors hover:bg-blue-50/40"
                            >
                              <td className="px-4 py-2.5 font-mono font-semibold text-blue-800">
                                {owner.id}
                              </td>
                              <td className="px-4 py-2.5 font-medium text-slate-900">
                                {owner.fullName}
                              </td>
                              <td className="px-4 py-2.5 text-slate-600">{owner.city}</td>
                              <td className="px-4 py-2.5 text-right font-mono tabular-nums text-slate-700">
                                {count}
                              </td>
                            </motion.tr>
                          );
                        })}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Live Cars Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/50 px-4 py-3">
                <h3 className="text-xs font-semibold text-slate-900">
                  Live Cars Table (Child Rows with Nullable FK)
                </h3>
                <span className="font-mono text-xs font-medium text-blue-800 tabular-nums">
                  {registry.cars.length} records
                </span>
              </div>

              {registry.cars.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-slate-500">
                  No Car records in memory. Add a Car or click &ldquo;Reset Sample Registry&rdquo;.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500">
                        <th className="px-4 py-2.5 font-medium">id (PK)</th>
                        <th className="px-4 py-2.5 font-medium">Make &amp; Model</th>
                        <th className="px-4 py-2.5 font-medium">Plate</th>
                        <th className="px-4 py-2.5 font-medium text-right">Year</th>
                        <th className="px-4 py-2.5 font-medium">ownerId (FK)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <AnimatePresence initial={false}>
                        {registry.cars.map((car) => (
                          <motion.tr
                            key={car.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2, ease: EASE_OUT }}
                            className="transition-colors hover:bg-blue-50/40"
                          >
                            <td className="px-4 py-2.5 font-mono font-semibold text-slate-900">
                              {car.id}
                            </td>
                            <td className="px-4 py-2.5 text-slate-800">
                              <span className="font-medium">{car.make}</span> {car.model}
                              <span className="ml-1.5 font-mono text-[11px] text-slate-400">
                                ({car.wheels}w)
                              </span>
                            </td>
                            <td className="px-4 py-2.5 font-mono text-slate-600">
                              {car.licensePlate}
                            </td>
                            <td className="px-4 py-2.5 text-right font-mono tabular-nums text-slate-700">
                              {car.year}
                            </td>
                            <td className="px-4 py-2.5 font-mono">
                              {car.ownerId === null ? (
                                <span className="font-semibold text-amber-900">
                                  null (unassigned)
                                </span>
                              ) : (
                                <span className="font-semibold text-blue-800">{car.ownerId}</span>
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recent Calls Log */}
            <AnimatePresence>
              {history.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs"
                >
                  <div className="text-xs font-semibold text-slate-900">Recent Operations</div>
                  <ul className="mt-2.5 space-y-2">
                    {history.map((entry) => (
                      <li
                        key={entry.id}
                        className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2 text-xs last:border-b-0 last:pb-0"
                      >
                        <span
                          className={`font-semibold ${
                            entry.ok ? 'text-emerald-800' : 'text-rose-800'
                          }`}
                        >
                          {entry.ok ? 'OK' : 'Rejected'} · {entry.title}
                        </span>
                        <code className="max-w-full truncate font-mono text-[11px] text-slate-600">
                          {entry.javaCall}
                        </code>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
