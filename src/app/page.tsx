'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  GraduationCap, 
  Briefcase, 
  DollarSign, 
  FlaskConical,
  RefreshCw,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

import WorldMap from '@/components/world-monitor/WorldMap';
import { StatsCard } from '@/components/world-monitor/StatsCard';
import { OpportunityCard } from '@/components/world-monitor/OpportunityCard';
import { ResearchFieldsChart } from '@/components/world-monitor/ResearchFieldsChart';
import { CountryDetails } from '@/components/world-monitor/CountryDetails';
import { ModeSelector } from '@/components/world-monitor/ModeSelector';
import { SearchFilters } from '@/components/world-monitor/SearchFilters';
import { LiveNewsFeed } from '@/components/world-monitor/LiveNewsFeed';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { countriesData, opportunities, fundingCalls, researchFields, globalStats } from '@/data/countries';
import { CountryData, MapViewMode } from '@/types';

export default function WorldMonitorPage() {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [viewMode, setViewMode] = useState<MapViewMode>('research');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Simulated real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 1500);
  };

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Implement search functionality
  };

  const handleFilterChange = (filters: Record<string, string>) => {
    console.log('Filters changed:', filters);
    // Implement filter functionality
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">World Research Monitor</h1>
                <p className="text-xs text-slate-400 hidden sm:block">Real-time global research intelligence</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <ModeSelector mode={viewMode} onModeChange={setViewMode} />
              
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Live
                </span>
                <span>•</span>
                <span>Updated {lastUpdate.toLocaleTimeString()}</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="border-slate-700 bg-slate-800/50 text-slate-300 hover:text-white"
              >
                <RefreshCw className={cn('h-4 w-4 mr-2', isRefreshing && 'animate-spin')} />
                Refresh
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-slate-400">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-slate-900 border-slate-800">
                <div className="flex flex-col gap-4 mt-8">
                  <ModeSelector mode={viewMode} onModeChange={(m) => { setViewMode(m); setMobileMenuOpen(false); }} />
                  <Button
                    variant="outline"
                    onClick={() => { handleRefresh(); setMobileMenuOpen(false); }}
                    disabled={isRefreshing}
                    className="border-slate-700 bg-slate-800/50"
                  >
                    <RefreshCw className={cn('h-4 w-4 mr-2', isRefreshing && 'animate-spin')} />
                    Refresh Data
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Active Projects"
            value="125K+"
            subtitle="Worldwide research initiatives"
            icon={FlaskConical}
            color="cyan"
            trend={{ value: 12, positive: true }}
            delay={0}
          />
          <StatsCard
            title="PhD Positions"
            value={globalStats.totalPhdPositions.toLocaleString()}
            subtitle="Open doctoral positions"
            icon={GraduationCap}
            color="purple"
            trend={{ value: 8, positive: true }}
            delay={0.1}
          />
          <StatsCard
            title="Postdoc Positions"
            value={globalStats.totalPostdocPositions.toLocaleString()}
            subtitle="Research fellowships"
            icon={Briefcase}
            color="orange"
            trend={{ value: 5, positive: true }}
            delay={0.2}
          />
          <StatsCard
            title="Available Funding"
            value="$2.5T"
            subtitle="Total research funding"
            icon={DollarSign}
            color="green"
            trend={{ value: 15, positive: true }}
            delay={0.3}
          />
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchFilters 
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* World Map - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="h-[400px] sm:h-[500px]">
              <WorldMap
                countries={countriesData}
                selectedCountry={selectedCountry}
                onSelectCountry={setSelectedCountry}
                viewMode={viewMode}
              />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <LiveNewsFeed />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <ResearchFieldsChart fields={researchFields} delay={0.2} />
          <OpportunityCard
            title="Latest Opportunities"
            items={opportunities}
            type="opportunity"
            delay={0.3}
          />
          <OpportunityCard
            title="Funding Calls"
            items={fundingCalls}
            type="funding"
            delay={0.4}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900/80 border-t border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>© 2025 World Research Monitor</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Real-time research intelligence</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                All systems operational
              </span>
              <Badge variant="outline" className="bg-slate-800/50 text-slate-400 border-slate-700">
                v1.0.0
              </Badge>
            </div>
          </div>
        </div>
      </footer>

      {/* Country Details Panel */}
      <AnimatePresence>
        {selectedCountry && (
          <CountryDetails
            country={selectedCountry}
            opportunities={opportunities}
            fundingCalls={fundingCalls}
            onClose={() => setSelectedCountry(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
