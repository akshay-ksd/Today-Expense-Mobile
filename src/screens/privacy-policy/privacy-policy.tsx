import { View, Text } from 'react-native'
import React from 'react'
import styles from './style'
import Header from '../../components/molecule/header/header'
import WebViewScreen from '../../components/template/web-view/web-view'
import { privacy_policy } from '../../components/constants/url'
const PrivacyPolicy = () => {

  return (
    <View style={styles.container}>
      <Header title={"Privacy Policy"}/>
      <WebViewScreen url={privacy_policy}/>
    </View>
  )
}

export default PrivacyPolicy