import { View, Text, NativeModules, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import styles from './style'
import PopUp from '../../components/molecule/popup/popup'
import usePopup from '../../service/zustand/usePopup'
import Header from './header/header'
import { SimpleRecycler } from 'react-native-simple-recyclerlistview';
import SingleList from './single-list/single-list'
import colors from '../../components/constants/colors'
import ScreenRatio from '../../components/constants/ScreenRatio'
import _ from 'lodash';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated'
import LottieView from 'lottie-react-native';

const { BackgroundService, ExpenseModule } = NativeModules;

const HomeScreen = () => {
    const isPopup = usePopup((state: any) => state.isPopup);
    const setPopup = usePopup((state: any) => state.setPopup);
    const [allData, setAllData] = useState([])
    const [loading, setLoading] = useState(true);
    const [lastDate, setLastDate] = useState<any>();
    const [lastType, setLastType] = useState<any>();
    const [selectedItem, setSelect] = useState<any>();
    const [total, setTotal] = useState(0);
    const lastIdRef = useRef<any>(0);


    const recyclerRef = useRef<SimpleRecycler>(null);

    useEffect(() => {
        getAllExpenses()
    }, []);

    useEffect(() => {
        if (!isPopup) {
            setSelect(null)
        }
    }, [isPopup])


    const getAllExpenses = async () => {


    };
    type Expense = {
        id: any,
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

            const sortedExpenses = _.sortBy(filteredExpenses, [(expense: Expense) => {
                return parseDate(expense.date).getTime(); // Adjust this based on actual data structure
            }], ['desc']); // Sort descending; remove 'desc' for ascending
            const totalExpense = sortedExpenses.reduce((sum, item) => sum + parseInt(item.expense), 0);
            setTimeout(() => {
                setTotal(totalExpense)
                setLoading(false);
            }, 450);
            setTimeout(() => {
                recyclerRef.current?.loadDataFromApi(sortedExpenses);
            }, 500);
        } catch (error) {
            console.error('Error fetching expenses:', error);
            setLoading(false);
        }
    };


    const filterMonth = async (month: number, year: number): Promise<void> => {
        try {
            const expenses = await ExpenseModule.getAllExpenses();
            const filteredExpenses = _.filter(expenses, (expense) => {
                const expenseDate = new Date(expense.date);
                return (expenseDate.getMonth() + 1 === month) && (expenseDate.getFullYear() === year);
            });

            const groupedExpenses = _.groupBy(filteredExpenses, 'date'); // Assuming 'date' is in 'YYYY-MM-DD' format.

            const results = _.map(groupedExpenses, (expenses, dateKey) => ({
                description: dateKey,
                expense: _.sumBy(expenses, exp => parseInt(exp.expense))
            }));
            const totalExpense = results.reduce((sum, item) => sum + parseInt(item.expense), 0);
            setTimeout(() => {
                setTotal(totalExpense)
                setLoading(false);
            }, 450);
            setTimeout(() => {
                recyclerRef.current?.loadDataFromApi(results);
            }, 500);
        } catch (error) {
            console.error('Error fetching expenses:', error);
            setLoading(false);
        }
    };

    const filterYear = async (year: number): Promise<void> => {
        try {
            const expenses = await ExpenseModule.getAllExpenses();

            // First, filter expenses for the given year
            const yearlyExpenses = _.filter(expenses, expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate.getFullYear() === year;
            });

            // Group by month and sum expenses
            const groupedExpenses = _.groupBy(yearlyExpenses, expense => {
                const date = new Date(expense.date);
                return date.getMonth();
            });

            const results = _.mapValues(groupedExpenses, (expenses, month) => {
                return {
                    description: new Date(year, month).toLocaleString('default', { month: 'long' }),
                    expense: _.sumBy(expenses, exp => parseInt(exp.expense))
                };
            });
            const totalExpense = Object.values(results).reduce((sum, item) => sum + parseInt(item.expense), 0);


            setTimeout(() => {
                setTotal(totalExpense)
                setLoading(false);
            }, 450);
            setTimeout(() => {
                recyclerRef.current?.loadDataFromApi(Object.values(results));
            }, 500);
        } catch (error) {
            console.error('Error fetching expenses:', error);
            setLoading(false);
        }
    };


    const filterData = async (type: any, date: any) => {
        setLoading(true);
        setLastType(type)
        setLastDate(date)

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
    }

    function getCurrentFormattedDate(d: any) {
        const date = new Date(d || lastDate);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        return `${year}-${month}-${day}`;
    }

    const addData = (amount: string, description: string, date: string) => {
        setTimeout(async () => {
            if (getCurrentFormattedDate(new Date()) == date) {
                BackgroundService.stopService();

            }
            setSelect("")
            const lastId = await loadLastId()
            const data = { id: lastId, expense: amount, description, date }
            recyclerRef.current?.addNewData(data);
            calculateTotal(date)

            if (getCurrentFormattedDate(new Date()) == date) {

                setTimeout(() => {
                    BackgroundService.startService();
                }, 500);

            }

        }, 800);
    };

    const calculateTotal = async (date: any) => {
        const expenses: Expense[] = await ExpenseModule.getAllExpenses();

        // Filter expenses that exactly match the given date
        const filteredExpenses = _.filter(expenses, (item: Expense) => item.date === date);

        const sortedExpenses = _.sortBy(filteredExpenses, [(expense: Expense) => {
            return parseDate(expense.date).getTime(); // Adjust this based on actual data structure
        }], ['desc']); // Sort descending; remove 'desc' for ascending
        const totalExpense = sortedExpenses.reduce((sum, item) => sum + parseInt(item.expense), 0);
        setTotal(totalExpense)
    }

    const selectLit = (item: any) => {
        setSelect(item)
        setPopup(true)
    }

    const loadLastId = async () => {
        const expenses: Expense[] = await ExpenseModule.getAllExpenses();
        lastIdRef.current = expenses[expenses?.length - 1]?.id
        return expenses[expenses?.length - 1]?.id
    }

    const deleteItem = async (item: any) => {
        if (getCurrentFormattedDate(new Date()) == item?.date) {
            BackgroundService.stopService();

        }
        setPopup(false)
        setSelect("")
        setTimeout(() => {
            recyclerRef.current?.SpliceData(item?.index);
            setTimeout(async () => {
                ExpenseModule.deleteExpense(item?.id)
                    .then((response: any) => {
                        console.log(response);
                        // Handle success (e.g., update your UI)
                    })
                    .catch((error: any) => {
                        console.error(error);
                        // Handle error
                    });
                    if (getCurrentFormattedDate(new Date()) == item?.date) {
                        BackgroundService.startService();
                    }
            }, 50);
        }, 150);

        
    }

    const updateItem =(amount:any, description:any, date:any,id:any)=>{
        if (getCurrentFormattedDate(new Date()) == date) {
            BackgroundService.stopService();

        }
        recyclerRef.current?.updateItem({expense:amount,description,date,id},id)
        setTimeout(() => {
            if (getCurrentFormattedDate(new Date()) == date) {
                BackgroundService.startService();
            }
        }, 500);
    }
    


    const rowRenderer = (
        _type: string | number,
        data: any,
        index: number,
        _extendedState?: object | undefined,
    ) => {
        lastIdRef.current = data?.item?.id
        return <SingleList index={index} item={data?.item} selectLit={selectLit} />;
    };


    const emptyText =   <LottieView source={require('../../assets/lottie/noData.json')} autoPlay loop style={{ height: 120, width: 120 }} />
    return (
        <View style={styles.container}>
            <Header filterData={filterData} total={total} />

            {
                isPopup && (
                    <PopUp addData={addData} lastDate={lastDate} selectedItem={selectedItem} deleteItem={deleteItem} updateItem={updateItem} />
                )
            }

            {loading ? (
                <View style={styles.center}>
                    <LottieView source={require('../../assets/lottie/loader.json')} autoPlay loop style={{ height: 150, width: 150 }} />
                </View>
            ) : (
                <Animated.View entering={ZoomIn} exiting={ZoomOut} style={{ flexGrow: 1 }}>
                    <SimpleRecycler
                        ref={recyclerRef}
                        rowRenderer={rowRenderer}
                        height={ScreenRatio.height}
                        width={ScreenRatio.width}
                        emptyText={emptyText}
                        emptyTextStyle={styles.emptyText}
                        renderFooter={() => (
                            <View>
                                <View style={styles.footer} />
                            </View>
                        )}
                    />
                </Animated.View>
            )}
        </View>
    )
}

export default HomeScreen