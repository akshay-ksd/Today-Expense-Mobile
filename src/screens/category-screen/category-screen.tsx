import { View, Text, ActivityIndicator, NativeModules } from 'react-native'
import React, { useRef, useState } from 'react'
import styles from './style'
import Header from '../../components/molecule/header/header'
import SingleCategory from './single-category/single-category'
import { SimpleRecycler } from 'react-native-simple-recyclerlistview';
import ScreenRatio from '../../components/constants/ScreenRatio'
import colors from '../../components/constants/colors'
import DateHeader from "./header/header"
import _ from 'lodash';
import Animated, { ZoomIn, ZoomInEasyDown, ZoomOut } from 'react-native-reanimated'
import LottieView from 'lottie-react-native'

const CategoryScreen = () => {
  const [loading, setLoading] = useState(true);
  const [lastDate, setLastDate] = useState<any>();
  const [lastType, setLastType] = useState<any>();
  const [total, setTotal] = useState(0);

  const recyclerRef = useRef<SimpleRecycler>(null);
  const { BackgroundService, ExpenseModule } = NativeModules;
  type Expense = {
    date: string; // Date in "DD-MM-YYYY" format
    amount: number;
    // ... other fields
  };
  let usedColors: any = [];


  function parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day); // month is 0-based in JavaScript Date
  }

  function getRandomColor() {
    // Helper function to generate a random color in hex format
    function generateRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    let color;
    // Generate new colors until we find one that hasn't been used yet
    do {
      color = generateRandomColor();
    } while (usedColors.includes(color));

    // Add the chosen color to the usedColors array
    usedColors.push(color);

    return color;
  }

  const groupCategory = (sortedExpenses: any) => {
    const groupedData = _.chain(sortedExpenses)
      .groupBy('description')
      .map((value: any, key: any) => ({
        description: _.trim(key), // Remove whitespace from the name
        expense: _.sumBy(value, (item: any) => parseFloat(item.expense)),
        color: getRandomColor(),
      }))
      .value();

    const mergedData = groupedData.reduce((acc: any, item: any) => {
      if (acc[item.description]) {
        acc[item.description].expense += item.expense;
      } else {
        acc[item.description] = { ...item };
      }
      return acc;
    }, {});
    return mergedData
  }

  const filterByDay = async (date: string): Promise<void> => {
    const expenses: Expense[] = await ExpenseModule.getAllExpenses();

    // Filter expenses that exactly match the given date
    const filteredExpenses = _.filter(expenses, (item: Expense) => item.date === date);

    // Assuming there's another field to sort by, e.g., `time` or `expense`
    // Adjust the sorting key accordingly
    const sortedExpenses: any = _.sortBy(filteredExpenses, [(expense: Expense) => {
      // If `expense` includes a time or another relevant field to sort by
      return parseDate(expense.date).getTime(); // Adjust this based on actual data structure
    }], ['desc']); // Sort descending; remove 'desc' for ascending

    const totalExpense = sortedExpenses.reduce((sum, item) => sum + parseInt(item.expense), 0);

    setTotal(totalExpense)

    setTimeout(() => {
      setTotal(totalExpense)
      setLoading(false);
    }, 450);
    setTimeout(() => {
      recyclerRef.current?.loadDataFromApi(Object.values(groupCategory(sortedExpenses)));
    }, 500);

  }

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
      setTimeout(() => {
        setTotal(totalExpense)
        setLoading(false);
      }, 450);
      setTimeout(() => {
        recyclerRef.current?.loadDataFromApi(Object.values(groupCategory(sortedExpenses)));
      }, 500);
     
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
      const totalExpense = sortedExpenses.reduce((sum, item) => sum + parseInt(item.expense), 0);

      setTotal(totalExpense)
      setTimeout(() => {
        setTotal(totalExpense)
        setLoading(false);
      }, 450);
      setTimeout(() => {
        recyclerRef.current?.loadDataFromApi(Object.values(groupCategory(sortedExpenses)));
      }, 500);

    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const filterData = async (type: any, date: any) => {
    setLoading(true)
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
  const emptyText =   <LottieView source={require('../../assets/lottie/noData.json')} autoPlay loop style={{ height: 120, width: 120 }} />

  const rowRenderer = (
    _type: string | number,
    data: any,
    index: number,
    _extendedState?: object | undefined,
  ) => {
    return <SingleCategory item={data?.item} />;
  };

  return (
    <Animated.View style={styles.container} entering={ZoomIn.duration(400)}>
      <Header title={"Category"} />
      <DateHeader total={total} filterData={filterData} />
      {loading ? (
        <View style={styles.center}>
          <LottieView source={require('../../assets/lottie/loader.json')} autoPlay loop style={{ height: 150, width: 150 }} />
        </View>
      ) : (
        <Animated.View entering={ZoomIn.duration(500)} exiting={ZoomOut.duration(500)} style={{ flexGrow: 1 }}>
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
    </Animated.View>
  )
}

export default CategoryScreen