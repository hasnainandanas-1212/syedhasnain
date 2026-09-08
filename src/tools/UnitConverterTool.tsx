import React, { useState, useMemo } from 'react';
import { useToast } from '../context/ToastContext';
import { UnitType, UnitDefinition } from '../types';
import {
  ArrowLeftRight,
  Copy,
  RotateCcw,
  Scale,
  Ruler,
  Thermometer,
  Grid,
  Droplet,
  Clock,
  Sparkles,
} from 'lucide-react';

interface UnitCategoryConfig {
  label: string;
  icon: React.ElementType;
  baseUnit: string;
  units: Record<string, UnitDefinition>;
}

const UNIT_DATABASE: Record<UnitType, UnitCategoryConfig> = {
  length: {
    label: 'Length',
    icon: Ruler,
    baseUnit: 'm',
    units: {
      m: { id: 'm', name: 'Meters', symbol: 'm', multiplier: 1 },
      km: { id: 'km', name: 'Kilometers', symbol: 'km', multiplier: 1000 },
      cm: { id: 'cm', name: 'Centimeters', symbol: 'cm', multiplier: 0.01 },
      mm: { id: 'mm', name: 'Millimeters', symbol: 'mm', multiplier: 0.001 },
      mi: { id: 'mi', name: 'Miles', symbol: 'mi', multiplier: 1609.344 },
      yd: { id: 'yd', name: 'Yards', symbol: 'yd', multiplier: 0.9144 },
      ft: { id: 'ft', name: 'Feet', symbol: 'ft', multiplier: 0.3048 },
      in: { id: 'in', name: 'Inches', symbol: 'in', multiplier: 0.0254 },
    },
  },
  weight: {
    label: 'Weight',
    icon: Scale,
    baseUnit: 'kg',
    units: {
      kg: { id: 'kg', name: 'Kilograms', symbol: 'kg', multiplier: 1 },
      g: { id: 'g', name: 'Grams', symbol: 'g', multiplier: 0.001 },
      mg: { id: 'mg', name: 'Milligrams', symbol: 'mg', multiplier: 0.000001 },
      lb: { id: 'lb', name: 'Pounds', symbol: 'lb', multiplier: 0.45359237 },
      oz: { id: 'oz', name: 'Ounces', symbol: 'oz', multiplier: 0.028349523125 },
      ton: { id: 'ton', name: 'Metric Tons', symbol: 't', multiplier: 1000 },
    },
  },
  temperature: {
    label: 'Temperature',
    icon: Thermometer,
    baseUnit: 'c',
    units: {
      c: {
        id: 'c',
        name: 'Celsius',
        symbol: '°C',
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      f: {
        id: 'f',
        name: 'Fahrenheit',
        symbol: '°F',
        toBase: (v) => ((v - 32) * 5) / 9,
        fromBase: (v) => (v * 9) / 5 + 32,
      },
      k: {
        id: 'k',
        name: 'Kelvin',
        symbol: 'K',
        toBase: (v) => v - 273.15,
        fromBase: (v) => v + 273.15,
      },
    },
  },
  area: {
    label: 'Area',
    icon: Grid,
    baseUnit: 'sqm',
    units: {
      sqm: { id: 'sqm', name: 'Square Meters', symbol: 'm²', multiplier: 1 },
      sqkm: { id: 'sqkm', name: 'Square Kilometers', symbol: 'km²', multiplier: 1000000 },
      sqft: { id: 'sqft', name: 'Square Feet', symbol: 'ft²', multiplier: 0.092903 },
      acre: { id: 'acre', name: 'Acres', symbol: 'ac', multiplier: 4046.8564 },
      ha: { id: 'ha', name: 'Hectares', symbol: 'ha', multiplier: 10000 },
    },
  },
  volume: {
    label: 'Volume',
    icon: Droplet,
    baseUnit: 'l',
    units: {
      l: { id: 'l', name: 'Liters', symbol: 'L', multiplier: 1 },
      ml: { id: 'ml', name: 'Milliliters', symbol: 'mL', multiplier: 0.001 },
      gal: { id: 'gal', name: 'US Gallons', symbol: 'gal', multiplier: 3.78541 },
      qt: { id: 'qt', name: 'US Quarts', symbol: 'qt', multiplier: 0.946353 },
      cup: { id: 'cup', name: 'US Cups', symbol: 'cup', multiplier: 0.236588 },
      cum: { id: 'cum', name: 'Cubic Meters', symbol: 'm³', multiplier: 1000 },
    },
  },
  time: {
    label: 'Time',
    icon: Clock,
    baseUnit: 's',
    units: {
      s: { id: 's', name: 'Seconds', symbol: 's', multiplier: 1 },
      ms: { id: 'ms', name: 'Milliseconds', symbol: 'ms', multiplier: 0.001 },
      min: { id: 'min', name: 'Minutes', symbol: 'min', multiplier: 60 },
      hr: { id: 'hr', name: 'Hours', symbol: 'hr', multiplier: 3600 },
      day: { id: 'day', name: 'Days', symbol: 'days', multiplier: 86400 },
      wk: { id: 'wk', name: 'Weeks', symbol: 'wks', multiplier: 604800 },
    },
  },
};

export const UnitConverterTool: React.FC = () => {
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState<UnitType>('length');
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');

  // When changing category, reset units sensibly
  const handleCategoryChange = (category: UnitType) => {
    setActiveCategory(category);
    const unitKeys = Object.keys(UNIT_DATABASE[category].units);
    setFromUnit(unitKeys[0]);
    setToUnit(unitKeys[1] || unitKeys[0]);
  };

  // Conversion computation
  const { result, formulaExplanation, isValid } = useMemo(() => {
    const rawVal = inputValue.trim();
    if (!rawVal) {
      return { result: '', formulaExplanation: 'Enter a value to convert', isValid: true };
    }

    const num = parseFloat(rawVal);
    if (isNaN(num)) {
      return { result: '', formulaExplanation: 'Please enter a valid numeric value', isValid: false };
    }

    const catConfig = UNIT_DATABASE[activeCategory];
    const uFrom = catConfig.units[fromUnit];
    const uTo = catConfig.units[toUnit];

    if (!uFrom || !uTo) {
      return { result: '', formulaExplanation: '', isValid: false };
    }

    let calculated: number;

    if (activeCategory === 'temperature') {
      const base = uFrom.toBase ? uFrom.toBase(num) : num;
      calculated = uTo.fromBase ? uTo.fromBase(base) : base;
    } else {
      const base = num * (uFrom.multiplier || 1);
      calculated = base / (uTo.multiplier || 1);
    }

    // Format output with scientific precision
    let formatted: string;
    if (Math.abs(calculated) < 0.00001 && calculated !== 0) {
      formatted = calculated.toExponential(4);
    } else {
      // Up to 6 decimals, trimming trailing zeroes
      formatted = parseFloat(calculated.toFixed(6)).toString();
    }

    const explanation = `1 ${uFrom.name} ≈ ${
      activeCategory === 'temperature'
        ? (uTo.fromBase ? uTo.fromBase(uFrom.toBase ? uFrom.toBase(1) : 1) : 1).toFixed(4)
        : ((uFrom.multiplier || 1) / (uTo.multiplier || 1)).toFixed(6).replace(/\.?0+$/, '')
    } ${uTo.name}`;

    return { result: formatted, formulaExplanation: explanation, isValid: true };
  }, [inputValue, activeCategory, fromUnit, toUnit]);

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    showToast('Units swapped', `${UNIT_DATABASE[activeCategory].units[toUnit].name} ⇄ ${UNIT_DATABASE[activeCategory].units[temp].name}`);
  };

  const handleClear = () => {
    setInputValue('');
  };

  const handleCopy = () => {
    if (result) {
      const uTo = UNIT_DATABASE[activeCategory].units[toUnit];
      navigator.clipboard.writeText(`${result} ${uTo.symbol}`);
      showToast('Result copied!', `${result} ${uTo.symbol} copied to clipboard.`);
    }
  };

  const currentCategoryConfig = UNIT_DATABASE[activeCategory];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-neutral-100 dark:bg-neutral-800/70 rounded-2xl overflow-x-auto scrollbar-none">
        {(Object.keys(UNIT_DATABASE) as UnitType[]).map((cat) => {
          const cfg = UNIT_DATABASE[cat];
          const Icon = cfg.icon;
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              id={`unit-tab-${cat}`}
              onClick={() => handleCategoryChange(cat)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap min-h-[44px] ${
                isActive
                  ? 'bg-white dark:bg-neutral-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cfg.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Conversion Card */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral-200 dark:border-neutral-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* FROM Box */}
          <div className="md:col-span-2 space-y-2">
            <label htmlFor="unit-from-input" className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              From
            </label>
            <div className="space-y-2">
              <input
                id="unit-from-input"
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="0"
                className={`w-full text-xl font-bold font-mono px-4 py-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border ${
                  !isValid ? 'border-rose-500 focus:ring-rose-500' : 'border-neutral-200 dark:border-neutral-800 focus:ring-indigo-500'
                } focus:outline-none focus:ring-2 transition-all text-neutral-900 dark:text-neutral-100`}
              />
              <select
                id="unit-from-select"
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full text-sm font-semibold px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {(Object.values(currentCategoryConfig.units) as UnitDefinition[]).map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center pt-4 md:pt-6">
            <button
              id="unit-swap-btn"
              type="button"
              onClick={handleSwap}
              aria-label="Swap units"
              className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60 transition-all hover:scale-105 active:scale-95 shadow-sm"
              title="Swap from and to units"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* TO Box */}
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="unit-to-output" className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                To (Converted)
              </label>
              {result && (
                <button
                  onClick={handleCopy}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              )}
            </div>
            <div className="space-y-2">
              <div
                id="unit-to-output"
                className="w-full text-xl font-bold font-mono px-4 py-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-indigo-900 dark:text-indigo-200 min-h-[58px] flex items-center overflow-x-auto whitespace-nowrap"
              >
                {result || '0'}
              </div>
              <select
                id="unit-to-select"
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full text-sm font-semibold px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {(Object.values(currentCategoryConfig.units) as UnitDefinition[]).map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error or validation message */}
        {!isValid && (
          <p className="text-xs text-rose-500 font-medium animate-in fade-in">
            Please enter a valid value.
          </p>
        )}

        {/* Live conversion equation helper */}
        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <span>{formulaExplanation}</span>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              id="unit-clear-btn"
              onClick={handleClear}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-200/70 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Clear
            </button>
            <button
              id="unit-copy-result-btn"
              onClick={handleCopy}
              disabled={!result}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 transition-colors flex items-center gap-1 shadow-sm"
            >
              <Copy className="w-3 h-3" /> Copy Result
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
