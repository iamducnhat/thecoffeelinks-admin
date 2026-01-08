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
                    <h1 className="text-2xl font-bold text-gray-900">Events</h1>
                    <p className="text-gray-500 mt-1">Manage carousel promotions and events</p>
                </div>
                <Link href="/events/new" className="btn btn-primary">
                    <Plus size={16} />
                    Add Event
                </Link>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full p-8 text-center text-gray-500">Loading...</div>
                ) : events.length === 0 ? (
                    <div className="col-span-full p-8 text-center text-gray-500">No events found</div>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="card overflow-hidden">
                            <div className={`${event.bg} p-6 -m-6 mb-4`}>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                                        {event.type}
                                    </span>
                                    <Calendar size={20} />
                                </div>
                                <h3 className="text-xl font-bold mt-4">{event.title}</h3>
                                <p className="text-sm opacity-80 mt-1">{event.subtitle}</p>
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-4">
                                <Link
                                    href={`/events/${event.id}/edit`}
                                    className="btn btn-outline text-sm py-1.5"
                                >
                                    <Edit2 size={14} />
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(event.id)}
                                    className="btn btn-danger text-sm py-1.5"
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
