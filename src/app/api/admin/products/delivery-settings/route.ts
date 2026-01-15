import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET/PUT /api/admin/products/delivery-settings
 * 
 * Admin management of product delivery settings.
 * Per spec: Set is_deliverable, best_in_store per product.
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
 * GET /api/admin/products/delivery-settings
 * List products with their delivery settings
 */
export async function GET(request: Request) {
    const { authorized, error: authError } = await verifyAdmin(request);
    if (!authorized) {
        return NextResponse.json({ error: authError }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');
        const deliverableOnly = searchParams.get('deliverableOnly') === 'true';
        const bestInStoreOnly = searchParams.get('bestInStoreOnly') === 'true';

        let query = supabaseAdmin
            .from('products')
            .select(`
                id,
                name,
                image,
                category_id,
                is_available,
                is_deliverable,
                best_in_store,
                delivery_notes,
                categories:category_id (id, name)
            `)
            .order('name', { ascending: true });

        if (categoryId) {
            query = query.eq('category_id', categoryId);
        }
        if (deliverableOnly) {
            query = query.eq('is_deliverable', true);
        }
        if (bestInStoreOnly) {
            query = query.eq('best_in_store', true);
        }

        const { data: products, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Group by category for easier admin view
        const byCategory: Record<string, any[]> = {};
        (products || []).forEach((p: any) => {
            const catName = p.categories?.name || 'Uncategorized';
            if (!byCategory[catName]) {
                byCategory[catName] = [];
            }
            byCategory[catName].push({
                id: p.id,
                name: p.name,
                image: p.image,
                isDeliverable: p.is_deliverable,
                bestInStore: p.best_in_store,
                deliveryNotes: p.delivery_notes,
                isAvailable: p.is_available
            });
        });

        return NextResponse.json({ 
            products: products || [],
            byCategory,
            total: products?.length || 0
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * PUT /api/admin/products/delivery-settings
 * Update delivery settings for a product or batch of products
 */
export async function PUT(request: Request) {
    const { authorized, error: authError } = await verifyAdmin(request);
    if (!authorized) {
        return NextResponse.json({ error: authError }, { status: 401 });
    }

    try {
        const body = await request.json();
        
        // Support single product or batch update
        const updates = Array.isArray(body) ? body : [body];
        
        const results = {
            updated: 0,
            failed: 0,
            errors: [] as string[]
        };

        for (const update of updates) {
            const { id, is_deliverable, best_in_store, delivery_notes } = update;

            if (!id) {
                results.failed++;
                results.errors.push('Product ID is required');
                continue;
            }

            const productUpdate: Record<string, any> = {};
            
            if (is_deliverable !== undefined) {
                productUpdate.is_deliverable = Boolean(is_deliverable);
            }
            if (best_in_store !== undefined) {
                productUpdate.best_in_store = Boolean(best_in_store);
            }
            if (delivery_notes !== undefined) {
                productUpdate.delivery_notes = delivery_notes ? String(delivery_notes).slice(0, 500) : null;
            }

            if (Object.keys(productUpdate).length === 0) {
                results.failed++;
                results.errors.push(`No valid updates for product ${id}`);
                continue;
            }

            const { error } = await supabaseAdmin
                .from('products')
                .update(productUpdate)
                .eq('id', id);

            if (error) {
                results.failed++;
                results.errors.push(`Product ${id}: ${error.message}`);
            } else {
                results.updated++;
            }
        }

        return NextResponse.json({
            success: results.failed === 0,
            updated: results.updated,
            failed: results.failed,
            errors: results.errors.length > 0 ? results.errors : undefined
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
