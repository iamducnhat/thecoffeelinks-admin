'use client';

import { useEffect, useState } from 'react';
import { Coffee, Calendar, Tag, Gift, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://appcafe-server.vercel.app';

interface Stats {
  products: number;
  events: number;
  vouchers: number;
  rewards: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ products: 0, events: 0, vouchers: 0, rewards: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, eventsRes, vouchersRes, rewardsRes] = await Promise.all([
        fetch(`${API_URL}/api/products`),
        fetch(`${API_URL}/api/events`),
        fetch(`${API_URL}/api/vouchers`),
        fetch(`${API_URL}/api/rewards`),
      ]);

      const [productsData, eventsData, vouchersData, rewardsData] = await Promise.all([
        productsRes.json(),
        eventsRes.json(),
        vouchersRes.json(),
        rewardsRes.json(),
      ]);

      setStats({
        products: productsData.products?.length || 0,
        events: eventsData.events?.length || 0,
        vouchers: vouchersData.vouchers?.length || 0,
        rewards: rewardsData.rewards?.length || 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Products',
      value: stats.products,
      icon: Coffee,
      href: '/products',
      gradient: 'from-caramel to-primary-hover',
      bgLight: 'from-caramel/10 to-gold/5',
    },
    {
      label: 'Events',
      value: stats.events,
      icon: Calendar,
      href: '/events',
      gradient: 'from-info to-blue-600',
      bgLight: 'from-info/10 to-blue-500/5',
    },
    {
      label: 'Vouchers',
      value: stats.vouchers,
      icon: Tag,
      href: '/vouchers',
      gradient: 'from-secondary to-emerald-600',
      bgLight: 'from-secondary/10 to-emerald-500/5',
    },
    {
      label: 'Rewards',
      value: stats.rewards,
      icon: Gift,
      href: '/rewards',
      gradient: 'from-gold to-amber-500',
      bgLight: 'from-gold/10 to-amber-500/5',
    },
  ];

  const quickActions = [
    { label: 'Add Product', href: '/products/new', icon: Coffee },
    { label: 'Add Event', href: '/events/new', icon: Calendar },
    { label: 'Add Voucher', href: '/vouchers/new', icon: Tag },
    { label: 'Add Reward', href: '/rewards/new', icon: Gift },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back to The Coffee Links Admin</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success-light text-success">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium">System Online</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, index) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="stat-card group animate-fade-in-up"
            style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                <stat.icon size={22} className="text-white" />
              </div>
              <ArrowRight size={18} className="text-neutral-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>

            <p className="text-label mb-1">{stat.label}</p>
            <p className="text-4xl font-bold text-foreground tracking-tight">
              {loading ? (
                <span className="inline-block w-12 h-10 bg-neutral-100 rounded animate-pulse" />
              ) : (
                stat.value
              )}
            </p>

            {/* Decorative gradient bar */}
            <div className={`h-1 rounded-full mt-4 bg-gradient-to-r ${stat.bgLight}`} />
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-header text-lg">Quick Actions</h2>
          <TrendingUp size={20} className="text-neutral-300" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={action.label}
              href={action.href}
              className="group flex flex-col items-center gap-3 p-6 rounded-xl bg-neutral-50 hover:bg-gradient-to-br hover:from-caramel/10 hover:to-gold/5 border border-transparent hover:border-caramel/20 transition-all duration-300"
              style={{ animationDelay: `${(index + 4) * 0.05}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-white border border-neutral-200 flex items-center justify-center group-hover:border-caramel/30 group-hover:shadow-md transition-all">
                <action.icon size={24} className="text-neutral-500 group-hover:text-caramel transition-colors" />
              </div>
              <span className="text-sm font-medium text-neutral-600 group-hover:text-foreground transition-colors">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
