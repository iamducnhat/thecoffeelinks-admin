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
                    <div className="loading-state">Loading vouchers...</div>
                ) : vouchers.length === 0 ? (
                    <div className="empty-state">No vouchers found</div>
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
                                            <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                                                <Tag size={16} className="text-primary" />
                                            </div>
                                            <span className="text-mono font-bold text-sm text-foreground">
                                                {voucher.code}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="text-mono font-bold text-primary">
                                            {voucher.discountPercent
                                                ? `${voucher.discountPercent}%`
                                                : voucher.discount
                                                    ? formatPrice(voucher.discount)
                                                    : '—'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="text-mono text-sm">
                                            {formatPrice(voucher.minOrder)}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="badge badge-success">
                                            <Check size={10} />
                                            Active
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/vouchers/${voucher.code}/edit`}
                                                className="action-btn"
                                            >
                                                <Edit2 size={15} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(voucher.code)}
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
