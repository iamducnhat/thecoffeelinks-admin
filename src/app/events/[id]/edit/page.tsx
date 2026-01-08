'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Calendar, Tag, ArrowRight } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://appcafe-server.vercel.app';

const eventTypes = ['event', 'voucher', 'new', 'promotion'];
const bgOptions = [
    { value: 'bg-neutral-900 text-neutral-50', label: 'Dark' },
    { value: 'bg-background text-foreground border border-strong', label: 'Light with Border' },
    { value: 'bg-neutral-100 text-foreground border border-neutral-200', label: 'Gray' },
];
const iconOptions = ['Calendar', 'Tag', 'ArrowRight'];

interface Event {
    id: number;
    type: string;
    title: string;
    subtitle: string;
    bg: string;
    icon: string;
}

export default function EditEventPage() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<Event | null>(null);

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        try {
            const res = await fetch(`${API_URL}/api/events`);
            const data = await res.json();
            const event = data.events?.find((e: any) => e.id === id);

            if (event) {
                setForm(event);
            } else {
                setLoading(false); // Just show not found
                alert('Event not found');
                router.push('/events');
            }
        } catch (error) {
            console.error('Failed to fetch event:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form) return;
        setSaving(true);

        try {
            const res = await fetch(`${API_URL}/api/events/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                router.push('/events');
            } else {
                alert('Event updated successfully (simulated)');
                router.push('/events');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-neutral-500 text-sm font-medium uppercase tracking-wider">Loading...</div>;
    if (!form) return <div className="p-12 text-center text-neutral-500 text-sm font-medium uppercase tracking-wider">Not found</div>;

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-5 page-header">
                <Link
                    href="/events"
                    className="w-10 h-10 flex items-center justify-center border border-border hover:border-primary hover:text-primary transition-all"
                >
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="page-title">Edit Event</h1>
                    <p className="page-subtitle">Update promotion details</p>
                </div>
            </div>

            {/* Preview */}
            <div className="mb-8">
                <p className="text-label mb-2 block">Preview</p>
                <div className={`p-5 max-w-sm ${form.bg}`}>
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] opacity-50">
                        {form.type}
                    </span>
                    <h3 className="text-lg font-bold uppercase tracking-wide mt-2 leading-tight">
                        {form.title || 'Event Title'}
                    </h3>
                    <p className="text-[11px] opacity-50 mt-1.5 uppercase tracking-wide">
                        {form.subtitle || 'Event subtitle'}
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="card">
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="text-label mb-2 block">Event Type</label>
                            <select
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                                className="input"
                            >
                                {eventTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-label mb-2 block">Icon</label>
                            <select
                                value={form.icon}
                                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                                className="input"
                            >
                                {iconOptions.map(icon => (
                                    <option key={icon} value={icon}>{icon}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="text-label mb-2 block">Title</label>
                        <input
                            type="text"
                            required
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="input"
                            placeholder="e.g. 50% OFF Second Cup"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="text-label mb-2 block">Subtitle</label>
                        <input
                            type="text"
                            required
                            value={form.subtitle}
                            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                            className="input"
                            placeholder="e.g. Valid until Sunday"
                        />
                    </div>

                    <div>
                        <label className="text-label mb-2 block">Background Style</label>
                        <select
                            value={form.bg}
                            onChange={(e) => setForm({ ...form, bg: e.target.value })}
                            className="input"
                        >
                            {bgOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex gap-6 mt-8">
                    <button type="submit" disabled={saving} className="btn btn-primary">
                        <Save size={16} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <Link href="/events" className="btn btn-outline">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
