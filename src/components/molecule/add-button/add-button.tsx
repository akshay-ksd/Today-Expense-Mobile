import { View, Text } from 'react-native'
import React, { FC } from 'react'
import styles from './style'
import Ripple from "react-native-material-ripple";
import Icons from "react-native-vector-icons/Ionicons";

const AddButton:FC<any> = ({onPress}) => {
  return (
    <View style={styles.container}>
        <Ripple style={styles.add} onPress={onPress}>
            <Icons name={"add-outline"} size={28} color={"white"}/>
        </Ripple>
    </View>
  )
}

export default AddButton