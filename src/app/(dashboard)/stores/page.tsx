'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search, MapPin, Clock, Phone } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://appcafe-server.vercel.app';

interface Store {
    id: string;
    name: string;
    address: string;
    phone: string;
    opening_time: string;
    closing_time: string;
    is_active: boolean;
}

export default function StoresPage() {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            const res = await fetch(`${API_URL}/api/stores`);
            const data = await res.json();
            if (data.success) {
                setStores(data.stores);
            }
        } catch (error) {
            console.error('Failed to fetch stores:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this store?')) return;

        try {
            await fetch(`${API_URL}/api/stores/${id}`, { method: 'DELETE' });
            setStores(stores.filter(s => s.id !== id));
        } catch (error) {
            console.error('Failed to delete store:', error);
        }
    };

    const filteredStores = stores.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between page-header">
                <div>
                    <h1 className="page-title">Stores</h1>
                    <p className="page-subtitle">Manage your store locations</p>
                </div>
                <Link href="/stores/new" className="btn btn-primary">
                    <Plus size={16} />
                    Add Store
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
                                placeholder="Search stores..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input"
                                style={{ paddingLeft: '2.75rem' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stores Table */}
            <div className="card p-0 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-neutral-500 text-sm font-medium uppercase tracking-wider">Loading stores...</div>
                ) : filteredStores.length === 0 ? (
                    <div className="p-12 text-center text-neutral-500 text-sm font-medium uppercase tracking-wider">No stores found</div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Store</th>
                                <th>Phone</th>
                                <th>Hours</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStores.map((store) => (
                                <tr key={store.id}>
                                    <td>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-neutral-100 border border-border flex items-center justify-center flex-shrink-0">
                                                <MapPin size={20} className="text-neutral-400" strokeWidth={1.5} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-sm text-foreground truncate uppercase tracking-tight">
                                                    {store.name}
                                                </p>
                                                <p className="text-xs text-neutral-500 truncate mt-1 font-medium">
                                                    {store.address}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                                            <Phone size={14} className="text-neutral-400" />
                                            <span className="font-mono">{store.phone || '—'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                                            <Clock size={14} className="text-neutral-400" />
                                            <span className="font-mono">
                                                {store.opening_time?.slice(0, 5)} - {store.closing_time?.slice(0, 5)}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${store.is_active ? 'badge-success' : 'badge-danger'}`}>
                                            {store.is_active ? 'Open' : 'Closed'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/stores/${store.id}`}
                                                className="btn btn-sm btn-outline px-2 border-neutral-200 hover:border-primary text-neutral-500 hover:text-primary"
                                            >
                                                <Edit2 size={14} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(store.id)}
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
