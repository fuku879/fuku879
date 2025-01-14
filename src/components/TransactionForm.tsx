import {
    Box,
    Button,
    ButtonGroup,
    FormControl,
    FormHelperText,
    IconButton,
    InputLabel,
    ListItemIcon,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close"; // 閉じるボタン用のアイコン
import FastfoodIcon from "@mui/icons-material/Fastfood"; //食事アイコン
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExpenseCategory, IncomeCategory, transaction } from "../types";
import AddHomeIcon from "@mui/icons-material/AddHome";
import AlarmIcon from "@mui/icons-material/Alarm";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import TrainIcon from "@mui/icons-material/Train";
import WorkIcon from "@mui/icons-material/Work";
import SavingsIcon from "@mui/icons-material/Savings";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import { schema, transactionSchema } from "../validations/schema";
import { Transaction } from "firebase/firestore";

interface TransactionFormProps {
    onCloseForm: () => void;
    isEntryDrawerOpen: boolean;
    currentDay: string;
    onSaveTransaction: (transaction: schema) => Promise<void>;
    selectedTransaction: transaction | null;
    onDeleteTransaction: (
        transactionId: string | readonly string[]
    ) => Promise<void>;
    setSelectedTransaction: React.Dispatch<
        React.SetStateAction<transaction | null>
    >;
    onUpdateTransaction: (
        transaction: schema,
        transactionId: string
    ) => Promise<void>;
}

type IncomeExpense = "income" | "expense";

interface CategoryItem {
    label: IncomeCategory | ExpenseCategory;
    icon: JSX.Element;
}

