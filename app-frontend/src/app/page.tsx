'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/utils/apiClient';
import { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Target, Search } from 'lucide-react';
import MetricCard from '@/components/dashboard/MetricCard';
import CashflowChart from '@/components/dashboard/CashflowChart';
import CategoriesChart from '@/components/dashboard/CategoriesChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import CashflowSankey from '@/components/dashboard/SankeyChart';
import { formatCurrency } from '@/utils/format';
import { ChevronDown, X } from 'lucide-react';

interface DashboardMetrics {
  total_income: number;
  total_expense: number;
  net_cashflow: number;
}

export default function Dashboard() {
  const [period, setPeriod] = useState('this_month');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [flowType, setFlowType] = useState('all');
  const [customMonth, setCustomMonth] = useState<{ month: number; year: number } | null>(null);

  // Fetch dynamic categories
  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/categories');
      return data;
    }
  });

  const categoryQuery = selectedCategories.length > 0 ? selectedCategories.join(',') : 'all';

  // Convert period to start_date and end_date
  let startDate = '';
  let endDate = '';
  const now = new Date();

  if (customMonth) {
    startDate = new Date(customMonth.year, customMonth.month, 1).toISOString().split('T')[0];
    endDate = new Date(customMonth.year, customMonth.month + 1, 0).toISOString().split('T')[0];
  } else if (period === 'this_month') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  } else if (period === 'last_month') {
    startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
    endDate = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
  } else if (period === 'this_year') {
    startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
    endDate = new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0];
  }

  const handleReset = () => {
    setPeriod('all');
    setSelectedCategories([]);
    setFlowType('all');
    setSearchQuery('');
    setCustomMonth(null);
  };

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
    setCustomMonth(null);
  };

  const { data: metrics, isLoading } = useQuery<DashboardMetrics>({
    queryKey: ['dashboard-metrics', startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);

      const { data } = await apiClient.get(`/api/dashboard/metrics?${params.toString()}`);
      return data;
    }
  });

  if (isLoading) {
    return <div className="animate-pulse flex space-x-4">Loading metrics...</div>;
  }

  // Savings goal mock data for now
  const savingsGoal = 2000;
  const currentSavings = metrics?.net_cashflow && metrics.net_cashflow > 0 ? metrics.net_cashflow : 0;
  const savingsProgress = Math.min(100, Math.round((currentSavings / savingsGoal) * 100));

  const getPeriodLabel = (baseTitle: string) => {
    if (customMonth) return `Selected Month ${baseTitle}`;
    if (period === 'this_month') return `This Month's ${baseTitle}`;
    if (period === 'last_month') return `Last Month's ${baseTitle}`;
    if (period === 'this_year') return `This Year's ${baseTitle}`;
    return `Total ${baseTitle}`;
  };

  return (
    <div className="space-y-6">
      {/* Global Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#1e1e1e] p-4 rounded-xl border border-[#333]">
        <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
          <div className="flex flex-col space-y-1">
            <label htmlFor="period-select" className="text-xs text-gray-400 font-medium uppercase tracking-wider">Period</label>
            <select
              id="period-select"
              aria-label="Period"
              value={customMonth ? 'custom' : period}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="bg-[#2a2a2a] border border-[#444] text-white text-sm rounded-lg focus:ring-[#4ade80] focus:border-[#4ade80] block w-full p-2.5 outline-none"
            >
              <option value="all">All Time</option>
              {customMonth && <option value="custom">Custom Selection</option>}
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="this_year">This Year</option>
            </select>
          </div>

          <div className="flex flex-col space-y-1">
            <label htmlFor="flow-type-select" className="text-xs text-gray-400 font-medium uppercase tracking-wider">Flow Type</label>
            <select
              id="flow-type-select"
              aria-label="Flow Type"
              value={flowType}
              onChange={(e) => setFlowType(e.target.value)}
              className="bg-[#2a2a2a] border border-[#444] text-white text-sm rounded-lg focus:ring-[#4ade80] focus:border-[#4ade80] block w-full p-2.5 outline-none"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>

          <div className="flex flex-col space-y-1 relative min-w-[200px]">
            <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Category</label>
            <div 
              className="bg-[#2a2a2a] border border-[#444] text-white text-sm rounded-lg p-2.5 cursor-pointer flex justify-between items-center"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              <span className="truncate">
                {selectedCategories.length === 0 ? 'All Categories' : 
                 selectedCategories.length === 1 ? selectedCategories[0] : 
                 `${selectedCategories.length} selected`}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
            </div>

            {isCategoryOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1e1e1e] border border-[#333] rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto p-2">
                <div 
                  className="flex items-center p-2 hover:bg-[#2a2a2a] rounded cursor-pointer"
                  onClick={() => setSelectedCategories([])}
                >
                  <div className={`w-4 h-4 rounded border ${selectedCategories.length === 0 ? 'bg-[#4ade80] border-[#4ade80]' : 'border-[#444]'} mr-2`} />
                  All Categories
                </div>
                {['income', 'expense', 'transfer'].map(type => (
                  <div key={type}>
                    <div className="text-[10px] text-gray-500 uppercase font-bold px-2 mt-2 mb-1">{type}</div>
                    {categories.filter(c => c.flow_type === type).map(cat => (
                      <div 
                        key={cat.category}
                        className="flex items-center p-2 hover:bg-[#2a2a2a] rounded cursor-pointer"
                        onClick={() => {
                          if (selectedCategories.includes(cat.category)) {
                            setSelectedCategories(selectedCategories.filter(c => c !== cat.category));
                          } else {
                            setSelectedCategories([...selectedCategories, cat.category]);
                          }
                        }}
                      >
                        <div className={`w-4 h-4 rounded border ${selectedCategories.includes(cat.category) ? 'bg-[#4ade80] border-[#4ade80]' : 'border-[#444]'} mr-2`} />
                        {cat.category}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
            {selectedCategories.length > 0 && (
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedCategories([]); }}
                className="absolute right-8 top-[34px] text-gray-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex flex-col space-y-1 flex-1 min-w-[200px]">
            <label htmlFor="search-input" className="text-xs text-gray-400 font-medium uppercase tracking-wider">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                id="search-input"
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#2a2a2a] border border-[#444] text-white text-sm rounded-lg focus:ring-[#4ade80] focus:border-[#4ade80] block w-full pl-10 p-2.5 outline-none"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleReset}
          aria-label="Reset Filters"
          className="text-sm px-4 py-2.5 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors border border-transparent hover:border-[#444] w-full md:w-auto"
        >
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Balance"
          value={formatCurrency(metrics?.net_cashflow || 0)}
          icon={Wallet}
          trend="+12.5%"
          trendPositive={true}
        />
        <MetricCard
          title={getPeriodLabel('Income')}
          value={formatCurrency(metrics?.total_income || 0)}
          icon={TrendingUp}
          trend="+8.2%"
          trendPositive={true}
        />
        <MetricCard
          title={getPeriodLabel('Expenses')}
          value={formatCurrency(Math.abs(metrics?.total_expense || 0))}
          icon={TrendingDown}
          trend="-5.1%"
          trendPositive={false}
        />
        <MetricCard
          title="Savings Goal Progress"
          value={`${savingsProgress}%`}
          icon={Target}
          trend="On track"
          trendPositive={true}
        />
      </div>

      {/* Charts placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-96 bg-[#1e1e1e] border border-[#333] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 font-medium">Income vs Expenses</h3>
          </div>
          <CashflowChart
            startDate={startDate}
            endDate={endDate}
            category={categoryQuery}
            onMonthSelect={(month, year) => setCustomMonth({ month, year })}
          />
        </div>
        <div className="h-96 bg-[#1e1e1e] border border-[#333] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 font-medium">Spending Categories</h3>
          </div>
          <CategoriesChart startDate={startDate} endDate={endDate} category={categoryQuery} onCategorySelect={(cat) => setSelectedCategories([cat])} />
        </div>
      </div>

      <CashflowSankey startDate={startDate} endDate={endDate} />

      <div className="h-[600px]">
        <RecentTransactions
          startDate={startDate}
          endDate={endDate}
          category={categoryQuery}
          flowType={flowType}
          search={searchQuery}
        />
      </div>
    </div>
  );
}
