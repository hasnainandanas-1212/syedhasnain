import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { Wrench, Shield, Heart, Sparkles, X } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();
  const [modalContent, setModalContent] = useState<{ title: string; body: string } | null>(null);

  const openPrivacyModal = () => {
    setModalContent({
      title: 'Privacy Policy',
      body: 'ToolKit Pro operates on an offline-first, client-side-first architecture. Your uploaded files (images, documents) and generated items (passwords, calculations) are processed entirely inside your local browser memory using standard HTML5 and JavaScript APIs. We do not store, log, harvest, or transmit your sensitive files or passwords to external servers.',
    });
  };

  const openTermsModal = () => {
    setModalContent({
      title: 'Terms of Service',
      body: 'ToolKit Pro provides free, open-access productivity utilities for informational and everyday personal or business tasks. Tools are provided "as is" with high accuracy safeguards. You are free to use generated PDFs, compressed images, and calculated results without attribution or licensing restrictions.',
    });
  };

  return (
    <footer className="mt-20 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <button
              id="footer-brand-btn"
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-sm">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-neutral-900 dark:text-neutral-100">
                ToolKit<span className="text-indigo-600 dark:text-indigo-400">Pro</span>
              </span>
            </button>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium max-w-sm">
              “Simple tools. Powerful results.”
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-md">
              A curated collection of modern, fast, and privacy-respecting browser utilities designed to make daily digital tasks effortless. Free forever, no registration needed.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <Shield className="w-4 h-4" />
              <span>100% Client-Side Processing • Zero Data Retention</span>
            </div>
          </div>

          {/* Quick Tools Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mb-4">
              Featured Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigate('/tools/calculator')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/tools/unit-converter')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Unit Converter
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/tools/pdf-converter')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  PDF Converter
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/tools/image-compressor')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Image Compressor
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/tools/password-generator')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Password Generator
                </button>
              </li>
            </ul>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mb-4">
              Company & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/tools')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  All Tools
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  About ToolKit Pro
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/faq')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={openPrivacyModal}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={openTermsModal}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-200/80 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <div>
            © 2026 ToolKit Pro. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              Built with precision for everyday productivity
            </span>
          </div>
        </div>
      </div>

      {/* Simple Legal Modal */}
      {modalContent && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setModalContent(null)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {modalContent.title}
              </h3>
              <button
                onClick={() => setModalContent(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {modalContent.body}
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setModalContent(null)}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
