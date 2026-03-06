import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    trendPositive?: boolean;
}

export default function MetricCard({ title, value, icon: Icon, trend, trendPositive }: MetricCardProps) {
    return (
        <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl p-6 shadow-xl transition-transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gray-800 rounded-lg">
                    <Icon className="w-6 h-6 text-gray-400" />
                </div>
                {trend && (
                    <div className={clsx(
                        "text-sm font-medium px-2 py-1 rounded-full",
                        trendPositive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    )}>
                        {trend}
                    </div>
                )}
            </div>
            <h3 className="text-gray-400 font-medium text-sm tracking-wide uppercase mb-1">{title}</h3>
            <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        </div>
    );
}
