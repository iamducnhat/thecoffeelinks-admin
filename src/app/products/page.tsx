'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search, Coffee } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://appcafe-server.vercel.app';

interface Product {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    category: string;
    image: string;
    isPopular?: boolean;
    isNew?: boolean;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_URL}/api/products`);
            const data = await res.json();
            setProducts(data.products || []);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
    };

    const categories = ['all', 'coffee', 'tea', 'smoothies', 'pastries', 'seasonal'];

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between page-header">
                <div>
                    <h1 className="page-title">Products</h1>
                    <p className="page-subtitle">Manage your menu items</p>
                </div>
                <Link href="/products/new" className="btn btn-primary">
                    <Plus size={16} />
                    Add Product
                </Link>
            </div>

            {/* Filters */}
            <div className="card mb-6">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[240px]">
                        <div className="relative">
                            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input pl-11"
                            />
                        </div>
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="input w-auto min-w-[160px]"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="card p-0 overflow-hidden">
                {loading ? (
                    <div className="loading-state">Loading products...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="empty-state">No products found</div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-neutral-100 border border-border flex items-center justify-center flex-shrink-0">
                                                <Coffee size={16} className="text-neutral-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-sm text-foreground truncate">
                                                    {product.name}
                                                </p>
                                                <p className="text-xs text-neutral-500 truncate mt-0.5">
                                                    {product.description}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-info">{product.category}</span>
                                    </td>
                                    <td>
                                        <span className="text-mono text-sm font-medium">
                                            {formatPrice(product.basePrice)}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-1.5">
                                            {product.isPopular && <span className="badge badge-warning">Popular</span>}
                                            {product.isNew && <span className="badge badge-success">New</span>}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/products/${product.id}/edit`}
                                                className="action-btn"
                                            >
                                                <Edit2 size={15} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="action-btn action-btn-danger"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
