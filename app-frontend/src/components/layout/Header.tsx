import { Bell, Search } from 'lucide-react';

export default function Header() {
    return (
        <header className="h-20 bg-[#121212] flex items-center justify-between px-8 border-b border-[#333] sticky top-0 z-10 w-full">
            <div className="flex items-center">
                {/* Search removed - integrated into page filters */}
            </div>

            <div className="flex items-center space-x-4">
                <button className="relative p-2 text-gray-300 hover:text-white transition-colors">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
            </div>
        </header>
    );
}
