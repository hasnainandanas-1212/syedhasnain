import React from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { FAQAccordion } from '../components/FAQAccordion';
import { useRouter } from '../context/RouterContext';
import { HelpCircle, MessageSquare, ArrowRight } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
      <Breadcrumb items={[{ label: 'FAQ' }]} />

      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
          <HelpCircle className="w-3.5 h-3.5" />
          Help & Support
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
          Frequently Asked Questions
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
          Find instant answers to common questions regarding ToolKit Pro features, data privacy, and usage.
        </p>
      </div>

      <div className="py-4">
        <FAQAccordion />
      </div>

      {/* Suggest a tool box */}
      <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          Have an idea for a new tool?
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
          We are continuously expanding ToolKit Pro with more browser utilities. Feel free to explore our current suite and tell us what you would love to see next.
        </p>
        <button
          onClick={() => navigate('/tools')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors text-sm shadow-sm"
        >
          <span>Explore Tools</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
