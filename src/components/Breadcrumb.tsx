import React from 'react';
import { useRouter } from '../context/RouterContext';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const { navigate } = useRouter();

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 py-3">
      <button
        id="breadcrumb-home"
        onClick={() => navigate('/')}
        className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1 rounded"
        title="Go to Home"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </button>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-600 flex-shrink-0" />
            {isLast || !item.path ? (
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                {item.label}
              </span>
            ) : (
              <button
                id={`breadcrumb-item-${idx}`}
                onClick={() => navigate(item.path!)}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1 rounded truncate"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
