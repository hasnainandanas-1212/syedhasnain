import { ToolItem, FAQItem } from '../types';

export const TOOLS_DATA: ToolItem[] = [
  {
    id: 'calculator',
    slug: 'calculator',
    name: 'Calculator',
    description: 'Perform quick and accurate calculations with history and keyboard support.',
    category: 'Calculators',
    iconName: 'Calculator',
    tags: ['math', 'addition', 'subtraction', 'percentage', 'finance', 'numbers'],
    popular: true,
    features: [
      'Basic arithmetic (+, -, ×, ÷)',
      'Percentage and decimal math',
      'Calculation history logging with instant recall',
      'Full physical keyboard shortcut support',
      'Clean tactile display with error guards',
    ],
  },
  {
    id: 'unit-converter',
    slug: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert measurements instantly across length, weight, temperature, and more.',
    category: 'Converters',
    iconName: 'ArrowLeftRight',
    tags: ['units', 'metric', 'imperial', 'length', 'weight', 'temperature', 'area', 'volume', 'time'],
    popular: true,
    features: [
      '6 major categories: Length, Weight, Temp, Area, Volume, Time',
      'Live bidirectional calculation as you type',
      'One-click unit swap button',
      'Copy result with instant clipboard confirmation',
      'Precise scientific rounding and zero float glitching',
    ],
  },
  {
    id: 'pdf-converter',
    slug: 'pdf-converter',
    name: 'PDF Converter',
    description: 'Convert images to PDF and organize documents securely in your browser.',
    category: 'PDF Tools',
    iconName: 'FileText',
    tags: ['pdf', 'document', 'images', 'jpg to pdf', 'png to pdf', 'convert'],
    popular: true,
    features: [
      'Convert single or batch images into a structured PDF document',
      'Drag-and-drop upload zone with multi-file support',
      'Interactive image preview with reordering and removal',
      'Live conversion progress bar and status indicator',
      'Instant client-side PDF generation and download',
    ],
  },
  {
    id: 'image-compressor',
    slug: 'image-compressor',
    name: 'Image Compressor',
    description: 'Reduce image size without unnecessary quality loss directly on your device.',
    category: 'Image Tools',
    iconName: 'Image',
    tags: ['compress', 'optimize', 'shrink', 'jpg', 'png', 'jpeg', 'photo'],
    popular: true,
    features: [
      'Client-side HTML5 canvas compression for JPG, JPEG, and PNG',
      'Fine-tuned quality slider from 10% to 90%',
      'Accurate byte-for-byte reduction calculation and percent saved',
      'Side-by-side original vs compressed visual comparison',
      'Instant single-click download with zero cloud server upload',
    ],
  },
  {
    id: 'password-generator',
    slug: 'password-generator',
    name: 'Password Generator',
    description: 'Create strong, uncrackable, and secure passwords with entropy indicators.',
    category: 'Security Tools',
    iconName: 'Lock',
    tags: ['password', 'security', 'crypto', 'random', 'keys', 'passphrase'],
    popular: true,
    features: [
      'Cryptographically random values via window.crypto',
      'Customizable length (4 to 64 characters)',
      'Character set toggles: Uppercase, Lowercase, Numbers, Symbols',
      'Live 4-tier strength meter (Weak, Medium, Strong, Very Strong)',
      'Strict zero-logging privacy — never stored or transmitted',
    ],
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'free',
    question: 'Are these tools free to use?',
    answer:
      'Yes, 100% free! Every tool on ToolKit Pro is available at zero cost with no hidden fees, limits, or subscriptions required.',
  },
  {
    id: 'account',
    question: 'Do I need to create an account?',
    answer:
      'No account is required. You can start using any tool immediately without signing up, entering an email, or logging in.',
  },
  {
    id: 'mobile-friendly',
    question: 'Are the tools mobile friendly?',
    answer:
      'Absolutely. Every tool is built with a responsive, mobile-first design, touch-friendly controls (minimum 44px tap targets), and optimized layouts for phones, tablets, and desktops.',
  },
  {
    id: 'files-stored',
    question: 'Are uploaded files stored?',
    answer:
      'No. Your privacy is paramount. Tools like the PDF Converter and Image Compressor process files entirely inside your browser using client-side JavaScript APIs. Your documents and photos never leave your device.',
  },
  {
    id: 'suggest-tool',
    question: 'How can I suggest a new tool?',
    answer:
      'We welcome feedback and feature requests! You can suggest new utilities via our feedback link or community page, and our team regularly reviews the most requested tools.',
  },
  {
    id: 'cross-device',
    question: 'Can I use these tools on desktop and mobile?',
    answer:
      'Yes! ToolKit Pro is fully cross-platform and functions identically on Chrome, Safari, Firefox, Edge across Windows, macOS, iOS, Android, and Linux.',
  },
];
