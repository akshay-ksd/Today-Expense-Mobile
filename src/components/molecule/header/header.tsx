import { View, Text } from 'react-native'
import React, { FC } from 'react'
import styles from './style'
import Icons from "react-native-vector-icons/Ionicons";
import Ripple from "react-native-material-ripple";
import { useNavigation } from '@react-navigation/native';
import AnimatedText from '../../atom/animated-text/animated-text';
const Header: FC<any> = ({ title }) => {
    const navigation: any = useNavigation();

    const goBack = () => {
        setTimeout(() => {
            navigation.goBack()
        }, 300);
    }

    return (
        <View style={styles.container}>
            <Ripple onPress={goBack}>
                <Icons name={"chevron-back-outline"} size={24} color={"black"} />
            </Ripple>
            <View style={{width:10}}/>
            <AnimatedText text={title} style={styles.title} />
        </View>
    )
}

export default Header