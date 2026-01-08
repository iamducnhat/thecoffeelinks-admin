'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://appcafe-server.vercel.app';

const eventTypes = ['event', 'voucher', 'new', 'promotion'];
const bgOptions = [
    { value: 'bg-neutral-900 text-neutral-50', label: 'Dark' },
    { value: 'bg-background text-foreground border border-strong', label: 'Light with Border' },
    { value: 'bg-neutral-100 text-foreground border border-neutral-200', label: 'Gray' },
    { value: 'bg-blue-600 text-white', label: 'Blue' },
    { value: 'bg-green-600 text-white', label: 'Green' },
    { value: 'bg-purple-600 text-white', label: 'Purple' },
];
const iconOptions = ['Calendar', 'Tag', 'ArrowRight'];

export default function NewEventPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        type: 'event',
        title: '',
        subtitle: '',
        bg: 'bg-neutral-900 text-neutral-50',
        icon: 'Calendar',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`${API_URL}/api/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    id: Date.now(),
                }),
            });

            if (res.ok) {
                router.push('/events');
            } else {
                alert('Failed to create event');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create event');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/events" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Event</h1>
                    <p className="text-gray-500 mt-1">Create a new carousel promotion</p>
                </div>
            </div>

            {/* Preview */}
            <div className="mb-8">
                <p className="text-sm font-medium text-gray-700 mb-3">Preview</p>
                <div className={`${form.bg} p-6 max-w-md rounded-lg`}>
                    <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                        {form.type}
                    </span>
                    <h3 className="text-2xl font-bold mt-2">{form.title || 'Event Title'}</h3>
                    <p className="text-sm opacity-80 mt-1">{form.subtitle || 'Event subtitle'}</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="card space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label">Event Type *</label>
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
                            <label className="label">Icon</label>
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

                    <div>
                        <label className="label">Title *</label>
                        <input
                            type="text"
                            required
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="input"
                            placeholder="e.g. 50% OFF Second Cup"
                        />
                    </div>

                    <div>
                        <label className="label">Subtitle *</label>
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
                        <label className="label">Background Style</label>
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

                <div className="flex gap-4 mt-6">
                    <button type="submit" disabled={saving} className="btn btn-primary">
                        <Save size={16} />
                        {saving ? 'Saving...' : 'Save Event'}
                    </button>
                    <Link href="/events" className="btn btn-outline">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
