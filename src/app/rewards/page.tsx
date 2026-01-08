'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Gift, Coffee } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://appcafe-server.vercel.app';

interface Reward {
    id: string;
    name: string;
    description: string;
    pointsCost: number;
    image: string;
    category: string;
}

export default function RewardsPage() {
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRewards();
    }, []);

    const fetchRewards = async () => {
        try {
            const res = await fetch(`${API_URL}/api/rewards`);
            const data = await res.json();
            setRewards(data.rewards || []);
        } catch (error) {
            console.error('Failed to fetch rewards:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this reward?')) return;

        try {
            await fetch(`${API_URL}/api/rewards/${id}`, { method: 'DELETE' });
            setRewards(rewards.filter(r => r.id !== id));
        } catch (error) {
            console.error('Failed to delete reward:', error);
        }
    };

    const getCategoryIcon = (category: string) => {
        if (category === 'drink') return <Coffee size={16} className="text-primary" />;
        return <Gift size={16} className="text-secondary" />;
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-xl font-bold uppercase tracking-widest text-foreground">Rewards</h1>
                    <p className="text-xs uppercase tracking-wider text-neutral-500 mt-1">
                        Manage loyalty program rewards
                    </p>
                </div>
                <Link href="/rewards/new" className="btn btn-primary">
                    <Plus size={14} />
                    Add Reward
                </Link>
            </div>

            {/* Rewards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    <div className="col-span-full p-8 text-center text-neutral-500 text-xs uppercase tracking-wider">
                        Loading...
                    </div>
                ) : rewards.length === 0 ? (
                    <div className="col-span-full p-8 text-center text-neutral-500 text-xs uppercase tracking-wider">
                        No rewards found
                    </div>
                ) : (
                    rewards.map((reward) => (
                        <div key={reward.id} className="card">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 border border-border flex items-center justify-center">
                                    {getCategoryIcon(reward.category)}
                                </div>
                                <span className="font-mono font-bold text-sm text-primary">
                                    {reward.pointsCost} pts
                                </span>
                            </div>
                            <h3 className="font-bold text-sm uppercase tracking-wide text-foreground mb-1">
                                {reward.name}
                            </h3>
                            <p className="text-xs text-neutral-500 mb-4">{reward.description}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-border">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                                    {reward.category}
                                </span>
                                <div className="flex gap-1">
                                    <Link
                                        href={`/rewards/${reward.id}/edit`}
                                        className="p-1.5 text-neutral-400 hover:text-primary transition-colors"
                                    >
                                        <Edit2 size={12} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(reward.id)}
                                        className="p-1.5 text-neutral-400 hover:text-danger transition-colors"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
