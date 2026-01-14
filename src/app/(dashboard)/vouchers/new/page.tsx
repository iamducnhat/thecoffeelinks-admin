'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://appcafe-server.vercel.app';

export default function NewVoucherPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        code: '',
        discount: '',
        type: 'percentage' as 'percentage' | 'fixed',
        minOrder: '0',
        maxDiscount: '',
        description: '',
        expiresAt: '',
        imageUrl: '',
        isActive: true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`${API_URL}/api/vouchers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: form.code.toUpperCase(),
                    // Send discountPercent for percentage type, discount for fixed type
                    discountPercent: form.type === 'percentage' ? parseInt(form.discount) : null,
                    discount: form.type === 'fixed' ? parseInt(form.discount) : null,
                    minOrder: parseInt(form.minOrder),
                    maxDiscount: form.maxDiscount ? parseInt(form.maxDiscount) : undefined,
                    description: form.description || undefined,
                    expiresAt: form.expiresAt || undefined,
                    imageUrl: form.imageUrl || undefined,
                    isActive: form.isActive,
                }),
            });

            if (res.ok) {
                router.push('/vouchers');
            } else {
                alert('Failed to create voucher');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create voucher');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-5 page-header">
                <Link
                    href="/vouchers"
                    className="w-10 h-10 flex items-center justify-center border border-border hover:border-primary hover:text-primary transition-all"
                >
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="page-title">Add Voucher</h1>
                    <p className="page-subtitle">Create a new discount code</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="card">
                    <div className="mb-6">
                        <label className="text-label mb-2 block">Voucher Code</label>
                        <input
                            type="text"
                            required
                            value={form.code}
                            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                            className="input text-mono uppercase"
                            placeholder="e.g. WELCOME10"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="text-label mb-2 block">Discount Type</label>
                            <select
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value as 'percentage' | 'fixed' })}
                                className="input"
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount (VND)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-label mb-2 block">
                                Discount Value {form.type === 'percentage' ? '(%)' : '(VND)'}
                            </label>
                            <input
                                type="number"
                                required
                                value={form.discount}
                                onChange={(e) => setForm({ ...form, discount: e.target.value })}
                                className="input font-mono"
                                placeholder={form.type === 'percentage' ? '10' : '50000'}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-label mb-2 block">Minimum Order (VND)</label>
                            <input
                                type="number"
                                value={form.minOrder}
                                onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
                                className="input font-mono"
                                placeholder="0"
                            />
                        </div>
                        {form.type === 'percentage' && (
                            <div>
                                <label className="text-label mb-2 block">Max Discount (VND)</label>
                                <input
                                    type="number"
                                    value={form.maxDiscount}
                                    onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                                    className="input font-mono"
                                    placeholder="Optional"
                                />
                            </div>
                        )}
                    </div>

                    <div className="mb-6 mt-6">
                        <label className="text-label mb-2 block">Description</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="input"
                            placeholder="e.g. Get 10% off your first order!"
                            rows={2}
                        />
                        <p className="text-xs text-muted mt-1">Shown to customers in the mobile app</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="text-label mb-2 block">Expiration Date</label>
                            <input
                                type="datetime-local"
                                value={form.expiresAt}
                                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                                className="input"
                            />
                            <p className="text-xs text-muted mt-1">Leave empty for no expiration</p>
                        </div>
                        <div>
                            <label className="text-label mb-2 block">Voucher Image URL</label>
                            <input
                                type="url"
                                value={form.imageUrl}
                                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                                className="input"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={form.isActive}
                            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                            className="w-4 h-4"
                        />
                        <label htmlFor="isActive" className="text-sm">
                            Active (visible to customers)
                        </label>
                    </div>
                </div>

                <div className="flex gap-6 mt-8">
                    <button type="submit" disabled={saving} className="btn btn-primary">
                        <Save size={16} />
                        {saving ? 'Saving...' : 'Save Voucher'}
                    </button>
                    <Link href="/vouchers" className="btn btn-outline">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
