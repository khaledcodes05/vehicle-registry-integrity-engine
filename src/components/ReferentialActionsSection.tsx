import { useState } from 'react';
import { AlertTriangle, Play, RotateCcw, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CarRecord,
  OwnerRecord,
  RegistryState,
  deleteOwner,
  updateOwnerId,
} from '../domain/registryEngine';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

function createActionSnapshot(): RegistryState {
  return {
    owners: [
      { id: 'OWN-101', fullName: 'Elena Vance', city: 'Munich, DE' },
      { id: 'OWN-102', fullName: 'Marcus Lindqvist', city: 'Gothenburg, SE' },
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
    ],
  };
}

interface SnapshotTableProps {
  title: string;
  owners: OwnerRecord[];
  cars: CarRecord[];
  mode: 'before' | 'set-null-after' | 'cascade-after';
}

function SnapshotTables({ title, owners, cars, mode }: SnapshotTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5">
        <span className="text-xs font-semibold text-slate-900">{title}</span>
        <span className="font-mono text-[11px] text-slate-500 tabular-nums">
          {owners.length} owners · {cars.length} cars
        </span>
      </div>

      {/* Owners Table */}
      <div className="border-b border-slate-200">
        <div className="bg-slate-50/70 px-4 py-1.5 text-[11px] font-semibold text-slate-600">
          Owners (Parent Rows)
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="px-4 py-2 font-medium">id (PK)</th>
                <th className="px-4 py-2 font-medium">fullName</th>
                <th className="px-4 py-2 font-medium text-right">Row Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {owners.map((owner) => {
                const isUpdatedOwner = mode === 'set-null-after' && owner.id === 'OWN-901';
                return (
                  <tr
                    key={owner.id}
                    className={isUpdatedOwner ? 'bg-blue-50/80' : 'bg-white'}
                  >
                    <td className="px-4 py-2 font-mono font-semibold text-slate-900">{owner.id}</td>
                    <td className="px-4 py-2 text-slate-700">{owner.fullName}</td>
                    <td className="px-4 py-2 text-right font-mono text-[11px]">
                      {isUpdatedOwner ? (
                        <span className="font-semibold text-blue-800">ID Updated</span>
                      ) : (
                        <span className="text-slate-500">Active</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {mode === 'cascade-after' && (
                <tr className="bg-rose-50/90 text-rose-900">
                  <td className="px-4 py-2 font-mono line-through">OWN-101</td>
                  <td className="px-4 py-2 line-through">Elena Vance</td>
                  <td className="px-4 py-2 text-right font-mono text-[11px] font-semibold">
                    Deleted Parent
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cars Table */}
      <div>
        <div className="bg-slate-50/70 px-4 py-1.5 text-[11px] font-semibold text-slate-600">
          Cars (Child Rows)
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="px-4 py-2 font-medium">id (PK)</th>
                <th className="px-4 py-2 font-medium">Vehicle</th>
                <th className="px-4 py-2 font-medium">ownerId (FK)</th>
                <th className="px-4 py-2 font-medium text-right">Effect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cars.map((car) => {
                const isSetNull =
                  mode === 'set-null-after' &&
                  (car.id === 'CAR-01' || car.id === 'CAR-02') &&
                  car.ownerId === null;
                return (
                  <tr key={car.id} className={isSetNull ? 'bg-amber-50/85' : 'bg-white'}>
                    <td className="px-4 py-2 font-mono font-semibold text-slate-900">{car.id}</td>
                    <td className="px-4 py-2 text-slate-700">
                      {car.make} {car.model}
                    </td>
                    <td className="px-4 py-2 font-mono">
                      {car.ownerId === null ? (
                        <span className="font-semibold text-amber-900">null</span>
                      ) : (
                        <span className="text-slate-900">{car.ownerId}</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-right font-mono text-[11px]">
                      {isSetNull ? (
                        <span className="font-semibold text-amber-900">Set to NULL</span>
                      ) : (
                        <span className="text-slate-500">Unchanged</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {mode === 'cascade-after' && (
                <>
                  <tr className="bg-rose-50/90 text-rose-900">
                    <td className="px-4 py-2 font-mono line-through">CAR-01</td>
                    <td className="px-4 py-2 line-through">Porsche 911 Carrera</td>
                    <td className="px-4 py-2 font-mono line-through">OWN-101</td>
                    <td className="px-4 py-2 text-right font-mono text-[11px] font-semibold">
                      Deleted (Cascade)
                    </td>
                  </tr>
                  <tr className="bg-rose-50/90 text-rose-900">
                    <td className="px-4 py-2 font-mono line-through">CAR-02</td>
                    <td className="px-4 py-2 line-through">Porsche Taycan 4S</td>
                    <td className="px-4 py-2 font-mono line-through">OWN-101</td>
                    <td className="px-4 py-2 text-right font-mono text-[11px] font-semibold">
                      Deleted (Cascade)
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function ReferentialActionsSection() {
  const baseline = createActionSnapshot();

  const [setNullState, setSetNullState] = useState<RegistryState | null>(null);
  const [setNullNote, setSetNullNote] = useState<string | null>(null);

  const [cascadeState, setCascadeState] = useState<RegistryState | null>(null);
  const [cascadeNote, setCascadeNote] = useState<string | null>(null);

  const runSetNullExample = () => {
    const result = updateOwnerId(baseline, 'OWN-101', 'OWN-901');
    setSetNullState(result.nextState);
    setSetNullNote(result.message);
  };

  const resetSetNullExample = () => {
    setSetNullState(null);
    setSetNullNote(null);
  };

  const runCascadeExample = () => {
    const result = deleteOwner(baseline, 'OWN-101');
    setCascadeState(result.nextState);
    setCascadeNote(result.message);
  };

  const resetCascadeExample = () => {
    setCascadeState(null);
    setCascadeNote(null);
  };

  return (
    <section
      id="actions"
      aria-labelledby="actions-heading"
      className="border-b border-slate-200 bg-white"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold text-indigo-700">
            Interactive Before &amp; After Examples
          </div>
          <h2
            id="actions-heading"
            className="mt-2 text-balance text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
          >
            SQL-Style{' '}
            <span className="bg-gradient-to-r from-amber-600 via-blue-700 to-rose-600 bg-clip-text text-transparent">
              Referential Actions
            </span>{' '}
            in Java
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
            When a parent <code className="font-mono text-slate-900">Owner</code> key changes or is
            deleted, child <code className="font-mono text-slate-900">Car</code> records cannot be
            left pointing to a stale ID. Run each example below to compare the tables before and
            after execution.
          </p>
        </div>

        <div className="mt-8 space-y-10">
          {/* Example 1: ON UPDATE SET NULL */}
          <div className="overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/60 via-slate-50 to-blue-50/40 shadow-sm">
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-blue-600" />
            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                      <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <h3 className="text-lg font-semibold text-slate-900">
                      1. ON UPDATE SET NULL —{' '}
                      <code className="font-mono text-base text-blue-800">
                        updateOwnerId(&quot;OWN-101&quot;, &quot;OWN-901&quot;)
                      </code>
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    Changing <code className="font-mono text-slate-900">OWN-101</code> to{' '}
                    <code className="font-mono text-slate-900">OWN-901</code> moves the parent owner
                    record and sets <code className="font-mono text-slate-900">ownerId = null</code>{' '}
                    on every car that referenced <code className="font-mono text-slate-900">OWN-101</code>.
                    Cars keep existing in the registry without dangling references.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <motion.button
                    type="button"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={runSetNullExample}
                    className="inline-flex min-h-[40px] items-center gap-2 whitespace-nowrap rounded-lg bg-gradient-to-r from-blue-700 to-indigo-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:from-blue-800 hover:to-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    <Play className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Run ON UPDATE SET NULL</span>
                  </motion.button>
                  {setNullState && (
                    <button
                      type="button"
                      onClick={resetSetNullExample}
                      className="inline-flex min-h-[40px] items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {setNullNote && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: EASE_OUT }}
                    role="status"
                    className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-950"
                  >
                    {setNullNote}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <SnapshotTables
                  title="Before updateOwnerId"
                  owners={baseline.owners}
                  cars={baseline.cars}
                  mode="before"
                />
                <AnimatePresence mode="wait">
                  {setNullState ? (
                    <motion.div
                      key="set-null-result"
                      initial={{ opacity: 0, scale: 0.98, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.24, ease: EASE_OUT }}
                    >
                      <SnapshotTables
                        title="After ON UPDATE SET NULL"
                        owners={setNullState.owners}
                        cars={setNullState.cars}
                        mode="set-null-after"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="set-null-placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-amber-300/80 bg-white/90 p-8 text-center"
                    >
                      <p className="text-sm font-semibold text-slate-800">
                        Ready to simulate{' '}
                        <code className="font-mono text-amber-800">ON UPDATE SET NULL</code>
                      </p>
                      <p className="mt-1 max-w-sm text-xs text-slate-600">
                        Click &ldquo;Run ON UPDATE SET NULL&rdquo; to rename{' '}
                        <code className="font-mono">OWN-101</code> to{' '}
                        <code className="font-mono">OWN-901</code> and watch{' '}
                        <code className="font-mono">CAR-01</code> &amp;{' '}
                        <code className="font-mono">CAR-02</code> transition to{' '}
                        <code className="font-mono">null</code>.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Example 2: ON DELETE CASCADE */}
          <div className="overflow-hidden rounded-2xl border border-rose-200/80 bg-gradient-to-br from-rose-50/60 via-slate-50 to-indigo-50/40 shadow-sm">
            <div className="h-1.5 w-full bg-gradient-to-r from-rose-600 via-red-500 to-amber-500" />
            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-rose-800">
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <h3 className="text-lg font-semibold text-slate-900">
                      2. ON DELETE CASCADE —{' '}
                      <code className="font-mono text-base text-blue-800">
                        deleteOwner(&quot;OWN-101&quot;)
                      </code>
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    Deleting parent owner <code className="font-mono text-slate-900">OWN-101</code>{' '}
                    automatically cascades and deletes every{' '}
                    <code className="font-mono text-slate-900">Car</code> whose{' '}
                    <code className="font-mono text-slate-900">ownerId</code> equals{' '}
                    <code className="font-mono text-slate-900">OWN-101</code> (
                    <code className="font-mono">CAR-01</code> and{' '}
                    <code className="font-mono">CAR-02</code>), while leaving{' '}
                    <code className="font-mono">OWN-102</code> and{' '}
                    <code className="font-mono">CAR-03</code> untouched.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <motion.button
                    type="button"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={runCascadeExample}
                    className="inline-flex min-h-[40px] items-center gap-2 whitespace-nowrap rounded-lg bg-gradient-to-r from-rose-700 to-red-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:from-rose-800 hover:to-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                  >
                    <Play className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Run ON DELETE CASCADE</span>
                  </motion.button>
                  {cascadeState && (
                    <button
                      type="button"
                      onClick={resetCascadeExample}
                      className="inline-flex min-h-[40px] items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {cascadeNote && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: EASE_OUT }}
                    role="status"
                    className="mt-4 rounded-xl border border-rose-300 bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-950"
                  >
                    {cascadeNote}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <SnapshotTables
                  title="Before deleteOwner"
                  owners={baseline.owners}
                  cars={baseline.cars}
                  mode="before"
                />
                <AnimatePresence mode="wait">
                  {cascadeState ? (
                    <motion.div
                      key="cascade-result"
                      initial={{ opacity: 0, scale: 0.98, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.24, ease: EASE_OUT }}
                    >
                      <SnapshotTables
                        title="After ON DELETE CASCADE"
                        owners={cascadeState.owners}
                        cars={cascadeState.cars}
                        mode="cascade-after"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="cascade-placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-rose-300/80 bg-white/90 p-8 text-center"
                    >
                      <p className="text-sm font-semibold text-slate-800">
                        Ready to simulate{' '}
                        <code className="font-mono text-rose-700">ON DELETE CASCADE</code>
                      </p>
                      <p className="mt-1 max-w-sm text-xs text-slate-600">
                        Click &ldquo;Run ON DELETE CASCADE&rdquo; to delete{' '}
                        <code className="font-mono">OWN-101</code> and verify that{' '}
                        <code className="font-mono">CAR-01</code> and{' '}
                        <code className="font-mono">CAR-02</code> are removed automatically.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
