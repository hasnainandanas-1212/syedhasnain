import React, { createContext, useContext, useState, useEffect } from 'react';

interface RouterContextType {
  path: string;
  navigate: (newPath: string) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

const normalizePath = (raw: string): string => {
  if (!raw) return '/';
  let p = raw.replace(/^#/, '');
  if (!p.startsWith('/')) p = '/' + p;
  // strip trailing slash if not root
  if (p.length > 1 && p.endsWith('/')) {
    p = p.slice(0, -1);
  }
  return p;
};

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash && hash.length > 1) {
        return normalizePath(hash);
      }
      return normalizePath(window.location.pathname);
    }
    return '/';
  });

  useEffect(() => {
    const handleUrlChange = () => {
      const hash = window.location.hash;
      if (hash && hash.length > 1) {
        setPath(normalizePath(hash));
      } else {
        setPath(normalizePath(window.location.pathname));
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const navigate = (newPath: string) => {
    const target = normalizePath(newPath);
    setPath(target);
    // Use hash navigation so iframe and static preview reload seamlessly without 404
    window.location.hash = target;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = (): RouterContextType => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
