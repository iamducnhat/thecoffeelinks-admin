'use client';

import { useEffect, useState } from 'react';
import { Coffee, Calendar, Tag, Gift } from 'lucide-react';
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
    { label: 'Products', value: stats.products, icon: Coffee, href: '/products' },
    { label: 'Events', value: stats.events, icon: Calendar, href: '/events' },
    { label: 'Vouchers', value: stats.vouchers, icon: Tag, href: '/vouchers' },
    { label: 'Rewards', value: stats.rewards, icon: Gift, href: '/rewards' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold uppercase tracking-widest text-foreground">Dashboard</h1>
        <p className="text-xs uppercase tracking-wider text-neutral-500 mt-1">
          Welcome to The Coffee Links Admin
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href} className="stat-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 border border-border flex items-center justify-center group-hover:border-primary transition-colors">
                <stat.icon size={18} className="text-primary" />
              </div>
            </div>
            <p className="stat-value">{loading ? '...' : stat.value}</p>
            <p className="stat-label mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-sm font-bold uppercase tracking-widest text-foreground mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/products/new" className="btn btn-primary">
            <Coffee size={14} />
            Add Product
          </Link>
          <Link href="/events/new" className="btn btn-outline">
            <Calendar size={14} />
            Add Event
          </Link>
          <Link href="/vouchers/new" className="btn btn-outline">
            <Tag size={14} />
            Add Voucher
          </Link>
          <Link href="/rewards/new" className="btn btn-outline">
            <Gift size={14} />
            Add Reward
          </Link>
        </div>
      </div>
    </div>
  );
}
