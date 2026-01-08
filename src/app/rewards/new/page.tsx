'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://appcafe-server.vercel.app';

const categories = ['drink', 'food', 'discount', 'merchandise'];

export default function NewRewardPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: '',
        description: '',
        pointsCost: '',
        category: 'drink',
        image: '/images/reward-default.jpg',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`${API_URL}/api/rewards`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    id: form.name.toLowerCase().replace(/\s+/g, '-'),
                    pointsCost: parseInt(form.pointsCost),
                }),
            });

            if (res.ok) {
                router.push('/rewards');
            } else {
                alert('Failed to create reward');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create reward');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/rewards" className="p-2 hover:bg-neutral-100 border border-transparent hover:border-border transition-all">
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-xl font-bold uppercase tracking-widest text-foreground">Add Reward</h1>
                    <p className="text-xs uppercase tracking-wider text-neutral-500 mt-1">
                        Create a new loyalty reward
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="card space-y-6">
                    <div>
                        <label className="label">Reward Name</label>
                        <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="input"
                            placeholder="e.g. Free Coffee"
                        />
                    </div>

                    <div>
                        <label className="label">Description</label>
                        <textarea
                            required
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="input"
                            rows={2}
                            placeholder="e.g. Any standard size coffee of your choice"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label">Points Cost</label>
                            <input
                                type="number"
                                required
                                value={form.pointsCost}
                                onChange={(e) => setForm({ ...form, pointsCost: e.target.value })}
                                className="input font-mono"
                                placeholder="50"
                            />
                        </div>
                        <div>
                            <label className="label">Category</label>
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

                <div className="flex gap-3 mt-6">
                    <button type="submit" disabled={saving} className="btn btn-primary">
                        <Save size={14} />
                        {saving ? 'Saving...' : 'Save Reward'}
                    </button>
                    <Link href="/rewards" className="btn btn-outline">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
