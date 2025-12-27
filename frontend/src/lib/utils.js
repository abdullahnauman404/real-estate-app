export function formatPrice(n) {
    const num = Number(n || 0);
    if (num >= 10000000) return (num / 10000000).toFixed(2) + " Crore";
    if (num >= 100000) return (num / 100000).toFixed(2) + " Lakh";
    return num.toLocaleString("en-PK");
}
