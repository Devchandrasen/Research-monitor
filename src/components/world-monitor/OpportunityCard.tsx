'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Opportunity, FundingCall } from '@/types';
import { ExternalLink, MapPin, Clock, DollarSign, Building } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OpportunityCardProps {
  title: string;
  items: (Opportunity | FundingCall)[];
  type: 'opportunity' | 'funding';
  delay?: number;
}

const typeColors: Record<string, string> = {
  phd: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  postdoc: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  researcher: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  faculty: 'bg-green-500/20 text-green-300 border-green-500/30',
};

export function OpportunityCard({ title, items, type, delay = 0 }: OpportunityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="bg-slate-800/50 border-slate-700 h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-white flex items-center justify-between">
            {title}
            <Badge variant="outline" className="bg-slate-700/50 text-slate-300">
              {items.length} items
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[300px] px-6">
            <div className="space-y-3 pb-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: delay + index * 0.05 }}
                  className="group p-3 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:border-slate-600 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm text-white line-clamp-2 group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h4>
                    {'type' in item && (
                      <Badge className={cn('shrink-0 text-xs', typeColors[item.type])}>
                        {item.type.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">
                    {'institution' in item && item.institution && (
                      <span className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {item.institution}
                      </span>
                    )}
                    {'funder' in item && item.funder && (
                      <span className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {item.funder}
                      </span>
                    )}
                    {item.country && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {item.country.name}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex gap-3 text-xs text-slate-400">
                      {item.deadline && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(item.deadline).toLocaleDateString()}
                        </span>
                      )}
                      {'salary' in item && item.salary && (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <DollarSign className="h-3 w-3" />
                          {item.salary.toLocaleString()} {item.currency}
                        </span>
                      )}
                      {'amount' in item && item.amount && (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <DollarSign className="h-3 w-3" />
                          {item.amount.toLocaleString()} {item.currency}
                        </span>
                      )}
                    </div>
                    {item.url && (
                      <Button size="sm" variant="ghost" className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}
