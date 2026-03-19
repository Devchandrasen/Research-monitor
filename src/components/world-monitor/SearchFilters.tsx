'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: Record<string, string>) => void;
  isLoading?: boolean;
}

const researchCategories = [
  'All Fields',
  'Computer Science',
  'Life Sciences',
  'Medical',
  'Physics',
  'Engineering',
  'Environmental',
];

const opportunityTypes = [
  'All Types',
  'PhD',
  'Postdoc',
  'Researcher',
  'Faculty',
];

const countries = [
  'All Countries',
  'United States',
  'China',
  'Germany',
  'Japan',
  'United Kingdom',
  'France',
];

export function SearchFilters({ onSearch, onFilterChange, isLoading }: SearchFiltersProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleSearch = () => {
    onSearch(query);
  };

  const handleFilterSelect = (type: string, value: string) => {
    if (value === 'All Fields' || value === 'All Types' || value === 'All Countries') {
      setActiveFilters(prev => prev.filter(f => !f.startsWith(type)));
    } else {
      const filterKey = `${type}:${value}`;
      setActiveFilters(prev => {
        const filtered = prev.filter(f => !f.startsWith(type));
        return [...filtered, filterKey];
      });
    }
    onFilterChange({ [type]: value });
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filter));
  };

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search research, opportunities, funding..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'border-slate-700 bg-slate-800/50',
            showFilters ? 'text-cyan-400 border-cyan-500' : 'text-slate-400'
          )}
        >
          <Filter className="h-4 w-4" />
        </Button>
        <Button
          onClick={handleSearch}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
          disabled={isLoading}
        >
          Search
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-wrap gap-3"
        >
          <Select onValueChange={(v) => handleFilterSelect('field', v)}>
            <SelectTrigger className="w-[160px] bg-slate-800/50 border-slate-700 text-slate-300">
              <SelectValue placeholder="Research Field" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {researchCategories.map((cat) => (
                <SelectItem key={cat} value={cat} className="text-slate-300 focus:bg-slate-700">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(v) => handleFilterSelect('type', v)}>
            <SelectTrigger className="w-[140px] bg-slate-800/50 border-slate-700 text-slate-300">
              <SelectValue placeholder="Opportunity Type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {opportunityTypes.map((type) => (
                <SelectItem key={type} value={type} className="text-slate-300 focus:bg-slate-700">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(v) => handleFilterSelect('country', v)}>
            <SelectTrigger className="w-[160px] bg-slate-800/50 border-slate-700 text-slate-300">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {countries.map((country) => (
                <SelectItem key={country} value={country} className="text-slate-300 focus:bg-slate-700">
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
      )}

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => {
            const [type, value] = filter.split(':');
            return (
              <Badge
                key={filter}
                variant="outline"
                className="bg-slate-800/50 border-slate-600 text-slate-300 pr-1"
              >
                <span className="mr-1">{value}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => removeFilter(filter)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-slate-400 hover:text-white"
            onClick={() => setActiveFilters([])}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
