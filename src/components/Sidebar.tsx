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
    MapPin,
} from 'lucide-react';

const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/stores', label: 'Stores', icon: MapPin },
    { href: '/products', label: 'Products', icon: Coffee },
    { href: '/events', label: 'Events', icon: Calendar },
    { href: '/vouchers', label: 'Vouchers', icon: Tag },
    { href: '/rewards', label: 'Rewards', icon: Gift },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-background border-r border-border min-h-screen flex flex-col shrink-0 relative z-20">
            {/* Header - Aligned to Page Header Height */}
            <div className="h-24 px-8 flex flex-col justify-center border-b border-border">
                <h1 className="text-2xl font-bold uppercase tracking-[0.2em] text-foreground leading-none">
                    The Coffee Links
                </h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mt-2 font-bold">
                    Admin Panel
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-8 px-0 flex flex-col gap-1">
                <p className="px-8 text-[10px] font-extrabold uppercase tracking-[0.2em] text-neutral-400 mb-4 ml-1">
                    Main Menu
                </p>

                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                group relative flex items-center gap-4 px-8 py-4 w-full transition-all duration-200
                                ${isActive
                                    ? 'bg-neutral-100/80 text-primary border-l-[6px] border-primary'
                                    : 'text-neutral-500 hover:text-foreground hover:bg-neutral-50 border-l-[6px] border-transparent'
                                }
                            `}
                        >
                            <item.icon
                                size={20}
                                strokeWidth={2}
                                className={`transition-colors ${isActive ? 'text-primary' : 'text-neutral-400 group-hover:text-foreground'}`}
                            />
                            <span className="text-sm font-bold uppercase tracking-[0.1em]">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-8 border-t border-border mt-auto">
                <Link
                    href="/settings"
                    className="flex items-center gap-4 text-neutral-500 hover:text-foreground group transition-colors"
                >
                    <Settings
                        size={20}
                        strokeWidth={2}
                        className="text-neutral-400 group-hover:text-foreground transition-colors"
                    />
                    <span className="text-sm font-bold uppercase tracking-[0.1em]">
                        Settings
                    </span>
                </Link>
            </div>
        </aside>
    );
}
