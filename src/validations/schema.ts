import { date, z } from "zod";

export const transactionSchema = z.object({
    type: z.enum(["income", "expense"]),
    date: z.string().min(1, { message: "日付は必須です" }),
    amount: z.number().min(1, { message: "金額は1円以上よ" }),
    content: z
        .string()
        .min(1, { message: "内容を入力して" })
        .max(50, { message: "50文字以内にして" })
        .optional(),

    category: z.union([
        z.literal(""),
        z.enum(["食費", "日用品", "住居費", "交際費", "娯楽", "交通費"]),
        z.enum(["給与", "副業", "お小遣い"]),
    ]),
    /*  .refine((val) => val !== "", { message: "カテゴリを選択して" }), */
});

export type schema = z.infer<typeof transactionSchema>;
