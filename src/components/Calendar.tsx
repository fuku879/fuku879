import FullCalendar from "@fullcalendar/react";
import React, { useState } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import jaLocale from "@fullcalendar/core/locales/ja";
import { DatesSetArg, EventContentArg } from "@fullcalendar/core";
import "../components/calendar.css";
import { Balance, CalendarContent, transaction } from "../types";
import { calculateDailyBalances } from "../utils/financeCalculations";
import { formatCurrency } from "../utils/formatting";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { useTheme } from "@mui/material";
import { isSameMonth } from "date-fns";

interface CalendarProps {
    monthlyTransactions: transaction[];
    setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
    setCurrentDay: React.Dispatch<React.SetStateAction<string>>;
    currentDay: string;
    today: string;
}
const Calendar = ({
    monthlyTransactions,
    setCurrentMonth,
    setCurrentDay,
    currentDay,
    today,
}: CalendarProps) => {
    const theme = useTheme();
    /* const [currentDay, setCurrentDayState] = useState<string>("");

    const events = [
        { title: "Meeting", start: new Date() },
        {
            title: "chrismas",
            start: "2024-12-24",
            income: 300,
            expense: 200,
            balance: 100,
        },
    ];
 */
    //transaction data per month
    /* const monthlyTransactions = [
        {
            id: "a",
            type: "income",
            category: "お小遣い",
            amount: 700,
            content: "from mother",
            date: "2023-12-20",
        },
        {
            id: "b",
            type: "expense",
            category: "stock",
            amount: 200,
            content: "for me",
            date: "2023-12-23",
        },{
            id: "c",
            type: "expense",
            category: "coin",
            amount: 500,
            content: "time",
            date: "2023-12-23",
        },

    ] */
    const dailyBalances = calculateDailyBalances(monthlyTransactions);
    console.log(dailyBalances);

    //1.this is function that will calculate the household a day
    /* const dailyBalances = {
        "2023-12-20": { income: 700, expense: 200, balance: 500 },
        "2023-12-23": { income: 0, expense: 500, balance: -500 },
    }; */

    //2.this is function that will make the events for fullCalendar
    const createCalendarEvents = (
        dailyBalances: Record<string, Balance>
    ): CalendarContent[] => {
        return Object.keys(dailyBalances).map((date) => {
            const { income, expense, balance } = dailyBalances[date];
            return {
                start: date,
                income: formatCurrency(income),
                expense: formatCurrency(expense),
                balance: formatCurrency(balance),
            };
        });
    };

    const calendarEvents = createCalendarEvents(dailyBalances);
    console.log(calendarEvents);

    const events = [
        { start: "2023-12-20", income: 700, expense: 200, balance: 500 },
        { start: "2023-12-23", display: "background", backgroundColor: "red" },
    ];

    const backgroundEvent = {
        start: currentDay,
        display: "background",
        backgroundColor: theme.palette.incomeColor.light,
    };

    console.log([...calendarEvents, backgroundEvent]);

    /* const calendarEvents = [
        { start: "2023-12-20", income: 700, expense: 200, balance: 500 },
        { start: "2023-12-23", income: 0, expense: 500, balance: -500 },
    ]; */

    const renderEventContent = (eventInfo: EventContentArg) => {
        console.log(eventInfo);
        return (
            <div>
                <div className="money" id="event-income">
                    {eventInfo.event.extendedProps.income}
                </div>
                <div className="money" id="event-expense">
                    {eventInfo.event.extendedProps.expense}
                </div>
                <div className="money" id="event-balance">
                    {eventInfo.event.extendedProps.balance}
                </div>
            </div>
        );
    };

    //to get a day of month
    const handleDateSet = (datesetInfo: DatesSetArg) => {
        const currentMonth = datesetInfo.view.currentStart;
        setCurrentMonth(currentMonth);
        const todayDate = new Date();
        if (isSameMonth(todayDate, currentMonth)) {
            setCurrentDay(today);
        }
        setCurrentDay(today);
    };

    const handleDateClick = (dateInfo: DateClickArg) => {
        console.log(dateInfo);
        setCurrentDay(dateInfo.dateStr);
    };

    return (
        <FullCalendar
            locale={jaLocale}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={[...calendarEvents, backgroundEvent]}
            eventContent={renderEventContent}
            datesSet={handleDateSet}
            dateClick={handleDateClick}
        />
    );
};

export default Calendar;
