/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { ToolsProvider } from './context/ToolsContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { HomePage } from './pages/HomePage';
import { ToolsDirectoryPage } from './pages/ToolsDirectoryPage';
import { ToolDetailPage } from './pages/ToolDetailPage';
import { AboutPage } from './pages/AboutPage';
import { FAQPage } from './pages/FAQPage';
import { NotFoundPage } from './pages/NotFoundPage';

const AppContent: React.FC = () => {
  const { path } = useRouter();

  const renderRoute = () => {
    if (path === '/' || path === '') {
      return <HomePage />;
    }

    if (path === '/tools') {
      return <ToolsDirectoryPage />;
    }

    if (path.startsWith('/tools/')) {
      const slug = path.replace(/^\/tools\//, '').split('/')[0];
      return <ToolDetailPage slug={slug} />;
    }

    if (path === '/about') {
      return <AboutPage />;
    }

    if (path === '/faq') {
      return <FAQPage />;
    }

    return <NotFoundPage />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      <Header />
      <main className="flex-1 w-full animate-in fade-in duration-300">
        {renderRoute()}
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ToolsProvider>
          <RouterProvider>
            <AppContent />
          </RouterProvider>
        </ToolsProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
