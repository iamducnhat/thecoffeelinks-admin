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
                <h1 className="text-base font-bold uppercase tracking-[0.2em] text-foreground leading-tight">
                    Coffee Links
                </h1>
                <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 mt-2">
                    Admin Panel
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-4 px-3">
                    Navigation
                </p>
                <ul className="space-y-0.5">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition-all border-l-2 ${isActive
                                            ? 'bg-primary/5 text-primary border-primary'
                                            : 'text-neutral-500 border-transparent hover:bg-neutral-100 hover:text-foreground hover:border-neutral-300'
                                        }`}
                                >
                                    <item.icon size={15} strokeWidth={1.75} />
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
                    className="flex items-center gap-3 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-400 hover:bg-neutral-100 hover:text-foreground transition-all"
                >
                    <Settings size={15} strokeWidth={1.75} />
                    Settings
                </Link>
            </div>
        </aside>
    );
}
