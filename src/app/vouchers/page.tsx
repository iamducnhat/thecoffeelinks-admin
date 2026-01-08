'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Tag, Check } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://appcafe-server.vercel.app';

interface Voucher {
    code: string;
    discountPercent?: number;
    discount?: number;
    type?: 'percentage' | 'fixed';
    minOrder: number;
    maxDiscount?: number;
    description?: string;
    isActive?: boolean;
}

export default function VouchersPage() {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        try {
            const res = await fetch(`${API_URL}/api/vouchers`);
            const data = await res.json();
            setVouchers(data.vouchers || []);
        } catch (error) {
            console.error('Failed to fetch vouchers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (code: string) => {
        if (!confirm('Are you sure you want to delete this voucher?')) return;

        try {
            await fetch(`${API_URL}/api/vouchers/${code}`, { method: 'DELETE' });
            setVouchers(vouchers.filter(v => v.code !== code));
        } catch (error) {
            console.error('Failed to delete voucher:', error);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-xl font-bold uppercase tracking-widest text-foreground">Vouchers</h1>
                    <p className="text-xs uppercase tracking-wider text-neutral-500 mt-1">
                        Manage discount codes
                    </p>
                </div>
                <Link href="/vouchers/new" className="btn btn-primary">
                    <Plus size={14} />
                    Add Voucher
                </Link>
            </div>

            {/* Vouchers Table */}
            <div className="card p-0 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-neutral-500 text-xs uppercase tracking-wider">
                        Loading...
                    </div>
                ) : vouchers.length === 0 ? (
                    <div className="p-8 text-center text-neutral-500 text-xs uppercase tracking-wider">
                        No vouchers found
                    </div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Discount</th>
                                <th>Min Order</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vouchers.map((voucher) => (
                                <tr key={voucher.code}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center">
                                                <Tag size={16} className="text-primary" />
                                            </div>
                                            <span className="font-mono font-bold text-sm uppercase tracking-wide text-foreground">
                                                {voucher.code}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="font-mono font-bold text-primary">
                                            {voucher.discountPercent
                                                ? `${voucher.discountPercent}%`
                                                : voucher.discount
                                                    ? formatPrice(voucher.discount)
                                                    : '-'}
                                        </span>
                                    </td>
                                    <td className="font-mono text-sm">{formatPrice(voucher.minOrder)}</td>
                                    <td>
                                        <span className="badge badge-success">
                                            <Check size={10} className="mr-1" />
                                            Active
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/vouchers/${voucher.code}/edit`}
                                                className="p-2 text-neutral-400 hover:text-primary transition-colors"
                                            >
                                                <Edit2 size={14} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(voucher.code)}
                                                className="p-2 text-neutral-400 hover:text-danger transition-colors"
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
