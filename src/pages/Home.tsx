import { Box } from "@mui/material";
import React, { useState } from "react";
import MonthlySummary from "../components/MonthlySummary";
import Calendar from "../components/Calendar";
import TransactionMenu from "../components/TransactionMenu";
import TransactionForm from "../components/TransactionForm";
import { transaction } from "../types";
import { format } from "date-fns";
import { schema } from "../validations/schema";
/* import { Calendar } from "@fullcalendar/core"; */

interface HomeProps {
    monthlyTransactions: transaction[];
    setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
    onSaveTransaction: (transaction: schema) => Promise<void>;
    onDeleteTransaction: (
        transactionId: string | readonly string[]
    ) => Promise<void>;
    onUpdateTransaction: (
        transaction: schema,
        transactionId: string
    ) => Promise<void>;
}

const Home = ({
    monthlyTransactions,
    setCurrentMonth,
    onSaveTransaction,
    onDeleteTransaction,
    onUpdateTransaction,
}: HomeProps) => {
    const today = format(new Date(), "yyyy-MM-dd");
    console.log(today);
    const [currentDay, setCurrentDay] = useState(today);
    const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] =
        useState<transaction | null>(null);
    //to get data of today
    const dailyTransactions = monthlyTransactions.filter((transaction) => {
        return transaction.date === currentDay;
    });
    //console.log(dailyTransactions);

    const closeForm = () => {
        setIsEntryDrawerOpen(!isEntryDrawerOpen);
        setSelectedTransaction(null);
    };

    //for open and close
    const handleAddTransactionForm = () => {
        if (selectedTransaction) {
            setSelectedTransaction(null);
        } else {
            setIsEntryDrawerOpen(!isEntryDrawerOpen);
        }
    };
    //process that it will be selected
    const handleSelectTransaction = (transaction: transaction) => {
        console.log(transaction);
        setIsEntryDrawerOpen(true);
        setSelectedTransaction(transaction);
    };

    return (
        <Box sx={{ display: "flex" }}>
            {/*  left  */}
            <Box sx={{ flexGrow: 1 }}>
                <MonthlySummary monthlyTransactions={monthlyTransactions} />
                <Calendar
                    monthlyTransactions={monthlyTransactions}
                    setCurrentMonth={setCurrentMonth}
                    setCurrentDay={setCurrentDay}
                    currentDay={currentDay}
                    today={today}
                />
            </Box>
            {/* right */}
            <Box>
                <TransactionMenu
                    dailyTransactions={dailyTransactions}
                    currentDay={currentDay}
                    onAddTransactionFrom={handleAddTransactionForm}
                    onSelectTransaction={handleSelectTransaction}
                />
                <TransactionForm
                    onCloseForm={closeForm}
                    isEntryDrawerOpen={isEntryDrawerOpen}
                    currentDay={currentDay}
                    onSaveTransaction={onSaveTransaction}
                    selectedTransaction={selectedTransaction}
                    onDeleteTransaction={onDeleteTransaction}
                    setSelectedTransaction={setSelectedTransaction}
                    onUpdateTransaction={onUpdateTransaction}
                />
            </Box>
        </Box>
    );
};

export default Home;
