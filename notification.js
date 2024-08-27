import PushNotification from 'react-native-push-notification';

class NotificationManager {
  configure = () => {
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('LOCAL NOTIFICATION ==>', notification);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });

    // Create a channel for Android devices (required for Android 8.0+)
    PushNotification.createChannel(
      {
        channelId: 'mqtt-messages-channel',
        channelName: 'MQTT Messages',
        channelDescription: 'A channel for MQTT message notifications',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );
  };

  showNotification = (title, message) => {
    PushNotification.localNotification({
      channelId: 'mqtt-messages-channel',
      title: title,
      message: message,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      vibrate: true,
    });
  };

  cancelAllLocalNotifications = () => {
    PushNotification.cancelAllLocalNotifications();
  };
}

export const notificationManager = new NotificationManager();
