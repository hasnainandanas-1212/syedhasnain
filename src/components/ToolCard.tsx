import React from 'react';
import { ToolItem } from '../types';
import { useRouter } from '../context/RouterContext';
import { useTools } from '../context/ToolsContext';
import { ToolIcon } from './ToolIcon';
import { ArrowRight, Star } from 'lucide-react';

interface ToolCardProps {
  tool: ToolItem;
  highlightMatch?: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const { navigate } = useRouter();
  const { isFavorite, toggleFavorite, recordToolVisit } = useTools();
  const favorite = isFavorite(tool.id);

  const handleOpen = () => {
    recordToolVisit(tool.id);
    navigate(`/tools/${tool.slug}`);
  };

  return (
    <div
      id={`tool-card-${tool.id}`}
      className="group relative flex flex-col justify-between p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
    >
      {/* Top row: Category tag & Favorite action */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
            {tool.category}
          </span>
          <button
            id={`tool-favorite-btn-${tool.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(tool.id);
            }}
            aria-label={favorite ? `Remove ${tool.name} from favorites` : `Add ${tool.name} to favorites`}
            className={`p-2 rounded-xl transition-colors ${
              favorite
                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60'
                : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <Star className={`w-4 h-4 ${favorite ? 'fill-amber-500' : ''}`} />
          </button>
        </div>

        {/* Icon & Details */}
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 group-hover:scale-105 transition-transform duration-300">
            <ToolIcon name={tool.iconName} className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {tool.name}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
              {tool.description}
            </p>
          </div>
        </div>
      </div>

      {/* Card Action footer */}
      <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 mt-2">
        <button
          id={`tool-open-btn-${tool.id}`}
          onClick={handleOpen}
          className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all duration-200 group/btn"
        >
          <span>Open Tool</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
