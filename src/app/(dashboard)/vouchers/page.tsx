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
            <div className="flex items-center justify-between page-header">
                <div>
                    <h1 className="page-title">Vouchers</h1>
                    <p className="page-subtitle">Manage discount codes</p>
                </div>
                <Link href="/vouchers/new" className="btn btn-primary">
                    <Plus size={16} />
                    Add Voucher
                </Link>
            </div>

            {/* Vouchers Table */}
            <div className="card p-0 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-neutral-500 text-sm font-medium uppercase tracking-wider">Loading vouchers...</div>
                ) : vouchers.length === 0 ? (
                    <div className="p-12 text-center text-neutral-500 text-sm font-medium uppercase tracking-wider">No vouchers found</div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Discount</th>
                                <th>Min Order</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {vouchers.map((voucher) => (
                                <tr key={voucher.code}>
                                    <td>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-neutral-100 border border-neutral-200 flex items-center justify-center flex-shrink-0 text-primary">
                                                <Tag size={18} strokeWidth={2} />
                                            </div>
                                            <span className="font-mono font-bold text-sm text-foreground tracking-tight">
                                                {voucher.code}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="font-mono font-bold text-primary tracking-tight">
                                            {voucher.discountPercent
                                                ? `${voucher.discountPercent}%`
                                                : voucher.discount
                                                    ? formatPrice(voucher.discount)
                                                    : '—'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="font-mono text-sm tracking-tight text-neutral-600">
                                            {formatPrice(voucher.minOrder)}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="badge badge-success">
                                            <Check size={10} strokeWidth={3} className="mr-1" />
                                            Active
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/vouchers/${voucher.code}/edit`}
                                                className="btn btn-sm btn-outline px-2 border-neutral-200 hover:border-primary text-neutral-500 hover:text-primary"
                                            >
                                                <Edit2 size={14} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(voucher.code)}
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
