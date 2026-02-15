import { prisma } from '@brandmind/shared';

export type BrandDNA = {
    brandName: string;
    mission: string;
    promise: string;
    positioning: {
        target: string;
        category: string;
        differentiator: string;
        proof: string;
    };
    coreValues: string[];
    antiValues: string[];
    toneAttributes: string[];
    neverLanguage: string[];
    primaryPersona: {
        name: string;
        jobToBeDone: string;
        triggers: string[];
        objections: string[];
    } | null;
    riskTolerance: string;
    priorityAreas: string[];
    northStarMetric: string;
};

/**
 * Compile the Brand DNA for a given shop.
 * This is the "always-on" context injected into every LLM call.
 */
export async function compileBrandDNA(shopId: string): Promise<BrandDNA | null> {
    const [identity, governance, voice, kpi, persona] = await Promise.all([
        prisma.brandIdentity.findUnique({ where: { shopId } }),
        prisma.decisionGovernance.findUnique({ where: { shopId } }),
        prisma.brandVoice.findUnique({ where: { shopId } }),
        prisma.kPIModel.findUnique({ where: { shopId } }),
        prisma.customerPersona.findFirst({ where: { shopId, isPrimary: true } }),
    ]);

    if (!identity) {
        return null; // Onboarding not complete
    }

    return {
        brandName: identity.brandName,
        mission: identity.mission,
        promise: identity.promise,
        positioning: identity.positioning as BrandDNA['positioning'],
        coreValues: identity.coreValues,
        antiValues: identity.antiValues,
        toneAttributes: voice?.toneAttributes || [],
        neverLanguage: voice?.neverLanguage || [],
        primaryPersona: persona ? {
            name: persona.name,
            jobToBeDone: persona.jobToBeDone,
            triggers: persona.triggers,
            objections: persona.objections,
        } : null,
        riskTolerance: governance?.riskTolerance || 'medium',
        priorityAreas: governance?.priorityAreas || [],
        northStarMetric: kpi?.northStarMetric || 'Revenue',
    };
}

/**
 * Generate the system prompt for LLM calls based on Brand DNA.
 */
export function generateBrandSystemPrompt(dna: BrandDNA): string {
    const personaSection = dna.primaryPersona
        ? `
PRIMARY PERSONA: ${dna.primaryPersona.name}
- Job to be Done: ${dna.primaryPersona.jobToBeDone}
- Purchase Triggers: ${dna.primaryPersona.triggers.join(', ')}
- Common Objections: ${dna.primaryPersona.objections.join(', ')}`
        : '';

    return `You are the strategic brain for ${dna.brandName}.

BRAND IDENTITY:
- Mission: ${dna.mission}
- Promise: ${dna.promise}
- Core Values: ${dna.coreValues.join(', ')}
- We are NOT: ${dna.antiValues.join(', ')}

POSITIONING:
For ${dna.positioning.target} who need ${dna.positioning.category},
we are the only ${dna.positioning.differentiator} because ${dna.positioning.proof}.

VOICE & TONE:
- Tone: ${dna.toneAttributes.join(', ')}
- NEVER use these words: ${dna.neverLanguage.join(', ')}
${personaSection}

DECISION CONTEXT:
- Risk Tolerance: ${dna.riskTolerance}
- Priority Areas: ${dna.priorityAreas.join(', ')}
- North Star Metric: ${dna.northStarMetric}

INSTRUCTIONS:
Always reason like the brand's CEO. Protect brand identity above short-term gains.
Every recommendation must align with the brand's values and speak to the primary persona.
When in doubt, default to the brand's stated positioning and voice guidelines.`;
}
