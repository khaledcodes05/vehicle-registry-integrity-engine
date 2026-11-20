import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { MotionConfig, motion, useScroll, useSpring } from 'motion/react';
import { OverviewSection } from './components/OverviewSection';
import { InheritanceSection } from './components/InheritanceSection';
import { ReferentialActionsSection } from './components/ReferentialActionsSection';
import { TryItSandbox } from './components/TryItSandbox';
import { JavaCodeSection } from './components/JavaCodeSection';

const NAV_ITEMS = [
  { href: '#overview', label: 'Overview' },
  { href: '#inheritance', label: 'Inheritance' },
  { href: '#actions', label: 'Referential Actions' },
  { href: '#try-it', label: 'Try It' },
  { href: '#java-code', label: 'Java Code' },
];

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-slate-50 text-slate-900">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/92 text-slate-100 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
            {/* Zone 1: Single-line wordmark */}
            <a
              href="#overview"
              className="whitespace-nowrap shrink-0 font-display text-sm font-semibold tracking-tight text-white sm:text-base"
            >
              Vehicle Registry Integrity Engine
            </a>

            {/* Zone 2: Single-line nav links */}
            <nav
              aria-label="Primary navigation"
              className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300"
            >
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="whitespace-nowrap shrink-0 transition-colors hover:text-cyan-300 hover:underline underline-offset-4"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Zone 3: Primary CTA + Mobile Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="#try-it"
                className="hidden sm:inline-flex min-h-[36px] items-center whitespace-nowrap shrink-0 rounded-lg bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-blue-950/50 transition-all hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
              >
                Open Sandbox
              </a>

              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav-drawer"
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-800 md:hidden"
              >
                {mobileMenuOpen ? (
                  <X className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Menu className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Reading Scroll Progress Bar */}
          <motion.div
            aria-hidden="true"
            style={{ scaleX }}
            className="h-[2.5px] w-full origin-left bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500"
          />

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <nav
              id="mobile-nav-drawer"
              aria-label="Mobile navigation"
              className="border-t border-slate-800 bg-slate-950 px-4 py-3 md:hidden"
            >
              <div className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-cyan-300"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </nav>
          )}
        </header>

        <main>
          <OverviewSection />
          <InheritanceSection />
          <ReferentialActionsSection />
          <TryItSandbox />
          <JavaCodeSection />
        </main>

        <footer className="bg-slate-950 py-8 text-slate-300">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div className="max-w-xl text-xs leading-relaxed text-slate-400">
              <span className="font-semibold text-white">Educational Simulation Note:</span>{' '}
              All state in this site is stored in browser memory to model Java object-oriented
              design. Production systems should enforce foreign-key constraints and cascade actions
              at the relational database layer.
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="transition-colors hover:text-cyan-300 hover:underline"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
