'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search, Coffee, Layers, UtensilsCrossed } from 'lucide-react';
import { api } from '@/lib/api';

interface Category {
    id: string;
    name: string;
    type: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    categoryId?: string;
    image: string;
    isPopular?: boolean;
    isNew?: boolean;
    basePrice?: number;
}

interface Topping {
    id: string;
    name: string;
    price: number;
    is_available: boolean;
}

type TabType = 'products' | 'categories' | 'toppings';

export default function ProductsManager() {
    const searchParams = useSearchParams();
    const initialTab = (searchParams.get('tab') as TabType) || 'products';
    const [activeTab, setActiveTab] = useState<TabType>(initialTab);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [toppings, setToppings] = useState<Topping[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
    const [showNewToppingForm, setShowNewToppingForm] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', type: 'menu' });
    const [newTopping, setNewTopping] = useState({ name: '', price: 0 });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchProducts(),
                fetchCategories(),
                fetchToppings(),
            ]);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const data = await api.get<{ products: Product[] }>('/api/products');
            setProducts(data.products || []);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await api.get<{ categories: Category[] }>('/api/categories');
            setCategories(data.categories || []);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchToppings = async () => {
        try {
            const data = await api.get<{ toppings: Topping[] }>('/api/toppings');
            setToppings(data.toppings || []);
        } catch (error) {
            console.error('Failed to fetch toppings:', error);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/api/products/${id}`);
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        try {
            await api.delete(`/api/categories/${id}`);
            setCategories(categories.filter(c => c.id !== id));
        } catch (error) {
            console.error('Failed to delete category:', error);
        }
    };

    const handleDeleteTopping = async (id: string) => {
        if (!confirm('Are you sure you want to delete this topping?')) return;
        try {
            await api.delete(`/api/toppings/${id}`);
            setToppings(toppings.filter(t => t.id !== id));
        } catch (error) {
            console.error('Failed to delete topping:', error);
        }
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.name.trim()) return;

        try {
            const data = await api.post<{ category: Category }>('/api/categories', newCategory);

            if (data.category) {
                setCategories([...categories, data.category]);
                setNewCategory({ name: '', type: 'menu' });
                setShowNewCategoryForm(false);
            }
        } catch (error) {
            console.error('Failed to create category:', error);
        }
    };

    const handleCreateTopping = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTopping.name.trim()) return;

        try {
            const data = await api.post<{ topping: Topping }>('/api/toppings', newTopping);

            if (data.topping) {
                setToppings([...toppings, data.topping]);
                setNewTopping({ name: '', price: 0 });
                setShowNewToppingForm(false);
            }
        } catch (error) {
            console.error('Failed to create topping:', error);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredToppings = toppings.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between page-header">
                <div>
                    <h1 className="page-title">Products</h1>
                    <p className="page-subtitle">Manage menu items, categories, and toppings</p>
                </div>
                {activeTab === 'products' && (
                    <Link href="/products/new" className="btn btn-primary">
                        <Plus size={16} />
                        Add Product
                    </Link>
                )}
                {activeTab === 'categories' && (
                    <button
                        onClick={() => setShowNewCategoryForm(!showNewCategoryForm)}
                        className="btn btn-primary"
                    >
                        <Plus size={16} />
                        Add Category
                    </button>
                )}
                {activeTab === 'toppings' && (
                    <button
                        onClick={() => setShowNewToppingForm(!showNewToppingForm)}
                        className="btn btn-primary"
                    >
                        <Plus size={16} />
                        Add Topping
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="card mb-6 p-0 border-b border-neutral-200">
                <div className="flex">
                    <button
                        onClick={() => {
                            setActiveTab('products');
                            setSearchQuery('');
                            setSelectedCategory('all');
                        }}
                        className={`flex-1 px-6 py-4 font-medium border-b-2 transition-all flex items-center justify-center gap-2 ${activeTab === 'products'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-neutral-600 hover:text-foreground'
                            }`}
                    >
                        <Coffee size={18} />
                        Products
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('categories');
                            setSearchQuery('');
                        }}
                        className={`flex-1 px-6 py-4 font-medium border-b-2 transition-all flex items-center justify-center gap-2 ${activeTab === 'categories'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-neutral-600 hover:text-foreground'
                            }`}
                    >
                        <Layers size={18} />
                        Categories
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('toppings');
                            setSearchQuery('');
                        }}
                        className={`flex-1 px-6 py-4 font-medium border-b-2 transition-all flex items-center justify-center gap-2 ${activeTab === 'toppings'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-neutral-600 hover:text-foreground'
                            }`}
                    >
                        <UtensilsCrossed size={18} />
                        Toppings
                    </button>
                </div>
            </div>

            {/* Filters */}
            {activeTab === 'products' && (
                <div className="card mb-6">
                    <div className="flex flex-wrap gap-6">
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
                            <option value="all">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>
                                    {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {(activeTab === 'categories' || activeTab === 'toppings') && (
                <div className="card mb-6">
                    <div className="flex flex-wrap gap-6">
                        <div className="flex-1 min-w-[240px]">
                            <div className="relative">
                                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder={activeTab === 'categories' ? 'Search categories...' : 'Search toppings...'}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="input pl-11"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* NEW CATEGORY FORM */}
            {activeTab === 'categories' && showNewCategoryForm && (
                <div className="card mb-6 bg-neutral-50 border border-primary">
                    <form onSubmit={handleCreateCategory} className="space-y-4">
                        <h3 className="font-bold text-sm uppercase tracking-wider">Create New Category</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-label mb-2 block">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                    className="input"
                                    placeholder="e.g. Coffee"
                                />
                            </div>
                            <div>
                                <label className="text-label mb-2 block">Type</label>
                                <select
                                    value={newCategory.type}
                                    onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
                                    className="input"
                                >
                                    <option value="menu">Menu</option>
                                    <option value="drink">Drink</option>
                                    <option value="food">Food</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" className="btn btn-primary btn-sm">
                                Create
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowNewCategoryForm(false);
                                    setNewCategory({ name: '', type: 'menu' });
                                }}
                                className="btn btn-outline btn-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* NEW TOPPING FORM */}
            {activeTab === 'toppings' && showNewToppingForm && (
                <div className="card mb-6 bg-neutral-50 border border-primary">
                    <form onSubmit={handleCreateTopping} className="space-y-4">
                        <h3 className="font-bold text-sm uppercase tracking-wider">Create New Topping</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-label mb-2 block">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newTopping.name}
                                    onChange={(e) => setNewTopping({ ...newTopping, name: e.target.value })}
                                    className="input"
                                    placeholder="e.g. Extra Shot"
                                />
                            </div>
                            <div>
                                <label className="text-label mb-2 block">Price (VND)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={newTopping.price}
                                    onChange={(e) => setNewTopping({ ...newTopping, price: Number(e.target.value) })}
                                    className="input"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" className="btn btn-primary btn-sm">
                                Create
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowNewToppingForm(false);
                                    setNewTopping({ name: '', price: 0 });
                                }}
                                className="btn btn-outline btn-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (
                <div className="card p-0 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-neutral-500 text-sm font-medium uppercase tracking-wider">
                            Loading products...
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="p-12 text-center text-neutral-500 text-sm font-medium uppercase tracking-wider">
                            No products found
                        </div>
                    ) : (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-neutral-100 border border-border flex items-center justify-center flex-shrink-0">
                                                    <Coffee size={20} className="text-neutral-400" strokeWidth={1.5} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-sm text-foreground truncate uppercase tracking-tight">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-xs text-neutral-500 truncate mt-1 font-medium">
                                                        {product.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge-neutral">{product.category}</span>
                                        </td>
                                        <td>
                                            <div className="flex gap-1.5">
                                                {product.isPopular && <span className="badge badge-warning">Popular</span>}
                                                {product.isNew && <span className="badge badge-success">New</span>}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/products/${product.id}/edit`}
                                                    className="btn btn-sm btn-outline px-2 border-neutral-200 hover:border-primary text-neutral-500 hover:text-primary"
                                                >
                                                    <Edit2 size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id)}
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
            )}

            {/* CATEGORIES TAB */}
            {activeTab === 'categories' && (
                <div className="card p-0 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-neutral-500 text-sm font-medium uppercase tracking-wider">
                            Loading categories...
                        </div>
                    ) : filteredCategories.length === 0 ? (
                        <div className="p-12 text-center text-neutral-500 text-sm font-medium uppercase tracking-wider">
                            No categories found
                        </div>
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
                                            <span className="font-bold text-sm">{category.name}</span>
                                        </td>
                                        <td>
                                            <span className="badge badge-neutral">{category.type}</span>
                                        </td>
                                        <td>
                                            <code className="text-xs font-mono text-neutral-500">{category.id}</code>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleDeleteCategory(category.id)}
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
            )}

            {/* TOPPINGS TAB */}
            {activeTab === 'toppings' && (
                <div className="card p-0 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-neutral-500 text-sm font-medium uppercase tracking-wider">
                            Loading toppings...
                        </div>
                    ) : filteredToppings.length === 0 ? (
                        <div className="p-12 text-center text-neutral-500 text-sm font-medium uppercase tracking-wider">
                            No toppings found
                        </div>
                    ) : (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Available</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredToppings.map((topping) => (
                                    <tr key={topping.id}>
                                        <td>
                                            <span className="font-bold text-sm">{topping.name}</span>
                                        </td>
                                        <td>
                                            <span className="font-mono text-sm font-bold tracking-tight">
                                                {formatPrice(topping.price)}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${topping.is_available ? 'badge-success' : 'badge-danger'}`}>
                                                {topping.is_available ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleDeleteTopping(topping.id)}
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
            )}
        </div>
    );
}
