import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET/POST/PUT/DELETE /api/admin/delivery-zones
 * 
 * Admin management of delivery zones per store.
 * Per spec: Admins can draw/edit zones on map per store.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

// Verify admin access
async function verifyAdmin(request: Request): Promise<{ authorized: boolean; error?: string }> {
    const adminKey = request.headers.get('X-Admin-Key');
    const adminSecret = process.env.ADMIN_SECRET;

    if (adminKey && adminSecret && adminKey === adminSecret) {
        return { authorized: true };
    }

    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        try {
            const { data, error } = await supabaseAdmin.auth.getUser(token);
            if (!error && data.user) {
                const role = data.user.app_metadata?.role || data.user.user_metadata?.role;
                if (role === 'admin') {
                    return { authorized: true };
                }
            }
        } catch { }
    }

    return { authorized: false, error: 'Admin access required' };
}

/**
 * GET /api/admin/delivery-zones
 * List all delivery zones, optionally filtered by store
 */
export async function GET(request: Request) {
    const { authorized, error: authError } = await verifyAdmin(request);
    if (!authorized) {
        return NextResponse.json({ error: authError }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const storeId = searchParams.get('storeId');

        let query = supabaseAdmin
            .from('delivery_zones')
            .select(`
                *,
                stores:store_id (id, name, address)
            `)
            .order('created_at', { ascending: false });

        if (storeId) {
            query = query.eq('store_id', storeId);
        }

        const { data: zones, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ zones: zones || [] });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * POST /api/admin/delivery-zones
 * Create a new delivery zone
 */
export async function POST(request: Request) {
    const { authorized, error: authError } = await verifyAdmin(request);
    if (!authorized) {
        return NextResponse.json({ error: authError }, { status: 401 });
    }

    try {
        const body = await request.json();
        const {
            store_id,
            name,
            polygon, // GeoJSON or WKT format
            base_fee,
            per_km_fee,
            max_distance_km,
            min_order_amount,
            estimated_minutes_base,
            estimated_minutes_per_km,
            is_active,
            priority
        } = body;

        if (!store_id) {
            return NextResponse.json({ error: 'store_id is required' }, { status: 400 });
        }

        // Verify store exists
        const { data: store } = await supabaseAdmin
            .from('stores')
            .select('id')
            .eq('id', store_id)
            .single();

        if (!store) {
            return NextResponse.json({ error: 'Store not found' }, { status: 404 });
        }

        const { data: zone, error } = await supabaseAdmin
            .from('delivery_zones')
            .insert({
                store_id,
                name: name || null,
                polygon: polygon || null,
                base_fee: base_fee || 0,
                per_km_fee: per_km_fee || 0,
                max_distance_km: max_distance_km || 10,
                min_order_amount: min_order_amount || 0,
                estimated_minutes_base: estimated_minutes_base || 30,
                estimated_minutes_per_km: estimated_minutes_per_km || 5,
                is_active: is_active !== false,
                priority: priority || 0
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, zone }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * PUT /api/admin/delivery-zones
 * Update a delivery zone
 */
export async function PUT(request: Request) {
    const { authorized, error: authError } = await verifyAdmin(request);
    if (!authorized) {
        return NextResponse.json({ error: authError }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'Zone ID is required' }, { status: 400 });
        }

        const allowedFields = [
            'name', 'polygon', 'base_fee', 'per_km_fee', 'max_distance_km',
            'min_order_amount', 'estimated_minutes_base', 'estimated_minutes_per_km',
            'is_active', 'priority'
        ];

        const sanitizedUpdates: Record<string, any> = {};
        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                sanitizedUpdates[field] = updates[field];
            }
        }

        const { data: zone, error } = await supabaseAdmin
            .from('delivery_zones')
            .update(sanitizedUpdates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, zone });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/delivery-zones
 * Delete a delivery zone
 */
export async function DELETE(request: Request) {
    const { authorized, error: authError } = await verifyAdmin(request);
    if (!authorized) {
        return NextResponse.json({ error: authError }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Zone ID is required' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('delivery_zones')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
