import {View, Text, SafeAreaView, StatusBar, NativeModules} from 'react-native';
import React, { useEffect } from 'react';
import Routes from './src/routes';
const { BackgroundService,AlarmModule } = NativeModules;

const App = () => {
  useEffect(()=>{
    BackgroundService.startService();
    // getAllExpenses()
    // AlarmModule.scheduleDailyNotification();
  },[])

  
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <Routes />
    </SafeAreaView>
  );
};

export default App;
