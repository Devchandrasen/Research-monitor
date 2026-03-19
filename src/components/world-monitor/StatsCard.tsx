'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  color: 'cyan' | 'purple' | 'orange' | 'green' | 'blue';
  delay?: number;
}

const colorClasses = {
  cyan: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/30',
  purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/30',
  orange: 'from-orange-500/20 to-orange-600/5 border-orange-500/30',
  green: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30',
  blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/30',
};

const iconColorClasses = {
  cyan: 'text-cyan-400 bg-cyan-500/20',
  purple: 'text-purple-400 bg-purple-500/20',
  orange: 'text-orange-400 bg-orange-500/20',
  green: 'text-emerald-400 bg-emerald-500/20',
  blue: 'text-blue-400 bg-blue-500/20',
};

export function StatsCard({ title, value, subtitle, icon: Icon, trend, color, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className={cn(
        'relative overflow-hidden bg-gradient-to-br border',
        colorClasses[color]
      )}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">{title}</CardTitle>
          <div className={cn('p-2 rounded-lg', iconColorClasses[color])}>
            <Icon className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{value}</div>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              'flex items-center gap-1 mt-2 text-xs',
              trend.positive ? 'text-emerald-400' : 'text-red-400'
            )}>
              <span>{trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
              <span className="text-slate-500">from last month</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
