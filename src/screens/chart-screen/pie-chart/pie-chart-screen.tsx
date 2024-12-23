import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import React, { FC, forwardRef, useImperativeHandle, useState } from 'react';
import styles from './style';
import { PieChart } from "react-native-chart-kit";
import ScreenRatio from '../../../components/constants/ScreenRatio';
import _ from 'lodash';
import Animated, { FadeOut, SlideInLeft, ZoomIn, ZoomOut } from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import Ripple from "react-native-material-ripple"
const PieChartScreen: FC<any> = (props, ref) => {
  const [loader, setLoader] = useState(true)
  const colorCodes = [
    "#4F81BD",  // Blue
    "#C0504D",  // Red
    "#9BBB59",  // Green
    "#F79646",  // Orange
    "#8064A2",  // Purple
    "#FFCC00",  // Yellow
    "#4BACC6",  // Teal
    "#808080",  // Gray
    "#E36C09",  // Pink
    "#93C47D"   // Light Green
  ];

  const [pieData, setPieData] = useState<any>([]);

  const [mostSpend, setMostSpend] = useState("");
  const [leastSpend, setLeastSpend] = useState("");


  const groupByDescription = (data: any) => {
    const expenses = _.map(data, (item: any) => ({
      ...item,
      expense: parseFloat(item.expense) // Ensure the expense is a number
    }));

    // Use Lodash to find the most and least expensive items
    const mostExpensive = _.maxBy(expenses, 'expense');
    const leastExpensive = _.minBy(expenses, 'expense');

    setMostSpend(`🍕  Most spend: ${mostExpensive?.description} (₹${mostExpensive?.expense})`);
    setLeastSpend(`🛍  Least spend: ${leastExpensive?.description} (₹${leastExpensive?.expense})`)
    const groupedData = _.chain(data)
      .groupBy('description')
      .map((value: any, key: any) => ({
        name: _.trim(key), // Remove whitespace from the name
        population: _.sumBy(value, (item: any) => parseFloat(item.expense)),
        color: getRandomColor(),
        legendFontColor: '#7F7F7F',
        legendFontSize: 10,
        legendMargin: 10
      }))
      .value();

    const mergedData = groupedData.reduce((acc: any, item: any) => {
      if (acc[item.name]) {
        acc[item.name].population += item.population;
      } else {
        acc[item.name] = { ...item };
      }
      return acc;
    }, {});

    let finalData: any = []

    const result = Object.values(mergedData);
    // Check if result contains more than 4 items
    if (result.length > 4) {
      // Sort data by population (descending)
      result.sort((a: any, b: any) => b.population - a.population);

      // Get top 4 items
      let top4 = result.slice(0, 4);

      // Group the rest into "Others"
      let others = {
        name: "Others",
        population: result.slice(4).reduce((sum: any, item: any) => sum + item.population, 0), // Handle the remaining items
        color: "#CCCCCC", // Color for 'Others'
        legendFontColor: "#7F7F7F",
        legendFontSize: 10,
        legendMargin: 10
      };

      // Combine top 4 with 'Others'
      finalData = [...top4, others];

    } else {
      // If there are 4 or fewer items, return the result as-is
      finalData = result;
    }


    setPieData(finalData);
    setTimeout(() => {
      setLoader(false)
    }, 800);

  };

  useImperativeHandle(ref, () => ({
    loadData: (data: any) => {
      setTimeout(() => {
        setLoader(true)
        groupByDescription(data);
      }, 300);
    }
  }));

  // Function to return a random color without repetition
  // Array of material design colors
  const materialColors = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
    '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',
    '#795548', '#9E9E9E', '#607D8B'
  ];

  let usedColors_: any[] = []; // To track used colors

  function getRandomColor() {
    let color;

    // Generate new colors until we find one that hasn't been used yet
    do {
      color = materialColors[Math.floor(Math.random() * materialColors.length)];
    } while (usedColors_.includes(color));

    // Add the chosen color to the usedColors_ array
    usedColors_.push(color);

    return color;
  }



  return (
    <Animated.View style={styles.container}>
      {
        loader ?
          <View style={{ height: ScreenRatio.height / 4, justifyContent: "center" }}>
            <LottieView source={require('../../../assets/lottie/loader.json')} autoPlay loop style={{ height: 150, width: 150 }} />
          </View>
          :
          <>
            {
              pieData.length ?
                <>
                  <Animated.View entering={ZoomIn} exiting={ZoomOut.duration(500)}>
                    <PieChart
                      data={pieData}
                      width={ScreenRatio.width - 10}
                      height={ScreenRatio.height / 4}
                      chartConfig={{
                        backgroundColor: '#e26a00',
                        backgroundGradientFrom: '#fb8c00',
                        backgroundGradientTo: '#ffa726',
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                          borderRadius: 16,
                        }
                      }}
                      accessor="population"
                      backgroundColor="transparent"
                      paddingLeft="20"
                      absolute
                      hasLegend={false}
                    />
                    <ScrollView style={styles.scrollView}>
                      <Ripple onPress={props.showCategory}>
                        {pieData.map((item: any, index: any) => (
                          <View key={index} style={styles.legendItem}>
                            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
                            <Text style={styles.legendText}>{item.name}- ₹{item.population}</Text>
                          </View>
                        ))}
                      </Ripple>

                    </ScrollView>
                    <View style={styles.footer}>
                      <Text style={styles.footerText}>{mostSpend}</Text>
                      <Text style={styles.footerText}>{leastSpend}</Text>
                    </View>
                  </Animated.View>

                </>
                :
                <Animated.View style={{ height: ScreenRatio.height / 4, justifyContent: "center", alignItems: "center", width: "100%" }} entering={ZoomIn} exiting={ZoomOut}>
                  <LottieView source={require('../../../assets/lottie/noData.json')} autoPlay loop style={{ height: 120, width: 120 }} />
                </Animated.View>
            }


          </>
      }
    </Animated.View>
  );
};

export default forwardRef(PieChartScreen);
