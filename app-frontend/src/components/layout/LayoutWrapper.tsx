'use client';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import clsx from 'clsx';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
            <div
                data-testid="main-container"
                className={clsx(
                    "flex-1 flex flex-col overflow-hidden transition-all duration-300",
                    isSidebarOpen ? "ml-64" : "ml-20"
                )}
            >
                <Header />
                <main className="flex-1 overflow-y-auto p-8 bg-[#121212]">
                    {children}
                </main>
            </div>
        </div>
    );
}
