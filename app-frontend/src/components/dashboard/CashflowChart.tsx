'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { useMemo } from 'react';

interface Transaction {
    date: string;
    amount: number;
}

export default function CashflowChart() {
    const { data: transactions, isLoading } = useQuery<Transaction[]>({
        queryKey: ['transactions'],
        queryFn: async () => {
            const { data } = await axios.get('http://localhost:8000/api/transactions');
            return data;
        }
    });

    const chartData = useMemo(() => {
        if (!transactions) return [];

        // Group by month
        const monthlyData: Record<string, { month: string, income: number, expense: number }> = {};

        // Sort transactions by date ascending
        const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        sorted.forEach(t => {
            if (!t.date) return;
            const date = parseISO(t.date);
            const monthKey = format(date, 'MMM yy');

            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { month: monthKey, income: 0, expense: 0 };
            }

            if (t.amount > 0) {
                monthlyData[monthKey].income += t.amount;
            } else {
                monthlyData[monthKey].expense += Math.abs(t.amount);
            }
        });

        return Object.values(monthlyData);
    }, [transactions]);

    if (isLoading) return <div className="animate-pulse h-full w-full bg-[#2a2a2a] rounded-lg"></div>;

    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="income" stroke="#4ade80" fillOpacity={1} fill="url(#colorIncome)" />
                    <Area type="monotone" dataKey="expense" stroke="#f87171" fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
