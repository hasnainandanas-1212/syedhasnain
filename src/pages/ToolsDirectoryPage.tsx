import React, { useState, useMemo } from 'react';
import { TOOLS_DATA } from '../data/toolsData';
import { ToolCategory } from '../types';
import { ToolCard } from '../components/ToolCard';
import { Breadcrumb } from '../components/Breadcrumb';
import { Search, X, FolderKanban, Sparkles } from 'lucide-react';

const CATEGORIES: ToolCategory[] = [
  'All Tools',
  'Calculators',
  'Converters',
  'PDF Tools',
  'Image Tools',
  'Security Tools',
];

export const ToolsDirectoryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('All Tools');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    return TOOLS_DATA.filter((tool) => {
      const matchCat =
        selectedCategory === 'All Tools' || tool.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'All Tools' }]} />

      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/80">
          <FolderKanban className="w-3.5 h-3.5" />
          Catalog
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
          All Tools
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300">
          Explore our collection of simple and useful online utilities.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 pt-2">
        {/* Search input */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500 pointer-events-none" />
          <input
            id="tools-page-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm text-sm sm:text-base text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                id={`category-pill-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Results */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        /* Empty state as specified:
           "No tools found."
           Friendly suggestion to try another search.
        */
        <div className="py-20 px-4 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
            <Search className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              No tools found.
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              We couldn't find any utilities matching your search criteria. Try clearing filters or searching for terms like "calc", "converter", or "pdf".
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Tools');
              }}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
