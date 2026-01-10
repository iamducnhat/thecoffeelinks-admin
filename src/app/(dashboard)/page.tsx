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
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome to The Coffee Links Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href} className="card hover:border-primary transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-label text-neutral-400 group-hover:text-primary transition-colors">{stat.label}</span>
              <stat.icon size={20} className="text-neutral-300 group-hover:text-primary transition-colors" />
            </div>
            <p className="text-3xl font-bold text-foreground tracking-tight">{loading ? '—' : stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-header mb-6 text-lg">Quick Actions</h2>
        <div className="flex flex-wrap gap-6">
          <Link href="/products/new" className="btn btn-primary">
            <Coffee size={18} strokeWidth={2} />
            Add Product
          </Link>
          <Link href="/events/new" className="btn btn-outline">
            <Calendar size={18} strokeWidth={2} />
            Add Event
          </Link>
          <Link href="/vouchers/new" className="btn btn-outline">
            <Tag size={18} strokeWidth={2} />
            Add Voucher
          </Link>
          <Link href="/rewards/new" className="btn btn-outline">
            <Gift size={18} strokeWidth={2} />
            Add Reward
          </Link>
        </div>
      </div>
    </div>
  );
}
