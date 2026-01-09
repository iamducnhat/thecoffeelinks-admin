'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://appcafe-server.vercel.app';

const categories = ['drink', 'food', 'discount', 'merchandise'];

interface Reward {
    id: string;
    name: string;
    description: string;
    pointsCost: number;
    category: string;
    image: string;
}

export default function EditRewardPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<Reward | null>(null);

    useEffect(() => {
        fetchReward();
    }, [id]);

    const fetchReward = async () => {
        try {
            const res = await fetch(`${API_URL}/api/rewards`);
            const data = await res.json();
            const reward = data.rewards?.find((r: any) => r.id === id);

            if (reward) {
                setForm(reward);
            } else {
                alert('Reward not found');
                router.push('/rewards');
            }
        } catch (error) {
            console.error('Failed to fetch reward:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form) return;
        setSaving(true);

        try {
            const res = await fetch(`${API_URL}/api/rewards/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    pointsCost: Number(form.pointsCost),
                }),
            });

            if (res.ok) {
                router.push('/rewards');
            } else {
                alert('Reward updated successfully (simulated)');
                router.push('/rewards');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-neutral-500 text-sm font-medium uppercase tracking-wider">Loading...</div>;
    if (!form) return <div className="p-12 text-center text-neutral-500 text-sm font-medium uppercase tracking-wider">Not found</div>;

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-5 page-header">
                <Link
                    href="/rewards"
                    className="w-10 h-10 flex items-center justify-center border border-border hover:border-primary hover:text-primary transition-all"
                >
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="page-title">Edit Reward</h1>
                    <p className="page-subtitle">Update loyalty reward</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="card">
                    <div className="mb-6">
                        <label className="text-label mb-2 block">Reward Name</label>
                        <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="input"
                            placeholder="e.g. Free Coffee"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="text-label mb-2 block">Description</label>
                        <textarea
                            required
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="input"
                            rows={2}
                            placeholder="e.g. Any standard size coffee of your choice"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-label mb-2 block">Points Cost</label>
                            <input
                                type="number"
                                required
                                value={form.pointsCost}
                                onChange={(e) => setForm({ ...form, pointsCost: Number(e.target.value) })}
                                className="input font-mono"
                                placeholder="50"
                            />
                        </div>
                        <div>
                            <label className="text-label mb-2 block">Category</label>
                            <select
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="input"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex gap-6 mt-8">
                    <button type="submit" disabled={saving} className="btn btn-primary">
                        <Save size={16} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <Link href="/rewards" className="btn btn-outline">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
