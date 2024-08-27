import { View, Text } from 'react-native'
import React, { FC, useState } from 'react'
import styles from './style'
import Ripple from 'react-native-material-ripple';
import DailyTab from '../../../components/molecule/daily-tab/daily-tab';
import MonthTab from '../../../components/molecule/month-tab/month-tab';
import YearTab from '../../../components/molecule/year-tab/year-tab';
import useFilterType from '../../../service/zustand/filterType';

const Header: FC<any> = ({ filterData, total }) => {

    const setFilterType = useFilterType((state:any) => state?.setFilterType)
    const filterType = useFilterType((state:any) => state?.filterType)

    const Box: FC<any> = ({ title }) => {
        return (
            <Ripple style={[styles.box, { backgroundColor: filterType == title ? "black" : "#f2f2f2" }]} onPress={() => setFilterType(title)}>
                <Text style={[styles.labelText, { color: filterType == title ? "white" : "black" }]}>{title}</Text>
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
            {filterType == "Daily" && (<DailyTab filterByDaily={filterByDaily} total={total} />)}
            {filterType == "Monthly" && (<MonthTab filterMonth={filterMonth} total={total} />)}
            {filterType == "Yearly" && (<YearTab filterYear={filterYear} total={total} />)}
        </View>
    )
}

export default Header