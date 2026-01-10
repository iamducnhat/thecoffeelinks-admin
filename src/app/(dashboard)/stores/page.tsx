'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, MapPin, Clock, Phone } from 'lucide-react';

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

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/stores`);
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

    if (loading) return <div className="p-8">Loading stores...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-serif text-[#1a2e1a]">Store Locations</h1>
                    <p className="text-gray-500">Manage your coffee shop chain</p>
                </div>
                <Link
                    href="/stores/new"
                    className="bg-[#1a2e1a] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#2a4e2a] transition-colors"
                >
                    <Plus size={20} />
                    Add Store
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stores.map((store) => (
                    <Link
                        key={store.id}
                        href={`/stores/${store.id}`}
                        className="group bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 p-2 ${store.is_active ? 'text-green-600' : 'text-red-500'}`}>
                            <div className="text-xs font-bold uppercase tracking-wider border border-current px-2 py-0.5 rounded-full">
                                {store.is_active ? 'Open' : 'Closed'}
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-[#1a2e1a] mb-4 group-hover:text-[#c6a87c] transition-colors">
                            {store.name}
                        </h3>

                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-[#c6a87c] mt-0.5 shrink-0" />
                                <span>{store.address}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Phone size={18} className="text-[#c6a87c] shrink-0" />
                                <span>{store.phone || 'No phone'}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Clock size={18} className="text-[#c6a87c] shrink-0" />
                                <span>{store.opening_time?.slice(0, 5)} - {store.closing_time?.slice(0, 5)}</span>
                            </div>
                        </div>
                    </Link>
                ))}

                {stores.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <MapPin size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-lg">No stores found</p>
                        <p className="text-sm">Add your first location to get started</p>
                    </div>
                )}
            </div>
        </div>
    );
}
