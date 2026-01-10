'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash } from 'lucide-react';
import Link from 'next/link';

interface Store {
    id: string;
    name: string;
    address: string;
    phone: string;
    opening_time: string;
    closing_time: string;
    latitude: number | null;
    longitude: number | null;
    is_active: boolean;
}

export default function StoreEditPage({ params }: { params: { id: string } }) {
    const isNew = params.id === 'new';
    const router = useRouter();
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState<Partial<Store>>({
        name: '',
        address: '',
        phone: '',
        opening_time: '07:00',
        closing_time: '22:00',
        latitude: null,
        longitude: null,
        is_active: true,
    });

    useEffect(() => {
        if (!isNew) {
            fetchStore();
        }
    }, [params.id]);

    const fetchStore = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/stores/${params.id}`);
            const data = await res.json();
            if (data.success) {
                setFormData(data.store);
            }
        } catch (error) {
            console.error('Failed to fetch store:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = isNew
                ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/stores`
                : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/stores/${params.id}`;

            const method = isNew ? 'POST' : 'PUT';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.success) {
                router.push('/stores');
            } else {
                alert(data.error || 'Failed to save store');
            }
        } catch (error) {
            console.error('Error saving store:', error);
            alert('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this store?')) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/stores/${params.id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success) {
                router.push('/stores');
            }
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/stores" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold font-serif text-[#1a2e1a]">
                    {isNew ? 'New Store' : 'Edit Store'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8">
                {/* Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Basic Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Store Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a2e1a]/10"
                                placeholder="e.g. Downtown Branch"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a2e1a]/10"
                                placeholder="+84..."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Address</label>
                        <input
                            type="text"
                            required
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a2e1a]/10"
                            placeholder="Full address..."
                        />
                    </div>
                </div>

                {/* Location & Time */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Location & Hours</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Opening Time</label>
                            <input
                                type="time"
                                value={formData.opening_time}
                                onChange={(e) => setFormData({ ...formData, opening_time: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a2e1a]/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Closing Time</label>
                            <input
                                type="time"
                                value={formData.closing_time}
                                onChange={(e) => setFormData({ ...formData, closing_time: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a2e1a]/10"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Latitude</label>
                            <input
                                type="number"
                                step="any"
                                value={formData.latitude || ''}
                                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || null })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a2e1a]/10"
                                placeholder="10.762..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Longitude</label>
                            <input
                                type="number"
                                step="any"
                                value={formData.longitude || ''}
                                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || null })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a2e1a]/10"
                                placeholder="106.660..."
                            />
                        </div>
                    </div>
                </div>

                {/* Settings */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Settings</h3>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="w-5 h-5 rounded border-gray-300 text-[#1a2e1a] focus:ring-[#1a2e1a]"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                            Store is Active (Open for orders)
                        </label>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 border-t">
                    {!isNew && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                        >
                            <Trash size={18} />
                            Delete Store
                        </button>
                    )}
                    <div className="flex items-center gap-4 ml-auto">
                        <Link
                            href="/stores"
                            className="px-6 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 rounded-lg bg-[#1a2e1a] text-white hover:bg-[#2a4e2a] transition-colors flex items-center gap-2"
                        >
                            <Save size={18} />
                            {saving ? 'Saving...' : 'Save Store'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
