'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://appcafe-server.vercel.app';

interface Category {
    id: string;
    name: string;
    type: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    category?: string;
    categoryId?: string;
    image: string;
    isPopular: boolean;
    isNew: boolean;
}

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<Product | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        fetchCategories();
        fetchProduct();
    }, [id]);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/api/categories`);
            const data = await res.json();
            setCategories(data.categories || []);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoadingCategories(false);
        }
    };

    const fetchProduct = async () => {
        try {
            // Fallback: Fetch all and filter if detail endpoint fails/is missing
            const res = await fetch(`${API_URL}/api/products`);
            const data = await res.json();
            const product = data.products?.find((p: any) => p.id === id);

            if (product) {
                setForm({
                    ...product,
                    // Ensure booleans
                    isPopular: !!product.isPopular,
                    isNew: !!product.isNew
                });
            } else {
                // Try direct endpoint just in case
                const directRes = await fetch(`${API_URL}/api/products/${id}`);
                if (directRes.ok) {
                    const directData = await directRes.json();
                    setForm(directData);
                } else {
                    alert('Product not found');
                    router.push('/products');
                }
            }
        } catch (error) {
            console.error('Failed to fetch product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form) return;
        setSaving(true);

        try {
            const res = await fetch(`${API_URL}/api/products/${id}`, {
                method: 'PUT', // or PATCH
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    basePrice: Number(form.basePrice),
                }),
            });

            if (res.ok) {
                router.push('/products');
            } else {
                const data = await res.json();
                console.error('Update failed:', data);
                alert(data.error || 'Failed to update product');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to update product');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-neutral-500 text-sm font-medium uppercase tracking-wider">Loading product...</div>;
    if (!form) return <div className="p-12 text-center text-neutral-500 text-sm font-medium uppercase tracking-wider">Product not found</div>;

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
                    <h1 className="page-title">Edit Product</h1>
                    <p className="page-subtitle">Update menu item details</p>
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

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="text-label mb-2 block">Price (VND)</label>
                            <input
                                type="number"
                                required
                                value={form.basePrice}
                                onChange={(e) => setForm({ ...form, basePrice: Number(e.target.value) })}
                                className="input font-mono"
                                placeholder="50000"
                            />
                        </div>
                        <div>
                            <label className="text-label mb-2 block">Category</label>
                            <select
                                value={form.categoryId || ''}
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
                    </div>

                    <div className="mb-6">
                        <ImageUpload
                            value={form.image}
                            onChange={(url) => setForm({ ...form, image: url })}
                        />
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
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <Link href="/products" className="btn btn-outline">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
