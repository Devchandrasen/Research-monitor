'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ExternalLink, 
  Clock, 
  Globe, 
  Zap,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  category: string;
  timestamp: string;
  url?: string;
}

// Simulated real-time news data
const generateNewsItems = (): NewsItem[] => [
  { id: '1', title: 'OpenAI Announces GPT-5 with Breakthrough Reasoning Capabilities', source: 'TechNews', category: 'AI/ML', timestamp: '2 min ago' },
  { id: '2', title: 'EU Approves €50B Research Initiative for Quantum Computing', source: 'ScienceDaily', category: 'Quantum', timestamp: '15 min ago' },
  { id: '3', title: 'MIT Secures $200M Grant for Climate Research Center', source: 'ResearchWatch', category: 'Climate', timestamp: '32 min ago' },
  { id: '4', title: 'China Opens New National Lab for Advanced Materials', source: 'GlobalResearch', category: 'Materials', timestamp: '1 hour ago' },
  { id: '5', title: 'Nobel Prize in Physics Awarded for Quantum Entanglement Work', source: 'NobelCommittee', category: 'Physics', timestamp: '2 hours ago' },
  { id: '6', title: 'Harvard-MIT Collaboration Launches $100M Brain Research Initiative', source: 'NeuroNews', category: 'Neuroscience', timestamp: '3 hours ago' },
  { id: '7', title: 'UK Announces Post-Brexit Research Visa Fast Track', source: 'PolicyWatch', category: 'Policy', timestamp: '4 hours ago' },
  { id: '8', title: 'Stanford AI Lab Breaks New Ground in Protein Folding', source: 'BioTechDaily', category: 'Biotech', timestamp: '5 hours ago' },
  { id: '9', title: 'Global Research Output Surges 15% in Q4 2024', source: 'ResearchMetrics', category: 'Statistics', timestamp: '6 hours ago' },
  { id: '10', title: 'New EU Funding Call Opens for Green Energy Research', source: 'EUGrants', category: 'Funding', timestamp: '7 hours ago' },
];

const categoryColors: Record<string, string> = {
  'AI/ML': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'Quantum': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'Climate': 'bg-green-500/20 text-green-300 border-green-500/30',
  'Materials': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'Physics': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Neuroscience': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'Policy': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'Biotech': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'Statistics': 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  'Funding': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
};

export function LiveNewsFeed() {
  const [news, setNews] = useState<NewsItem[]>(() => generateNewsItems());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const refreshNews = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setNews(generateNewsItems());
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-400" />
            Live Research Updates
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-normal">
              {lastUpdate.toLocaleTimeString()}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-400 hover:text-white"
              onClick={refreshNews}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[350px] px-6">
          <div className="space-y-3 pb-4">
            {news.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="group p-3 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:border-slate-600 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-medium text-white line-clamp-2 group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h4>
                  <Badge className={cn('shrink-0 text-xs', categoryColors[item.category] || 'bg-slate-500/20 text-slate-300')}>
                    {item.category}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {item.source}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.timestamp}
                    </span>
                  </div>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
