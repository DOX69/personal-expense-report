'use client';

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, CartesianGrid } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { useMemo } from 'react';

interface Transaction {
    date: string;
    amount: number;
    flow_type: string;
}

interface CashflowChartProps {
    startDate?: string;
    endDate?: string;
    category?: string;
    onMonthSelect?: (month: number, year: number) => void;
}

export default function CashflowChart({ startDate, endDate, category, onMonthSelect }: CashflowChartProps) {
    const { data: transactions, isLoading } = useQuery<Transaction[]>({
        queryKey: ['transactions', startDate, endDate, category],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (startDate) params.append('start_date', startDate);
            if (endDate) params.append('end_date', endDate);
            if (category && category !== 'all') params.append('category', category);

            const { data } = await axios.get(`http://localhost:8000/api/transactions?${params.toString()}`);
            return data;
        }
    });

    const chartData = useMemo(() => {
        if (!transactions) return [];

        // Group by month
        const monthlyData: Record<string, { month: string, monthNum: number, year: number, income: number, expense: number }> = {};

        // Sort transactions by date ascending
        const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        sorted.forEach(t => {
            if (!t.date || t.flow_type === 'transfer') return;
            const date = parseISO(t.date);
            const monthKey = format(date, 'MMM yy');

            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = {
                    month: monthKey,
                    monthNum: date.getMonth(),
                    year: date.getFullYear(),
                    income: 0,
                    expense: 0
                };
            }

            if (t.flow_type === 'income') {
                monthlyData[monthKey].income += t.amount;
            } else if (t.flow_type === 'expense') {
                monthlyData[monthKey].expense += Math.abs(t.amount);
            }
        });

        return Object.values(monthlyData);
    }, [transactions]);

    if (isLoading) return <div className="animate-pulse h-full w-full bg-[#2a2a2a] rounded-lg"></div>;

    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="80%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="month" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(value) => `$${value}`} axisLine={false} tickLine={false} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', color: '#fff', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{ fill: '#2a2a2a' }}
                        formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Value']}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af', paddingTop: '10px' }} />
                    <Bar
                        dataKey="income"
                        name="Income"
                        fill="#4ade80"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={50}
                        cursor="pointer"
                        onClick={(data: any) => onMonthSelect && onMonthSelect(data.monthNum, data.year)}
                    />
                    <Bar
                        dataKey="expense"
                        name="Expense"
                        fill="#f87171"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={50}
                        cursor="pointer"
                        onClick={(data: any) => onMonthSelect && onMonthSelect(data.monthNum, data.year)}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
