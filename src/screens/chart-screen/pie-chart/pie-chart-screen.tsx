import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import React, { FC, forwardRef, useImperativeHandle, useState } from 'react';
import styles from './style';
import { PieChart } from "react-native-chart-kit";
import ScreenRatio from '../../../components/constants/ScreenRatio';
import _ from 'lodash';
import Animated, { FadeOut, SlideInLeft, ZoomIn, ZoomOut } from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
 
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

  let usedColors: any = [];
  const [pieData, setPieData] = useState<any>([]);

  const groupByDescription = (data: any) => {
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

    const result = Object.values(mergedData);
    setPieData(result);
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
                      {pieData.map((item: any, index: any) => (
                        <View key={index} style={styles.legendItem}>
                          <View style={[styles.colorBox, { backgroundColor: item.color }]} />
                          <Text style={styles.legendText}>{item.name}- ₹{item.population}</Text>
                        </View>
                      ))}
                    </ScrollView>
                  </Animated.View>

                </>
                :
                <Animated.View style={{ height: ScreenRatio.height / 4, justifyContent: "center",alignItems:"center",width:"100%" }} entering={ZoomIn} exiting={ZoomOut}>
                  <LottieView source={require('../../../assets/lottie/noData.json')} autoPlay loop style={{ height: 120, width: 120 }} />
                </Animated.View>
            }


          </>
      }
    </Animated.View>
  );
};

export default forwardRef(PieChartScreen);
