import { ArrowRight, CheckCircle2, Database, Info, KeyRound, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export function OverviewSection() {
  return (
    <section
      id="overview"
      aria-labelledby="overview-heading"
      className="relative overflow-hidden border-b border-slate-800 bg-slate-950 text-slate-100"
    >
      {/* Atmospheric Multi-Stop Radial Gradient Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-engineering-grid opacity-90"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 left-1/4 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-1/5 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 right-1/3 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left column: Problem Statement & Rule Cards */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="lg:col-span-7"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-cyan-300">
              <span>Java OOP Architecture</span>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <span>Referential Integrity</span>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <span>In-Memory Simulation</span>
            </div>

            <h1
              id="overview-heading"
              className="mt-3 text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
            >
              Vehicle Registry{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                Integrity Engine
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
              An interactive visual guide to building a multi-level Java inheritance hierarchy that
              enforces SQL-style foreign-key constraints in memory, including{' '}
              <code className="rounded border border-amber-400/30 bg-amber-500/15 px-1.5 py-0.5 font-mono text-sm text-amber-200">
                ON UPDATE SET NULL
              </code>{' '}
              and{' '}
              <code className="rounded border border-rose-400/30 bg-rose-500/15 px-1.5 py-0.5 font-mono text-sm text-rose-200">
                ON DELETE CASCADE
              </code>
              , using explicit constructor parameter passing.
            </p>

            {/* Challenge Brief Card with Subtle Gradient Border */}
            <div className="mt-6 rounded-xl bg-gradient-to-r from-blue-500/35 via-cyan-400/25 to-indigo-500/35 p-px">
              <div className="rounded-[11px] bg-slate-900/95 p-4 sm:p-5">
                <div className="text-xs font-semibold tracking-wide text-cyan-300">
                  Design Challenge
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-200">
                  “Build a multi-level Java inheritance hierarchy that enforces SQL foreign-key
                  integrity rules, including ON DELETE CASCADE and ON UPDATE SET NULL, using
                  explicit parameter passing.”
                </p>
              </div>
            </div>

            {/* 4 Core Rules Summary */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.18, ease: EASE_OUT }}
                className="rounded-xl border border-blue-500/25 bg-slate-900/80 p-4 backdrop-blur-sm transition-colors hover:border-blue-400/50"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300">
                    <KeyRound className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>Parent &amp; Child Rows</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  <code className="font-mono text-cyan-200">Owner</code> records act as parent rows.
                  Each <code className="font-mono text-cyan-200">Car</code> holds a nullable{' '}
                  <code className="font-mono text-amber-200">ownerId</code> foreign key pointing to an owner.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.18, ease: EASE_OUT }}
                className="rounded-xl border border-rose-500/25 bg-slate-900/80 p-4 backdrop-blur-sm transition-colors hover:border-rose-400/50"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/20 text-rose-300">
                    <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>Foreign-Key Enforcement</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  Adding a car with a non-existent <code className="font-mono text-rose-200">ownerId</code>{' '}
                  is rejected immediately. Setting <code className="font-mono text-amber-200">ownerId</code>{' '}
                  to <code className="font-mono text-amber-200">null</code> is valid for unassigned vehicles.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.18, ease: EASE_OUT }}
                className="rounded-xl border border-emerald-500/25 bg-slate-900/80 p-4 backdrop-blur-sm transition-colors hover:border-emerald-400/50"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>Unique Primary Keys</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  Duplicate <code className="font-mono text-emerald-200">Owner</code> IDs and duplicate{' '}
                  <code className="font-mono text-emerald-200">Car</code> IDs are rejected before modifying
                  the registry maps.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.18, ease: EASE_OUT }}
                className="rounded-xl border border-amber-500/25 bg-slate-900/80 p-4 backdrop-blur-sm transition-colors hover:border-amber-400/50"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300">
                    <Database className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>Automated Cascades</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  Updating an owner ID clears dependent <code className="font-mono text-amber-200">ownerId</code>{' '}
                  references to <code className="font-mono text-amber-200">null</code>; deleting an owner
                  deletes all cars referencing them.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right column: Animated Parent-Child Foreign Key Diagram + Simulation Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE_OUT }}
            className="space-y-4 lg:col-span-5"
          >
            <div className="rounded-2xl bg-gradient-to-br from-cyan-400/35 via-blue-500/25 to-indigo-500/35 p-px shadow-xl shadow-blue-950/50">
              <div className="rounded-[15px] bg-slate-900/95 p-5 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white">
                    Parent–Child Foreign-Key Relationship
                  </h2>
                  <span className="font-mono text-xs font-semibold text-cyan-300">1 : 0..*</span>
                </div>
                <p className="mt-1 text-xs text-slate-300">
                  Every non-null <code className="font-mono text-amber-200">Car.ownerId</code> must match an existing{' '}
                  <code className="font-mono text-cyan-200">Owner.id</code>.
                </p>

                {/* Diagram */}
                <div className="mt-4 space-y-2.5">
                  {/* Parent Box */}
                  <div className="rounded-xl border border-cyan-400/35 bg-gradient-to-br from-slate-800/90 to-slate-900 p-3.5">
                    <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
                      <span className="font-mono text-xs font-semibold text-cyan-300">
                        Owner (Parent Row)
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        extends RegistryEntity
                      </span>
                    </div>
                    <div className="mt-2 space-y-1 font-mono text-xs">
                      <div className="flex items-center justify-between text-white">
                        <span>id : String</span>
                        <span className="font-semibold text-cyan-300">Primary Key</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span>fullName : String</span>
                        <span className="text-slate-400">required</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span>city : String</span>
                        <span className="text-slate-400">required</span>
                      </div>
                    </div>
                  </div>

                  {/* Animated SVG Relationship Connector */}
                  <div className="flex items-center justify-center py-0.5" aria-hidden="true">
                    <svg width="260" height="46" viewBox="0 0 260 46" className="overflow-visible">
                      <line
                        x1="130"
                        y1="0"
                        x2="130"
                        y2="37"
                        stroke="#38BDF8"
                        strokeWidth="2"
                        strokeDasharray="5 4"
                        className="animate-dash-flow"
                      />
                      <polygon points="130,45 125,35 135,35" fill="#38BDF8" />
                      <rect
                        x="42"
                        y="10"
                        width="176"
                        height="22"
                        rx="6"
                        fill="#0F172A"
                        stroke="#38BDF8"
                        strokeOpacity="0.6"
                      />
                      <text
                        x="130"
                        y="25"
                        textAnchor="middle"
                        fill="#BAE6FD"
                        fontSize="10.5"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        Car.ownerId → Owner.id
                      </text>
                    </svg>
                  </div>

                  {/* Child Box */}
                  <div className="rounded-xl border border-indigo-400/35 bg-gradient-to-br from-slate-800/90 to-slate-900 p-3.5">
                    <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
                      <span className="font-mono text-xs font-semibold text-indigo-300">
                        Car (Child Row)
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        extends RoadVehicle
                      </span>
                    </div>
                    <div className="mt-2 space-y-1 font-mono text-xs">
                      <div className="flex items-center justify-between text-white">
                        <span>id : String</span>
                        <span className="font-semibold text-indigo-300">Primary Key</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span>make, model, year, wheels, plate</span>
                        <span className="text-slate-400">inherited + own</span>
                      </div>
                      <div className="flex items-center justify-between rounded-md border border-amber-400/30 bg-amber-500/15 px-2 py-1 text-amber-200">
                        <span>ownerId : String</span>
                        <span className="font-semibold">Nullable FK</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                  <a
                    href="#actions"
                    className="inline-flex items-center gap-1 font-semibold text-cyan-300 transition-colors hover:text-cyan-200 hover:underline"
                  >
                    <span>Inspect cascade examples</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                  <span className="text-slate-600" aria-hidden="true">|</span>
                  <a
                    href="#try-it"
                    className="inline-flex items-center gap-1 font-semibold text-indigo-300 transition-colors hover:text-indigo-200 hover:underline"
                  >
                    <span>Open interactive sandbox</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            {/* Educational Simulation Note */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="flex items-start gap-2.5">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
                <div>
                  <h3 className="text-xs font-semibold text-white">
                    In-Memory Educational Simulation
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-300">
                    This engine runs entirely in memory to teach object-oriented design and
                    relational constraint mechanics. In a real application, foreign-key constraints,{' '}
                    <code className="font-mono text-rose-200">ON DELETE CASCADE</code>, and{' '}
                    <code className="font-mono text-amber-200">ON UPDATE SET NULL</code> should
                    generally be enforced by the database engine for transactional safety and persistence.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
