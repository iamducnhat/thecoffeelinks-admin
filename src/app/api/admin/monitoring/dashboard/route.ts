import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/admin/monitoring/dashboard
 * 
 * Admin monitoring dashboards per spec:
 * - Undo Usage: undo rate, reasons, time-to-undo
 * - Delivery Performance: ETA accuracy, zone coverage, fee distribution
 * - AI Adoption: source=ai_suggested order %, acceptance rate
 * - Reports Queue: pending count, avg resolution time
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

export async function GET(request: Request) {
    const { authorized, error: authError } = await verifyAdmin(request);
    if (!authorized) {
        return NextResponse.json({ error: authError }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const dashboard = searchParams.get('dashboard') || 'all';
        const days = parseInt(searchParams.get('days') || '7', 10);

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const startDateStr = startDate.toISOString();

        const results: Record<string, any> = {};

        // Undo Usage Dashboard
        if (dashboard === 'all' || dashboard === 'undo') {
            const { data: allOrders } = await supabaseAdmin
                .from('orders')
                .select('id, status, source, created_at, finalized_at, pending_until')
                .gte('created_at', startDateStr);

            const totalOrders = allOrders?.length || 0;
            const cancelledPending = (allOrders || []).filter((o: any) => 
                o.status === 'cancelled' && o.pending_until
            );
            const undoRate = totalOrders > 0 ? (cancelledPending.length / totalOrders * 100).toFixed(2) : 0;

            // Calculate average time to undo
            let avgTimeToUndo = 0;
            if (cancelledPending.length > 0) {
                const times = cancelledPending.map((o: any) => {
                    const created = new Date(o.created_at);
                    const finalized = new Date(o.finalized_at);
                    return (finalized.getTime() - created.getTime()) / 1000;
                }).filter((t: number) => t > 0 && t <= 30);
                avgTimeToUndo = times.length > 0 ? times.reduce((a: number, b: number) => a + b, 0) / times.length : 0;
            }

            results.undoUsage = {
                totalOrders,
                cancelledWithinWindow: cancelledPending.length,
                undoRate: parseFloat(String(undoRate)),
                avgTimeToUndoSeconds: Math.round(avgTimeToUndo * 10) / 10
            };
        }

        // Delivery Performance Dashboard
        if (dashboard === 'all' || dashboard === 'delivery') {
            const { data: deliveryOrders } = await supabaseAdmin
                .from('orders')
                .select('id, delivery_option, delivery_fee, delivery_eta_minutes, status')
                .eq('delivery_option', 'delivery')
                .gte('created_at', startDateStr);

            const totalDelivery = deliveryOrders?.length || 0;
            const completedDelivery = (deliveryOrders || []).filter((o: any) => o.status === 'completed');
            
            const avgFee = totalDelivery > 0
                ? (deliveryOrders || []).reduce((sum: number, o: any) => sum + (o.delivery_fee || 0), 0) / totalDelivery
                : 0;

            const avgEta = totalDelivery > 0
                ? (deliveryOrders || []).reduce((sum: number, o: any) => sum + (o.delivery_eta_minutes || 0), 0) / totalDelivery
                : 0;

            // Zone coverage
            const { data: zones } = await supabaseAdmin
                .from('delivery_zones')
                .select('id, store_id, is_active');

            results.deliveryPerformance = {
                totalDeliveryOrders: totalDelivery,
                completedDeliveryOrders: completedDelivery.length,
                avgDeliveryFee: Math.round(avgFee),
                avgEtaMinutes: Math.round(avgEta),
                activeZones: zones?.filter((z: any) => z.is_active).length || 0,
                totalZones: zones?.length || 0
            };
        }

        // AI Adoption Dashboard
        if (dashboard === 'all' || dashboard === 'ai') {
            const { data: allOrders } = await supabaseAdmin
                .from('orders')
                .select('id, source, status')
                .gte('created_at', startDateStr);

            const totalOrders = allOrders?.length || 0;
            const aiOrders = (allOrders || []).filter((o: any) => o.source === 'ai_suggested');
            const reorderOrders = (allOrders || []).filter((o: any) => o.source === 'reorder');
            const favoriteOrders = (allOrders || []).filter((o: any) => o.source === 'favorite');
            const manualOrders = (allOrders || []).filter((o: any) => o.source === 'manual');

            results.aiAdoption = {
                totalOrders,
                bySource: {
                    ai_suggested: aiOrders.length,
                    reorder: reorderOrders.length,
                    favorite: favoriteOrders.length,
                    manual: manualOrders.length
                },
                aiSuggestedPercent: totalOrders > 0 ? Math.round(aiOrders.length / totalOrders * 100 * 10) / 10 : 0,
                quickOrderPercent: totalOrders > 0 
                    ? Math.round((aiOrders.length + reorderOrders.length + favoriteOrders.length) / totalOrders * 100 * 10) / 10 
                    : 0
            };
        }

        // Reports Queue Dashboard
        if (dashboard === 'all' || dashboard === 'reports') {
            const { data: reports } = await supabaseAdmin
                .from('user_reports')
                .select('id, status, created_at, reviewed_at, reason');

            const pending = (reports || []).filter((r: any) => r.status === 'pending');
            const reviewed = (reports || []).filter((r: any) => r.status === 'reviewed');
            const actioned = (reports || []).filter((r: any) => r.status === 'actioned');
            const dismissed = (reports || []).filter((r: any) => r.status === 'dismissed');

            // Average resolution time (for resolved reports)
            const resolved = (reports || []).filter((r: any) => r.reviewed_at);
            let avgResolutionHours = 0;
            if (resolved.length > 0) {
                const times = resolved.map((r: any) => {
                    const created = new Date(r.created_at);
                    const reviewed = new Date(r.reviewed_at);
                    return (reviewed.getTime() - created.getTime()) / (1000 * 60 * 60);
                });
                avgResolutionHours = times.reduce((a: number, b: number) => a + b, 0) / times.length;
            }

            // By reason
            const byReason: Record<string, number> = {};
            (reports || []).forEach((r: any) => {
                byReason[r.reason] = (byReason[r.reason] || 0) + 1;
            });

            // SLA violations
            const now = new Date();
            const slaViolations = pending.filter((r: any) => {
                const created = new Date(r.created_at);
                return (now.getTime() - created.getTime()) / (1000 * 60 * 60) > 24;
            });

            results.reportsQueue = {
                total: reports?.length || 0,
                byStatus: {
                    pending: pending.length,
                    reviewed: reviewed.length,
                    actioned: actioned.length,
                    dismissed: dismissed.length
                },
                byReason,
                avgResolutionHours: Math.round(avgResolutionHours * 10) / 10,
                slaViolations: slaViolations.length
            };
        }

        return NextResponse.json({
            dashboard,
            period: { days, startDate: startDateStr },
            ...results
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
