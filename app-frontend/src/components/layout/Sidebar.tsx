import Link from 'next/link';
import { Home, List, PieChart, TrendingUp, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
    const routes = [
        { label: 'Dashboard', icon: Home, href: '/' },
        { label: 'Transactions', icon: List, href: '/transactions' },
        { label: 'Budgets', icon: PieChart, href: '/budgets' },
        { label: 'Subscriptions', icon: TrendingUp, href: '/subscriptions' },
        { label: 'Settings', icon: Settings, href: '/settings' },
    ];

    return (
        <aside
            data-testid="sidebar-container"
            className={clsx(
                "bg-[#1e1e1e] border-r border-[#333] h-screen fixed left-0 top-0 flex flex-col transition-all duration-300 z-20",
                isOpen ? "w-64" : "w-20"
            )}
        >
            <div className={clsx("p-6 flex items-center h-20", isOpen ? "justify-between" : "justify-center")}>
                {isOpen && <h1 className="text-2xl font-bold text-[#4ade80] truncate mr-2">FinanceFlow</h1>}
                <button
                    data-testid="sidebar-toggle"
                    onClick={onToggle}
                    className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-[#333] transition-colors flex-shrink-0"
                    aria-label="Toggle Sidebar"
                >
                    {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {routes.map((route) => {
                    const Icon = route.icon;
                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={clsx(
                                "flex items-center rounded-lg text-gray-300 hover:bg-[#2a2a2a] hover:text-white transition-colors",
                                isOpen ? "px-4 py-3 space-x-3" : "p-3 justify-center"
                            )}
                            title={!isOpen ? route.label : undefined}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {isOpen && <span className="font-medium whitespace-nowrap overflow-hidden transition-all">{route.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className={clsx("p-4 border-t border-[#333] flex items-center", isOpen ? "space-x-3" : "justify-center")}>
                <div className="w-10 h-10 rounded-full bg-blue-500 flex flex-shrink-0 items-center justify-center font-bold">
                    D
                </div>
                {isOpen && (
                    <div className="overflow-hidden">
                        <p className="font-medium truncate">DOX</p>
                        <p className="text-xs text-gray-400 truncate">Premium User</p>
                    </div>
                )}
            </div>
        </aside>
    );
}
