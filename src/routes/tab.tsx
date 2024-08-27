// import * as React from 'react';
// import { Text, View } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Material from 'react-native-vector-icons/MaterialIcons';

// function Services() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Services!</Text>
//     </View>
//   );
// }

// function Activity() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Activity!</Text>
//     </View>
//   );
// }

// function Account() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Account!</Text>
//     </View>
//   );
// }

// const Tab = createBottomTabNavigator();

// export default function TabRouter() {
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         headerShown: false,
//         tabBarStyle: { backgroundColor: 'white', height: 55 },
//       }}
//     >
//       <Tab.Screen
//         name="Services"
//         component={Services}
//         options={{
//           tabBarLabel: 'Services',
//           tabBarLabelStyle: { color: 'black', fontFamily: 'Poppins-Medium', fontSize: 12 },
//           tabBarIcon: ({ color, size, focused }) => (
//             <Ionicons name="add-circle" color={focused ? 'black' : 'gray'} size={size} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Activity"
//         component={Activity}
//         options={{
//           tabBarLabel: 'Activity',
//           tabBarLabelStyle: { color: 'black', fontFamily: 'Poppins-Medium', fontSize: 12 },
//           tabBarIcon: ({ color, size, focused }) => (
//             <Ionicons name="reader" color={focused ? 'black' : 'gray'} size={size} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Account"
//         component={Account}
//         options={{
//           tabBarLabel: 'Account',
//           tabBarLabelStyle: { color: 'black', fontFamily: 'Poppins-Medium', fontSize: 12 },
//           tabBarIcon: ({ color, size, focused }) => (
//             <Ionicons name="person" color={focused ? 'black' : 'gray'} size={size} />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// }

import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Ionicons from "react-native-vector-icons/Ionicons"
import CustomBottomTab from '../components/molecule/CustomBottomTab/CustomBottomTab';
import HomeScreen from '../screens/home-screen/home-screen';
import ChartScreen from '../screens/chart-screen/chart-screen';
import UserProfile from '../screens/userPorfile';

function MyNetwork() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>My Network!</Text>
        </View>
    );
}

function POst() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Post!</Text>
        </View>
    );
}

function Notification() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Notification!</Text>
        </View>
    );
}

function SettingsScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Settings!</Text>
        </View>
    );
}

const Tab = createBottomTabNavigator();
export type BottomTabParamList = {
    Home: undefined;
    Notification: undefined;
    Profile: undefined;
};

const CustomBottomTabs = (props: BottomTabBarProps) => {
    return <CustomBottomTab {...props} />;
};


export default function App() {
    return (
            <Tab.Navigator tabBar={CustomBottomTabs}
                screenOptions={{ headerShown: false }}>
                <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                <Tab.Screen name="ChartScreen" component={ChartScreen} options={{ headerShown: false }} />
                <Tab.Screen name="Profile" component={UserProfile} options={{ headerShown: false }} />
            </Tab.Navigator>
    );
}
