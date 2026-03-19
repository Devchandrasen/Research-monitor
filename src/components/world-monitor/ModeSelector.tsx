'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MapViewMode } from '@/types';
import { 
  FlaskConical, 
  GraduationCap, 
  Briefcase, 
  DollarSign 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModeSelectorProps {
  mode: MapViewMode;
  onModeChange: (mode: MapViewMode) => void;
}

const modes: { value: MapViewMode; label: string; icon: typeof FlaskConical }[] = [
  { value: 'research', label: 'Research Output', icon: FlaskConical },
  { value: 'phd', label: 'PhD Positions', icon: GraduationCap },
  { value: 'postdoc', label: 'Postdoc Positions', icon: Briefcase },
  { value: 'funding', label: 'Funding', icon: DollarSign },
];

export function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-slate-800/50 rounded-lg border border-slate-700">
      {modes.map((m) => (
        <Button
          key={m.value}
          variant="ghost"
          size="sm"
          onClick={() => onModeChange(m.value)}
          className={cn(
            'flex items-center gap-2 px-3 h-8 transition-all',
            mode === m.value 
              ? 'bg-slate-700 text-white shadow-sm' 
              : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
          )}
        >
          <m.icon className="h-4 w-4" />
          <span className="text-xs font-medium hidden sm:inline">{m.label}</span>
        </Button>
      ))}
    </div>
  );
}
