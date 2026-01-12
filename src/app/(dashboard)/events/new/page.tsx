'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Calendar } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://appcafe-server.vercel.app';

const eventTypes = ['Event', 'Promotion', 'New', 'Special'];
const bgOptions = [
    { value: '', label: 'Auto (Cycle Theme)' },
    { value: 'from-amber-900 via-amber-800 to-amber-950', label: 'Coffee Rich' },
    { value: 'from-emerald-900 via-emerald-800 to-emerald-950', label: 'Emerald' },
    { value: 'from-purple-900 via-indigo-900 to-slate-900', label: 'Midnight' },
    { value: 'from-rose-900 via-red-800 to-rose-950', label: 'Rose' },
    { value: 'from-neutral-900 via-neutral-800 to-black', label: 'Obsidian' },
];
const iconOptions = ['Calendar', 'Tag', 'Gift', 'Sparkles', 'Percent'];

export default function NewEventPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        type: 'Event',
        title: '',
        subtitle: '',
        bg: '',
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
                    id: Date.now(), // Temporary ID, server usually handles this but mimicking existing logic
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
            <div className="flex items-center gap-5 page-header">
                <Link
                    href="/events"
                    className="w-10 h-10 flex items-center justify-center border border-border hover:border-primary hover:text-primary transition-all rounded-full"
                >
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="page-title">Add Event</h1>
                    <p className="page-subtitle">Create a new carousel promotion</p>
                </div>
            </div>

            {/* Preview */}
            <div className="mb-8">
                <p className="text-sm font-medium text-neutral-500 mb-3 uppercase tracking-wide">Preview</p>
                <div className={`p-6 max-w-sm rounded-[24px] overflow-hidden relative shadow-xl bg-gradient-to-r ${form.bg || 'from-amber-900 via-amber-800 to-amber-950'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Calendar size={100} />
                    </div>

                    <div className="relative z-10 text-white">
                        <span className="inline-block px-2 py-1 bg-white/10 backdrop-blur-md rounded-md text-[10px] font-bold uppercase tracking-[0.15em] border border-white/20 mb-4">
                            {form.type}
                        </span>

                        <h3 className="text-2xl font-serif leading-tight mb-2 drop-shadow-sm">
                            {form.title || 'Event Title'}
                        </h3>
                        <p className="text-sm opacity-80 font-medium tracking-wide">
                            {form.subtitle || 'Event subtitle'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="card p-6 bg-white shadow-sm border border-neutral-200 rounded-xl">
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="text-sm font-bold text-neutral-700 mb-2 block">Event Type</label>
                            <select
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                                className="w-full h-10 px-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all"
                            >
                                {eventTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-neutral-700 mb-2 block">Icon</label>
                            <select
                                value={form.icon}
                                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                                className="w-full h-10 px-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all"
                            >
                                {iconOptions.map(icon => (
                                    <option key={icon} value={icon}>{icon}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="text-sm font-bold text-neutral-700 mb-2 block">Title</label>
                        <input
                            type="text"
                            required
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full h-10 px-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all"
                            placeholder="e.g. 50% OFF Second Cup"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="text-sm font-bold text-neutral-700 mb-2 block">Subtitle</label>
                        <input
                            type="text"
                            required
                            value={form.subtitle}
                            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                            className="w-full h-10 px-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all"
                            placeholder="e.g. Valid until Sunday"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-bold text-neutral-700 mb-2 block">Background Style</label>
                        <select
                            value={form.bg}
                            onChange={(e) => setForm({ ...form, bg: e.target.value })}
                            className="w-full h-10 px-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all"
                        >
                            {bgOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex gap-4 mt-8">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 bg-neutral-900 text-white font-bold uppercase tracking-wider text-sm rounded-lg hover:bg-black transition-colors shadow-lg flex items-center gap-2"
                    >
                        <Save size={16} />
                        {saving ? 'Saving...' : 'Save Event'}
                    </button>
                    <Link
                        href="/events"
                        className="px-6 py-3 bg-white text-neutral-600 border border-neutral-200 font-bold uppercase tracking-wider text-sm rounded-lg hover:border-neutral-400 transition-colors"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
