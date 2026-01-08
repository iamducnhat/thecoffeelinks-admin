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
      <div className="grid-stats mb-8">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href} className="stat-card">
            <div className="stat-icon">
              <stat.icon size={18} className="text-primary" />
            </div>
            <p className="stat-value">{loading ? '—' : stat.value}</p>
            <p className="stat-label">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="section-title">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/products/new" className="btn btn-primary">
            <Coffee size={16} />
            Add Product
          </Link>
          <Link href="/events/new" className="btn btn-outline">
            <Calendar size={16} />
            Add Event
          </Link>
          <Link href="/vouchers/new" className="btn btn-outline">
            <Tag size={16} />
            Add Voucher
          </Link>
          <Link href="/rewards/new" className="btn btn-outline">
            <Gift size={16} />
            Add Reward
          </Link>
        </div>
      </div>
    </div>
  );
}
