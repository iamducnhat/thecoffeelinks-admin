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
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-xl font-bold uppercase tracking-widest text-foreground">Events</h1>
                    <p className="text-xs uppercase tracking-wider text-neutral-500 mt-1">
                        Manage carousel promotions
                    </p>
                </div>
                <Link href="/events/new" className="btn btn-primary">
                    <Plus size={14} />
                    Add Event
                </Link>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    <div className="col-span-full p-8 text-center text-neutral-500 text-xs uppercase tracking-wider">
                        Loading...
                    </div>
                ) : events.length === 0 ? (
                    <div className="col-span-full p-8 text-center text-neutral-500 text-xs uppercase tracking-wider">
                        No events found
                    </div>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="card p-0 overflow-hidden">
                            <div className="bg-neutral-900 text-neutral-50 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                                        {event.type}
                                    </span>
                                    <Calendar size={16} className="opacity-60" />
                                </div>
                                <h3 className="text-lg font-bold uppercase tracking-wide">{event.title}</h3>
                                <p className="text-xs opacity-60 mt-1 uppercase">{event.subtitle}</p>
                            </div>
                            <div className="flex items-center justify-end gap-2 p-4 border-t border-border">
                                <Link
                                    href={`/events/${event.id}/edit`}
                                    className="btn btn-outline text-xs py-2"
                                >
                                    <Edit2 size={12} />
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(event.id)}
                                    className="btn btn-danger text-xs py-2"
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
