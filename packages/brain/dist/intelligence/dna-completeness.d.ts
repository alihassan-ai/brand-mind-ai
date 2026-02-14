/**
 * DNA Completeness Checker
 * Identifies missing fields in Brand DNA and prompts users to fill them
 */
export interface MissingField {
    field: string;
    section: 'identity' | 'marketPosition' | 'operationalDNA' | 'customerDNA';
    importance: 'critical' | 'important' | 'nice_to_have';
    question: string;
    inputType: 'text' | 'select' | 'multiselect' | 'number' | 'textarea';
    options?: Array<{
        label: string;
        value: string;
    } | string>;
    placeholder?: string;
    helpText?: string;
}
export interface SectionCompleteness {
    score: number;
    filledFields: number;
    totalFields: number;
    missingCritical: string[];
    missingImportant: string[];
    missingOptional: string[];
}
export interface CompletenessResult {
    overallScore: number;
    isActionable: boolean;
    sections: {
        identity: SectionCompleteness;
        marketPosition: SectionCompleteness;
        operationalDNA: SectionCompleteness;
        customerDNA: SectionCompleteness;
    };
    userActionRequired: MissingField[];
    dataRequired: Array<{
        field: string;
        section: string;
        source: string;
        message: string;
        action: string;
    }>;
}
export declare function checkDNACompleteness(shopId: string): Promise<CompletenessResult>;
export declare function updateDNAField(shopId: string, field: string, value: any): Promise<void>;
//# sourceMappingURL=dna-completeness.d.ts.map