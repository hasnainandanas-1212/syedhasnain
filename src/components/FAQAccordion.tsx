import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/toolsData';
import { ChevronDown } from 'lucide-react';

interface FAQAccordionProps {
  limit?: number;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ limit }) => {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const items = limit ? FAQ_ITEMS.slice(0, limit) : FAQ_ITEMS;

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      {items.map((item, idx) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            id={`faq-item-${item.id}`}
            className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden transition-all duration-200"
          >
            <button
              id={`faq-btn-${item.id}`}
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${item.id}`}
              className="w-full min-h-[56px] px-6 py-4 flex items-center justify-between text-left gap-4 hover:bg-neutral-50/70 dark:hover:bg-neutral-800/50 transition-colors"
            >
              <span className="font-semibold text-base text-neutral-900 dark:text-neutral-100">
                {item.question}
              </span>
              <div
                className={`p-1 rounded-lg text-neutral-400 dark:text-neutral-500 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60' : ''
                }`}
              >
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              </div>
            </button>

            {isOpen && (
              <div
                id={`faq-answer-${item.id}`}
                className="px-6 pb-5 pt-1 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/80 animate-in fade-in duration-150"
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
