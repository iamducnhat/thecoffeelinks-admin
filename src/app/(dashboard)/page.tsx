'use client';

import { useEffect, useState } from 'react';
import { Coffee, Calendar, Tag, Gift, TrendingUp, ArrowRight, Plus, Sparkles } from 'lucide-react';
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
      gradient: 'from-coffee-dark to-espresso',
      iconBg: 'bg-gold/20',
      iconColor: 'text-gold',
    },
    {
      label: 'Events',
      value: stats.events,
      icon: Calendar,
      href: '/events',
      gradient: 'from-info to-blue-700',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
    },
    {
      label: 'Vouchers',
      value: stats.vouchers,
      icon: Tag,
      href: '/vouchers',
      gradient: 'from-success to-emerald-700',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
    },
    {
      label: 'Rewards',
      value: stats.rewards,
      icon: Gift,
      href: '/rewards',
      gradient: 'from-gold to-amber-600',
      iconBg: 'bg-coffee-dark/20',
      iconColor: 'text-coffee-dark',
    },
  ];

  const quickActions = [
    { label: 'Add Product', href: '/products/new', icon: Coffee },
    { label: 'Create Event', href: '/events/new', icon: Calendar },
    { label: 'New Voucher', href: '/vouchers/new', icon: Tag },
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
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl glass-gold">
            <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-foreground">System Online</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat, index) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="stat-card group animate-fade-in-up overflow-hidden relative"
            style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
          >
            {/* Background gradient on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl ${stat.iconBg} group-hover:bg-white/20 flex items-center justify-center transition-all duration-500 group-hover:scale-110`}>
                  <stat.icon size={26} className={`${stat.iconColor} group-hover:text-white transition-colors duration-500`} />
                </div>
                <ArrowRight size={20} className="text-neutral-300 group-hover:text-white/60 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </div>

              <p className="text-label group-hover:text-white/60 transition-colors mb-2">{stat.label}</p>
              <p className="font-serif text-4xl font-bold text-foreground group-hover:text-white transition-colors tracking-tight">
                {loading ? (
                  <span className="inline-block w-16 h-10 bg-neutral-100 group-hover:bg-white/20 rounded-lg animate-pulse" />
                ) : (
                  stat.value
                )}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl glass-gold flex items-center justify-center">
              <Sparkles size={22} className="text-gold" />
            </div>
            <div>
              <h2 className="font-serif text-xl text-foreground">Quick Actions</h2>
              <p className="text-subheading mt-1">Create new content</p>
            </div>
          </div>
          <TrendingUp size={24} className="text-neutral-300" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {quickActions.map((action, index) => (
            <Link
              key={action.label}
              href={action.href}
              className="group flex flex-col items-center gap-4 p-7 rounded-2xl bg-neutral-50 hover:bg-gradient-to-br hover:from-coffee-dark hover:to-espresso border border-transparent hover:border-gold/20 transition-all duration-500"
              style={{ animationDelay: `${(index + 4) * 0.1}s` }}
            >
              <div className="w-16 h-16 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center group-hover:border-gold/30 group-hover:bg-gold/20 group-hover:shadow-lg transition-all duration-500">
                <action.icon size={28} className="text-neutral-500 group-hover:text-gold transition-colors duration-500" />
              </div>
              <div className="flex items-center gap-2">
                <Plus size={14} className="text-neutral-400 group-hover:text-gold transition-colors" />
                <span className="text-sm font-medium text-foreground-muted group-hover:text-cream transition-colors duration-500">
                  {action.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
