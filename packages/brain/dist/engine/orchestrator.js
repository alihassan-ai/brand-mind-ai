import OpenAI from 'openai';
import { prisma } from '@brandmind/shared';
import { getTopProducts } from './metrics';
import { compileBrandDNA, generateBrandSystemPrompt } from '../compiler';
// OpenAI client is initialized lazily within functions to ensure 
// environment variables (OPENAI_API_KEY) are loaded before usage.
export async function explainRecommendation(shopId, candidate) {
    const openai = new OpenAI();
    const memory = await prisma.businessMemorySnapshot.findFirst({
        where: { shopId },
        orderBy: { date: 'desc' },
    });
    const activeGoal = await prisma.goal.findFirst({
        where: { shopId },
        orderBy: { createdAt: 'desc' },
    });
    const prompt = `
    You are Antigravity, a business decision OS. 
    Explain this ${candidate.type} to a merchant.
    
    Candidate Data:
    ${JSON.stringify(candidate, null, 2)}
    
    Business Profile:
    ${JSON.stringify((memory === null || memory === void 0 ? void 0 : memory.snapshot) || {}, null, 2)}
    
    Current Goal:
    ${JSON.stringify(activeGoal || {}, null, 2)}
    
    Response format:
    - Why this matters (1-2 sentences)
    - Evidence highlights (bullet points)
    - Recommended test/next step
    - Assumptions made
  `;
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'system', content: prompt }],
        temperature: 0.7,
    });
    return response.choices[0].message.content;
}
export async function askTheBusiness(shopId, question) {
    const openai = new OpenAI();
    // Get Brand DNA for system prompt
    const brandDNA = await compileBrandDNA(shopId);
    const brandSystemPrompt = brandDNA ? generateBrandSystemPrompt(brandDNA) : 'You are Antigravity, an AI assistant for Shopify merchants.';
    // Enhanced RAG: pull latest metrics, memory, top products, and recent alerts
    const memory = await prisma.businessMemorySnapshot.findFirst({
        where: { shopId },
        orderBy: { date: 'desc' },
    });
    const metrics = await prisma.dailyMetric.findMany({
        where: { shopId },
        orderBy: { date: 'desc' },
        take: 7,
    });
    // Get top-selling products for product-specific questions
    const topProducts = await getTopProducts(shopId, 10);
    // Get recent refunds for quality-related questions
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const recentRefunds = await prisma.refund.findMany({
        where: {
            order: { shopId },
            createdAt: { gte: last7Days },
        },
        include: {
            order: {
                include: { lineItems: true },
            },
        },
        take: 20,
    });
    const refundSummary = recentRefunds.map((r) => ({
        amount: Number(r.amount),
        date: r.createdAt.toISOString().split('T')[0],
        products: r.order.lineItems.map((li) => li.title).join(', '),
    }));
    // Get active goal for context
    const activeGoal = await prisma.goal.findFirst({
        where: { shopId },
        orderBy: { createdAt: 'desc' },
    });
    const userPrompt = `
=== RECENT DAILY METRICS (Last 7 Days) ===
${metrics.map((m) => `${m.date.toISOString().split('T')[0]}: Revenue $${Number(m.netRevenue).toFixed(2)}, Orders: ${m.orderCount}, AOV: $${Number(m.aov).toFixed(2)}, Refunds: $${Number(m.refundAmount).toFixed(2)}`).join('\n')}

=== TOP SELLING PRODUCTS (Last 30 Days) ===
${topProducts.map((p, i) => `${i + 1}. ${p.productTitle} ${p.variantTitle ? `(${p.variantTitle})` : ''}: $${p.revenue.toFixed(2)} revenue, ${p.unitsSold} units`).join('\n')}

=== RECENT REFUNDS (Last 7 Days) ===
${refundSummary.length > 0 ? refundSummary.map(r => `${r.date}: $${r.amount.toFixed(2)} - Products: ${r.products}`).join('\n') : 'No refunds in the last 7 days'}

=== CURRENT BUSINESS GOAL ===
${activeGoal ? `${activeGoal.type} - Priority: ${activeGoal.priority}` : 'No goal set'}

=== MERCHANT QUESTION ===
${question}

=== RULES ===
- Only use the data provided above.
- If you don't have the data to answer, say so clearly.
- Cite specific numbers when possible.
- Keep responses concise and actionable.
- Align your response with the brand's identity and voice.
  `;
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            { role: 'system', content: brandSystemPrompt },
            { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
    });
    return response.choices[0].message.content;
}
