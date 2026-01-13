'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search, Layers, Grid } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://appcafe-server.vercel.app';

interface Category {
    id: string;
    name: string;
    type: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/api/categories`);
            const data = await res.json();
            setCategories(data.categories || []);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category? Products in this category will not be deleted but will have no category.')) return;

        try {
            await fetch(`${API_URL}/api/categories/${id}`, { method: 'DELETE' });
            setCategories(categories.filter(c => c.id !== id));
        } catch (error) {
            console.error('Failed to delete category:', error);
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between page-header">
                <div>
                    <h1 className="page-title">Categories</h1>
                    <p className="page-subtitle">Manage menu categories</p>
                </div>
                <Link href="/categories/new" className="btn btn-primary">
                    <Plus size={16} />
                    Add Category
                </Link>
            </div>

            {/* Filters */}
            <div className="card mb-6">
                <div className="flex flex-wrap gap-6">
                    <div className="flex-1 min-w-[240px]">
                        <div className="relative">
                            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input pl-11"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Table */}
            <div className="card p-0 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-neutral-500 text-sm font-medium uppercase tracking-wider">Loading categories...</div>
                ) : filteredCategories.length === 0 ? (
                    <div className="p-12 text-center text-neutral-500 text-sm font-medium uppercase tracking-wider">No categories found</div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>ID</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategories.map((category) => (
                                <tr key={category.id}>
                                    <td>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-neutral-100 border border-border flex items-center justify-center flex-shrink-0 rounded-lg">
                                                <Grid size={18} className="text-neutral-400" />
                                            </div>
                                            <span className="font-bold text-sm text-foreground">
                                                {category.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-neutral">{category.type}</span>
                                    </td>
                                    <td>
                                        <span className="text-xs text-neutral-400 font-mono">{category.id}</span>
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-end gap-2">
                                            {/* 
                                            <Link
                                                href={`/categories/${category.id}/edit`}
                                                className="btn btn-sm btn-outline px-2 border-neutral-200 hover:border-primary text-neutral-500 hover:text-primary"
                                            >
                                                <Edit2 size={14} />
                                            </Link> 
                                            */}
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                className="btn btn-sm btn-outline px-2 border-neutral-200 hover:border-danger text-neutral-500 hover:text-danger hover:bg-red-50"
                                            >
                                                <Trash2 size={14} />
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
