'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/utils/apiClient';
import { format, parseISO } from 'date-fns';
import clsx from 'clsx';
import { Search, Filter, Download } from 'lucide-react';

interface Transaction {
    id: number;
    date: string;
    description: string;
    amount: number;
    currency: string;
    category: string;
}

export default function TransactionsPage() {
    const { data: transactions, isLoading } = useQuery<Transaction[]>({
        queryKey: ['transactions'],
        queryFn: async () => {
            const { data } = await apiClient.get('/api/transactions');
            return data;
        }
    });

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">All Transactions</h1>
                    <p className="text-gray-400">View and manage your complete transaction history</p>
                </div>
                <div className="flex space-x-3">
                    <button className="bg-[#1e1e1e] border border-[#333] hover:bg-[#2a2a2a] text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors">
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                    </button>
                    <button className="bg-[#1e1e1e] border border-[#333] hover:bg-[#2a2a2a] text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors">
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-[#333] flex items-center bg-[#252525]">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by description, amount, or category..."
                            className="w-full bg-[#1e1e1e] border border-[#333] rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-[#4ade80] transition-colors"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-12 text-center text-gray-400 animate-pulse">Loading transactions...</div>
                ) : !transactions || transactions.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">No transactions found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#1e1e1e] border-b border-[#333] sticky top-0">
                                <tr>
                                    <th className="py-4 px-6 font-semibold text-gray-400 uppercase tracking-wider text-xs">Date</th>
                                    <th className="py-4 px-6 font-semibold text-gray-400 uppercase tracking-wider text-xs">Description</th>
                                    <th className="py-4 px-6 font-semibold text-gray-400 uppercase tracking-wider text-xs">Category</th>
                                    <th className="py-4 px-6 font-semibold text-gray-400 uppercase tracking-wider text-xs text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#333]">
                                {transactions.map((t, idx) => (
                                    <tr key={t.id || idx} className="hover:bg-[#252525] transition-colors group">
                                        <td className="py-4 px-6 text-sm text-gray-300">
                                            {t.date ? format(parseISO(t.date), 'MMM dd, yyyy') : 'N/A'}
                                        </td>
                                        <td className="py-4 px-6 text-sm font-medium text-white">
                                            {t.description}
                                        </td>
                                        <td className="py-4 px-6 text-sm">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#333] text-gray-300 group-hover:bg-[#444] transition-colors">
                                                {t.category}
                                            </span>
                                        </td>
                                        <td className={clsx(
                                            "py-4 px-6 text-sm font-bold text-right",
                                            t.amount > 0 ? "text-[#4ade80]" : "text-white"
                                        )}>
                                            {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {t.currency}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
