'use client';

import React from 'react';
import {
    CheckCircle,
    XCircle,
    RefreshCcw,
    Activity,
    Clock,
    Database
} from 'lucide-react';

interface SyncLog {
    id: string;
    startedAt: string | Date;
    completedAt: string | Date | null;
    status: string;
    resource: string;
    stats: any;
    error: string | null;
}

export function SyncLogs({ logs }: { logs: SyncLog[] }) {
    if (!logs || logs.length === 0) return null;

    const formatDate = (date: string | Date) => {
        return new Date(date).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <CheckCircle className="w-4 h-4 text-green-400" />;
            case 'failed':
                return <XCircle className="w-4 h-4 text-red-400" />;
            case 'running':
                return <RefreshCcw className="w-4 h-4 text-blue-400 animate-spin" />;
            default:
                return <Activity className="w-4 h-4 text-[var(--muted-foreground)]" />;
        }
    };

    const getResourceLabel = (resource: string) => {
        switch (resource) {
            case 'full': return 'Smart Sync';
            case 'incremental': return 'Auto-Sync';
            case 'historical': return 'Historical Backfill';
            default: return resource.charAt(0).toUpperCase() + resource.slice(1);
        }
    };

    return (
        <div className="mt-12 bg-[var(--background-card)]/80 border border-[var(--border)] rounded-2xl overflow-hidden backdrop-blur-xl">
            <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                        <Database className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--foreground)]">Data Sync History</h3>
                        <p className="text-[10px] text-[var(--muted-foreground)] font-medium uppercase tracking-wider mt-0.5">Live Feed Audit Trail</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/5 border border-green-500/10 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">System Healthy</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/[0.02]">
                            <th className="px-6 py-3 text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest border-b border-[var(--border)]">Event</th>
                            <th className="px-6 py-3 text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest border-b border-[var(--border)]">Status</th>
                            <th className="px-6 py-3 text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest border-b border-[var(--border)]">Records</th>
                            <th className="px-6 py-3 text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest border-b border-[var(--border)]">Timestamp</th>
                            <th className="px-6 py-3 text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest border-b border-[var(--border)] text-right">Duration</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {logs.map((log) => {
                            const duration = log.completedAt
                                ? Math.round((new Date(log.completedAt).getTime() - new Date(log.startedAt).getTime()) / 1000)
                                : null;

                            return (
                                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-1.5 h-1.5 rounded-full ${log.status === 'success' ? 'bg-green-500' : log.status === 'failed' ? 'bg-red-500' : 'bg-blue-500'}`} />
                                            <span className="text-xs font-semibold text-[var(--foreground)]/90">{getResourceLabel(log.resource)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(log.status)}
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${log.status === 'success' ? 'text-green-400' :
                                                    log.status === 'failed' ? 'text-red-400' : 'text-blue-400'
                                                }`}>
                                                {log.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-[10px] text-[var(--muted-foreground)]">
                                        {log.status === 'success' && log.stats ? (
                                            <div className="flex gap-2">
                                                {log.stats.products !== undefined && <span>P:{log.stats.products}</span>}
                                                {log.stats.orders !== undefined && <span>O:{log.stats.orders}</span>}
                                                {log.stats.customers !== undefined && <span>C:{log.stats.customers}</span>}
                                            </div>
                                        ) : log.error ? (
                                            <span className="text-red-400/80 truncate max-w-[150px] inline-block">{log.error}</span>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-[10px] text-[var(--muted-foreground)] font-medium">
                                            <Clock className="w-3 h-3 opacity-50" />
                                            {formatDate(log.startedAt)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right tabular-nums">
                                        <span className="text-[10px] font-bold text-[var(--foreground)]/40">
                                            {duration !== null ? `${duration}s` : '---'}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-3 bg-white/[0.01] border-t border-[var(--border)] flex items-center justify-center">
                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em]">End of Audit Trail</p>
            </div>
        </div>
    );
}
