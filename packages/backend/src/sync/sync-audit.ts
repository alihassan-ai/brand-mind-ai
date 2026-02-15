import { prisma } from '@brandmind/shared';

export async function createSyncLog(shopId: string, resource: string) {
    return await prisma.syncEvent.create({
        data: {
            shopId,
            resource,
            status: 'running',
            startedAt: new Date(),
        }
    });
}

export async function updateSyncLog(logId: string, data: { status: 'success' | 'failed', stats?: any, error?: string }) {
    return await prisma.syncEvent.update({
        where: { id: logId },
        data: {
            ...data,
            completedAt: new Date(),
        }
    });
}
