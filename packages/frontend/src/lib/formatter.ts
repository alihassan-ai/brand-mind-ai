/**
 * Formats a numeric value into a localized currency string.
 * @param amount - The numerical value to format.
 * @param currencyCode - The ISO 4217 currency code (e.g., 'USD', 'EUR').
 * @param options - Additional Intl.NumberFormat options.
 */
export function formatCurrency(
    amount: number,
    currencyCode: string = "USD",
    options: Intl.NumberFormatOptions = {}
): string {
    try {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currencyCode,
            ...options,
        }).format(amount);
    } catch {
        // Fallback if currency code is invalid
        const symbol = currencyCode === "EUR" ? "€" : "$";
        return `${symbol}${amount.toLocaleString()}`;
    }
}

/**
 * Returns the currency symbol for a given code.
 */
export function getCurrencySymbol(currencyCode: string = "USD"): string {
    const formatted = formatCurrency(0, currencyCode, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    return formatted.replace(/[0-9\s.,]/g, "");
}
