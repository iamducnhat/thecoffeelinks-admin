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
    ChevronRight,
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
        <aside className="w-72 bg-white border-r border-neutral-200/60 min-h-screen flex flex-col shrink-0 relative z-20">
            {/* Header */}
            <div className="h-24 px-6 flex items-center border-b border-neutral-200/60">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-espresso to-coffee-dark flex items-center justify-center shadow-md">
                        <Coffee size={20} className="text-cream" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-foreground leading-none">
                            Coffee Links
                        </h1>
                        <p className="text-xs text-neutral-400 mt-0.5">
                            Admin Panel
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 flex flex-col gap-1">
                <p className="px-3 text-label mb-3">
                    Main Menu
                </p>

                {navItems.map((item, index) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                                animate-fade-in-up stagger-${Math.min(index + 1, 4)}
                                ${isActive
                                    ? 'bg-gradient-to-r from-caramel/10 to-gold/5 text-caramel'
                                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-foreground'
                                }
                            `}
                        >
                            {/* Active indicator */}
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-caramel to-gold rounded-full" />
                            )}

                            <div className={`
                                w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200
                                ${isActive
                                    ? 'bg-gradient-to-br from-caramel to-primary-hover text-white shadow-sm'
                                    : 'bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200 group-hover:text-foreground'
                                }
                            `}>
                                <item.icon size={18} strokeWidth={2} />
                            </div>

                            <span className="text-sm font-medium flex-1">
                                {item.label}
                            </span>

                            {isActive && (
                                <ChevronRight size={16} className="text-caramel opacity-60" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-neutral-200/60 mt-auto">
                <Link
                    href="/settings"
                    className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                        ${pathname === '/settings'
                            ? 'bg-gradient-to-r from-caramel/10 to-gold/5 text-caramel'
                            : 'text-neutral-600 hover:bg-neutral-50 hover:text-foreground'
                        }
                    `}
                >
                    <div className={`
                        w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200
                        ${pathname === '/settings'
                            ? 'bg-gradient-to-br from-caramel to-primary-hover text-white shadow-sm'
                            : 'bg-neutral-100 text-neutral-500'
                        }
                    `}>
                        <Settings size={18} strokeWidth={2} />
                    </div>
                    <span className="text-sm font-medium">
                        Settings
                    </span>
                </Link>
            </div>
        </aside>
    );
}
