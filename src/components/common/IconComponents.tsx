import React from "react";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import AlarmIcon from "@mui/icons-material/Alarm";
import { ExpenseCategory, IncomeCategory } from "../../types";

const IconComponents: Record<IncomeCategory | ExpenseCategory, JSX.Element> = {
    食費: <FastfoodIcon fontSize="small" />,
    日用品: <AlarmIcon fontSize="small" />,
    住居費: <FastfoodIcon fontSize="small" />,
    交際費: <FastfoodIcon fontSize="small" />,
    娯楽: <FastfoodIcon fontSize="small" />,
    交通費: <FastfoodIcon fontSize="small" />,
    給与: <FastfoodIcon fontSize="small" />,
    副業: <FastfoodIcon fontSize="small" />,
    お小遣い: <FastfoodIcon fontSize="small" />,
};

export default IconComponents;