const TransactionForm = ({
    onCloseForm,
    isEntryDrawerOpen,
    currentDay,
    onSaveTransaction,
    selectedTransaction,
    onDeleteTransaction,
    setSelectedTransaction,
    onUpdateTransaction,
}: TransactionFormProps) => {
    const formWidth = 320;

    const expenseCategories: CategoryItem[] = [
        { label: "食費", icon: <FastfoodIcon /> },
        { label: "日用品", icon: <AlarmIcon fontSize="small" /> },
        { label: "住居費", icon: <AddHomeIcon fontSize="small" /> },
        { label: "交際費", icon: <DriveEtaIcon fontSize="small" /> },
        { label: "娯楽", icon: <SportsTennisIcon fontSize="small" /> },
        { label: "交通費", icon: <TrainIcon fontSize="small" /> },
    ];

    const incomeCategories: CategoryItem[] = [
        { label: "給与", icon: <WorkIcon fontSize="small" /> },
        { label: "副業", icon: <SavingsIcon fontSize="small" /> },
        { label: "お小遣い", icon: <AddBusinessIcon fontSize="small" /> },
    ];

    const [categories, setCategories] = useState(expenseCategories);

    const {
        control,
        setValue,
        watch,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm<schema>({
        defaultValues: {
            type: "expense",
            date: currentDay,
            amount: 0,
            category: "",
            content: "",
        },
        resolver: zodResolver(transactionSchema),
    });
    console.log(errors);

    const incomeExpenseToggle = (type: IncomeExpense) => {
        setValue("type", type);
        setValue("category", "");
    };
    //see the household type
    const currentType = watch("type");
    console.log(currentType);

    useEffect(() => {
        const newCategories =
            currentType === "expense" ? expenseCategories : incomeCategories;
        console.log(newCategories);
        setCategories(newCategories);
    }, [currentType]);

    const onSubmit: SubmitHandler<schema> = (data) => {
        console.log(data);

        if (selectedTransaction) {
            onUpdateTransaction(data, selectedTransaction.id)
                .then(() => {
                    /* console.log("renewed!!");*/
                    setSelectedTransaction(null);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            onSaveTransaction(data)
                .then(() => {
                    console.log("preserved!!");
                })
                .catch((error) => {
                    console.error(error);
                });
            console.log("preserved!!");
        }

        reset({
            type: "expense",
            date: currentDay,
            amount: 0,
            category: "",
            content: "",
        });
    };

    useEffect(() => {
        //check if it renewed
        if (selectedTransaction) {
            const categoryExists = categories.some(
                (category) => category.label === selectedTransaction.category
            );
            setValue(
                "category",
                categoryExists ? selectedTransaction.category : ""
            );
        }
    }, [selectedTransaction, categories]);

    useEffect(() => {
        if (selectedTransaction) {
            setValue("type", selectedTransaction.type);
            setValue("date", selectedTransaction.date);
            setValue("amount", selectedTransaction.amount);

            setValue("content", selectedTransaction.content);
        } else {
            reset({
                date: currentDay,
            });
        }
    }, [selectedTransaction]);

    const handleDelete = () => {
        if (selectedTransaction) {
            onDeleteTransaction(selectedTransaction.id);
            setSelectedTransaction(null);
        }
    };

    return (
        <Box
            sx={{
                position: "fixed",
                top: 64,
                right: isEntryDrawerOpen ? formWidth : "-2%", // フォームの位置を調整
                width: formWidth,
                height: "100%",
                bgcolor: "background.paper",
                zIndex: (theme) => theme.zIndex.drawer - 1,
                transition: (theme) =>
                    theme.transitions.create("right", {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                p: 2, // 内部の余白
                boxSizing: "border-box", // ボーダーとパディングをwidthに含める
                boxShadow: "0px 0px 15px -5px #777777",
            }}
        >
            {/* 入力エリアヘッダー */}
            <Box display={"flex"} justifyContent={"space-between"} mb={2}>
                <Typography variant="h6">入力</Typography>
                {/* 閉じるボタン */}
                <IconButton
                    onClick={onCloseForm}
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>
            {/* フォーム要素 */}
            <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                    {/* 収支切り替えボタン */}
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => {
                            console.log(field);
                            return (
                                <ButtonGroup fullWidth>
                                    <Button
                                        variant={
                                            field.value === "expense"
                                                ? "contained"
                                                : "outlined"
                                        }
                                        color={"primary"}
                                        onClick={() =>
                                            incomeExpenseToggle("expense")
                                        }
                                    >
                                        支出
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            incomeExpenseToggle("income")
                                        }
                                        variant={
                                            field.value === "income"
                                                ? "contained"
                                                : "outlined"
                                        }
                                    >
                                        収入
                                    </Button>
                                </ButtonGroup>
                            );
                        }}
                    />

                    {/* 日付 */}
                    <Controller
                        name="date"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="日付"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                error={!!errors.date}
                                helperText={errors.date?.message}
                            />
                        )}
                    />

                    {/* カテゴリ */}
                    <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                            /* <TextField
                                {...field}
                                select
                                label="カテゴリ"
                                error={!!errors.category}
                                helperText={errors.category?.message}
                                InputLabelProps={{
                                    htmlFor: "category",
                                }}
                                inputProps={{ id: "category" }}
                            >
                                {categories.map((category, index) => (
                                    <MenuItem
                                        value={category.label}
                                        key={index}
                                    >
                                        <ListItemIcon>
                                            {category.icon}
                                        </ListItemIcon>
                                        {category.label}
                                    </MenuItem>
                                ))}
                            </TextField> */

                            <FormControl fullWidth error={!!errors.category}>
                                <InputLabel id="category-select-label">
                                    カテゴリ
                                </InputLabel>
                                <Select
                                    {...field}
                                    labelId="category-select-label"
                                    id="category-select"
                                    label="カテゴリ"
                                >
                                    {categories.map((category, index) => (
                                        <MenuItem
                                            value={category.label}
                                            key={index}
                                        >
                                            <ListItemIcon>
                                                {category.icon}
                                            </ListItemIcon>
                                            {category.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>
                                    {errors.category?.message}
                                </FormHelperText>
                            </FormControl>
                        )}
                    />

                    {/* 金額 */}
                    <Controller
                        name="amount"
                        control={control}
                        render={(field) => {
                            return (
                                <TextField
                                    error={!!errors.amount}
                                    helperText={errors.amount?.message}
                                    {...field.field}
                                    value={
                                        field.field.value === 0
                                            ? ""
                                            : field.field.value
                                    }
                                    onChange={(e) => {
                                        const newValue =
                                            parseInt(e.target.value, 10) || 0;
                                        field.field.onChange(newValue);
                                    }}
                                    label="金額"
                                    type="number"
                                />
                            );
                        }}
                    />

                    {/* 内容 */}
                    <Controller
                        name="content"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                error={!!errors.content}
                                helperText={errors.content?.message}
                                {...field}
                                label="内容"
                                type="text"
                            />
                        )}
                    />

                    {/* 保存ボタン */}
                    <Button
                        type="submit"
                        variant="contained"
                        color={currentType === "income" ? "primary" : "error"}
                        fullWidth
                    >
                        {selectedTransaction ? "更新" : "保存"}
                    </Button>

                    {selectedTransaction && (
                        <Button
                            onClick={handleDelete}
                            variant="outlined"
                            color={"secondary"}
                            fullWidth
                        >
                            削除
                        </Button>
                    )}
                </Stack>
            </Box>
        </Box>
    );
};
export default TransactionForm;
