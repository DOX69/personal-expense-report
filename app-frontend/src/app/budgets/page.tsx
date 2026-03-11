'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/utils/apiClient';
import { useState, useEffect } from 'react';
import { Plus, Settings2, Target } from 'lucide-react';
import clsx from 'clsx';
import { format, parseISO } from 'date-fns';

interface Transaction {
    amount: number;
    category: string;
    date: string;
}

export default function BudgetsPage() {
    const [targets, setTargets] = useState<Record<string, number>>({
        'Dépenses Variables - Alimentation': 400,
        'Dépenses Variables - Vie Sociale': 200,
        'Dépenses Variables - Transport (Usage)': 100,
    });

    const { data: transactions, isLoading } = useQuery<Transaction[]>({
        queryKey: ['transactions'],
        queryFn: async () => {
            const { data } = await apiClient.get('/api/transactions');
            return data;
        }
    });

    const [currentMonthExpenses, setCurrentMonthExpenses] = useState<Record<string, number>>({});

    useEffect(() => {
        if (!transactions) return;

        // Simplistic: just take all expenses for now, or filter by current month
        const expenses: Record<string, number> = {};
        const now = new Date();
        const currentMonthStr = format(now, 'yyyy-MM');

        transactions.forEach(t => {
            if (t.amount < 0 && t.date && t.date.startsWith(currentMonthStr)) {
                const cat = t.category || 'Other';
                expenses[cat] = (expenses[cat] || 0) + Math.abs(t.amount);
            }
        });

        setCurrentMonthExpenses(expenses);
    }, [transactions]);

    if (isLoading) return <div className="animate-pulse p-8">Loading budgets...</div>;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Budget Tracking</h1>
                    <p className="text-gray-400">Manage your monthly targets and track your spending</p>
                </div>
                <button className="bg-[#4ade80] hover:bg-[#22c55e] text-[#121212] font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors">
                    <Plus className="w-5 h-5" />
                    <span>New Budget</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(targets).map(([category, target]) => {
                    const spent = currentMonthExpenses[category] || 0;
                    const percentage = Math.min(100, (spent / target) * 100);
                    const isOverBudget = percentage >= 100;
                    const isWarning = percentage >= 80 && !isOverBudget;

                    return (
                        <div key={category} className="bg-[#1e1e1e] border border-[#333] rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-[#4ade80]/50 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-gray-800 rounded-lg text-[#4ade80]">
                                    <Target className="w-6 h-6" />
                                </div>
                                <button className="text-gray-500 hover:text-white transition-opacity opacity-0 group-hover:opacity-100">
                                    <Settings2 className="w-5 h-5" />
                                </button>
                            </div>

                            <h3 className="text-white font-semibold text-lg mb-1 truncate" title={category}>{category}</h3>
                            <div className="flex items-end space-x-2 mb-4">
                                <p className="text-2xl font-bold text-white">${spent.toFixed(2)}</p>
                                <p className="text-gray-500 mb-1">/ ${target.toFixed(2)}</p>
                            </div>

                            <div className="w-full h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                                <div
                                    className={clsx(
                                        "h-full rounded-full transition-all duration-500",
                                        isOverBudget ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-[#4ade80]"
                                    )}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>

                            <p className={clsx(
                                "text-sm mt-3 font-medium",
                                isOverBudget ? "text-red-400" : isWarning ? "text-amber-400" : "text-gray-400"
                            )}>
                                {isOverBudget ? 'Over budget by ' : 'Remaining: '}
                                <span className="font-bold">
                                    ${Math.abs(target - spent).toFixed(2)}
                                </span>
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
