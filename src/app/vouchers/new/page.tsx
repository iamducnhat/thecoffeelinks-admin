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
                    discount: parseInt(form.discount),
                    type: form.type,
                    minOrder: parseInt(form.minOrder),
                    maxDiscount: form.maxDiscount ? parseInt(form.maxDiscount) : undefined,
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
                    <div className="form-group">
                        <label className="label">Voucher Code</label>
                        <input
                            type="text"
                            required
                            value={form.code}
                            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                            className="input text-mono uppercase"
                            placeholder="e.g. WELCOME10"
                        />
                    </div>

                    <div className="form-row form-group">
                        <div>
                            <label className="label">Discount Type</label>
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
                            <label className="label">
                                Discount Value {form.type === 'percentage' ? '(%)' : '(VND)'}
                            </label>
                            <input
                                type="number"
                                required
                                value={form.discount}
                                onChange={(e) => setForm({ ...form, discount: e.target.value })}
                                className="input text-mono"
                                placeholder={form.type === 'percentage' ? '10' : '50000'}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div>
                            <label className="label">Minimum Order (VND)</label>
                            <input
                                type="number"
                                value={form.minOrder}
                                onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
                                className="input text-mono"
                                placeholder="0"
                            />
                        </div>
                        {form.type === 'percentage' && (
                            <div>
                                <label className="label">Max Discount (VND)</label>
                                <input
                                    type="number"
                                    value={form.maxDiscount}
                                    onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                                    className="input text-mono"
                                    placeholder="Optional"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button type="submit" disabled={saving} className="btn btn-primary">
                        <Save size={14} />
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
