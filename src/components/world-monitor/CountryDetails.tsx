'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CountryData, Opportunity, FundingCall, Project } from '@/types';
import { 
  X, 
  Globe, 
  GraduationCap, 
  Briefcase, 
  DollarSign, 
  TrendingUp,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CountryDetailsProps {
  country: CountryData;
  opportunities?: Opportunity[];
  fundingCalls?: FundingCall[];
  projects?: Project[];
  onClose: () => void;
}

export function CountryDetails({ 
  country, 
  opportunities = [], 
  fundingCalls = [], 
  projects = [],
  onClose 
}: CountryDetailsProps) {
  const stats = [
    { 
      label: 'Research Output', 
      value: country.researchOutput.toLocaleString(), 
      icon: TrendingUp,
      color: 'text-cyan-400'
    },
    { 
      label: 'PhD Positions', 
      value: country.phdPositions.toLocaleString(), 
      icon: GraduationCap,
      color: 'text-purple-400'
    },
    { 
      label: 'Postdoc Positions', 
      value: country.postdocPositions.toLocaleString(), 
      icon: Briefcase,
      color: 'text-orange-400'
    },
    { 
      label: 'R&D Investment', 
      value: `${country.rInvestment}% GDP`, 
      icon: DollarSign,
      color: 'text-green-400'
    },
  ];

  const formatFunding = (amount: number) => {
    if (amount >= 1e12) return `$${(amount / 1e12).toFixed(1)}T`;
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
    return `$${amount.toLocaleString()}`;
  };

  const countryOpportunities = opportunities.filter(o => o.country?.code === country.code);
  const countryFunding = fundingCalls.filter(f => f.country?.code === country.code);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 w-[400px] bg-slate-900/95 backdrop-blur-xl border-l border-slate-700 z-50 overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Globe className="h-5 w-5 text-cyan-400" />
                <h2 className="text-xl font-bold text-white">{country.name}</h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="h-4 w-4" />
                <span>{country.continent} • {country.region}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-800/50 rounded-lg p-3 border border-slate-700"
              >
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon className={cn('h-4 w-4', stat.color)} />
                  <span className="text-xs text-slate-400">{stat.label}</span>
                </div>
                <p className="text-lg font-semibold text-white">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Funding Available */}
          <Card className="bg-gradient-to-br from-emerald-500/10 to-green-600/5 border-emerald-500/30 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Available Funding</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {formatFunding(country.fundingAvailable)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-emerald-400/50" />
              </div>
            </CardContent>
          </Card>

          {/* Opportunities */}
          {countryOpportunities.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-purple-400" />
                Open Positions ({countryOpportunities.length})
              </h3>
              <div className="space-y-2">
                {countryOpportunities.slice(0, 3).map((opp) => (
                  <div
                    key={opp.id}
                    className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium text-white line-clamp-1">{opp.title}</h4>
                      <Badge className={cn(
                        'text-xs shrink-0',
                        opp.type === 'phd' ? 'bg-purple-500/20 text-purple-300' : 'bg-orange-500/20 text-orange-300'
                      )}>
                        {opp.type.toUpperCase()}
                      </Badge>
                    </div>
                    {opp.institution && (
                      <p className="text-xs text-slate-400 mt-1">{opp.institution}</p>
                    )}
                    {opp.deadline && (
                      <p className="text-xs text-slate-500 mt-1">
                        Deadline: {new Date(opp.deadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Funding Calls */}
          {countryFunding.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-400" />
                Funding Calls ({countryFunding.length})
              </h3>
              <div className="space-y-2">
                {countryFunding.slice(0, 3).map((funding) => (
                  <div
                    key={funding.id}
                    className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
                  >
                    <h4 className="text-sm font-medium text-white line-clamp-1">{funding.title}</h4>
                    {funding.funder && (
                      <p className="text-xs text-slate-400 mt-1">{funding.funder}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      {funding.amount && (
                        <span className="text-xs text-emerald-400 font-medium">
                          {funding.amount.toLocaleString()} {funding.currency}
                        </span>
                      )}
                      {funding.deadline && (
                        <span className="text-xs text-slate-500">
                          Due: {new Date(funding.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white">
              <ExternalLink className="h-4 w-4 mr-2" />
              View All Opportunities
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
