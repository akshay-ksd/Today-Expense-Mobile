import { View, Text, NativeModules } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import styles from './style'
import Ripple from 'react-native-material-ripple';
import AllTimeTab from '../../../components/molecule/all-time-tab/all-time-tab';
import DailyTab from '../../../components/molecule/daily-tab/daily-tab';
import MonthTab from '../../../components/molecule/month-tab/month-tab';
import YearTab from '../../../components/molecule/year-tab/year-tab';
import { SegmentedControl } from '../../../components/molecule/segment-control/segment-control';
const Header: FC<any> = ({ filterData, total }) => {
    const [selectedTab, setSelectedTab] = useState("Daily")
    const { BackgroundService, ExpenseModule } = NativeModules;
    const [selectedOption, setSelectedOption] = useState('Daily');
    const options = ['Daily', 'Monthly', 'Yearly'];

    const Box: FC<any> = ({ title }) => {
        return (
            <Ripple style={[styles.box, { backgroundColor: selectedOption == title ? "black" : "#f2f2f2" }]} onPress={() => setSelectedOption(title)}>
                <Text style={[styles.labelText, { color: selectedOption == title ? "white" : "black" }]}>{title}</Text>
            </Ripple>
        )
    }


    const filterByDaily = (date: any) => {
        filterData("D", date)
    }

    const filterMonth = (date: any) => {
        filterData("M", date)
    }

    const filterYear = (date: any) => {
        filterData("Y", date)
    }



    return (
        <View style={styles.container}>
            <View style={styles.tab}>
                <Box title={"Daily"} />
                <Box title={"Monthly"} />
                <Box title={"Yearly"} />
            </View>
            {selectedOption == "Daily" && (<DailyTab filterByDaily={filterByDaily} total={total} />)}
            {selectedOption == "Monthly" && (<MonthTab filterMonth={filterMonth} total={total} />)}
            {selectedOption == "Yearly" && (<YearTab filterYear={filterYear} total={total} />)}
        </View>
    )
}

export default Header