export type ToolCategory =
  | 'All Tools'
  | 'Calculators'
  | 'Converters'
  | 'PDF Tools'
  | 'Image Tools'
  | 'Security Tools';

export interface ToolItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  iconName: 'Calculator' | 'ArrowLeftRight' | 'FileText' | 'Image' | 'Lock';
  tags: string[];
  popular?: boolean;
  features: string[];
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'error';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface CalculationHistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: string;
}

export type UnitType = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'time';

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  // ratio to base unit or conversion function
  toBase?: (val: number) => number;
  fromBase?: (val: number) => number;
  multiplier?: number; // base = value * multiplier
}
