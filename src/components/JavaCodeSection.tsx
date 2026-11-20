import { useState } from 'react';
import { Code2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { JAVA_CODE_TABS } from '../data/javaCodeSnippets';
import { JavaCodeBlock } from './JavaCodeBlock';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export function JavaCodeSection() {
  const [selectedId, setSelectedId] = useState<string>('road-vehicle');
  const activeTab = JAVA_CODE_TABS.find((t) => t.id === selectedId) ?? JAVA_CODE_TABS[0];

  return (
    <section
      id="java-code"
      aria-labelledby="java-code-heading"
      className="relative overflow-hidden border-b border-slate-800 bg-slate-950 text-slate-100"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-1/4 h-80 w-80 rounded-full bg-indigo-600/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/4 h-80 w-80 rounded-full bg-cyan-600/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
            <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Reference Implementation</span>
          </div>
          <h2
            id="java-code-heading"
            className="mt-2 text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl"
          >
            Java Source Classes &amp;{' '}
            <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
              Registry Methods
            </span>
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
            Explore every class in the hierarchy and each referential integrity method in{' '}
            <code className="font-mono text-cyan-200">VehicleRegistry</code>. Every rule in this
            code matches the interactive simulator above.
          </p>
        </div>

        {/* Animated Selector Bar */}
        <div
          role="tablist"
          aria-label="Java classes and methods"
          className="mt-6 flex flex-wrap gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 p-1.5"
        >
          {JAVA_CODE_TABS.map((tab) => {
            const isActive = tab.id === activeTab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedId(tab.id)}
                className={`relative min-h-[36px] shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="java-code-active-tab"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 shadow-sm"
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Code Block with Smooth Crossfade */}
        <div className="mt-4 rounded-2xl bg-gradient-to-br from-cyan-500/25 via-blue-500/20 to-indigo-500/25 p-px shadow-2xl shadow-black/40">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: EASE_OUT }}
            >
              <JavaCodeBlock
                filename={activeTab.filename}
                subtitle={activeTab.subtitle}
                code={activeTab.code}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
