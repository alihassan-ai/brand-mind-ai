/**
 * Forecasting Engine
 * 
 * Predicts future revenue based on historical daily metrics.
 * Uses Linear Regression (Least Squares) if sufficient data exists.
 * Falls back to simple averaging with simulation noise if data is sparse.
 */

import { prisma } from '@brandmind/shared';
import { Decimal } from '@prisma/client/runtime/library';

export interface ForecastPoint {
    date: Date;
    revenue: number;
    confidenceLow: number;
    confidenceHigh: number;
    model: 'linear_regression' | 'simulation';
}

export async function forecastRevenue(shopId: string, daysToForecast: number = 30): Promise<ForecastPoint[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ninetyDaysAgo = new Date(today);
    ninetyDaysAgo.setDate(today.getDate() - 90);

    // 1. Fetch Historical Data
    const history = await prisma.dailyMetric.findMany({
        where: {
            shopId,
            date: { gte: ninetyDaysAgo, lt: today },
            netRevenue: { gt: 0 } // Filter out zero-revenue days (e.g. before store launch)
        },
        orderBy: { date: 'asc' },
        select: {
            date: true,
            netRevenue: true
        }
    });

    const dataPoints = history.map((day, index) => ({
        x: index, // Day index (0, 1, 2...)
        y: Number(day.netRevenue)
    }));

    const forecast: ForecastPoint[] = [];
    const modelType = dataPoints.length >= 7 ? 'linear_regression' : 'simulation';

    if (modelType === 'linear_regression') {
        // --- LINEAR REGRESSION (y = mx + b) ---
        const n = dataPoints.length;
        const sumX = dataPoints.reduce((acc, p) => acc + p.x, 0);
        const sumY = dataPoints.reduce((acc, p) => acc + p.y, 0);
        const sumXY = dataPoints.reduce((acc, p) => acc + (p.x * p.y), 0);
        const sumXX = dataPoints.reduce((acc, p) => acc + (p.x * p.x), 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // Calculate Standard Error (Confidence Interval)
        const residuals = dataPoints.map(p => p.y - (slope * p.x + intercept));
        const stdDev = Math.sqrt(residuals.reduce((acc, r) => acc + (r * r), 0) / n);

        // Generate Forecast
        for (let i = 1; i <= daysToForecast; i++) {
            const futureX = n + i;
            const predictedY = slope * futureX + intercept;

            // Widen confidence interval as we go further into future
            const marginOfError = stdDev * (1 + (i / daysToForecast));

            const futureDate = new Date(today);
            futureDate.setDate(today.getDate() + i);

            forecast.push({
                date: futureDate,
                revenue: Math.max(0, predictedY), // No negative revenue
                confidenceLow: Math.max(0, predictedY - marginOfError),
                confidenceHigh: predictedY + marginOfError,
                model: 'linear_regression'
            });
        }

    } else {
        // --- SIMULATION (Fallback) ---
        const avgRevenue = dataPoints.length > 0
            ? dataPoints.reduce((acc, p) => acc + p.y, 0) / dataPoints.length
            : 0;

        // If literally no data, assume $100 baseline for demo purposes
        const baseline = avgRevenue === 0 ? 100 : avgRevenue;

        for (let i = 1; i <= daysToForecast; i++) {
            const noise = (Math.random() * 0.4) - 0.2; // +/- 20%
            const val = baseline * (1 + noise);

            const futureDate = new Date(today);
            futureDate.setDate(today.getDate() + i);

            forecast.push({
                date: futureDate,
                revenue: val,
                confidenceLow: val * 0.8,
                confidenceHigh: val * 1.2,
                model: 'simulation'
            });
        }
    }

    return forecast;
}
