import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { useTheme } from '../context/ThemeContext';
import { GlobalSearchModal } from './GlobalSearchModal';
import {
  Wrench,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  Shield,
  HelpCircle,
  FolderKanban,
  Home,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { path, navigate } = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Tools', path: '/tools', icon: FolderKanban },
    { label: 'About', path: '/about', icon: Shield },
    { label: 'FAQ', path: '/faq', icon: HelpCircle },
  ];

  const handleNav = (targetPath: string) => {
    navigate(targetPath);
    setMobileMenuOpen(false);
  };

  const isLinkActive = (itemPath: string) => {
    if (itemPath === '/') return path === '/';
    return path.startsWith(itemPath);
  };

  return (
    <>
      <header
        id="app-header"
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md shadow-sm border-b border-neutral-200/80 dark:border-neutral-800'
            : 'bg-white dark:bg-neutral-950 border-b border-neutral-200/60 dark:border-neutral-800/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              id="header-logo-btn"
              onClick={() => handleNav('/')}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
              aria-label="ToolKit Pro Homepage"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5 transition-transform group-hover:rotate-12" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-extrabold text-xl tracking-tight text-neutral-900 dark:text-neutral-50">
                    ToolKit<span className="text-indigo-600 dark:text-indigo-400">Pro</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/80">
                    <Sparkles className="w-2.5 h-2.5" /> FREE
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium hidden sm:block mt-0.5">
                  Simple tools. Powerful results.
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const active = isLinkActive(item.path);
              return (
                <button
                  key={item.path}
                  id={`nav-link-${item.label.toLowerCase()}`}
                  onClick={() => handleNav(item.path)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/60'
                      : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Button */}
            <button
              id="header-search-btn"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200/80 dark:hover:bg-neutral-700/80 rounded-xl transition-colors"
              aria-label="Search tools"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Search tools...</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[10px] font-mono font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-200/80 dark:bg-neutral-700 px-1.5 py-0.5 rounded">
                ⌘K
              </kbd>
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              id="header-theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="p-2.5 rounded-xl text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200/80 dark:hover:bg-neutral-700/80 transition-colors focus:outline-none"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-neutral-700 animate-in spin-in-180 duration-300" />
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              id="header-mobile-menu-btn"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-2.5 rounded-xl text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200/80 dark:hover:bg-neutral-700/80 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-drawer"
            className="md:hidden fixed inset-x-0 top-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shadow-2xl p-4 sm:p-6 animate-in slide-in-from-top-2 duration-200 z-30"
          >
            <div className="flex flex-col gap-1.5">
              {navLinks.map((item) => {
                const active = isLinkActive(item.path);
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    id={`mobile-nav-${item.label.toLowerCase()}`}
                    onClick={() => handleNav(item.path)}
                    className={`flex items-center justify-between w-full min-h-[48px] px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                      active
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400'
                        : 'text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 opacity-80" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 px-2">
              <span>ToolKit Pro • 100% Free Utilities</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                All Systems Operational
              </span>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Dialog Modal */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
