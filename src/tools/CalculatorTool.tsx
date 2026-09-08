import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import { CalculationHistoryItem } from '../types';
import {
  RotateCcw,
  Delete,
  Copy,
  History,
  Trash2,
  Percent,
  Divide,
  X as Multiply,
  Minus,
  Plus,
  Equal,
} from 'lucide-react';

export const CalculatorTool: React.FC = () => {
  const { showToast } = useToast();
  const [expression, setExpression] = useState('');
  const [displayValue, setDisplayValue] = useState('0');
  const [history, setHistory] = useState<CalculationHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('toolkit_calc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showHistory, setShowHistory] = useState(false);
  const [justCalculated, setJustCalculated] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('toolkit_calc_history', JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  }, [history]);

  // Safe expression evaluator for arithmetic + - * / %
  const evaluateExpression = useCallback((expr: string): string => {
    try {
      // Normalize operators
      let sanitized = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-');

      // Check for division by zero
      if (/\/0(?![0-9.])/.test(sanitized)) {
        return 'Cannot divide by 0';
      }

      // Handle simple percentage (e.g. 50% => 0.5 or 200 + 10% => 220)
      sanitized = sanitized.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

      // Validate allowed characters strictly
      if (!/^[\d\s+\-*/().]+$/.test(sanitized)) {
        return 'Error';
      }

      // Safely evaluate arithmetic using Function constructor with restricted scope
      const compute = new Function(`"use strict"; return (${sanitized});`);
      const val = compute();

      if (typeof val !== 'number' || !isFinite(val)) {
        return 'Error';
      }

      // Format clean decimals
      const rounded = Math.round((val + Number.EPSILON) * 1e10) / 1e10;
      return String(rounded);
    } catch {
      return 'Error';
    }
  }, []);

  const handleDigit = useCallback((digit: string) => {
    setDisplayValue((prev) => {
      if (justCalculated) {
        setJustCalculated(false);
        setExpression('');
        return digit;
      }
      if (prev === '0' || prev === 'Error' || prev === 'Cannot divide by 0') {
        return digit;
      }
      // Prevent excessively long inputs
      if (prev.length > 20) return prev;
      return prev + digit;
    });
  }, [justCalculated]);

  const handleDecimal = useCallback(() => {
    setDisplayValue((prev) => {
      if (justCalculated) {
        setJustCalculated(false);
        setExpression('');
        return '0.';
      }
      if (prev === 'Error' || prev === 'Cannot divide by 0') return '0.';
      // Check if current number chunk already has a decimal
      const parts = prev.split(/[\s+\-×÷]/);
      const lastPart = parts[parts.length - 1];
      if (lastPart.includes('.')) return prev;
      return prev + '.';
    });
  }, [justCalculated]);

  const handleOperator = useCallback((op: string) => {
    setJustCalculated(false);
    setDisplayValue((prev) => {
      if (prev === 'Error' || prev === 'Cannot divide by 0') return '0';
      const trimmed = prev.trim();
      const lastChar = trimmed.slice(-1);
      if (['+', '−', '×', '÷'].includes(lastChar)) {
        return trimmed.slice(0, -1) + ' ' + op + ' ';
      }
      return trimmed + ' ' + op + ' ';
    });
  }, []);

  const handleClear = useCallback(() => {
    setDisplayValue('0');
    setExpression('');
    setJustCalculated(false);
  }, []);

  const handleDelete = useCallback(() => {
    setDisplayValue((prev) => {
      if (justCalculated) {
        setJustCalculated(false);
        return '0';
      }
      if (prev === 'Error' || prev === 'Cannot divide by 0' || prev.length <= 1) {
        return '0';
      }
      // If ends with operator space, delete cleanly
      const trimmed = prev.trimEnd();
      if (['+', '−', '×', '÷'].includes(trimmed.slice(-1))) {
        return trimmed.slice(0, -1).trimEnd();
      }
      return prev.slice(0, -1) || '0';
    });
  }, [justCalculated]);

  const handlePercentage = useCallback(() => {
    setDisplayValue((prev) => {
      if (prev === 'Error' || prev === 'Cannot divide by 0') return '0';
      const num = parseFloat(prev);
      if (isNaN(num)) return prev;
      const res = String(num / 100);
      return res;
    });
  }, []);

  const handleEquals = useCallback(() => {
    if (displayValue === 'Error' || displayValue === 'Cannot divide by 0') return;
    const result = evaluateExpression(displayValue);
    if (result !== 'Error' && result !== 'Cannot divide by 0') {
      const newHistoryItem: CalculationHistoryItem = {
        id: `${Date.now()}`,
        expression: displayValue,
        result,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setHistory((prev) => [newHistoryItem, ...prev].slice(0, 30));
      setExpression(displayValue + ' =');
      setDisplayValue(result);
      setJustCalculated(true);
    } else {
      setDisplayValue(result);
      setJustCalculated(true);
    }
  }, [displayValue, evaluateExpression]);

  // Desktop keyboard event listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Ignore keyboard if typing in an input element elsewhere
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === '.') {
        e.preventDefault();
        handleDecimal();
      } else if (e.key === '+') {
        e.preventDefault();
        handleOperator('+');
      } else if (e.key === '-') {
        e.preventDefault();
        handleOperator('−');
      } else if (e.key === '*') {
        e.preventDefault();
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (e.key === '%') {
        e.preventDefault();
        handlePercentage();
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleDelete();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleDigit, handleDecimal, handleOperator, handlePercentage, handleEquals, handleDelete, handleClear]);

  const copyResult = () => {
    if (displayValue && displayValue !== 'Error') {
      navigator.clipboard.writeText(displayValue);
      showToast('Result copied!', `"${displayValue}" saved to your clipboard.`);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    showToast('History cleared', 'Calculation logs removed.');
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Top action bar: History toggle & Copy */}
      <div className="flex items-center justify-between px-2">
        <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          Physical keyboard active (Numbers, +, -, *, /, Enter, Backspace, Esc)
        </span>
        <div className="flex items-center gap-2">
          <button
            id="calc-copy-btn"
            onClick={copyResult}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
            title="Copy current display value"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy</span>
          </button>
          <button
            id="calc-history-toggle-btn"
            onClick={() => setShowHistory((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              showHistory
                ? 'bg-indigo-600 text-white'
                : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History ({history.length})</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Main Calculator Card */}
        <div
          className={`bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-xl border border-neutral-200 dark:border-neutral-800 ${
            showHistory ? 'md:col-span-8' : 'md:col-span-12 max-w-md mx-auto w-full'
          }`}
        >
          {/* LCD Screen Display */}
          <div className="bg-neutral-100 dark:bg-neutral-950/80 rounded-2xl p-5 mb-6 text-right flex flex-col justify-between min-h-[110px] border border-neutral-200/80 dark:border-neutral-800/80">
            <div className="text-xs sm:text-sm font-mono text-neutral-400 dark:text-neutral-500 h-5 overflow-hidden text-ellipsis">
              {expression || ' '}
            </div>
            <div
              id="calc-display"
              className="text-3xl sm:text-4xl font-mono font-bold text-neutral-900 dark:text-neutral-50 tracking-tight overflow-x-auto whitespace-nowrap scrollbar-none"
            >
              {displayValue}
            </div>
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
            {/* Row 1: AC, ⌫, %, ÷ */}
            <button
              id="calc-key-ac"
              onClick={handleClear}
              className="h-14 sm:h-16 rounded-2xl font-bold text-base sm:text-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 active:scale-95 transition-all flex items-center justify-center"
            >
              AC
            </button>
            <button
              id="calc-key-del"
              onClick={handleDelete}
              className="h-14 sm:h-16 rounded-2xl font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 active:scale-95 transition-all flex items-center justify-center"
              aria-label="Delete last character"
            >
              <Delete className="w-5 h-5" />
            </button>
            <button
              id="calc-key-percent"
              onClick={handlePercentage}
              className="h-14 sm:h-16 rounded-2xl font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 active:scale-95 transition-all flex items-center justify-center"
            >
              <Percent className="w-4 h-4" />
            </button>
            <button
              id="calc-key-div"
              onClick={() => handleOperator('÷')}
              className="h-14 sm:h-16 rounded-2xl font-bold text-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 active:scale-95 transition-all flex items-center justify-center"
            >
              <Divide className="w-5 h-5" />
            </button>

            {/* Row 2: 7, 8, 9, × */}
            <button
              onClick={() => handleDigit('7')}
              className="h-14 sm:h-16 rounded-2xl font-bold text-lg sm:text-xl bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 transition-all text-neutral-900 dark:text-neutral-100"
            >
              7
            </button>
            <button
              onClick={() => handleDigit('8')}
              className="h-14 sm:h-16 rounded-2xl font-bold text-lg sm:text-xl bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 transition-all text-neutral-900 dark:text-neutral-100"
            >
              8
            </button>
            <button
              onClick={() => handleDigit('9')}
              className="h-14 sm:h-16 rounded-2xl font-bold text-lg sm:text-xl bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 transition-all text-neutral-900 dark:text-neutral-100"
            >
              9
            </button>
            <button
              id="calc-key-mult"
              onClick={() => handleOperator('×')}
              className="h-14 sm:h-16 rounded-2xl font-bold text-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 active:scale-95 transition-all flex items-center justify-center"
            >
              <Multiply className="w-5 h-5" />
            </button>

            {/* Row 3: 4, 5, 6, − */}
            <button
              onClick={() => handleDigit('4')}
              className="h-14 sm:h-16 rounded-2xl font-bold text-lg sm:text-xl bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 transition-all text-neutral-900 dark:text-neutral-100"
            >
              4
            </button>
            <button
              onClick={() => handleDigit('5')}
              className="h-14 sm:h-16 rounded-2xl font-bold text-lg sm:text-xl bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 transition-all text-neutral-900 dark:text-neutral-100"
            >
              5
            </button>
            <button
              onClick={() => handleDigit('6')}
              className="h-14 sm:h-16 rounded-2xl font-bold text-lg sm:text-xl bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 transition-all text-neutral-900 dark:text-neutral-100"
            >
              6
            </button>
            <button
              id="calc-key-minus"
              onClick={() => handleOperator('−')}
              className="h-14 sm:h-16 rounded-2xl font-bold text-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 active:scale-95 transition-all flex items-center justify-center"
            >
              <Minus className="w-5 h-5" />
            </button>

            {/* Row 4: 1, 2, 3, + */}
            <button
              onClick={() => handleDigit('1')}
              className="h-14 sm:h-16 rounded-2xl font-bold text-lg sm:text-xl bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 transition-all text-neutral-900 dark:text-neutral-100"
            >
              1
            </button>
            <button
              onClick={() => handleDigit('2')}
              className="h-14 sm:h-16 rounded-2xl font-bold text-lg sm:text-xl bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 transition-all text-neutral-900 dark:text-neutral-100"
            >
              2
            </button>
            <button
              onClick={() => handleDigit('3')}
              className="h-14 sm:h-16 rounded-2xl font-bold text-lg sm:text-xl bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 transition-all text-neutral-900 dark:text-neutral-100"
            >
              3
            </button>
            <button
              id="calc-key-plus"
              onClick={() => handleOperator('+')}
              className="h-14 sm:h-16 rounded-2xl font-bold text-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 active:scale-95 transition-all flex items-center justify-center"
            >
              <Plus className="w-5 h-5" />
            </button>

            {/* Row 5: 0, ., = */}
            <button
              onClick={() => handleDigit('0')}
              className="col-span-2 h-14 sm:h-16 rounded-2xl font-bold text-lg sm:text-xl bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 transition-all text-neutral-900 dark:text-neutral-100 flex items-center justify-center"
            >
              0
            </button>
            <button
              id="calc-key-dot"
              onClick={handleDecimal}
              className="h-14 sm:h-16 rounded-2xl font-bold text-xl bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 transition-all text-neutral-900 dark:text-neutral-100 flex items-center justify-center"
            >
              .
            </button>
            <button
              id="calc-key-equals"
              onClick={handleEquals}
              className="h-14 sm:h-16 rounded-2xl font-bold text-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 active:scale-95 transition-all flex items-center justify-center"
            >
              <Equal className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className="md:col-span-4 bg-white dark:bg-neutral-900 rounded-3xl p-5 shadow-xl border border-neutral-200 dark:border-neutral-800 flex flex-col max-h-[500px]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                  Recent Calculations
                </h3>
              </div>
              {history.length > 0 && (
                <button
                  id="calc-clear-history-btn"
                  onClick={clearHistory}
                  className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {history.length > 0 ? (
                history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setDisplayValue(item.result);
                      setJustCalculated(true);
                      showToast('Value recalled', `Loaded ${item.result} into display.`);
                    }}
                    className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-850 hover:bg-indigo-50/60 dark:hover:bg-neutral-800 text-right cursor-pointer transition-colors group"
                    title="Click to load result"
                  >
                    <div className="text-xs font-mono text-neutral-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {item.expression} =
                    </div>
                    <div className="text-base font-mono font-bold text-neutral-900 dark:text-neutral-100">
                      {item.result}
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-1">
                      {item.timestamp}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-xs text-neutral-400">
                  No calculations yet. Perform a calculation to see history.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
