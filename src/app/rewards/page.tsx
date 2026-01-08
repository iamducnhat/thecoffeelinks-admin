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
        if (category === 'drink') return <Coffee size={18} className="text-blue-600" />;
        return <Gift size={18} className="text-purple-600" />;
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Rewards</h1>
                    <p className="text-gray-500 mt-1">Manage loyalty program rewards</p>
                </div>
                <Link href="/rewards/new" className="btn btn-primary">
                    <Plus size={16} />
                    Add Reward
                </Link>
            </div>

            {/* Rewards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full p-8 text-center text-gray-500">Loading...</div>
                ) : rewards.length === 0 ? (
                    <div className="col-span-full p-8 text-center text-gray-500">No rewards found</div>
                ) : (
                    rewards.map((reward) => (
                        <div key={reward.id} className="card">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                    {getCategoryIcon(reward.category)}
                                </div>
                                <span className="badge badge-info font-mono">{reward.pointsCost} pts</span>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">{reward.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">{reward.description}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                <span className="text-xs text-gray-400 capitalize">{reward.category}</span>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/rewards/${reward.id}/edit`}
                                        className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                                    >
                                        <Edit2 size={14} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(reward.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 size={14} />
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
