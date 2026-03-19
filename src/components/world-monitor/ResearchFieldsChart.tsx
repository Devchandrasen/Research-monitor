'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResearchField } from '@/types';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResearchFieldsChartProps {
  fields: ResearchField[];
  delay?: number;
}

const categoryColors: Record<string, string> = {
  'Computer Science': 'from-cyan-500 to-blue-500',
  'Life Sciences': 'from-green-500 to-emerald-500',
  'Medical': 'from-red-500 to-rose-500',
  'Physics': 'from-purple-500 to-violet-500',
  'Engineering': 'from-orange-500 to-amber-500',
  'Environmental': 'from-teal-500 to-green-500',
  'Pharmaceutical': 'from-pink-500 to-rose-500',
  'Agricultural': 'from-lime-500 to-green-500',
};

export function ResearchFieldsChart({ fields, delay = 0 }: ResearchFieldsChartProps) {
  const maxCount = Math.max(...fields.map(f => f.projectCount || 0));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="bg-slate-800/50 border-slate-700 h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-white flex items-center justify-between">
            Top Research Fields
            <Badge variant="outline" className="bg-slate-700/50 text-slate-300">
              {fields.length} fields
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {fields.slice(0, 8).map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + index * 0.05 }}
                className="group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                      {field.name}
                    </span>
                    <Badge 
                      variant="outline" 
                      className="text-xs bg-slate-700/50 border-slate-600 text-slate-400"
                    >
                      {field.category}
                    </Badge>
                  </div>
                  <span className="text-sm font-medium text-slate-400">
                    {field.projectCount?.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                  <motion.div
                    className={cn(
                      'h-full rounded-full bg-gradient-to-r',
                      categoryColors[field.category] || 'from-slate-500 to-slate-400'
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${((field.projectCount || 0) / maxCount) * 100}%` }}
                    transition={{ duration: 1, delay: delay + index * 0.05 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-4 pt-3 border-t border-slate-700 flex justify-center">
            <button className="text-sm text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1">
              View all fields
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
