'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Coffee,
    Calendar,
    Tag,
    Gift,
    Settings,
} from 'lucide-react';

const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/products', label: 'Products', icon: Coffee },
    { href: '/events', label: 'Events', icon: Calendar },
    { href: '/vouchers', label: 'Vouchers', icon: Tag },
    { href: '/rewards', label: 'Rewards', icon: Gift },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-background border-r border-border min-h-screen flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-border">
                <h1 className="text-lg font-bold uppercase tracking-widest text-foreground">
                    ☕ Coffee Links
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">
                    Admin Dashboard
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3 px-3">
                    Menu
                </p>
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-3 text-xs font-bold uppercase tracking-wide transition-colors border-l-2 ${isActive
                                            ? 'bg-neutral-100 text-primary border-primary'
                                            : 'text-neutral-500 border-transparent hover:bg-neutral-50 hover:text-foreground hover:border-neutral-300'
                                        }`}
                                >
                                    <item.icon size={16} strokeWidth={2} />
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 px-3 py-3 text-xs font-bold uppercase tracking-wide text-neutral-500 hover:bg-neutral-50 hover:text-foreground transition-colors"
                >
                    <Settings size={16} strokeWidth={2} />
                    Settings
                </Link>
            </div>
        </aside>
    );
}
