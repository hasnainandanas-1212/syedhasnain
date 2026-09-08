import React, { useEffect } from 'react';
import { TOOLS_DATA } from '../data/toolsData';
import { useRouter } from '../context/RouterContext';
import { useTools } from '../context/ToolsContext';
import { Breadcrumb } from '../components/Breadcrumb';
import { ToolCard } from '../components/ToolCard';
import { ToolIcon } from '../components/ToolIcon';
import { CalculatorTool } from '../tools/CalculatorTool';
import { UnitConverterTool } from '../tools/UnitConverterTool';
import { PDFConverterTool } from '../tools/PDFConverterTool';
import { ImageCompressorTool } from '../tools/ImageCompressorTool';
import { PasswordGeneratorTool } from '../tools/PasswordGeneratorTool';
import {
  ArrowLeft,
  Info,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

interface ToolDetailPageProps {
  slug: string;
}

const TOOL_INSTRUCTIONS: Record<string, { steps: string[]; faqs: { q: string; a: string }[] }> = {
  calculator: {
    steps: [
      'Enter numbers and mathematical operators (+, −, ×, ÷, %) using the on-screen keypad or your physical keyboard.',
      'Press "=" or the Enter key on desktop to execute the arithmetic calculation.',
      'Toggle the "History" panel to review past equations and click any result to reload it into the display.',
      'Use "AC" to reset everything, or the backspace key (⌫) to delete the last entered digit.',
    ],
    faqs: [
      {
        q: 'Can I use keyboard shortcuts?',
        a: 'Yes! Type digits 0-9, arithmetic keys (+, -, *, /), Enter/Equals to solve, Backspace to delete, and Esc or C to clear.',
      },
      {
        q: 'Does it support decimal operations?',
        a: 'Yes, full floating-point operations are supported with automatic IEEE-754 precision safeguards to avoid decimal rounding anomalies.',
      },
    ],
  },
  'unit-converter': {
    steps: [
      'Choose a measurement category from the top tabs (Length, Weight, Temperature, Area, Volume, Time).',
      'Enter the numerical value you want to convert into the "From" input box.',
      'Select your source and target units from the dropdown menus.',
      'Use the swap button (⇄) to reverse conversion directions instantly.',
      'Click "Copy Result" to save the converted value and symbol directly to your clipboard.',
    ],
    faqs: [
      {
        q: 'Are conversions updated instantly?',
        a: 'Yes! As you type or change units, the conversion computes in real time without requiring page refreshes or button clicks.',
      },
      {
        q: 'How accurate are the conversion formulas?',
        a: 'Every unit is pegged to international standard SI base units with high precision math.',
      },
    ],
  },
  'pdf-converter': {
    steps: [
      'Drag and drop your images (JPG, JPEG, PNG, WEBP) into the upload area or click "Browse files".',
      'Review your queued images, check their file sizes, or remove unwanted items.',
      'Click the "Convert Images to PDF" button to initiate local PDF document synthesis.',
      'Once the progress bar reaches 100%, click "Download PDF" to save your generated document.',
    ],
    faqs: [
      {
        q: 'Are my photos or documents uploaded to a cloud server?',
        a: 'No. The entire PDF compilation is performed locally in your browser memory using client-side libraries. Nothing is sent to any server.',
      },
      {
        q: 'Can I combine multiple photos into a single PDF?',
        a: 'Yes! You can select multiple images simultaneously, and each image will become a clean, scaled page inside the resulting PDF.',
      },
    ],
  },
  'image-compressor': {
    steps: [
      'Drag and drop any JPG, JPEG, or PNG image into the upload box.',
      'Adjust the "Compression Quality" slider to find your desired balance between file size and clarity.',
      'Inspect the live metrics showing original size, compressed size, and the percentage reduction.',
      'Use the comparison toggle to visually verify picture sharpness.',
      'Click "Download Compressed Image" to save your optimized file immediately.',
    ],
    faqs: [
      {
        q: 'What is the recommended quality setting?',
        a: '75% is typically the sweet spot, providing 60-80% file size reduction with virtually indistinguishable visual difference.',
      },
      {
        q: 'Does this compress images privately?',
        a: 'Yes! Image processing occurs entirely via HTML5 Canvas in your web browser. No photos ever leave your machine.',
      },
    ],
  },
  'password-generator': {
    steps: [
      'Drag the length slider to select your desired password length (e.g. 16 characters).',
      'Toggle character options including Uppercase, Lowercase, Numbers, and Symbols.',
      'Check the real-time strength meter to ensure your password achieves "Strong" or "Very Strong" status.',
      'Click the "Generate New Password" button if you wish to generate another unique variant.',
      'Click "Copy" to safely place the password onto your clipboard.',
    ],
    faqs: [
      {
        q: 'Are generated passwords stored or logged anywhere?',
        a: 'Never. Passwords are generated strictly in temporary browser memory using window.crypto.getRandomValues and are destroyed when you close the tab.',
      },
      {
        q: 'How does the strength meter work?',
        a: 'It computes real mathematical information entropy based on character set pool size and total password length.',
      },
    ],
  },
};

export const ToolDetailPage: React.FC<ToolDetailPageProps> = ({ slug }) => {
  const { navigate } = useRouter();
  const { recordToolVisit } = useTools();

  const tool = TOOLS_DATA.find((t) => t.slug === slug);

  useEffect(() => {
    if (tool) {
      recordToolVisit(tool.id);
    }
  }, [tool, recordToolVisit]);

  if (!tool) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Tool Not Found</h2>
        <p className="text-neutral-500">The tool you are looking for does not exist.</p>
        <button
          onClick={() => navigate('/tools')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold"
        >
          View All Tools
        </button>
      </div>
    );
  }

  const instructions = TOOL_INSTRUCTIONS[tool.slug] || {
    steps: ['Select options and interact with the tool controls above.'],
    faqs: [],
  };

  const relatedTools = TOOLS_DATA.filter((t) => t.id !== tool.id).slice(0, 3);

  const renderToolComponent = () => {
    switch (tool.slug) {
      case 'calculator':
        return <CalculatorTool />;
      case 'unit-converter':
        return <UnitConverterTool />;
      case 'pdf-converter':
        return <PDFConverterTool />;
      case 'image-compressor':
        return <ImageCompressorTool />;
      case 'password-generator':
        return <PasswordGeneratorTool />;
      default:
        return <div>Tool interface under maintenance.</div>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10">
      {/* Top Breadcrumb & Back */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Breadcrumb items={[{ label: 'Tools', path: '/tools' }, { label: tool.name }]} />
        <button
          id="back-to-tools-btn"
          onClick={() => navigate('/tools')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Tools</span>
        </button>
      </div>

      {/* Tool Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
          <ToolIcon name={tool.iconName} className="w-3.5 h-3.5" />
          <span>{tool.category}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
          {tool.name}
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Main Interactive Tool Interface */}
      <div className="py-2">
        {renderToolComponent()}
      </div>

      {/* Helpful Instructions Card */}
      <div className="max-w-3xl mx-auto bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Info className="w-5 h-5" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100">
            How to use the {tool.name}
          </h2>
        </div>

        <ul className="space-y-3 pt-2">
          {instructions.steps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center mt-0.5">
                {idx + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tool-Specific FAQs */}
      {instructions.faqs.length > 0 && (
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {instructions.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-1.5"
              >
                <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {faq.q}
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Tools */}
      <div className="pt-8 border-t border-neutral-200/80 dark:border-neutral-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              Related Tools
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              More free utilities to speed up your everyday workflows
            </p>
          </div>
          <button
            onClick={() => navigate('/tools')}
            className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Explore all
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedTools.map((relTool) => (
            <ToolCard key={relTool.id} tool={relTool} />
          ))}
        </div>
      </div>
    </div>
  );
};
