'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Wallet, TrendingUp, TrendingDown, Target } from 'lucide-react';
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
  const { data: metrics, isLoading } = useQuery<DashboardMetrics>({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:8000/api/dashboard/metrics');
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Balance"
          value={`$${(metrics?.net_cashflow || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={Wallet}
          trend="+12.5%"
          trendPositive={true}
        />
        <MetricCard
          title="This Month's Income"
          value={`$${(metrics?.total_income || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={TrendingUp}
          trend="+8.2%"
          trendPositive={true}
        />
        <MetricCard
          title="This Month's Expenses"
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
          <CashflowChart />
        </div>
        <div className="h-96 bg-[#1e1e1e] border border-[#333] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 font-medium">Spending Categories</h3>
          </div>
          <CategoriesChart />
        </div>
      </div>

      <CashflowSankey />

      <div className="h-[600px]">
        <RecentTransactions />
      </div>
    </div>
  );
}
