import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET/PUT /api/admin/config
 * 
 * Admin management of system configuration.
 * Per spec: Popularity rules, undo window duration, etc.
 * Some settings are LOCKED and cannot be modified.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

// Verify admin access
async function verifyAdmin(request: Request): Promise<{ authorized: boolean; userId?: string; error?: string }> {
    const adminKey = request.headers.get('X-Admin-Key');
    const adminSecret = process.env.ADMIN_SECRET;

    if (adminKey && adminSecret && adminKey === adminSecret) {
        return { authorized: true, userId: 'system-admin' };
    }

    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        try {
            const { data, error } = await supabaseAdmin.auth.getUser(token);
            if (!error && data.user) {
                const role = data.user.app_metadata?.role || data.user.user_metadata?.role;
                if (role === 'admin') {
                    return { authorized: true, userId: data.user.id };
                }
            }
        } catch { }
    }

    return { authorized: false, error: 'Admin access required' };
}

/**
 * GET /api/admin/config
 * List all configuration settings
 */
export async function GET(request: Request) {
    const { authorized, error: authError } = await verifyAdmin(request);
    if (!authorized) {
        return NextResponse.json({ error: authError }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        let query = supabaseAdmin
            .from('system_config')
            .select('*')
            .order('category', { ascending: true })
            .order('key', { ascending: true });

        if (category) {
            query = query.eq('category', category);
        }

        const { data: configs, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Group by category
        const byCategory: Record<string, any[]> = {};
        (configs || []).forEach((c: any) => {
            const cat = c.category || 'general';
            if (!byCategory[cat]) {
                byCategory[cat] = [];
            }
            byCategory[cat].push({
                key: c.key,
                value: c.value,
                description: c.description,
                isLocked: c.is_locked,
                minValue: c.min_value,
                maxValue: c.max_value,
                updatedAt: c.updated_at
            });
        });

        return NextResponse.json({ 
            configs: configs || [],
            byCategory,
            categories: Object.keys(byCategory)
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * PUT /api/admin/config
 * Update configuration settings
 */
export async function PUT(request: Request) {
    const { authorized, userId, error: authError } = await verifyAdmin(request);
    if (!authorized) {
        return NextResponse.json({ error: authError }, { status: 401 });
    }

    try {
        const body = await request.json();
        const updates = Array.isArray(body) ? body : [body];
        
        const results = {
            updated: 0,
            failed: 0,
            errors: [] as string[]
        };

        for (const update of updates) {
            const { key, value } = update;

            if (!key) {
                results.failed++;
                results.errors.push('Config key is required');
                continue;
            }

            // Fetch current config to check if locked
            const { data: config } = await supabaseAdmin
                .from('system_config')
                .select('*')
                .eq('key', key)
                .single();

            if (!config) {
                results.failed++;
                results.errors.push(`Config '${key}' not found`);
                continue;
            }

            // Check if locked per spec
            if (config.is_locked) {
                results.failed++;
                results.errors.push(`Config '${key}' is locked and cannot be modified`);
                continue;
            }

            // Validate min/max for numeric values
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
                if (config.min_value !== null) {
                    const minVal = parseFloat(config.min_value);
                    if (numValue < minVal) {
                        results.failed++;
                        results.errors.push(`Config '${key}' value ${numValue} is below minimum ${minVal}`);
                        continue;
                    }
                }
                if (config.max_value !== null) {
                    const maxVal = parseFloat(config.max_value);
                    if (numValue > maxVal) {
                        results.failed++;
                        results.errors.push(`Config '${key}' value ${numValue} is above maximum ${maxVal}`);
                        continue;
                    }
                }
            }

            // Update the config
            const { error: updateError } = await supabaseAdmin
                .from('system_config')
                .update({
                    value: typeof value === 'string' ? value : JSON.stringify(value),
                    updated_at: new Date().toISOString(),
                    updated_by: userId
                })
                .eq('key', key);

            if (updateError) {
                results.failed++;
                results.errors.push(`Config '${key}': ${updateError.message}`);
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
