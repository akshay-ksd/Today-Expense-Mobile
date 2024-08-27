import { View, Text } from 'react-native'
import React from 'react'
import styles from './style'
import Header from '../../components/molecule/header/header'
import AddButton from '../../components/molecule/add-button/add-button'
import SingleReminder from './single-reminder/single-reminder'

const ReminderScreen = () => {
  return (
    <View style={styles.container}>
      <Header title={"Emi Reminder"}/>
      <SingleReminder/>
      <AddButton/>
    </View>
  )
}

export default ReminderScreen