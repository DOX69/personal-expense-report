'use client';

import { Sankey, Tooltip, ResponsiveContainer, Rectangle, Layer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

interface SankeyData {
    nodes: { name: string }[];
    links: { source: number; target: number; value: number }[];
}

const COLORS = ['#3b82f6', '#4ade80', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'];

function SankeyNode({ x, y, width, height, index, payload }: any) {
    if (typeof x !== 'number' || typeof y !== 'number' || typeof width !== 'number' || typeof height !== 'number') {
        return null;
    }
    const color = COLORS[index % COLORS.length];
    return (
        <Layer key={`node-${index}`}>
            <Rectangle
                x={x}
                y={y}
                width={width}
                height={height}
                fill={color}
                fillOpacity={0.9}
            />
            <text
                x={x + width + 6}
                y={y + height / 2}
                textAnchor="start"
                dominantBaseline="central"
                fill="#9ca3af"
                fontSize={12}
            >
                {payload?.name}
            </text>
        </Layer>
    );
}

interface CashflowSankeyProps {
    startDate?: string;
    endDate?: string;
    // Category might break Sankey if it's too restrictive, but we'll include it logically though Sankey doesn't filter by category on the main graph normally, the API doesn't accept category.
}

export default function CashflowSankey({ startDate, endDate }: CashflowSankeyProps) {
    const { data: sankeyData, isLoading, error } = useQuery<SankeyData>({
        queryKey: ['sankey', startDate, endDate],
        queryFn: async () => {
            const data = await apiClient.get('/dashboard/sankey', {
                start_date: startDate,
                end_date: endDate
            });
            return data;
        }
    });

    if (isLoading) return <div className="animate-pulse h-[400px] w-full bg-[#1e1e1e] border border-[#333] rounded-2xl p-6 text-gray-500">Loading Sankey Diagram...</div>;
    if (error || !sankeyData || sankeyData.nodes.length === 0) return <div className="h-[400px] w-full bg-[#1e1e1e] border border-[#333] rounded-2xl p-6 text-gray-400 flex items-center justify-center">No cashflow data available.</div>;

    return (
        <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl p-6 mb-6">
            <h3 className="text-gray-400 font-medium mb-4">Cashflow Flow (Sankey)</h3>
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <Sankey
                        data={sankeyData}
                        nodeWidth={10}
                        nodePadding={24}
                        margin={{ top: 20, right: 160, bottom: 20, left: 20 }}
                        node={<SankeyNode />}
                        link={{ stroke: '#4b5563', strokeOpacity: 0.4 }}
                    >
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', color: '#fff', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                    </Sankey>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
