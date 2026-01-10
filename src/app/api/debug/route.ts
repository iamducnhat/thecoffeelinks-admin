import { NextResponse } from 'next/server';

export async function GET() {
    const secret = process.env.ADMIN_SECRET;

    return NextResponse.json({
        hasSecret: !!secret,
        secretLength: secret?.length || 0,
        secretPreview: secret ? `${secret.substring(0, 5)}...${secret.substring(secret.length - 5)}` : 'NOT_SET',
        // Check if it has quotes
        startsWithQuote: secret?.startsWith('"') || false,
        endsWithQuote: secret?.endsWith('"') || false,
    });
}
