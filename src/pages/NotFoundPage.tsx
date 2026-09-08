import React from 'react';
import { useRouter } from '../context/RouterContext';
import { Home, Search, AlertCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="max-w-xl mx-auto py-20 sm:py-28 px-4 text-center space-y-6">
      <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
          ERROR 404
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
          Oops! Page not found.
        </h1>
        <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-sm mx-auto">
          The page you're looking for doesn't exist or may have been moved.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          id="notfound-home-btn"
          onClick={() => navigate('/')}
          className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2 text-sm"
        >
          <Home className="w-4 h-4" />
          <span>Back Home</span>
        </button>
        <button
          id="notfound-explore-btn"
          onClick={() => navigate('/tools')}
          className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors shadow-xs flex items-center justify-center gap-2 text-sm"
        >
          <Search className="w-4 h-4" />
          <span>Explore Tools</span>
        </button>
      </div>
    </div>
  );
};
