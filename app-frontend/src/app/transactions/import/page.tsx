'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Upload, AlertCircle, CheckCircle2, FileUp } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';

export default function ImportPage() {
    const queryClient = useQueryClient();
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [uploadMessage, setUploadMessage] = useState('');

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
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-white mb-6">Import Transactions</h1>

            <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-4 text-[#4ade80]">CSV Format Instructions</h2>
                <div className="text-gray-300 space-y-4 mb-6">
                    <p>
                        Your CSV file must include a header row and follow this exact column structure:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>date</strong>: YYYY-MM-DD format (e.g. 2023-10-15)</li>
                        <li><strong>description</strong>: A readable string for the transaction</li>
                        <li><strong>amount</strong>: A number representing the monetary value (negative for expenses, positive for income)</li>
                        <li><strong>currency</strong>: 3-letter currency code (e.g. USD, EUR)</li>
                        <li><strong>category</strong>: Grouping category (e.g. Groceries, Salary, Rent)</li>
                    </ul>
                </div>

                <div
                    {...getRootProps()}
                    className={clsx(
                        "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors mt-6",
                        isDragActive ? "border-[#4ade80] bg-[#4ade80]/10" : "border-[#444] hover:border-[#666]",
                        uploadStatus === 'uploading' && "opacity-50 pointer-events-none"
                    )}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <FileUp className={clsx(
                            "w-10 h-10",
                            isDragActive ? "text-[#4ade80]" : "text-gray-400"
                        )} />
                        <p className="text-lg font-medium text-gray-200">
                            {isDragActive ? "Drop the CSV file here..." : "Drag & drop a CSV file here, or click to select file"}
                        </p>
                        <p className="text-sm text-gray-500">Only .csv files are supported</p>
                    </div>
                </div>

                {uploadStatus === 'success' && (
                    <div className="mt-4 flex items-center space-x-2 text-sm text-green-400 bg-green-400/10 p-3 rounded-lg border border-green-500/20">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-medium">{uploadMessage}</span>
                    </div>
                )}

                {uploadStatus === 'error' && (
                    <div className="mt-4 flex items-center space-x-2 text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-500/20">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-medium">{uploadMessage}</span>
                    </div>
                )}

                {uploadStatus === 'uploading' && (
                    <div className="mt-4 flex justify-center text-[#4ade80]">
                        <span className="animate-pulse font-medium">Uploading and processing transactions...</span>
                    </div>
                )}
            </div>
        </div>
    );
}
