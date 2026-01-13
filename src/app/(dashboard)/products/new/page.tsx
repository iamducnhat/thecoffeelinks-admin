'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://appcafe-server.vercel.app';

interface Category {
    id: string;
    name: string;
    type: string;
}

export default function NewProductPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [form, setForm] = useState({
        name: '',
        description: '',
        categoryId: '',
        image: '/images/default.jpg',
        isPopular: false,
        isNew: true,
        sizeOptions: {
            small: { enabled: false, price: 0 },
            medium: { enabled: true, price: 65000 },
            large: { enabled: true, price: 69000 }
        }
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/api/categories`);
            const data = await res.json();
            setCategories(data.categories || []);
            if (data.categories?.length > 0) {
                setForm(prev => ({ ...prev, categoryId: data.categories[0].id }));
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoadingCategories(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Get admin token from cookie
            const adminToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('admin_token='))
                ?.split('=')[1];

            const res = await fetch(`${API_URL}/api/products`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-Admin-Key': adminToken || ''
                },
                body: JSON.stringify({
                    ...form,
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
                    <div className="mb-6">
                        <label className="text-label mb-2 block">Product Name</label>
                        <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="input"
                            placeholder="e.g. Caramel Macchiato"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="text-label mb-2 block">Description</label>
                        <textarea
                            required
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="input"
                            rows={3}
                            placeholder="A brief description of the product..."
                        />
                    </div>

                    <div className="mb-6">
                        <label className="text-label mb-2 block">Category</label>
                        <select
                            value={form.categoryId}
                            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                            className="input"
                            disabled={loadingCategories}
                            required
                        >
                            {loadingCategories ? (
                                <option>Loading categories...</option>
                            ) : categories.length === 0 ? (
                                <option>No categories available</option>
                            ) : (
                                categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    <div className="mb-6">
                        <ImageUpload
                            value={form.image}
                            onChange={(url) => setForm({ ...form, image: url })}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="text-label mb-3 block">Available Sizes</label>
                        <div className="space-y-3 bg-neutral-50 p-4 border border-neutral-200">
                            {/* Small */}
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer min-w-[120px]">
                                    <input
                                        type="checkbox"
                                        checked={form.sizeOptions.small.enabled}
                                        onChange={(e) => setForm({
                                            ...form,
                                            sizeOptions: {
                                                ...form.sizeOptions,
                                                small: { ...form.sizeOptions.small, enabled: e.target.checked }
                                            }
                                        })}
                                        className="w-4 h-4 rounded-none border-border checked:bg-primary"
                                    />
                                    <span className="text-sm font-medium">Small</span>
                                </label>
                                <input
                                    type="number"
                                    value={form.sizeOptions.small.price}
                                    onChange={(e) => setForm({
                                        ...form,
                                        sizeOptions: {
                                            ...form.sizeOptions,
                                            small: { ...form.sizeOptions.small, price: Number(e.target.value) }
                                        }
                                    })}
                                    disabled={!form.sizeOptions.small.enabled}
                                    className="input input-sm w-32 font-mono"
                                    placeholder="0"
                                />
                                <span className="text-xs text-neutral-500">VND</span>
                            </div>

                            {/* Medium */}
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer min-w-[120px]">
                                    <input
                                        type="checkbox"
                                        checked={form.sizeOptions.medium.enabled}
                                        onChange={(e) => setForm({
                                            ...form,
                                            sizeOptions: {
                                                ...form.sizeOptions,
                                                medium: { ...form.sizeOptions.medium, enabled: e.target.checked }
                                            }
                                        })}
                                        className="w-4 h-4 rounded-none border-border checked:bg-primary"
                                    />
                                    <span className="text-sm font-medium">Medium</span>
                                </label>
                                <input
                                    type="number"
                                    value={form.sizeOptions.medium.price}
                                    onChange={(e) => setForm({
                                        ...form,
                                        sizeOptions: {
                                            ...form.sizeOptions,
                                            medium: { ...form.sizeOptions.medium, price: Number(e.target.value) }
                                        }
                                    })}
                                    disabled={!form.sizeOptions.medium.enabled}
                                    className="input input-sm w-32 font-mono"
                                    placeholder="65000"
                                />
                                <span className="text-xs text-neutral-500">VND</span>
                            </div>

                            {/* Large */}
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer min-w-[120px]">
                                    <input
                                        type="checkbox"
                                        checked={form.sizeOptions.large.enabled}
                                        onChange={(e) => setForm({
                                            ...form,
                                            sizeOptions: {
                                                ...form.sizeOptions,
                                                large: { ...form.sizeOptions.large, enabled: e.target.checked }
                                            }
                                        })}
                                        className="w-4 h-4 rounded-none border-border checked:bg-primary"
                                    />
                                    <span className="text-sm font-medium">Large</span>
                                </label>
                                <input
                                    type="number"
                                    value={form.sizeOptions.large.price}
                                    onChange={(e) => setForm({
                                        ...form,
                                        sizeOptions: {
                                            ...form.sizeOptions,
                                            large: { ...form.sizeOptions.large, price: Number(e.target.value) }
                                        }
                                    })}
                                    disabled={!form.sizeOptions.large.enabled}
                                    className="input input-sm w-32 font-mono"
                                    placeholder="69000"
                                />
                                <span className="text-xs text-neutral-500">VND</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-6 pt-2">

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={form.isPopular}
                                onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
                                className="w-5 h-5 rounded-none border-border checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0 transition-all"
                            />
                            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 group-hover:text-primary transition-colors">Mark as Popular</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={form.isNew}
                                onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                                className="w-5 h-5 rounded-none border-border checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0 transition-all"
                            />
                            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 group-hover:text-primary transition-colors">Mark as New</span>
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
