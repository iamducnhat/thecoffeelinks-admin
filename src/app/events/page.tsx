'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://appcafe-server.vercel.app';

interface Event {
    id: number;
    type: string;
    title: string;
    subtitle: string;
    bg: string;
    icon: string;
}

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await fetch(`${API_URL}/api/events`);
            const data = await res.json();
            setEvents(data.events || []);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            await fetch(`${API_URL}/api/events/${id}`, { method: 'DELETE' });
            setEvents(events.filter(e => e.id !== id));
        } catch (error) {
            console.error('Failed to delete event:', error);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between page-header">
                <div>
                    <h1 className="page-title">Events</h1>
                    <p className="page-subtitle">Manage carousel promotions</p>
                </div>
                <Link href="/events/new" className="btn btn-primary">
                    <Plus size={14} />
                    Add Event
                </Link>
            </div>

            {/* Events Grid */}
            <div className="grid-cards">
                {loading ? (
                    <div className="col-span-full">
                        <div className="card">
                            <div className="loading-state">Loading events...</div>
                        </div>
                    </div>
                ) : events.length === 0 ? (
                    <div className="col-span-full">
                        <div className="card">
                            <div className="empty-state">No events found</div>
                        </div>
                    </div>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="card p-0 overflow-hidden">
                            <div className="bg-neutral-900 text-neutral-50 p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] opacity-50">
                                        {event.type}
                                    </span>
                                    <Calendar size={14} className="opacity-40" />
                                </div>
                                <h3 className="text-base font-bold uppercase tracking-wide leading-tight">
                                    {event.title}
                                </h3>
                                <p className="text-[11px] opacity-50 mt-1.5 uppercase tracking-wide">
                                    {event.subtitle}
                                </p>
                            </div>
                            <div className="flex items-center justify-end gap-2 p-4">
                                <Link
                                    href={`/events/${event.id}/edit`}
                                    className="btn btn-sm btn-outline"
                                >
                                    <Edit2 size={12} />
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(event.id)}
                                    className="btn btn-sm btn-danger"
                                >
                                    <Trash2 size={12} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
