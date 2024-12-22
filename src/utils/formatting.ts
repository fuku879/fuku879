import { format } from "date-fns";

export function formatMonth(date: Date): string {
    return format(date, "yyyy-MM");
}

//function that convert to japanese yen
export function formatCurrency(amount: number): string {
    return amount.toLocaleString("ja-JP");
}
