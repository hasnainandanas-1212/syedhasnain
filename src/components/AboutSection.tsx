import React from 'react';
import { Zap, ShieldCheck, Smartphone } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'Fast',
      description: 'Tools designed for quick results with lightweight client processing and zero lag.',
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50',
    },
    {
      icon: ShieldCheck,
      title: 'Privacy Friendly',
      description: 'Your files and generated data should be handled responsibly. Everything stays in your browser.',
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50',
    },
    {
      icon: Smartphone,
      title: 'Mobile Friendly',
      description: 'Use our tools comfortably on desktop, tablet or mobile with touch-optimized interfaces.',
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/50',
    },
  ];

  return (
    <section id="about-section" className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/80">
            About Our Mission
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
            About ToolKit Pro
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
            ToolKit Pro is a collection of simple and useful online utilities designed to help users complete everyday digital tasks quickly and easily.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                id={`feature-card-${idx}`}
                className="p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${feat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
