import React from 'react';
import { Calculator, ArrowLeftRight, FileText, Image, Lock, LucideIcon } from 'lucide-react';

interface ToolIconProps {
  name: 'Calculator' | 'ArrowLeftRight' | 'FileText' | 'Image' | 'Lock';
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  Calculator,
  ArrowLeftRight,
  FileText,
  Image,
  Lock,
};

export const ToolIcon: React.FC<ToolIconProps> = ({ name, className = 'w-6 h-6' }) => {
  const IconComponent = iconMap[name] || Calculator;
  return <IconComponent className={className} />;
};
