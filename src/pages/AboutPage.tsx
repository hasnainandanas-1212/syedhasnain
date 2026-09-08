import React from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { AboutSection } from '../components/AboutSection';
import { useRouter } from '../context/RouterContext';
import { Shield, Sparkles, ArrowRight, Heart, Users, Lock, Zap } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
      <Breadcrumb items={[{ label: 'About' }]} />

      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
          <Sparkles className="w-3.5 h-3.5" />
          Our Story & Philosophy
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
          Built for simplicity, speed, and privacy.
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
          “Simple tools. Powerful results.” — We created ToolKit Pro because everyday utilities shouldn't come with paywalls, spammy ads, or privacy compromises.
        </p>
      </div>

      {/* Feature Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Zero Lag Experience</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Every tool is written in optimized, lightweight modern TypeScript. Calculators and converters compute in microseconds without server round-trips.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Local-First Privacy</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Your files and calculations never leave your computer. Everything from image compression to PDF assembly executes client-side.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Accessible for Everyone</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Responsive design with touch targets of at least 44px, full dark mode, and desktop keyboard shortcuts for maximum comfort.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-center space-y-4 shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Ready to streamline your daily workflow?
        </h2>
        <p className="text-indigo-100 max-w-xl mx-auto text-sm sm:text-base">
          Browse our suite of free online utilities today.
        </p>
        <button
          onClick={() => navigate('/tools')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-indigo-600 font-bold hover:bg-neutral-100 transition-colors shadow-sm"
        >
          <span>Explore All Tools</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
