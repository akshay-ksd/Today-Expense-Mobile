import { View, Text, ActivityIndicator } from 'react-native';
import React, { FC, forwardRef, useImperativeHandle, useState } from 'react';
import styles from './style';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";
import ScreenRatio from '../../../components/constants/ScreenRatio';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { FadeIn, ZoomIn, ZoomOut } from 'react-native-reanimated';
import LottieView from 'lottie-react-native';

const BarChartScreen: FC<any> = (props, ref) => {
    const [loading, setLoading] = useState(false)
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                data: []
            }
        ]
    });

    useImperativeHandle(ref, () => ({
        loadData: (data: any) => {
            setTimeout(() => {
                setLoading(true)
                const groupedByDate = data.reduce((acc: any, expense: any) => {
                    const date = expense.date;
                    if (!acc[date]) {
                        acc[date] = 0;
                    }
                    acc[date] += parseFloat(expense.expense);
                    return acc;
                }, {});

                const dates = Object.keys(groupedByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

                const labels = dates.map(date => new Date(date).toLocaleDateString());
                const expenseData = dates.map(date => groupedByDate[date].toFixed(2));

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            data: expenseData
                        }
                    ]
                });
                setTimeout(() => {
                    setLoading(false)
                }, 800);
            }, 300);

        },
        loadByYear: (data: any) => {
            setTimeout(() => {
                setLoading(true)

                const labels = data.map((item: any) => item?.description);
                const expenseData = data.map((item: any) => item?.expense);
                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            data: expenseData
                        }
                    ]
                });
                setTimeout(() => {
                    setLoading(false)
                }, 800);
            }, 300);
        }
    }));

    const chartConfigs = [
        {
            backgroundColor: '#000000',
            backgroundGradientFrom: '#1E2923',
            backgroundGradientTo: '#08130D',
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
            style: {
                borderRadius: 16
            }
        },
        {
            backgroundColor: '#022173',
            backgroundGradientFrom: '#022173',
            backgroundGradientTo: '#1b3fa0',
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
                borderRadius: 16
            }
        },
        {
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        },
        {
            backgroundColor: '#26872a',
            backgroundGradientFrom: '#43a047',
            backgroundGradientTo: '#66bb6a',
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
                borderRadius: 16,

            }
        },
        {
            backgroundColor: '#000000',
            backgroundGradientFrom: '#000000',
            backgroundGradientTo: '#000000',
            color: (opacity = 1) => `rgba(${255}, ${255}, ${255}, ${opacity})`
        }, {
            backgroundColor: '#0091EA',
            backgroundGradientFrom: '#0091EA',
            backgroundGradientTo: '#0091EA',
            color: (opacity = 1) => `rgba(${255}, ${255}, ${255}, ${opacity})`
        },
        {
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
                borderRadius: 16
            }
        },
        {
            backgroundColor: '#b90602',
            backgroundGradientFrom: '#e53935',
            backgroundGradientTo: '#ef5350',
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
                borderRadius: 16
            }
        },
        {
            backgroundColor: '#ff3e03',
            backgroundGradientFrom: '#ff3e03',
            backgroundGradientTo: '#ff3e03',
            color: (opacity = 1) => `rgba(${0}, ${0}, ${0}, ${opacity})`
        }
    ];
    const getWidth = () => {
        const w = chartData?.labels?.length / 5
        const width = ScreenRatio.width * (w > 2 ? w : 0.8);
        return width
    }
    return (
        <View style={styles.container}>
            {
                loading ?
                    <View style={{ height: ScreenRatio.height / 3, justifyContent: "center" }}>
                        <LottieView source={require('../../../assets/lottie/loader.json')} autoPlay loop style={{ height: 150, width: 150 }} />
                    </View>
                    :
                    <>
                        {
                            chartData.labels?.length ?
                                <ScrollView horizontal>
                                    <Animated.View entering={ZoomIn} exiting={ZoomOut} style={{ width: getWidth() }}>
                                        <BarChart
                                            style={{
                                                borderRadius: 16,
                                                marginVertical: 8,

                                            }}
                                            data={chartData}
                                            width={getWidth()}
                                            height={ScreenRatio.height / 3}
                                            yAxisLabel="₹"
                                            chartConfig={chartConfigs[2]}
                                            verticalLabelRotation={0}
                                            fromZero={true}
                                            showValuesOnTopOfBars

                                        />
                                    </Animated.View>

                                </ScrollView>
                                :
                                <Animated.View style={{ height: ScreenRatio.height / 3, justifyContent: "center", alignItems: "center", width: "100%" }} entering={ZoomIn} exiting={ZoomOut}>
                                    <LottieView source={require('../../../assets/lottie/noData.json')} autoPlay loop style={{ height: 120, width: 120 }} />
                                </Animated.View>
                        }
                    </>
            }
            {/* <View style={{ height: 120 }} /> */}
        </View>
    );
}

export default forwardRef(BarChartScreen);
