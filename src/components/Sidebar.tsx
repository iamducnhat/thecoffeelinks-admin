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
        <aside className="w-60 bg-background border-r border-border min-h-screen flex flex-col">
            {/* Logo */}
            <div className="px-6 py-8 border-b border-border">
                <h1 className="text-lg font-bold uppercase tracking-[0.2em] text-foreground leading-tight">
                    Coffee Links
                </h1>
                <p className="text-[11px] uppercase tracking-[0.15em] text-neutral-500 mt-2 font-bold">
                    Admin Panel
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-neutral-500 mb-4 px-3">
                    Menu
                </p>
                <ul className="space-y-0.5">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-4 px-3 py-3 text-[13px] font-bold uppercase tracking-[0.05em] transition-all border-l-4 ${isActive
                                        ? 'bg-neutral-100 text-primary border-primary'
                                        : 'text-neutral-600 border-transparent hover:bg-neutral-50 hover:text-foreground hover:border-neutral-300'
                                        }`}
                                >
                                    <item.icon size={20} strokeWidth={2} />
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="py-4 px-4 border-t border-border">
                <Link
                    href="/settings"
                    className="flex items-center gap-4 px-3 py-3 text-[13px] font-bold uppercase tracking-[0.05em] text-neutral-600 hover:bg-neutral-50 hover:text-foreground transition-all"
                >
                    <Settings size={20} strokeWidth={2} />
                    Settings
                </Link>
            </div>
        </aside>
    );
}
