/**
 * Data Import System
 * CSV/JSON parsing and import pipeline
 */

import { prisma } from '@brandmind/shared';

// ============================================
// TYPES
// ============================================

export type ImportType = 'products' | 'orders' | 'customers';

export interface FieldMapping {
    sourceField: string;
    targetField: string;
    transform?: 'string' | 'number' | 'date' | 'boolean';
}

export interface ImportConfig {
    type: ImportType;
    fieldMappings: FieldMapping[];
    skipFirstRow?: boolean;
    dateFormat?: string;
}

export interface ImportResult {
    success: boolean;
    recordsProcessed: number;
    recordsImported: number;
    recordsFailed: number;
    errors: Array<{ row: number; error: string }>;
}

export interface ImportProgress {
    id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number;
    total: number;
    message: string;
}

// ============================================
// CSV PARSER
// ============================================

export function parseCSV(content: string, skipFirstRow: boolean = true): string[][] {
    const lines = content.split('\n').filter(line => line.trim());
    const rows: string[][] = [];

    for (let i = skipFirstRow ? 1 : 0; i < lines.length; i++) {
        const line = lines[i];
        const row: string[] = [];
        let current = '';
        let inQuotes = false;

        for (let j = 0; j < line.length; j++) {
            const char = line[j];

            if (char === '"' && !inQuotes) {
                inQuotes = true;
            } else if (char === '"' && inQuotes) {
                if (line[j + 1] === '"') {
                    current += '"';
                    j++;
                } else {
                    inQuotes = false;
                }
            } else if (char === ',' && !inQuotes) {
                row.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        row.push(current.trim());
        rows.push(row);
    }

    return rows;
}

export function getCSVHeaders(content: string): string[] {
    const firstLine = content.split('\n')[0];
    return parseCSV(firstLine + '\n', false)[0] || [];
}

// ============================================
// JSON PARSER
// ============================================

export function parseJSON(content: string): any[] {
    const parsed = JSON.parse(content);

    if (Array.isArray(parsed)) {
        return parsed;
    }

    // Handle nested arrays (e.g., { products: [...] })
    const keys = Object.keys(parsed);
    for (const key of keys) {
        if (Array.isArray(parsed[key])) {
            return parsed[key];
        }
    }

    // Single object
    return [parsed];
}

export function getJSONFields(content: string): string[] {
    const data = parseJSON(content);
    if (data.length === 0) return [];

    const sample = data[0];
    return Object.keys(sample);
}

// ============================================
// FIELD TRANSFORMER
// ============================================

function transformValue(value: any, transform?: string): any {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    switch (transform) {
        case 'number':
            const num = parseFloat(String(value).replace(/[^0-9.-]/g, ''));
            return isNaN(num) ? null : num;

        case 'date':
            const date = new Date(value);
            return isNaN(date.getTime()) ? null : date;

        case 'boolean':
            const lower = String(value).toLowerCase();
            return lower === 'true' || lower === '1' || lower === 'yes';

        case 'string':
        default:
            return String(value);
    }
}

// ============================================
// IMPORT PIPELINE
// ============================================

export async function importData(
    shopId: string,
    data: any[],
    config: ImportConfig
): Promise<ImportResult> {
    const result: ImportResult = {
        success: true,
        recordsProcessed: 0,
        recordsImported: 0,
        recordsFailed: 0,
        errors: [],
    };

    for (let i = 0; i < data.length; i++) {
        result.recordsProcessed++;
        const row = data[i];

        try {
            // Map fields
            const mapped: Record<string, any> = { shopId };

            for (const mapping of config.fieldMappings) {
                const sourceValue = Array.isArray(row)
                    ? row[parseInt(mapping.sourceField)]
                    : row[mapping.sourceField];
                mapped[mapping.targetField] = transformValue(sourceValue, mapping.transform);
            }

            // Import based on type
            switch (config.type) {
                case 'products':
                    await importProduct(shopId, mapped);
                    break;
                case 'orders':
                    await importOrder(shopId, mapped);
                    break;
                case 'customers':
                    await importCustomer(shopId, mapped);
                    break;
            }

            result.recordsImported++;

        } catch (error: any) {
            result.recordsFailed++;
            result.errors.push({
                row: i + 1,
                error: error.message,
            });
        }
    }

    result.success = result.recordsFailed === 0;
    return result;
}

// ============================================
// TYPE-SPECIFIC IMPORTERS
// ============================================

async function importProduct(shopId: string, data: Record<string, any>) {
    const shopifyId = data.shopifyId || data.id || `import-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    await prisma.product.upsert({
        where: { shopifyId: String(shopifyId) },
        update: {
            title: data.title,
            handle: data.handle || data.title?.toLowerCase().replace(/\s+/g, '-'),
            vendor: data.vendor,
            productType: data.productType || data.type,
            updatedAt: new Date(),
        },
        create: {
            shopId,
            shopifyId: String(shopifyId),
            title: data.title || 'Untitled',
            handle: data.handle || data.title?.toLowerCase().replace(/\s+/g, '-') || 'untitled',
            vendor: data.vendor,
            productType: data.productType || data.type,
            createdAt: data.createdAt || new Date(),
            updatedAt: new Date(),
        },
    });
}

async function importOrder(shopId: string, data: Record<string, any>) {
    const shopifyId = data.shopifyId || data.id || `import-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    await prisma.order.upsert({
        where: { shopifyId: String(shopifyId) },
        update: {
            totalPrice: data.totalPrice || data.total || 0,
            updatedAt: new Date(),
        },
        create: {
            shopId,
            shopifyId: String(shopifyId),
            orderNumber: data.orderNumber || data.order_number || shopifyId,
            totalPrice: data.totalPrice || data.total || 0,
            subtotalPrice: data.subtotalPrice || data.subtotal || 0,
            totalTax: data.totalTax || data.tax || 0,
            totalDiscounts: data.totalDiscounts || data.discount || 0,
            currency: data.currency || 'EUR',
            createdAt: data.createdAt || new Date(),
            updatedAt: new Date(),
        },
    });
}

async function importCustomer(shopId: string, data: Record<string, any>) {
    const shopifyId = data.shopifyId || data.id || `import-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    await prisma.customer.upsert({
        where: { shopifyId: String(shopifyId) },
        update: {
            email: data.email,
            firstName: data.firstName || data.first_name,
            lastName: data.lastName || data.last_name,
        },
        create: {
            shopId,
            shopifyId: String(shopifyId),
            email: data.email,
            firstName: data.firstName || data.first_name,
            lastName: data.lastName || data.last_name,
            createdAt: data.createdAt || new Date(),
        },
    });
}

// ============================================
// IMPORT TRACKING
// ============================================

export async function createImportRecord(
    shopId: string,
    filename: string,
    type: ImportType,
    totalRecords: number
): Promise<string> {
    const record = await prisma.dataImport.create({
        data: {
            shopId,
            fileName: filename,
            dataType: type,
            importType: 'manual',
            status: 'pending',
            totalRows: totalRecords,
            processedRows: 0,
            failedRows: 0,
            fieldMapping: {},
        },
    });
    return record.id;
}

export async function updateImportProgress(
    importId: string,
    processed: number,
    failed: number,
    status: string
) {
    await prisma.dataImport.update({
        where: { id: importId },
        data: {
            processedRows: processed,
            failedRows: failed,
            status,
            completedAt: status === 'completed' || status === 'failed' ? new Date() : null,
        },
    });
}

export async function getImportHistory(shopId: string): Promise<any[]> {
    return prisma.dataImport.findMany({
        where: { shopId },
        orderBy: { createdAt: 'desc' },
        take: 20,
    });
}
