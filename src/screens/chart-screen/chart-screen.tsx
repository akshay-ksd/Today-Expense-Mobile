import { View, Text, NativeModules, ScrollView } from 'react-native'
import React, { useRef, useState } from 'react'
import styles from './style'
import Header from './header/header'
import BarChartScreen from './bar-chart/bar-chart'
import PieChartScreen from './pie-chart/pie-chart-screen'
import _ from 'lodash';

const ChartScreen = () => {
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const { BackgroundService, ExpenseModule } = NativeModules;

    const pieChartRef: any = useRef();
    const barChartRef: any = useRef();

    const filterData = (type: any, date: any) => {
        setTimeout(() => {
            if (type == "D") {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                const day = String(date.getDate()).padStart(2, '0');
                const formattedDate = `${year}-${month}-${day}`;
                filterByDay(formattedDate)
                return
            }

            if (type == "M") {
                const year = date.getFullYear();
                const month = date.getMonth() + 1; // Months are zero-based
                filterMonth(month, year);
                return
            }

            if (type == "Y") {
                const year = date.getFullYear();
                filterYear(year);
                return
            }
        }, 300);
    }

    type Expense = {
        date: string; // Date in "DD-MM-YYYY" format
        amount: number;
        // ... other fields
    };

    function parseDate(dateString: string): Date {
        const [day, month, year] = dateString.split("-").map(Number);
        return new Date(year, month - 1, day); // month is 0-based in JavaScript Date
    }


    const filterByDay = async (date: string): Promise<void> => {
        try {
            const expenses: Expense[] = await ExpenseModule.getAllExpenses();

            // Filter expenses that exactly match the given date
            const filteredExpenses = _.filter(expenses, (item: Expense) => item.date === date);

            // Assuming there's another field to sort by, e.g., `time` or `expense`
            // Adjust the sorting key accordingly
            const sortedExpenses = _.sortBy(filteredExpenses, [(expense: Expense) => {
                // If `expense` includes a time or another relevant field to sort by
                return parseDate(expense.date).getTime(); // Adjust this based on actual data structure
            }], ['desc']); // Sort descending; remove 'desc' for ascending
            const totalExpense = sortedExpenses.reduce((sum, item) => sum + parseInt(item.expense), 0);
            setTotal(totalExpense)
            pieChartRef.current.loadData(sortedExpenses)
            barChartRef.current.loadData(sortedExpenses)
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };


    const filterMonth = async (month: number, year: number): Promise<void> => {
        try {
            const expenses = await ExpenseModule.getAllExpenses();
            const filteredExpenses = _.filter(expenses, (expense: any) => {
                const expenseDate = new Date(expense.date);
                return (expenseDate.getMonth() + 1 === month) && (expenseDate.getFullYear() === year);
            });

            const sortedExpenses = _.sortBy(filteredExpenses, [(expense: Expense) => {
                // If `expense` includes a time or another relevant field to sort by
                return parseDate(expense.date).getTime(); // Adjust this based on actual data structure
            }], ['desc']); // Sort descending; remove 'desc' for a
            const totalExpense = sortedExpenses.reduce((sum, item) => sum + parseInt(item.expense), 0);
            setTotal(totalExpense)
            pieChartRef.current.loadData(sortedExpenses)
            barChartRef.current.loadData(sortedExpenses)
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };


    const filterYear = async (year: number): Promise<void> => {
        setLoading(true);
        try {
            const expenses = await ExpenseModule.getAllExpenses();

            const filteredExpenses = _.filter(expenses, (expense: any) => {
                const expenseDate = new Date(expense.date);
                return expenseDate.getFullYear() === year;
            });

            // Group by month and sum expenses
            const sortedExpenses = _.sortBy(filteredExpenses, [(expense: Expense) => {
                // If `expense` includes a time or another relevant field to sort by
                return parseDate(expense.date).getTime(); // Adjust this based on actual data structure
            }], ['desc']); // Sort descending; remove 'desc' for a

            pieChartRef.current.loadData(sortedExpenses)

            const groupedExpenses = _.groupBy(sortedExpenses, expense => {
                const date = new Date(expense.date);
                return date.getMonth();
            });

            const results = _.mapValues(groupedExpenses, (expenses, month) => {
                return {
                    description: new Date(year, month).toLocaleString('default', { month: 'long' }),
                    expense: _.sumBy(expenses, exp => parseInt(exp.expense))
                };
            });

            const transformedArray = Object.values(results);
            const totalExpense = transformedArray.reduce((sum, item) => sum + parseInt(item.expense), 0);
            setTotal(totalExpense)
            barChartRef.current.loadByYear(transformedArray)


        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };
    return (
        <View style={styles.container}>
            <Header filterData={filterData} total={total} />
            <PieChartScreen ref={pieChartRef} />
            <BarChartScreen ref={barChartRef} />
        </View>
    )
}

export default ChartScreen