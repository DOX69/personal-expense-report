'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FileUp } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import clsx from 'clsx';
import Link from 'next/link';

interface Transaction {
    id: number;
    date: string;
    description: string;
    amount: number;
    currency: string;
    category: string;
}

interface RecentTransactionsProps {
    startDate?: string;
    endDate?: string;
    category?: string;
    search?: string;
}

export default function RecentTransactions({ startDate, endDate, category, search }: RecentTransactionsProps) {
    const { data: transactions, isLoading } = useQuery<Transaction[]>({
        queryKey: ['transactions', startDate, endDate, category, search],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (startDate) params.append('start_date', startDate);
            if (endDate) params.append('end_date', endDate);
            if (category && category !== 'all') params.append('category', category);
            if (search) params.append('search', search);

            const { data } = await axios.get(`http://localhost:8000/api/transactions?${params.toString()}`);
            return data;
        }
    });

    return (
        <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-[#333] flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
                <Link href="/transactions/import" className="text-sm text-[#4ade80] hover:text-[#22c55e] transition-colors">
                    Import CSV
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="p-6 text-center text-gray-400">Loading transactions...</div>
                ) : !transactions || transactions.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center justify-center h-full">
                        <FileUp className="w-12 h-12 text-gray-600 mb-4" />
                        <p className="text-gray-400">No transactions found.</p>
                        <p className="text-sm text-gray-500 mt-1">Upload a CSV to get started.</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-[#1e1e1e] border-b border-[#333] shadow-sm">
                            <tr>
                                <th className="py-3 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="py-3 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</th>
                                <th className="py-3 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                                <th className="py-3 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#333]">
                            {transactions.slice(0, 50).map((t, idx) => (
                                <tr key={t.id || idx} className="hover:bg-[#252525] transition-colors">
                                    <td className="py-3 px-6 text-sm text-gray-300 whitespace-nowrap">
                                        {t.date ? format(parseISO(t.date), 'MMM dd, yyyy') : 'N/A'}
                                    </td>
                                    <td className="py-3 px-6 text-sm font-medium text-gray-200">
                                        <div className="max-w-[200px] truncate">{t.description}</div>
                                    </td>
                                    <td className="py-3 px-6 text-sm">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#333] text-gray-300">
                                            {t.category}
                                        </span>
                                    </td>
                                    <td className={clsx(
                                        "py-3 px-6 text-sm font-medium text-right whitespace-nowrap",
                                        t.amount > 0 ? "text-green-400" : "text-white"
                                    )}>
                                        {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {t.currency}
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
