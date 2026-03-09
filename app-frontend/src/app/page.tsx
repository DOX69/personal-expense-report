'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Target, Search } from 'lucide-react';
import MetricCard from '@/components/dashboard/MetricCard';
import CashflowChart from '@/components/dashboard/CashflowChart';
import CategoriesChart from '@/components/dashboard/CategoriesChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import CashflowSankey from '@/components/dashboard/SankeyChart';

interface DashboardMetrics {
  total_income: number;
  total_expense: number;
  net_cashflow: number;
}

export default function Dashboard() {
  const [period, setPeriod] = useState('this_month');
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [flowType, setFlowType] = useState('all');
  const [customMonth, setCustomMonth] = useState<{ month: number; year: number } | null>(null);

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
    setCategory('all');
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

      const { data } = await axios.get(`http://localhost:8000/api/dashboard/metrics?${params.toString()}`);
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

          <div className="flex flex-col space-y-1">
            <label htmlFor="category-select" className="text-xs text-gray-400 font-medium uppercase tracking-wider">Category</label>
            <select
              id="category-select"
              aria-label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-[#2a2a2a] border border-[#444] text-white text-sm rounded-lg focus:ring-[#4ade80] focus:border-[#4ade80] block w-full p-2.5 outline-none"
            >
              <option value="all">All Categories</option>
              <optgroup label="Income" className="bg-[#1e1e1e] text-green-400">
                <option value="Salary">Salary</option>
                <option value="Dividends">Dividends</option>
                <option value="Interest">Interest</option>
                <option value="Rent">Rent</option>
                <option value="Refund">Refund</option>
                <option value="Gift">Gift</option>
                <option value="Other Income">Other Income</option>
              </optgroup>
              <optgroup label="Expense" className="bg-[#1e1e1e] text-red-400">
                <option value="Housing">Housing</option>
                <option value="Energy & Water">Energy & Water</option>
                <option value="Insurance">Insurance</option>
                <option value="Telecom">Telecom</option>
                <option value="Groceries">Groceries</option>
                <option value="Transport">Transport</option>
                <option value="Dining Out">Dining Out</option>
                <option value="Shopping">Shopping</option>
                <option value="Leisure & Culture">Leisure & Culture</option>
                <option value="Health">Health</option>
                <option value="Other">Other</option>
              </optgroup>
              <optgroup label="Other" className="bg-[#1e1e1e] text-gray-400">
                <option value="Savings">Savings</option>
                <option value="Investment">Investment</option>
                <option value="Currency Transfer">Currency Transfer</option>
              </optgroup>
            </select>
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
          value={`$${(metrics?.net_cashflow || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={Wallet}
          trend="+12.5%"
          trendPositive={true}
        />
        <MetricCard
          title={getPeriodLabel('Income')}
          value={`$${(metrics?.total_income || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={TrendingUp}
          trend="+8.2%"
          trendPositive={true}
        />
        <MetricCard
          title={getPeriodLabel('Expenses')}
          value={`$${Math.abs(metrics?.total_expense || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
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
            category={category}
            onMonthSelect={(month, year) => setCustomMonth({ month, year })}
          />
        </div>
        <div className="h-96 bg-[#1e1e1e] border border-[#333] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 font-medium">Spending Categories</h3>
          </div>
          <CategoriesChart startDate={startDate} endDate={endDate} category={category} onCategorySelect={setCategory} />
        </div>
      </div>

      <CashflowSankey startDate={startDate} endDate={endDate} />

      <div className="h-[600px]">
        <RecentTransactions
          startDate={startDate}
          endDate={endDate}
          category={category}
          flowType={flowType}
          search={searchQuery}
        />
      </div>
    </div>
  );
}
