import React, { useState, useEffect, useRef } from 'react';
import { TOOLS_DATA } from '../data/toolsData';
import { useRouter } from '../context/RouterContext';
import { useTools } from '../context/ToolsContext';
import { ToolIcon } from './ToolIcon';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { navigate } = useRouter();
  const { recordToolVisit } = useTools();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();
  const filteredTools = trimmed
    ? TOOLS_DATA.filter((tool) => {
        return (
          tool.name.toLowerCase().includes(trimmed) ||
          tool.description.toLowerCase().includes(trimmed) ||
          tool.category.toLowerCase().includes(trimmed) ||
          tool.tags.some((tag) => tag.toLowerCase().includes(trimmed))
        );
      })
    : TOOLS_DATA;

  const handleSelect = (slug: string, id: string) => {
    recordToolVisit(id);
    navigate(`/tools/${slug}`);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global Tool Search"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-neutral-900/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-neutral-200 dark:border-neutral-800">
          <Search className="w-5 h-5 text-neutral-400 dark:text-neutral-500 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            id="global-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools..."
            className="w-full bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-md mr-1"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-xs font-medium text-neutral-500 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-400 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {filteredTools.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                {trimmed ? 'Matching Tools' : 'All Available Tools'}
              </div>
              {filteredTools.map((tool) => (
                <button
                  key={tool.id}
                  id={`search-result-${tool.id}`}
                  onClick={() => handleSelect(tool.slug, tool.id)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/80 text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                      <ToolIcon name={tool.iconName} className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                        {tool.name}
                        <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-normal">
                          {tool.category}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-neutral-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    <span className="text-xs hidden sm:inline font-medium">Open</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-12 px-4 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                No tools found.
              </h4>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs mx-auto">
                We couldn't find any tool matching "{query}". Try checking your spelling or searching for keywords like math, pdf, or password.
              </p>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900/90 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
          <span>Quick shortcut: <kbd className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-mono text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-mono text-[10px]">K</kbd></span>
          <span className="flex items-center gap-1">
            Navigate with <CornerDownLeft className="w-3 h-3 inline" />
          </span>
        </div>
      </div>
    </div>
  );
};
