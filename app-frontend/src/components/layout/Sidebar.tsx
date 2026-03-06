import Link from 'next/link';
import { Home, List, PieChart, TrendingUp, Settings } from 'lucide-react';

export default function Sidebar() {
    const routes = [
        { label: 'Dashboard', icon: Home, href: '/' },
        { label: 'Transactions', icon: List, href: '/transactions' },
        { label: 'Budgets', icon: PieChart, href: '/budgets' },
        { label: 'Subscriptions', icon: TrendingUp, href: '/subscriptions' },
        { label: 'Settings', icon: Settings, href: '/settings' },
    ];

    return (
        <aside className="w-64 bg-[#1e1e1e] border-r border-[#333] h-screen fixed left-0 top-0 flex flex-col">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-[#4ade80]">FinanceFlow</h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {routes.map((route) => {
                    const Icon = route.icon;
                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#2a2a2a] hover:text-white transition-colors"
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{route.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-[#333]">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">
                        D
                    </div>
                    <div>
                        <p className="font-medium">DOX</p>
                        <p className="text-xs text-gray-400">Premium User</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
