import { View, StatusBar, Text, Share, Linking } from 'react-native';
import React, { FC } from 'react';
import styles from './styles';
import Animated from 'react-native-reanimated';
import { ParamListBase, RouteProp } from '@react-navigation/native';
import SingleSettings from './single-settings/single-settings';
import Icons from "react-native-vector-icons/Ionicons";

interface props {
  route: RouteProp<ParamListBase>;
}

const UserProfile: FC<props> = ({ route }) => {
  const shareApp = async () => {
    setTimeout(async() => {
      try {
        await Share.share({
          message: 'Check out this amazing app: [Your App Name]! You can download it from [App Store/Play Store URL].',
          title: 'Share My App',
          url: 'https://example.com', // Replace with your app's URL if available
        });
      } catch (error) {
        console.error('Error sharing the app:', error);
      }
    }, 300);
  };

  const openPlayStore = () => {
    const url = 'market://details?id=com.yourapp.package'; // Replace with your app's package name
    setTimeout(() => {
      Linking.canOpenURL(url).then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          // Handle the case where the Play Store app is not installed or the URL is invalid
          console.log('Play Store is not supported on this device.');
        }
      }).catch((err) => {
        console.error('An error occurred', err);
      });
    }, 300);
  };

  const openGmail = () => {
    const email = 'akshaykarandakkad92@gmail.com'; // Replace with your email address
    const subject = 'Contact Us'; // Optional: subject line
    const body = ''; // Optional: email body
  
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setTimeout(() => {
      Linking.openURL('mailto:akshya.karandakkad@gmail.com?subject=SendMail&body=Description')
    }, 300);
  };

  const sendFeedback = async () => {  
    setTimeout(async() => {
      Linking.openURL('whatsapp://send?text=hello&phone=8157896995')
    }, 300);
  };

  const settings = [
    {
      id: 1,
      icon: null,
      title: "Expense By Category",
      action: <Icons name={"apps-outline"} size={20} color={"black"} />,
      path: "CategoryScreen"
    },
    {
      id: 3,
      icon: null,
      title: "Rate App",
      action: <Icons name={"star-outline"} size={20} color={"black"} />,
      path: false,
      ping: ()=>openPlayStore()
    },
    {
      id: 4,
      icon: null,
      title: "Share App",
      action: <Icons name={"share-social-outline"} size={20} color={"black"} />,
      path: false,
      ping: () => shareApp()
    },
    {
      id: 5,
      icon: null,
      title: "Privacy Policy",
      action: <Icons name={"lock-closed-outline"} size={20} color={"black"} />,
      path: "PrivacyPolicy"
    },
    {
      id: 6,
      icon: null,
      title: "Terms And Condition",
      action: <Icons name={"document-outline"} size={20} color={"black"} />,
      path: "TermsAndCondition"
    },
    {
      id: 7,
      icon: null,
      title: "Contact Us",
      action: <Icons name={"mail-outline"} size={20} color={"black"} />,
      path: false,
      ping: () => openGmail()
    },
    {
      id: 8,
      icon: null,
      title: "Feedback",
      action: <Icons name={"chatbox-outline"} size={20} color={"black"} />,
      path: false,
      ping: () => sendFeedback()
    }
  ];

  return (
    <Animated.View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Icons name={"settings-outline"} size={24} color={"black"} />
      </View>
      {
        settings.map((item, index) => (
          <SingleSettings item={item} key={item?.id} />
        ))
      }
    </Animated.View>
  );
};

export default UserProfile;
