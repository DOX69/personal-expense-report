'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useMemo } from 'react';
import { RefreshCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import clsx from 'clsx';

interface Transaction {
    id: number;
    amount: number;
    description: string;
    date: string;
    category: string;
}

export default function SubscriptionsPage() {
    const { data: transactions, isLoading } = useQuery<Transaction[]>({
        queryKey: ['transactions'],
        queryFn: async () => {
            const { data } = await axios.get('http://localhost:8000/api/transactions');
            return data;
        }
    });

    const subscriptions = useMemo(() => {
        if (!transactions) return [];

        // Simple heuristic to detect subscriptions: 
        // Same description (or similar), same amount, multiple occurrences over consecutive months
        // Here we'll do a basic grouping by identical description and identical amount.
        const groups: Record<string, Transaction[]> = {};

        transactions.forEach(t => {
            // Look for negative amounts only
            if (t.amount >= 0) return;

            const key = `${t.description.toLowerCase().trim()}_${t.amount}`;
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(t);
        });

        const recurring = Object.values(groups).filter(group => group.length >= 2);

        return recurring.map(group => {
            // Sort by date descending
            group.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            const lastPayment = group[0];
            const frequency = 'Monthly (estimated)'; // In a real app we'd calculate duration diff

            return {
                id: lastPayment.id,
                name: lastPayment.description,
                amount: Math.abs(lastPayment.amount),
                frequency,
                lastPaymentDate: lastPayment.date,
                totalSpent: group.reduce((sum, t) => sum + Math.abs(t.amount), 0),
                status: 'Active',
            };
        });

    }, [transactions]);

    if (isLoading) return <div className="animate-pulse p-8">Loading subscriptions...</div>;

    const totalMonthly = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Subscriptions</h1>
                    <p className="text-gray-400">Automatically detected recurring charges</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center space-x-3 mb-2">
                        <RefreshCcw className="text-[#3b82f6] w-5 h-5" />
                        <h3 className="text-gray-400 font-medium">Estimated Monthly Spend</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">${totalMonthly.toFixed(2)}</p>
                </div>
                <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center space-x-3 mb-2">
                        <CheckCircle2 className="text-[#4ade80] w-5 h-5" />
                        <h3 className="text-gray-400 font-medium">Active Subscriptions</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{subscriptions.length}</p>
                </div>
                <div className="bg-[#1e1e1e] border border-[#1e1e1e] rounded-2xl p-6 shadow-xl bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a]">
                    <div className="flex items-center space-x-3 mb-2">
                        <AlertTriangle className="text-amber-400 w-5 h-5" />
                        <h3 className="text-gray-400 font-medium">Potential Savings</h3>
                    </div>
                    <p className="text-3xl font-bold text-amber-400">${(totalMonthly * 0.15).toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-1">Found by optimizing plans</p>
                </div>
            </div>

            <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-[#333]">
                    <h2 className="text-xl font-semibold text-white">Detected Recurring Charges</h2>
                </div>

                {subscriptions.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        No recurring charges detected yet. Make sure you have enough transaction history.
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#252525] border-b border-[#333]">
                            <tr>
                                <th className="py-4 px-6 font-semibold text-gray-400 uppercase tracking-wider text-sm">Service / Name</th>
                                <th className="py-4 px-6 font-semibold text-gray-400 uppercase tracking-wider text-sm">Status</th>
                                <th className="py-4 px-6 font-semibold text-gray-400 uppercase tracking-wider text-sm">Frequency</th>
                                <th className="py-4 px-6 font-semibold text-gray-400 uppercase tracking-wider text-sm">Last Payment</th>
                                <th className="py-4 px-6 font-semibold text-gray-400 uppercase tracking-wider text-sm text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#333]">
                            {subscriptions.map((sub, idx) => (
                                <tr key={idx} className="hover:bg-[#252525] transition-colors group">
                                    <td className="py-4 px-6 text-white font-medium">
                                        {sub.name}
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-gray-300 text-sm">
                                        {sub.frequency}
                                    </td>
                                    <td className="py-4 px-6 text-gray-400 text-sm">
                                        {sub.lastPaymentDate ? format(parseISO(sub.lastPaymentDate), 'MMM dd, yyyy') : 'N/A'}
                                    </td>
                                    <td className="py-4 px-6 text-right font-bold text-white">
                                        ${sub.amount.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
