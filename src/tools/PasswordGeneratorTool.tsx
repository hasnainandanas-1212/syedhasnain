import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import {
  Lock,
  Copy,
  RefreshCw,
  Check,
  ShieldCheck,
  Sliders,
  ShieldAlert,
  Shield,
  Eye,
  EyeOff,
} from 'lucide-react';

export const PasswordGeneratorTool: React.FC = () => {
  const { showToast } = useToast();
  const [length, setLength] = useState<number>(16);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [avoidAmbiguous, setAvoidAmbiguous] = useState<boolean>(false); // avoids l, 1, I, O, 0

  const [password, setPassword] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(true);

  // Generate cryptographically secure random password
  const generatePassword = useCallback(() => {
    let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lower = 'abcdefghijklmnopqrstuvwxyz';
    let numbers = '0123456789';
    let symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (avoidAmbiguous) {
      upper = upper.replace(/[IO]/g, '');
      lower = lower.replace(/[lo]/g, '');
      numbers = numbers.replace(/[01]/g, '');
    }

    let charPool = '';
    const guaranteedChars: string[] = [];

    // Ensure at least one character from each selected set is included
    const getRandomChar = (str: string): string => {
      const randomValues = new Uint32Array(1);
      window.crypto.getRandomValues(randomValues);
      return str[randomValues[0] % str.length];
    };

    if (includeUppercase && upper) {
      charPool += upper;
      guaranteedChars.push(getRandomChar(upper));
    }
    if (includeLowercase && lower) {
      charPool += lower;
      guaranteedChars.push(getRandomChar(lower));
    }
    if (includeNumbers && numbers) {
      charPool += numbers;
      guaranteedChars.push(getRandomChar(numbers));
    }
    if (includeSymbols && symbols) {
      charPool += symbols;
      guaranteedChars.push(getRandomChar(symbols));
    }

    if (!charPool) {
      // Fallback if all unchecked
      charPool = lower;
      guaranteedChars.push(getRandomChar(lower));
    }

    const generatedArr: string[] = [...guaranteedChars];
    const remaining = length - guaranteedChars.length;

    if (remaining > 0) {
      const randomBuffer = new Uint32Array(remaining);
      window.crypto.getRandomValues(randomBuffer);
      for (let i = 0; i < remaining; i++) {
        generatedArr.push(charPool[randomBuffer[i] % charPool.length]);
      }
    }

    // Cryptographically shuffle array (Fisher-Yates)
    for (let i = generatedArr.length - 1; i > 0; i--) {
      const randBuf = new Uint32Array(1);
      window.crypto.getRandomValues(randBuf);
      const j = randBuf[0] % (i + 1);
      [generatedArr[i], generatedArr[j]] = [generatedArr[j], generatedArr[i]];
    }

    const finalPass = generatedArr.slice(0, length).join('');
    setPassword(finalPass);
    setCopied(false);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, avoidAmbiguous]);

  // Initial generation on mount
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  // Calculate strength strictly according to: Weak, Medium, Strong, Very Strong
  const strengthInfo = (() => {
    let poolSize = 0;
    if (includeUppercase) poolSize += 26;
    if (includeLowercase) poolSize += 26;
    if (includeNumbers) poolSize += 10;
    if (includeSymbols) poolSize += 26;
    if (poolSize === 0) poolSize = 26;

    // Entropy = length * log2(poolSize)
    const entropy = length * Math.log2(poolSize);

    if (length < 8 || entropy < 36) {
      return {
        label: 'Weak' as const,
        score: 1,
        color: 'bg-rose-500',
        textColor: 'text-rose-500',
        borderColor: 'border-rose-500',
        bgTint: 'bg-rose-50 dark:bg-rose-950/40',
        description: 'Vulnerable to brute force attacks.',
      };
    } else if (length < 12 || entropy < 60) {
      return {
        label: 'Medium' as const,
        score: 2,
        color: 'bg-amber-500',
        textColor: 'text-amber-500',
        borderColor: 'border-amber-500',
        bgTint: 'bg-amber-50 dark:bg-amber-950/40',
        description: 'Adequate for standard non-critical accounts.',
      };
    } else if (length < 16 || entropy < 85) {
      return {
        label: 'Strong' as const,
        score: 3,
        color: 'bg-emerald-500',
        textColor: 'text-emerald-500',
        borderColor: 'border-emerald-500',
        bgTint: 'bg-emerald-50 dark:bg-emerald-950/40',
        description: 'Highly secure for banking and personal credentials.',
      };
    } else {
      return {
        label: 'Very Strong' as const,
        score: 4,
        color: 'bg-indigo-600',
        textColor: 'text-indigo-600 dark:text-indigo-400',
        borderColor: 'border-indigo-600',
        bgTint: 'bg-indigo-50 dark:bg-indigo-950/40',
        description: 'Cryptographically robust against sophisticated attacks.',
      };
    }
  })();

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    showToast('Password copied!', 'Your secure password has been copied to your clipboard.');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Generated Password Card */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral-200 dark:border-neutral-800 space-y-6">
        {/* Monospace Display Box */}
        <div className="relative group">
          <div className="flex items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-neutral-100 dark:bg-neutral-950/90 border border-neutral-200 dark:border-neutral-800">
            <span
              id="password-display"
              className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-neutral-900 dark:text-neutral-50 overflow-x-auto select-all whitespace-nowrap scrollbar-none"
            >
              {showPassword ? password : '•'.repeat(password.length)}
            </span>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="p-2.5 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/80 dark:hover:bg-neutral-800 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                id="password-refresh-btn"
                type="button"
                onClick={generatePassword}
                className="p-2.5 rounded-xl text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-neutral-200/80 dark:hover:bg-neutral-800 transition-colors"
                title="Generate new password"
                aria-label="Generate new password"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                id="password-copy-btn"
                type="button"
                onClick={handleCopy}
                className={`p-2.5 rounded-xl font-semibold transition-all ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                }`}
                title="Copy password"
                aria-label="Copy password to clipboard"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Strength Meter Bar */}
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-500 dark:text-neutral-400">
                Password Strength:
              </span>
              <span className={`font-bold ${strengthInfo.textColor}`}>
                {strengthInfo.label}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 h-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`rounded-full transition-all duration-300 ${
                    step <= strengthInfo.score
                      ? strengthInfo.color
                      : 'bg-neutral-200 dark:bg-neutral-800'
                  }`}
                />
              ))}
            </div>
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
              {strengthInfo.description}
            </p>
          </div>
        </div>

        {/* Controls: Length Slider */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password-length-slider"
              className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2"
            >
              <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Password Length: <span className="font-mono text-indigo-600 dark:text-indigo-400">{length} characters</span>
            </label>
          </div>
          <input
            id="password-length-slider"
            type="range"
            min="6"
            max="48"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-mono text-neutral-400">
            <span>6</span>
            <span>16 (Recommended)</span>
            <span>32</span>
            <span>48</span>
          </div>
        </div>

        {/* Checkbox Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors border border-neutral-200/80 dark:border-neutral-800">
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Uppercase Letters (A-Z)
            </span>
          </label>

          <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors border border-neutral-200/80 dark:border-neutral-800">
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={(e) => setIncludeLowercase(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Lowercase Letters (a-z)
            </span>
          </label>

          <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors border border-neutral-200/80 dark:border-neutral-800">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Numbers (0-9)
            </span>
          </label>

          <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors border border-neutral-200/80 dark:border-neutral-800">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Symbols (!@#$%^&*)
            </span>
          </label>

          <label className="sm:col-span-2 flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors border border-neutral-200/80 dark:border-neutral-800">
            <input
              type="checkbox"
              checked={avoidAmbiguous}
              onChange={(e) => setAvoidAmbiguous(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Avoid Ambiguous Characters (e.g. 0, O, 1, l, I)
            </span>
          </label>
        </div>

        {/* Main Action Buttons */}
        <div className="pt-3 flex flex-col sm:flex-row gap-3">
          <button
            id="generate-new-password-btn"
            onClick={generatePassword}
            className="flex-1 min-h-[48px] px-6 py-3 rounded-2xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Generate New Password</span>
          </button>
          <button
            id="copy-password-main-btn"
            onClick={handleCopy}
            className="px-6 py-3 min-h-[48px] rounded-2xl text-base font-bold text-neutral-800 dark:text-neutral-100 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </button>
        </div>

        {/* Security & Privacy Notice */}
        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/70 dark:border-neutral-800 flex items-start gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Zero-Knowledge Privacy:</strong> Passwords are generated strictly on your device using hardware-backed cryptographic pseudo-random number generators (PRNG). Generated passwords are never transmitted over the internet or logged to any database.
          </span>
        </div>
      </div>
    </div>
  );
};
