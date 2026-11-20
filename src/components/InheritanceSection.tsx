import { useState } from 'react';
import { ArrowUp, GitBranch, Layers } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

type ClassNodeId = 'RegistryEntity' | 'Owner' | 'Vehicle' | 'RoadVehicle' | 'Car';

interface ClassAccentTheme {
  selectedBorder: string;
  selectedBg: string;
  badgeText: string;
  gradientBar: string;
  levelText: string;
  superPillBg: string;
}

interface ClassNodeSpec {
  id: ClassNodeId;
  level: string;
  modifier: 'abstract class' | 'class';
  extendsClass: string | null;
  ownFields: string[];
  inheritedFields: string[];
  constructorSignature: string;
  superCall: string | null;
  explanation: string;
  theme: ClassAccentTheme;
  exampleTrace: {
    step: string;
    call: string;
    detail: string;
  }[];
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const CLASS_SPECS: Record<ClassNodeId, ClassNodeSpec> = {
  RegistryEntity: {
    id: 'RegistryEntity',
    level: 'Level 1 · Root',
    modifier: 'abstract class',
    extendsClass: null,
    ownFields: ['private String id'],
    inheritedFields: [],
    constructorSignature: 'protected RegistryEntity(String id)',
    superCall: null,
    explanation:
      'Every record stored in VehicleRegistry—whether an Owner or a Car—inherits a validated non-blank id from RegistryEntity. Because it is abstract, you cannot instantiate RegistryEntity directly.',
    theme: {
      selectedBorder: 'border-indigo-600 ring-2 ring-indigo-500/20',
      selectedBg: 'bg-gradient-to-r from-indigo-50 to-violet-50',
      badgeText: 'text-indigo-700',
      gradientBar: 'from-indigo-600 via-violet-500 to-blue-500',
      levelText: 'text-indigo-700',
      superPillBg: 'border-indigo-200 bg-indigo-50 text-indigo-900',
    },
    exampleTrace: [
      {
        step: 'Root Validation',
        call: 'this.id = id.trim();',
        detail: 'Rejects null or blank IDs before any subclass finishes constructing.',
      },
    ],
  },
  Owner: {
    id: 'Owner',
    level: 'Level 2 · Parent Entity',
    modifier: 'class',
    extendsClass: 'RegistryEntity',
    ownFields: ['private final String fullName', 'private final String city'],
    inheritedFields: ['id (from RegistryEntity)'],
    constructorSignature: 'public Owner(String id, String fullName, String city)',
    superCall: 'super(id);',
    explanation:
      'Owner extends RegistryEntity directly instead of Vehicle. It acts as the parent table row in the registry, supplying the primary key id that Car.ownerId references.',
    theme: {
      selectedBorder: 'border-emerald-600 ring-2 ring-emerald-500/20',
      selectedBg: 'bg-gradient-to-r from-emerald-50 to-teal-50',
      badgeText: 'text-emerald-700',
      gradientBar: 'from-emerald-600 via-teal-500 to-cyan-500',
      levelText: 'text-emerald-700',
      superPillBg: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    },
    exampleTrace: [
      {
        step: '1. Instantiate Owner',
        call: 'new Owner("OWN-101", "Elena Vance", "Munich, DE")',
        detail: 'Receives all three arguments at the leaf constructor.',
      },
      {
        step: '2. Explicit Forwarding',
        call: 'super("OWN-101");',
        detail: 'Passes id explicitly up to RegistryEntity(String id) for validation.',
      },
    ],
  },
  Vehicle: {
    id: 'Vehicle',
    level: 'Level 2 · Vehicle Branch',
    modifier: 'abstract class',
    extendsClass: 'RegistryEntity',
    ownFields: ['private final String make'],
    inheritedFields: ['id (from RegistryEntity)'],
    constructorSignature: 'protected Vehicle(String id, String make)',
    superCall: 'super(id);',
    explanation:
      'Vehicle adds the manufacturer make and explicitly forwards id to RegistryEntity via super(id). Subclasses such as RoadVehicle invoke super(id, make) to initialize both layers.',
    theme: {
      selectedBorder: 'border-cyan-600 ring-2 ring-cyan-500/20',
      selectedBg: 'bg-gradient-to-r from-cyan-50 to-sky-50',
      badgeText: 'text-cyan-700',
      gradientBar: 'from-cyan-600 via-sky-500 to-blue-500',
      levelText: 'text-cyan-700',
      superPillBg: 'border-cyan-200 bg-cyan-50 text-cyan-900',
    },
    exampleTrace: [
      {
        step: '1. Called by RoadVehicle',
        call: 'super("CAR-01", "Porsche");',
        detail: 'RoadVehicle passes id and make explicitly into Vehicle.',
      },
      {
        step: '2. Forward to Root',
        call: 'super("CAR-01");',
        detail: 'Vehicle forwards id up to RegistryEntity and validates make locally.',
      },
    ],
  },
  RoadVehicle: {
    id: 'RoadVehicle',
    level: 'Level 3 · Road Specialization',
    modifier: 'abstract class',
    extendsClass: 'Vehicle',
    ownFields: ['private final int wheels', 'private final String licensePlate'],
    inheritedFields: ['id (RegistryEntity)', 'make (Vehicle)'],
    constructorSignature:
      'protected RoadVehicle(String id, String make, int wheels, String licensePlate)',
    superCall: 'super(id, make);',
    explanation:
      'RoadVehicle models road-legal attributes (wheels and licensePlate) and passes id and make upward with super(id, make). This guarantees every level validates its own parameters.',
    theme: {
      selectedBorder: 'border-blue-600 ring-2 ring-blue-500/20',
      selectedBg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
      badgeText: 'text-blue-700',
      gradientBar: 'from-blue-600 via-indigo-500 to-cyan-500',
      levelText: 'text-blue-700',
      superPillBg: 'border-blue-200 bg-blue-50 text-blue-900',
    },
    exampleTrace: [
      {
        step: '1. Called by Car',
        call: 'super("CAR-01", "Porsche", 4, "M-PV-911");',
        detail: 'Car forwards all shared vehicle and road attributes upward.',
      },
      {
        step: '2. Call Vehicle',
        call: 'super("CAR-01", "Porsche");',
        detail: 'Explicit super(id, make) initializes Vehicle and RegistryEntity.',
      },
    ],
  },
  Car: {
    id: 'Car',
    level: 'Level 4 · Concrete Child Entity',
    modifier: 'class',
    extendsClass: 'RoadVehicle',
    ownFields: [
      'private final String model',
      'private final int year',
      'private String ownerId // nullable FK',
    ],
    inheritedFields: [
      'id (RegistryEntity)',
      'make (Vehicle)',
      'wheels, licensePlate (RoadVehicle)',
    ],
    constructorSignature:
      'public Car(String id, String make, int wheels, String licensePlate, String model, int year, String ownerId)',
    superCall: 'super(id, make, wheels, licensePlate);',
    explanation:
      'Car is the concrete child row stored in VehicleRegistry. It passes four parameters up through RoadVehicle → Vehicle → RegistryEntity and stores model, year, and a nullable ownerId foreign key.',
    theme: {
      selectedBorder: 'border-amber-600 ring-2 ring-amber-500/20',
      selectedBg: 'bg-gradient-to-r from-amber-50 to-orange-50',
      badgeText: 'text-amber-800',
      gradientBar: 'from-amber-500 via-orange-500 to-rose-500',
      levelText: 'text-amber-800',
      superPillBg: 'border-amber-200 bg-amber-50 text-amber-950',
    },
    exampleTrace: [
      {
        step: '1. Car Constructor',
        call: 'new Car("CAR-01", "Porsche", 4, "M-PV-911", "911 Carrera", 2025, "OWN-101")',
        detail: 'Accepts all 7 parameters and starts the explicit super(...) chain.',
      },
      {
        step: '2. RoadVehicle Layer',
        call: 'super("CAR-01", "Porsche", 4, "M-PV-911");',
        detail: 'Validates wheels and licensePlate, then calls super(id, make).',
      },
      {
        step: '3. Vehicle Layer',
        call: 'super("CAR-01", "Porsche");',
        detail: 'Validates make, then calls super(id).',
      },
      {
        step: '4. RegistryEntity Root',
        call: 'super("CAR-01");',
        detail: 'Validates and stores the shared primary key id.',
      },
    ],
  },
};

export function InheritanceSection() {
  const [selectedClass, setSelectedClass] = useState<ClassNodeId>('RoadVehicle');
  const active = CLASS_SPECS[selectedClass];

  const renderNodeButton = (nodeId: ClassNodeId, badge: string, subtitle: string) => {
    const spec = CLASS_SPECS[nodeId];
    const isSelected = selectedClass === nodeId;
    const isAbstract = spec.modifier === 'abstract class';

    return (
      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.16, ease: EASE_OUT }}
        onClick={() => setSelectedClass(nodeId)}
        aria-pressed={isSelected}
        className={`w-full rounded-xl border px-3.5 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
          isSelected
            ? `${spec.theme.selectedBorder} ${spec.theme.selectedBg} text-slate-900 shadow-sm`
            : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-sm font-semibold">{nodeId}</span>
          <span
            className={`font-mono text-[11px] font-medium ${
              isSelected
                ? spec.theme.badgeText
                : isAbstract
                  ? 'text-slate-500'
                  : 'text-emerald-700'
            }`}
          >
            {badge}
          </span>
        </div>
        <div className="mt-0.5 text-xs text-slate-600">{subtitle}</div>
      </motion.button>
    );
  };

  return (
    <section
      id="inheritance"
      aria-labelledby="inheritance-heading"
      className="relative border-b border-slate-200 bg-slate-50 bg-light-dot-grid"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
            <Layers className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Multi-Level Inheritance Hierarchy</span>
          </div>
          <h2
            id="inheritance-heading"
            className="mt-2 text-balance text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
          >
            Explicit Constructor{' '}
            <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Parameter Passing
            </span>
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
            Every class passes shared fields upward using explicit{' '}
            <code className="rounded border border-blue-200 bg-white px-1.5 py-0.5 font-mono text-sm text-blue-900">
              super(...)
            </code>{' '}
            calls—never silent no-arg defaults. Click any class in the hierarchy to trace its
            fields and constructor chain.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left: Interactive Hierarchy Tree Diagram */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                <GitBranch className="h-4 w-4 text-blue-700" aria-hidden="true" />
                <span>Class Inheritance Tree</span>
              </div>
              <span className="text-xs font-medium text-blue-700">Click to inspect</span>
            </div>

            <div className="mt-4 space-y-3">
              {/* Root: RegistryEntity */}
              <div>{renderNodeButton('RegistryEntity', 'abstract', 'id : String (Primary Key)')}</div>

              {/* Branch connector */}
              <div className="grid grid-cols-1 gap-4 pl-4 sm:grid-cols-12 sm:gap-3 sm:pl-3">
                {/* Left branch: Owner */}
                <div className="sm:col-span-5">
                  <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[11px] font-medium text-emerald-700">
                    <ArrowUp className="h-3 w-3" aria-hidden="true" />
                    <span>super(id)</span>
                  </div>
                  {renderNodeButton('Owner', 'concrete', 'fullName, city')}
                </div>

                {/* Right branch: Vehicle -> RoadVehicle -> Car */}
                <div className="space-y-2.5 sm:col-span-7">
                  <div>
                    <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[11px] font-medium text-cyan-700">
                      <ArrowUp className="h-3 w-3" aria-hidden="true" />
                      <span>super(id)</span>
                    </div>
                    {renderNodeButton('Vehicle', 'abstract', 'make : String')}
                  </div>

                  <div className="pl-3">
                    <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[11px] font-semibold text-blue-700">
                      <ArrowUp className="h-3 w-3" aria-hidden="true" />
                      <span>super(id, make)</span>
                    </div>
                    {renderNodeButton('RoadVehicle', 'abstract', 'wheels, licensePlate')}
                  </div>

                  <div className="pl-6">
                    <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[11px] font-medium text-amber-800">
                      <ArrowUp className="h-3 w-3" aria-hidden="true" />
                      <span>super(id, make, wheels, licensePlate)</span>
                    </div>
                    {renderNodeButton('Car', 'concrete', 'model, year, ownerId (FK)')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Animated Class Inspector & super(...) Parameter Trace */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-7">
            <div className={`h-1.5 w-full bg-gradient-to-r ${active.theme.gradientBar}`} />

            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
                className="p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <div className={`text-xs font-semibold ${active.theme.levelText}`}>
                      {active.level}
                    </div>
                    <h3 className="mt-1 font-mono text-xl font-semibold text-slate-900">
                      {active.modifier} {active.id}
                      {active.extendsClass ? ` extends ${active.extendsClass}` : ''}
                    </h3>
                  </div>
                  {active.superCall && (
                    <div
                      className={`rounded-lg border px-2.5 py-1 font-mono text-xs font-semibold ${active.theme.superPillBg}`}
                    >
                      Calls {active.superCall}
                    </div>
                  )}
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-700">{active.explanation}</p>

                {/* Fields & Constructor Grid */}
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-slate-50/90 p-3.5">
                    <div className="text-xs font-semibold text-slate-900">Fields Declared Here</div>
                    <ul className="mt-2 space-y-1 font-mono text-xs text-slate-800">
                      {active.ownFields.map((field) => (
                        <li key={field}>{field}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/90 p-3.5">
                    <div className="text-xs font-semibold text-slate-900">Inherited State</div>
                    {active.inheritedFields.length === 0 ? (
                      <p className="mt-2 text-xs text-slate-500">None — root of hierarchy.</p>
                    ) : (
                      <ul className="mt-2 space-y-1 font-mono text-xs text-slate-700">
                        {active.inheritedFields.map((field) => (
                          <li key={field}>{field}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Constructor Signature */}
                <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-slate-100">
                  <div className="text-[11px] font-medium text-slate-400">
                    Constructor Signature
                  </div>
                  <code className="mt-1 block overflow-x-auto whitespace-nowrap font-mono text-xs text-cyan-300">
                    {active.constructorSignature}
                  </code>
                  {active.superCall && (
                    <code className="mt-1 block font-mono text-xs text-emerald-300">
                      {'    '}
                      {active.superCall}
                    </code>
                  )}
                </div>

                {/* Step-by-step Parameter Trace */}
                <div className="mt-5">
                  <div className="text-xs font-semibold text-slate-900">
                    Explicit Parameter Passing Trace
                  </div>
                  <ol className="mt-2.5 space-y-2">
                    {active.exampleTrace.map((item, idx) => (
                      <motion.li
                        key={item.step}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.22, delay: idx * 0.05, ease: EASE_OUT }}
                        className="rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-slate-900">{item.step}</span>
                          <code className="font-mono text-xs font-medium text-blue-800">
                            {item.call}
                          </code>
                        </div>
                        <p className="mt-1 text-xs text-slate-600">{item.detail}</p>
                      </motion.li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
