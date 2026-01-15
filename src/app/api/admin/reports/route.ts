import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/admin/reports
 * PUT /api/admin/reports (update status)
 * 
 * Admin management of user reports.
 * Per spec: SLA <24h, statuses: pending, reviewed, actioned, dismissed
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

const VALID_STATUSES = ['pending', 'reviewed', 'actioned', 'dismissed'] as const;

/**
 * GET /api/admin/reports
 * List reports with filtering
 */
export async function GET(request: Request) {
    const { authorized, error: authError } = await verifyAdmin(request);
    if (!authorized) {
        return NextResponse.json({ error: authError }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const limit = parseInt(searchParams.get('limit') || '50', 10);
        const offset = parseInt(searchParams.get('offset') || '0', 10);

        let query = supabaseAdmin
            .from('user_reports')
            .select(`
                *,
                reporter:reporter_id (id, full_name, email, avatar_url),
                reported_user:reported_user_id (id, full_name, email, avatar_url),
                reviewer:reviewed_by (id, full_name)
            `, { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (status && VALID_STATUSES.includes(status as any)) {
            query = query.eq('status', status);
        }

        const { data: reports, count, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Calculate SLA violations
        const now = new Date();
        const reportsWithSLA = (reports || []).map((r: any) => {
            const createdAt = new Date(r.created_at);
            const hoursAgo = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
            return {
                ...r,
                hoursAgo: Math.round(hoursAgo * 10) / 10,
                slaViolation: r.status === 'pending' && hoursAgo > 24
            };
        });

        // Stats summary
        const pendingCount = (reports || []).filter((r: any) => r.status === 'pending').length;
        const slaViolations = reportsWithSLA.filter((r: any) => r.slaViolation).length;

        return NextResponse.json({
            reports: reportsWithSLA,
            pagination: {
                total: count || 0,
                limit,
                offset,
                hasMore: count ? offset + limit < count : false
            },
            stats: {
                pending: pendingCount,
                slaViolations
            }
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * PUT /api/admin/reports
 * Update report status
 */
export async function PUT(request: Request) {
    const { authorized, userId, error: authError } = await verifyAdmin(request);
    if (!authorized) {
        return NextResponse.json({ error: authError }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, status, resolution_notes } = body;

        if (!id) {
            return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });
        }

        if (!status || !VALID_STATUSES.includes(status)) {
            return NextResponse.json({ 
                error: `Invalid status. Valid options: ${VALID_STATUSES.join(', ')}` 
            }, { status: 400 });
        }

        // Verify report exists
        const { data: existing } = await supabaseAdmin
            .from('user_reports')
            .select('id, status')
            .eq('id', id)
            .single();

        if (!existing) {
            return NextResponse.json({ error: 'Report not found' }, { status: 404 });
        }

        const updateData: Record<string, any> = {
            status,
            reviewed_at: new Date().toISOString(),
            reviewed_by: userId
        };

        if (resolution_notes) {
            updateData.resolution_notes = String(resolution_notes).slice(0, 1000);
        }

        const { data: updatedReport, error: updateError } = await supabaseAdmin
            .from('user_reports')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            report: updatedReport
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
