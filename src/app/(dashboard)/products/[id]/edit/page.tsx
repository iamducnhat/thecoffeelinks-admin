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

interface Topping {
    id: string;
    name: string;
    price: number;
    is_available: boolean;
}

interface Product {
    id: string;
    name: string;
    description: string;
    category?: string;
    categoryId?: string;
    image: string;
    isPopular: boolean;
    isNew: boolean;
    availableToppings?: string[];
    sizeOptions?: {
        small: { enabled: boolean; price: number };
        medium: { enabled: boolean; price: number };
        large: { enabled: boolean; price: number };
    };
}

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<Product | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [toppings, setToppings] = useState<Topping[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingToppings, setLoadingToppings] = useState(true);

    useEffect(() => {
        fetchCategories();
        fetchToppings();
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

    const fetchToppings = async () => {
        try {
            const res = await fetch(`${API_URL}/api/toppings`);
            const data = await res.json();
            setToppings(data.toppings || []);
        } catch (error) {
            console.error('Failed to fetch toppings:', error);
        } finally {
            setLoadingToppings(false);
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
                    isNew: !!product.isNew,
                    sizeOptions: product.sizeOptions || {
                        small: { enabled: false, price: 0 },
                        medium: { enabled: true, price: 65000 },
                        large: { enabled: true, price: 69000 }
                    }
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
            // Get admin token from cookie
            const adminTokenCookie = document.cookie
                .split('; ')
                .find(row => row.startsWith('admin_token='));
            // Use substring to handle tokens that contain '=' characters
            // URL-decode to handle special characters
            const rawToken = adminTokenCookie?.substring('admin_token='.length);
            let adminToken: string | undefined;
            try {
                adminToken = rawToken ? decodeURIComponent(rawToken) : undefined;
            } catch {
                adminToken = rawToken;
            }

            const res = await fetch(`${API_URL}/api/products/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-Admin-Key': adminToken || ''
                },
                body: JSON.stringify(form),
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

                    <div className="mb-6">
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
                                        checked={form.sizeOptions?.small.enabled || false}
                                        onChange={(e) => setForm({
                                            ...form,
                                            sizeOptions: {
                                                ...form.sizeOptions!,
                                                small: { ...form.sizeOptions!.small, enabled: e.target.checked }
                                            }
                                        })}
                                        className="w-4 h-4 rounded-none border-border checked:bg-primary"
                                    />
                                    <span className="text-sm font-medium">Small</span>
                                </label>
                                <input
                                    type="number"
                                    value={form.sizeOptions?.small.price || 0}
                                    onChange={(e) => setForm({
                                        ...form,
                                        sizeOptions: {
                                            ...form.sizeOptions!,
                                            small: { ...form.sizeOptions!.small, price: Number(e.target.value) }
                                        }
                                    })}
                                    disabled={!form.sizeOptions?.small.enabled}
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
                                        checked={form.sizeOptions?.medium.enabled || false}
                                        onChange={(e) => setForm({
                                            ...form,
                                            sizeOptions: {
                                                ...form.sizeOptions!,
                                                medium: { ...form.sizeOptions!.medium, enabled: e.target.checked }
                                            }
                                        })}
                                        className="w-4 h-4 rounded-none border-border checked:bg-primary"
                                    />
                                    <span className="text-sm font-medium">Medium</span>
                                </label>
                                <input
                                    type="number"
                                    value={form.sizeOptions?.medium.price || 65000}
                                    onChange={(e) => setForm({
                                        ...form,
                                        sizeOptions: {
                                            ...form.sizeOptions!,
                                            medium: { ...form.sizeOptions!.medium, price: Number(e.target.value) }
                                        }
                                    })}
                                    disabled={!form.sizeOptions?.medium.enabled}
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
                                        checked={form.sizeOptions?.large.enabled || false}
                                        onChange={(e) => setForm({
                                            ...form,
                                            sizeOptions: {
                                                ...form.sizeOptions!,
                                                large: { ...form.sizeOptions!.large, enabled: e.target.checked }
                                            }
                                        })}
                                        className="w-4 h-4 rounded-none border-border checked:bg-primary"
                                    />
                                    <span className="text-sm font-medium">Large</span>
                                </label>
                                <input
                                    type="number"
                                    value={form.sizeOptions?.large.price || 69000}
                                    onChange={(e) => setForm({
                                        ...form,
                                        sizeOptions: {
                                            ...form.sizeOptions!,
                                            large: { ...form.sizeOptions!.large, price: Number(e.target.value) }
                                        }
                                    })}
                                    disabled={!form.sizeOptions?.large.enabled}
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

                    <div className="mb-6 mt-8 pt-8 border-t border-neutral-200">
                        <label className="text-label mb-4 block">Available Toppings</label>
                        {loadingToppings ? (
                            <div className="text-sm text-neutral-500">Loading toppings...</div>
                        ) : toppings.length === 0 ? (
                            <div className="text-sm text-neutral-500">No toppings available. Create some first.</div>
                        ) : (
                            <div className="space-y-2 bg-neutral-50 p-4 border border-neutral-200 rounded-lg">
                                {toppings.map((topping) => (
                                    <label key={topping.id} className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={(form.availableToppings || []).includes(topping.id)}
                                            onChange={(e) => {
                                                const current = form.availableToppings || [];
                                                if (e.target.checked) {
                                                    setForm({
                                                        ...form,
                                                        availableToppings: [...current, topping.id]
                                                    });
                                                } else {
                                                    setForm({
                                                        ...form,
                                                        availableToppings: current.filter(t => t !== topping.id)
                                                    });
                                                }
                                            }}
                                            className="w-4 h-4 rounded-none border-border checked:bg-primary"
                                        />
                                        <span className="text-sm font-medium">{topping.name}</span>
                                        <span className="text-xs text-neutral-500 font-mono">+{topping.price}đ</span>
                                    </label>
                                ))}
                            </div>
                        )}
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
