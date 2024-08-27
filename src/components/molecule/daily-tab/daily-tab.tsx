import { View, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import styles from './style';
import Icons from 'react-native-vector-icons/Ionicons';
import Ripple from 'react-native-material-ripple';
import Animated, { FadeIn, ZoomIn, ZoomInDown, ZoomInEasyUp } from 'react-native-reanimated';
import DatePicker from 'react-native-date-picker'
import { useIsFocused } from '@react-navigation/native';

const DailyTab: React.FC<any> = ({filterByDaily,total}) => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [open,setOpen] = useState<any>(false);
    const isFocused = useIsFocused()

    useEffect(() => {
        if(isFocused){
            setCurrentDate(new Date());
            filterByDaily(new Date())
        }
    }, [isFocused]);

    const handleDateChange = (days: number) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + days);
        setCurrentDate(newDate);
        filterByDaily(newDate);
    };

    const day = currentDate.getDate();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    const openCalender = () => {
        setOpen(true)
    }

    return (
        <View style={styles.container}>
            <Animated.View style={styles.box} entering={ZoomIn.duration(500)}>
                <Ripple onPress={() => handleDateChange(-1)} style={[styles.date, { backgroundColor: "white" }]}>
                    <Icons name={"chevron-back-outline"} size={20} color={"black"} />
                </Ripple>
                <Ripple style={styles.labelContainer} onPress={openCalender}>
                    <View style={styles.date}>
                        <Text style={styles.dateText}>{day}</Text>
                    </View>
                    <View>
                        <Text style={[styles.dateText, { color: "black", marginLeft: 10 }]}>{month}</Text>
                        <Text style={[styles.dateText, { color: "black", marginLeft: 10 }]}>{year}</Text>
                    </View>
                </Ripple>
                <View style={styles.totalContainer}>
                    <Text style={[styles.dateText, { color: "black" }]}>Total</Text>
                    <Animated.Text style={[styles.dateText, { color: "black" }]} entering={FadeIn}>₹{total.toFixed(2)}</Animated.Text>
                </View>
                <Ripple onPress={() => handleDateChange(1)} style={[styles.date, { backgroundColor: "white" }]}>
                    <Icons name={"chevron-forward-outline"} size={20} color={"black"} />
                </Ripple>
            </Animated.View>
            <DatePicker
                modal
                mode='date'
                open={open}
                date={currentDate}
                onConfirm={(date) => {
                    setOpen(false)
                    setCurrentDate(date)
                    filterByDaily(new Date(date));
                }}
                onCancel={() => {
                    setOpen(false)
                }}
            />
        </View>
    );
}

export default DailyTab;
