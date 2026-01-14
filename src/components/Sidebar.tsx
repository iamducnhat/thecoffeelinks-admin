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
    Sparkles,
    Layers,
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
        <aside className="w-80 bg-white border-r border-neutral-200/60 min-h-screen flex flex-col shrink-0 relative z-20">
            {/* Header - Brand */}
            <div className="h-28 px-7 flex items-center border-b border-neutral-200/60">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-forest-canopy to-forest-floor flex items-center justify-center shadow-lg">
                            <Coffee size={22} className="text-morning-fog" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-sun-ray flex items-center justify-center">
                            <Sparkles size={8} className="text-forest-canopy" />
                        </div>
                    </div>
                    <div>
                        <h1 className="font-serif text-xl text-foreground italic">
                            The Coffee Links
                        </h1>
                        <p className="text-subheading mt-0.5">
                            Admin Panel
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-8 px-4 flex flex-col gap-2">
                <p className="text-label px-4 mb-4">
                    Main Menu
                </p>

                {navItems.map((item, index) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                group relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500
                                animate-fade-in-up stagger-${Math.min(index + 1, 4)}
                                ${isActive
                                    ? 'bg-gradient-to-r from-forest-canopy to-forest-floor text-morning-fog shadow-lg'
                                    : 'text-foreground-muted hover:bg-neutral-50 hover:text-foreground'
                                }
                            `}
                            style={{ opacity: 0 }}
                        >
                            {/* Icon container */}
                            <div className={`
                                w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                                ${isActive
                                    ? 'bg-sun-ray/20 text-sun-ray'
                                    : 'bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200 group-hover:text-foreground'
                                }
                            `}>
                                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            </div>

                            <span className="text-sm font-medium flex-1">
                                {item.label}
                            </span>

                            {isActive && (
                                <ChevronRight size={16} className="text-sun-ray/60" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer - Settings */}
            <div className="p-4 border-t border-neutral-200/60">
                <Link
                    href="/settings"
                    className={`
                        flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500
                        ${pathname === '/settings'
                            ? 'bg-gradient-to-r from-forest-canopy to-forest-floor text-morning-fog shadow-lg'
                            : 'text-foreground-muted hover:bg-neutral-50 hover:text-foreground'
                        }
                    `}
                >
                    <div className={`
                        w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                        ${pathname === '/settings'
                            ? 'bg-sun-ray/20 text-sun-ray'
                            : 'bg-neutral-100 text-neutral-500'
                        }
                    `}>
                        <Settings size={20} />
                    </div>
                    <span className="text-sm font-medium">
                        Settings
                    </span>
                </Link>
            </div>
        </aside>
    );
}
