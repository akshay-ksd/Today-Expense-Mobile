import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import UserList from '../screens/userList';
import UserProfile from '../screens/userPorfile';
import React from 'react';
import TabRouter from './tab';
import ReminderScreen from '../screens/reminder-screen/reminder-screen';
import CategoryScreen from '../screens/category-screen/category-screen';
import PrivacyPolicy from '../screens/privacy-policy/privacy-policy';
import TermsAndCondition from '../screens/terms-and-condition/terms-and-condition';
const Stack = createStackNavigator();
const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="HomeScreen" component={TabRouter} />
        <Stack.Screen name="ReminderScreen" component={ReminderScreen}
          options={{ presentation: 'modal', animationTypeForReplace: 'push' }}
        />
        <Stack.Screen name="CategoryScreen" component={CategoryScreen}
          options={{ presentation: 'modal', animationTypeForReplace: 'push' }}
        />
        <Stack.Screen
          name="UserProfile"
          component={UserProfile}
        />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy}
          options={{ presentation: 'modal', animationTypeForReplace: 'push' }}
        />
        <Stack.Screen name="TermsAndCondition" component={TermsAndCondition}
          options={{ presentation: 'modal', animationTypeForReplace: 'push' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
