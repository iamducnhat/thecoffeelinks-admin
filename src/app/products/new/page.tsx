'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://appcafe-server.vercel.app';

const categories = ['coffee', 'tea', 'smoothies', 'pastries', 'seasonal'];

export default function NewProductPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: '',
        description: '',
        basePrice: '',
        category: 'coffee',
        image: '/images/default.jpg',
        isPopular: false,
        isNew: true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`${API_URL}/api/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    basePrice: parseInt(form.basePrice),
                    id: form.name.toLowerCase().replace(/\s+/g, '-'),
                }),
            });

            if (res.ok) {
                router.push('/products');
            } else {
                alert('Failed to create product');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create product');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-5 page-header">
                <Link
                    href="/products"
                    className="w-10 h-10 flex items-center justify-center border border-border hover:border-primary hover:text-primary transition-all"
                >
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="page-title">Add Product</h1>
                    <p className="page-subtitle">Create a new menu item</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="card">
                    <div className="form-group">
                        <label className="label">Product Name</label>
                        <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="input"
                            placeholder="e.g. Caramel Macchiato"
                        />
                    </div>

                    <div className="form-group">
                        <label className="label">Description</label>
                        <textarea
                            required
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="input"
                            rows={3}
                            placeholder="A brief description of the product..."
                        />
                    </div>

                    <div className="form-row form-group">
                        <div>
                            <label className="label">Price (VND)</label>
                            <input
                                type="number"
                                required
                                value={form.basePrice}
                                onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                                className="input text-mono"
                                placeholder="50000"
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

                    <div className="flex gap-6">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.isPopular}
                                onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
                                className="w-4 h-4 accent-primary"
                            />
                            <span className="text-xs font-semibold uppercase tracking-wide">Mark as Popular</span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.isNew}
                                onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                                className="w-4 h-4 accent-primary"
                            />
                            <span className="text-xs font-semibold uppercase tracking-wide">Mark as New</span>
                        </label>
                    </div>
                </div>

                <div className="flex gap-6 mt-8">
                    <button type="submit" disabled={saving} className="btn btn-primary">
                        <Save size={16} />
                        {saving ? 'Saving...' : 'Save Product'}
                    </button>
                    <Link href="/products" className="btn btn-outline">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
