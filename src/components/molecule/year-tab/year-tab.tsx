import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from './style';
import Icons from 'react-native-vector-icons/Ionicons';
import Ripple from 'react-native-material-ripple';
import Animated, { FadeIn, ZoomIn, ZoomOut } from 'react-native-reanimated';
import { useIsFocused } from '@react-navigation/native';

const YearTab: React.FC<any> = ({filterYear,total}) => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const isFocused = useIsFocused()

    useEffect(() => {
        // This will update the state when the component mounts
        if(isFocused){
            setCurrentDate(new Date());
            filterYear(new Date())
        }
       
    }, [isFocused]);

    const handleDateChange = (years: number) => {
        const newDate = new Date(currentDate);
        newDate.setFullYear(currentDate.getFullYear() + years);
        setCurrentDate(newDate);
        filterYear(newDate)
    };

    const year = currentDate.getFullYear();

    return (
        <View style={styles.container}>
            <Animated.View style={styles.box} entering={ZoomIn.duration(500)} >
                <Ripple onPress={() => handleDateChange(-1)} style={[styles.date, { backgroundColor: "white" }]}>
                    <Icons name={"chevron-back-outline"} size={20} color={"black"} />
                </Ripple>
                <View style={styles.labelContainer}>
                    <Text style={[styles.dateText, { color: "black", marginLeft: 5 }]}>{year}</Text>
                </View>
                <View style={styles.totalContainer}>
                    <Text style={[styles.dateText, { color: "black" }]}>Total</Text>
                    <Text style={[styles.dateText, { color: "black" }]}>₹{total.toFixed(2)}</Text>
                </View>
                <Ripple onPress={() => handleDateChange(1)} style={[styles.date, { backgroundColor: "white" }]}>
                    <Icons name={"chevron-forward-outline"} size={20} color={"black"} />
                </Ripple>
            </Animated.View>
        </View>
    );
}

export default YearTab;
