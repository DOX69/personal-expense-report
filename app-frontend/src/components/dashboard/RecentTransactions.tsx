'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Upload, FileUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { format, parseISO } from 'date-fns';
import clsx from 'clsx';

interface Transaction {
    id: number;
    date: string;
    description: string;
    amount: number;
    currency: string;
    category: string;
}

export default function RecentTransactions() {
    const queryClient = useQueryClient();
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [uploadMessage, setUploadMessage] = useState('');

    const { data: transactions, isLoading } = useQuery<Transaction[]>({
        queryKey: ['transactions'],
        queryFn: async () => {
            const { data } = await axios.get('http://localhost:8000/api/transactions');
            return data;
        }
    });

    const uploadMutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append('file', file);
            const { data } = await axios.post('http://localhost:8000/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data;
        },
        onSuccess: (data) => {
            if (data.success) {
                setUploadStatus('success');
                setUploadMessage(`Successfully imported ${data.inserted} transactions.`);
                queryClient.invalidateQueries({ queryKey: ['transactions'] });
                queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
                setTimeout(() => setUploadStatus('idle'), 3000);
            } else {
                setUploadStatus('error');
                setUploadMessage(data.errors.join(', '));
            }
        },
        onError: (error: any) => {
            setUploadStatus('error');
            setUploadMessage(error.message || 'Error uploading file');
        }
    });

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setUploadStatus('uploading');
            uploadMutation.mutate(acceptedFiles[0]);
        }
    }, [uploadMutation]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'text/csv': ['.csv'] },
        maxFiles: 1
    });

    return (
        <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-[#333] flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
            </div>

            <div className="p-4 border-b border-[#333] bg-[#252525]">
                <div
                    {...getRootProps()}
                    className={clsx(
                        "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors",
                        isDragActive ? "border-[#4ade80] bg-[#4ade80]/10" : "border-[#444] hover:border-[#666]",
                        uploadStatus === 'uploading' && "opacity-50 pointer-events-none"
                    )}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <Upload className={clsx(
                            "w-8 h-8",
                            isDragActive ? "text-[#4ade80]" : "text-gray-400"
                        )} />
                        <p className="text-sm font-medium text-gray-300">
                            {isDragActive ? "Drop the CSV file here..." : "Drag & drop a CSV file, or click to select"}
                        </p>
                        <p className="text-xs text-gray-500">Only .csv files are supported</p>
                    </div>
                </div>

                {uploadStatus === 'success' && (
                    <div className="mt-3 flex items-center space-x-2 text-sm text-green-400 bg-green-400/10 p-2 rounded">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{uploadMessage}</span>
                    </div>
                )}

                {uploadStatus === 'error' && (
                    <div className="mt-3 flex items-center space-x-2 text-sm text-red-400 bg-red-400/10 p-2 rounded">
                        <AlertCircle className="w-4 h-4" />
                        <span>{uploadMessage}</span>
                    </div>
                )}
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
