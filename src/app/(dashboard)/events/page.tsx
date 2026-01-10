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
                    <Plus size={16} />
                    Add Event
                </Link>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full">
                        <div className="card p-12 text-center text-neutral-500 text-sm font-medium uppercase tracking-wider">
                            Loading events...
                        </div>
                    </div>
                ) : events.length === 0 ? (
                    <div className="col-span-full">
                        <div className="card p-12 text-center text-neutral-500 text-sm font-medium uppercase tracking-wider">
                            No events found
                        </div>
                    </div>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="card p-0 overflow-hidden group hover:border-primary transition-colors">
                            <div className="bg-neutral-800 text-neutral-50 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
                                        {event.type}
                                    </span>
                                    <Calendar size={16} className="opacity-40" />
                                </div>
                                <h3 className="text-xl font-bold uppercase tracking-wide leading-none mb-2">
                                    {event.title}
                                </h3>
                                <p className="text-xs opacity-60 uppercase tracking-widest font-medium">
                                    {event.subtitle}
                                </p>
                            </div>
                            <div className="flex items-center justify-end gap-3 p-4 bg-background border-t border-border">
                                <Link
                                    href={`/events/${event.id}/edit`}
                                    className="btn btn-sm btn-outline border-neutral-200 hover:border-primary text-neutral-600 hover:text-primary"
                                >
                                    <Edit2 size={14} />
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(event.id)}
                                    className="btn btn-sm btn-outline border-neutral-200 hover:border-danger text-neutral-600 hover:text-danger hover:bg-red-50"
                                >
                                    <Trash2 size={14} />
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
