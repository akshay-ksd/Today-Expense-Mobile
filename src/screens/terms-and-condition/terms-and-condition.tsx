import { View, Text } from 'react-native'
import React from 'react'
import styles from './style'
import Header from '../../components/molecule/header/header'
import WebViewScreen from '../../components/template/web-view/web-view'
import { terms_and_condition } from '../../components/constants/url'
const TermsAndCondition = () => {

  return (
    <View style={styles.container}>
      <Header title={"Terms And Condition"}/>
      <WebViewScreen url={terms_and_condition}/>
    </View>
  )
}

export default TermsAndCondition