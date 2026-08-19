/**
 * Estrella weight-display rule: plain number + lowercase unit, no label.
 * e.g. formatWeight(5, "gms") -> "5.00 gms"
 */
export function formatWeight(value: number, unit: "gms" | "cts"): string {
  return `${value.toFixed(2)} ${unit}`;
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}
