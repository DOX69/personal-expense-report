'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useMemo } from 'react';

interface Transaction {
    date: string;
    amount: number;
    category: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function CategoriesChart() {
    const { data: transactions, isLoading } = useQuery<Transaction[]>({
        queryKey: ['transactions'],
        queryFn: async () => {
            const { data } = await axios.get('http://localhost:8000/api/transactions');
            return data;
        }
    });

    const chartData = useMemo(() => {
        if (!transactions) return [];

        const categoryTotals: Record<string, number> = {};

        transactions.forEach(t => {
            // Only show expenses for category breakdown
            if (t.amount < 0) {
                const cat = t.category || 'Other';
                categoryTotals[cat] = (categoryTotals[cat] || 0) + Math.abs(t.amount);
            }
        });

        return Object.entries(categoryTotals)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6); // Top 6 categories
    }, [transactions]);

    if (isLoading) return <div className="animate-pulse h-full w-full bg-[#2a2a2a] rounded-lg"></div>;

    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', color: '#fff', borderRadius: '8px' }}
                        formatter={(value: number) => `$${value.toFixed(2)}`}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
