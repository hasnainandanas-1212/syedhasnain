import React from 'react';
import { TOOLS_DATA } from '../data/toolsData';
import { useRouter } from '../context/RouterContext';
import { useTools } from '../context/ToolsContext';
import { ToolCard } from '../components/ToolCard';
import { ToolIcon } from '../components/ToolIcon';
import { AboutSection } from '../components/AboutSection';
import { FAQAccordion } from '../components/FAQAccordion';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Star,
  History,
  RotateCcw,
  Compass,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const { getFavoriteTools, getRecentTools, clearRecents } = useTools();

  const favoriteTools = getFavoriteTools();
  const recentTools = getRecentTools();

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section
        id="hero-section"
        className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28"
      >
        {/* Subtle background glow effect (anti-slop, clean single neutral tint) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-semibold border border-indigo-200/80 dark:border-indigo-800/80 shadow-xs mb-6 animate-in fade-in duration-500">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Fast, Free, & Privacy-First Browser Tools</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 max-w-4xl mx-auto leading-[1.15]">
            All the useful tools you need, <span className="text-indigo-600 dark:text-indigo-400">in one place.</span>
          </h1>

          {/* Subheading */}
          <p className="mt-5 text-base sm:text-lg lg:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Fast, simple and free online tools designed to make everyday tasks easier. No registration, no ads, and 100% private.
          </p>

          {/* CTAs */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            <button
              id="hero-explore-tools-btn"
              onClick={() => navigate('/tools')}
              className="w-full sm:w-auto min-h-[48px] px-7 py-3.5 rounded-2xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
            >
              <span>Explore Tools</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="hero-try-tool-btn"
              onClick={() => navigate('/tools/calculator')}
              className="w-full sm:w-auto min-h-[48px] px-7 py-3.5 rounded-2xl text-base font-bold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 transition-all border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-center gap-2"
            >
              <span>Try a Tool</span>
            </button>
          </div>

          {/* Floating Tool Badges Row */}
          <div className="mt-12 sm:mt-16 pt-8 border-t border-neutral-200/60 dark:border-neutral-800/60 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {TOOLS_DATA.map((tool) => (
              <button
                key={tool.id}
                onClick={() => navigate(`/tools/${tool.slug}`)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 hover:-translate-y-0.5 transition-all text-xs font-semibold text-neutral-800 dark:text-neutral-200 group"
              >
                <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ToolIcon name={tool.iconName} className="w-3.5 h-3.5" />
                </div>
                <span>{tool.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section id="popular-tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Curated Utilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight mt-1">
              Popular Tools
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-1">
              Quick, simple and powerful tools for everyday tasks.
            </p>
          </div>
          <button
            id="view-all-tools-link"
            onClick={() => navigate('/tools')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 self-start sm:self-auto group"
          >
            <span>View All Tools</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 5 Tool Cards Grid: 3 on top row, 2 centered on bottom row on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS_DATA.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* Recent & Favorite Tools Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Favorite Tools */}
          <div className="p-6 sm:p-8 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-500">
                <Star className="w-5 h-5 fill-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  Favorite Tools
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Your pinned utilities for fast 1-click access
                </p>
              </div>
            </div>

            {favoriteTools.length > 0 ? (
              <div className="space-y-2.5 mt-4">
                {favoriteTools.map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => navigate(`/tools/${tool.slug}`)}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <ToolIcon name={tool.iconName} className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {tool.name}
                        </div>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {tool.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-neutral-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      <span>Open</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-sm text-neutral-400 space-y-2">
                <p>No favorite tools pinned yet.</p>
                <p className="text-xs">Click the star icon on any tool card to add it here.</p>
              </div>
            )}
          </div>

          {/* Recent Tools with Empty State */}
          <div className="p-6 sm:p-8 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    Recent Tools
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Quickly resume where you left off
                  </p>
                </div>
              </div>
              {recentTools.length > 0 && (
                <button
                  onClick={clearRecents}
                  className="text-xs font-semibold text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                >
                  Clear
                </button>
              )}
            </div>

            {recentTools.length > 0 ? (
              <div className="space-y-2.5 mt-4">
                {recentTools.map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => navigate(`/tools/${tool.slug}`)}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <ToolIcon name={tool.iconName} className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {tool.name}
                        </div>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {tool.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-neutral-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      <span>Resume</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Specific Empty State requested in prompt:
                 No recent tools
                 “Start using a tool and your recent activity will appear here.”
                 Include a CTA: Explore Tools
              */
              <div className="py-10 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                    No recent tools
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs mx-auto">
                    Start using a tool and your recent activity will appear here.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/tools')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <span>Explore Tools</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* FAQ Section */}
      <section id="faq-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
          <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/80">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-neutral-600 dark:text-neutral-300">
            Everything you need to know about using ToolKit Pro.
          </p>
        </div>

        <FAQAccordion />
      </section>
    </div>
  );
};
