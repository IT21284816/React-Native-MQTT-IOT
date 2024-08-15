import PushNotification from 'react-native-push-notification';

class NotificationService {
  configure(onNotification) {
    PushNotification.configure({
      onNotification: function (notification) {
        // Process the notification here
        console.log('Notification:', notification);
        if (onNotification) {
          onNotification(notification);
        }
      },
      // Android only
      popInitialNotification: true,
      requestPermissions: true,
    });
  }

  localNotification(title, message) {
    PushNotification.localNotification({
      title: title,
      message: message,
    });
  }
}

export default new NotificationService();
