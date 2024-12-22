export type TransactionType = "income" | "expense";
export type IncomeCategory = "給与" | "副業" | "お小遣い";
export type ExpenseCategory =
    | "食費"
    | "日用品"
    | "住居費"
    | "交際費"
    | "娯楽"
    | "交通費";

export interface transaction {
    id: string;
    date: string;
    amount: number;
    content: string;
    type: TransactionType;
    category: IncomeCategory | ExpenseCategory;
}

export interface Balance {
    income: number;
    expense: number;
    balance: number;
    [key: string]: number;
}

export interface CalendarContent {
    start: string;
    income: string;
    expense: string;
    balance: string;
}
