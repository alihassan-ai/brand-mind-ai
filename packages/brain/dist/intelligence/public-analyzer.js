import OpenAI from 'openai';
import * as cheerio from 'cheerio';
export async function analyzePublicDomain(domain) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    console.log(`[PublicAnalyzer] Starting analysis for: ${domain}`);
    // Ensure domain has protocol
    const url = domain.startsWith('http') ? domain : `https://${domain}`;
    try {
        // 1. Scraping Layer
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to access site: ${response.statusText}`);
        }
        const html = await response.text();
        const $ = cheerio.load(html);
        // Extract metadata and basic cues
        const title = $('title').text() || domain;
        const metaDesc = $('meta[name="description"]').attr('content') || '';
        const headings = $('h1, h2').map((_, el) => $(el).text()).get().slice(0, 5).join(', ');
        // 2. Intelligence Layer
        const prompt = `
            You are Antigravity, an AI Executive Business Partner.
            Analyze this public storefront data and provide a strategic executive preview.

            Site Title: ${title}
            Meta Description: ${metaDesc}
            Key Content: ${headings}

            The goal is to wow the merchant with your perception. 
            Identify their likely industry, current market positioning, and a "Next Hit" opportunity.

            Output JSON format:
            {
                "brandName": "string",
                "description": "Short strategic summary (max 20 words)",
                "healthScore": number (1-100),
                "estimatedRevenue": "Estimate string like '$1M - $5M'",
                "topOpportunities": ["Strategic growth lever 1", "Lever 2"],
                "riskSignals": ["Signal 1"],
                "modernityScore": number (1-100)
            }
        `;
        const aiResponse = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'system', content: prompt }],
            response_format: { type: 'json_object' },
            temperature: 0.7,
        });
        const result = JSON.parse(aiResponse.choices[0].message.content || '{}');
        return {
            brandName: result.brandName || title,
            description: result.description || 'Strategic profile identified.',
            healthScore: result.healthScore || 75,
            estimatedRevenue: result.estimatedRevenue || 'High Velocity',
            topOpportunities: result.topOpportunities || ['Optimize catalog architecture'],
            riskSignals: result.riskSignals || ['Market saturation trends'],
            modernityScore: result.modernityScore || 80
        };
    }
    catch (error) {
        console.error(`[PublicAnalyzer] Error: ${error.message}`);
        throw new Error(`Could not analyze ${domain}. Ensure it is a public storefront.`);
    }
}
