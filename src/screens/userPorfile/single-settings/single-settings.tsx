import { View, Text } from 'react-native'
import React, { FC } from 'react'
import styles from './style'
import Ripple from "react-native-material-ripple";
import { useNavigation } from '@react-navigation/native';

const SingleSettings: FC<any> = ({ item }) => {
    const navigation:any = useNavigation();

    const goReminder =()=> {
        if(item?.path == false){
            item?.ping()
            return
        }
        setTimeout(() => {
            navigation.navigate(item?.path)
        }, 100);
    }

    return (
        <View style={styles.container}>
            <Ripple style={styles.box} onPress={goReminder}>
                <View style={styles.details}>
                    {item?.icon}
                    <Text style={styles.title}>{item?.title}</Text>
                </View>
                {
                    item?.action ? (
                        item?.action
                    ):<View/>
                }
            </Ripple>
        </View>
    )
}

export default SingleSettings