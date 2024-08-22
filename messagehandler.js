import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import '@react-native-firebase/app';

// Handle background and quit state messages
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
  // Show a local notification or handle the message as needed
  Alert.alert('New Message', remoteMessage.notification.body);
});

// Handle foreground messages
export const onMessageListener = () => {
  messaging().onMessage(async remoteMessage => {
    console.log('A new FCM message arrived!', remoteMessage);
    // Show a local notification or handle the message as needed
    Alert.alert('New Message', remoteMessage.notification.body);
  });
};
