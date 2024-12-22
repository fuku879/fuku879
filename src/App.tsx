import React, { useEffect, useState } from "react";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Report from "./pages/Report";
import NoMatch from "./pages/NoMatch";
import AppLayout from "./components/layout/AppLayout";
import { theme } from "./theme/theme";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { transaction } from "./types/index";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { format } from "date-fns";
import { formatMonth } from "./formatting";
import { schema } from "./validations/schema";
import { randomBytes } from "crypto";
import { Helmet } from "react-helmet";

<>
    <meta http-equiv="Content-Security-Policy" />
</>;

function App() {
    const [transactions, setTransactions] = useState<transaction[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const nonce = "random123";
    const [isLoading, setIsLoading] = useState(true);

    //they will judge them if firestore is error or not
    function isFireStoreError(
        err: unknown
    ): err is { code: string; message: string } {
        return typeof err === "object" && err !== null && "code" in err;
    }
    //const csp = `object-src 'none'; base-uri 'none'; script-src 'self' 'unsafe-eval'  https: http: 'nonce-${nonce}' 'strict-dynamic'`

    /* console.log(currentMonth);
    const a = format(currentMonth, "yyyy-MM");
    console.log(a); */

    useEffect(() => {
        const fecheTransactions = async () => {
            try {
                const querySnapshot = await getDocs(
                    collection(db, "Transactions")
                );
                console.log(querySnapshot);
                const transactionsData = querySnapshot.docs.map((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    //console.log(doc.id, " => ", doc.data());
                    return {
                        ...doc.data(),
                        id: doc.id,
                    } as transaction;
                });
                setTransactions(transactionsData);
            } catch (err) {
                //error
                if (isFireStoreError(err)) {
                    console.error("firebase error is", err);
                } else {
                    console.error("general error is ", err);
                }
            } finally {
                setIsLoading(false);
            }
        };
        fecheTransactions();
    }, []);
    //just a month we will get data
    const monthlyTransactions = transactions.filter((transaction) => {
        return transaction.date.startsWith(formatMonth(currentMonth));
    });

    //preserve deal
    const handleSaveTransaction = async (transaction: schema) => {
        console.log(transaction);
        try {
            //preserve data in firestore
            // Add a new document with a generated id.
            const docRef = await addDoc(
                collection(db, "Transactions"),
                transaction
            );
            console.log("Document written with ID: ", docRef.id);

            const newTransaction = {
                id: docRef.id,
                ...transaction,
            } as transaction;
            console.log(newTransaction);
            setTransactions((prevTransaction) => [
                ...prevTransaction,
                newTransaction,
            ]);
        } catch (err) {
            if (isFireStoreError(err)) {
                console.error("firebase error is", err);
            } else {
                console.error("general error is ", err);
            }
        }
    };

    const handleDeleteTransaction = async (
        transactionIds: string | readonly string[]
    ) => {
        try {
            const idsToDelete = Array.isArray(transactionIds)
                ? transactionIds
                : [transactionIds];
            console.log(idsToDelete);

            for (const id of idsToDelete) {
                //delete firestore data
                await deleteDoc(doc(db, "Transactions", id));
            }

            /* const filterdTransactions = transactions.filter(
                (transaction) => transaction.id !== transactionId
            ); */

            const filterdTransactions = transactions.filter(
                (transaction) => !idsToDelete.includes(transaction.id)
            );
            console.log(filterdTransactions);
            setTransactions(filterdTransactions);
        } catch (err) {
            if (isFireStoreError(err)) {
                console.error("firebase error is", err);
            } else {
                console.error("general error is ", err);
            }
        }
    };

    const handleUpdateTransaction = async (
        transaction: schema,
        transactionId: string
    ) => {
        try {
            //renewed firestore
            const docRef = doc(db, "Transactions", transactionId);

            // Set the "capital" field of the city 'DC'
            await updateDoc(docRef, transaction);
            //renew front
            const updatedTransactions = transactions.map((t) =>
                t.id === transactionId ? { ...t, ...transaction } : t
            ) as transaction[];
            console.log(updatedTransactions);
            setTransactions(updatedTransactions);
        } catch (err) {
            if (isFireStoreError(err)) {
                console.error("firebase error is", err);
            } else {
                console.error("general error is ", err);
            }
        }
    };

    return (
        <>
            {/* <style> タグで nonce を使う */}
            {/* <meta
                httpEquiv="Content-Security-Policy"
                content={`script-src 'self'; object-src 'none';`}
            /> */}

            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                    <Routes>
                        <Route path="/" element={<AppLayout />}>
                            <Route
                                index
                                element={
                                    <Home
                                        monthlyTransactions={
                                            monthlyTransactions
                                        }
                                        setCurrentMonth={setCurrentMonth}
                                        onSaveTransaction={
                                            handleSaveTransaction
                                        }
                                        onDeleteTransaction={
                                            handleDeleteTransaction
                                        }
                                        onUpdateTransaction={
                                            handleUpdateTransaction
                                        }
                                    />
                                }
                            />
                            <Route
                                path="/report"
                                element={
                                    <Report
                                        currentMonth={currentMonth}
                                        setCurrentMonth={setCurrentMonth}
                                        monthlyTransactions={
                                            monthlyTransactions
                                        }
                                        isLoading={isLoading}
                                        onDeleteTransaction={
                                            handleDeleteTransaction
                                        }
                                    />
                                }
                            />
                            <Route path="*" element={<NoMatch />} />
                        </Route>
                    </Routes>
                </Router>
            </ThemeProvider>
        </>
    );
}

export default App;
