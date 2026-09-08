import React, { createContext, useContext, useState, useEffect } from 'react';
import { TOOLS_DATA } from '../data/toolsData';
import { ToolItem } from '../types';

interface ToolsContextType {
  favoriteIds: string[];
  recentIds: string[];
  toggleFavorite: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;
  recordToolVisit: (toolId: string) => void;
  clearRecents: () => void;
  getFavoriteTools: () => ToolItem[];
  getRecentTools: () => ToolItem[];
}

const ToolsContext = createContext<ToolsContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = 'toolkit_favorites';
const RECENTS_STORAGE_KEY = 'toolkit_recents';

export const ToolsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['calculator', 'password-generator'];
    } catch {
      return ['calculator', 'password-generator'];
    }
  });

  const [recentIds, setRecentIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch (e) {
      console.error(e);
    }
  }, [favoriteIds]);

  useEffect(() => {
    try {
      localStorage.setItem(RECENTS_STORAGE_KEY, JSON.stringify(recentIds));
    } catch (e) {
      console.error(e);
    }
  }, [recentIds]);

  const toggleFavorite = (toolId: string) => {
    setFavoriteIds((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
  };

  const isFavorite = (toolId: string) => favoriteIds.includes(toolId);

  const recordToolVisit = (toolId: string) => {
    setRecentIds((prev) => {
      const filtered = prev.filter((id) => id !== toolId);
      return [toolId, ...filtered].slice(0, 5);
    });
  };

  const clearRecents = () => {
    setRecentIds([]);
  };

  const getFavoriteTools = (): ToolItem[] => {
    return favoriteIds
      .map((id) => TOOLS_DATA.find((t) => t.id === id))
      .filter((t): t is ToolItem => Boolean(t));
  };

  const getRecentTools = (): ToolItem[] => {
    return recentIds
      .map((id) => TOOLS_DATA.find((t) => t.id === id))
      .filter((t): t is ToolItem => Boolean(t));
  };

  return (
    <ToolsContext.Provider
      value={{
        favoriteIds,
        recentIds,
        toggleFavorite,
        isFavorite,
        recordToolVisit,
        clearRecents,
        getFavoriteTools,
        getRecentTools,
      }}
    >
      {children}
    </ToolsContext.Provider>
  );
};

export const useTools = (): ToolsContextType => {
  const context = useContext(ToolsContext);
  if (!context) {
    throw new Error('useTools must be used within a ToolsProvider');
  }
  return context;
};
