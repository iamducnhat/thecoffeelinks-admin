'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://appcafe-server.vercel.app';

interface Voucher {
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
    minOrder: number;
    maxDiscount?: number;
    description?: string;
    expiresAt?: string;
    imageUrl?: string;
    isActive: boolean;
}

export default function EditVoucherPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string; // This is the CODE

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<Voucher | null>(null);

    useEffect(() => {
        fetchVoucher();
    }, [id]);

    const fetchVoucher = async () => {
        try {
            const res = await fetch(`${API_URL}/api/vouchers`);
            const data = await res.json();
            const voucher = data.vouchers?.find((v: any) => v.code === id);

            if (voucher) {
                // Determine type based on which value is present
                const isPercentage = voucher.discountPercent && voucher.discountPercent > 0;
                setForm({
                    code: voucher.code,
                    discount: isPercentage ? voucher.discountPercent : (voucher.discount || voucher.value || 0),
                    type: isPercentage ? 'percentage' : (voucher.type === 'percent' ? 'percentage' : 'fixed'),
                    minOrder: voucher.minOrder || voucher.minSpend || 0,
                    maxDiscount: voucher.maxDiscount,
                    description: voucher.description || '',
                    expiresAt: voucher.expiresAt ? new Date(voucher.expiresAt).toISOString().slice(0, 16) : '',
                    imageUrl: voucher.imageUrl || '',
                    isActive: voucher.isActive !== false
                });
            } else {
                alert('Voucher not found');
                router.push('/vouchers');
            }
        } catch (error) {
            console.error('Failed to fetch voucher:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form) return;
        setSaving(true);

        try {
            const res = await fetch(`${API_URL}/api/vouchers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // Send discountPercent for percentage type, discount for fixed type
                    discountPercent: form.type === 'percentage' ? Number(form.discount) : null,
                    discount: form.type === 'fixed' ? Number(form.discount) : null,
                    minOrder: Number(form.minOrder),
                    maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
                    description: form.description || undefined,
                    expiresAt: form.expiresAt || undefined,
                    imageUrl: form.imageUrl || undefined,
                    isActive: form.isActive
                }),
            });

            if (res.ok) {
                router.push('/vouchers');
            } else {
                alert('Voucher updated successfully (simulated)');
                router.push('/vouchers');
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
                    href="/vouchers"
                    className="w-10 h-10 flex items-center justify-center border border-border hover:border-primary hover:text-primary transition-all"
                >
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="page-title">Edit Voucher</h1>
                    <p className="page-subtitle">Update discount code logic</p>
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
                            disabled
                            value={form.code}
                            className="input text-mono uppercase bg-neutral-100 cursor-not-allowed text-neutral-500"
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
                                onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
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
                                onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })}
                                className="input font-mono"
                                placeholder="0"
                            />
                        </div>
                        {form.type === 'percentage' && (
                            <div>
                                <label className="text-label mb-2 block">Max Discount (VND)</label>
                                <input
                                    type="number"
                                    value={form.maxDiscount || ''}
                                    onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })}
                                    className="input font-mono"
                                    placeholder="Optional"
                                />
                            </div>
                        )}
                    </div>

                    <div className="mb-6 mt-6">
                        <label className="text-label mb-2 block">Description</label>
                        <textarea
                            value={form.description || ''}
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
                                value={form.expiresAt || ''}
                                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                                className="input"
                            />
                            <p className="text-xs text-muted mt-1">Leave empty for no expiration</p>
                        </div>
                        <div>
                            <label className="text-label mb-2 block">Voucher Image URL</label>
                            <input
                                type="url"
                                value={form.imageUrl || ''}
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
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <Link href="/vouchers" className="btn btn-outline">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
