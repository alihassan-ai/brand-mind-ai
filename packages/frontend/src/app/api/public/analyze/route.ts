import { NextRequest, NextResponse } from 'next/server';
import { analyzePublicDomain } from '@brandmind/brain';

export async function POST(req: NextRequest) {
    try {
        const { domain } = await req.json();

        if (!domain) {
            return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
        }

        const analysis = await analyzePublicDomain(domain);
        return NextResponse.json(analysis);

    } catch (error: any) {
        console.error('[PublicAPI] Analysis failed:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
