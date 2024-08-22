import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { onMessageListener } from './messagehandler'; // Import your message handler
import '@react-native-firebase/app';
import { Paho } from 'paho-mqtt';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const mqttClient = new Paho.MQTT.Client(
      'broker.hivemq.com',
      8884,
      '208d1aef-fa4f-48ee-a507-07fb6d7ec77d'
    );

    mqttClient.onConnectionLost = (responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.log('Connection Lost:', responseObject.errorMessage);
        setIsConnected(false);
      }
    };

    mqttClient.onMessageArrived = (message) => {
      console.log('Message Arrived:', message.payloadString);
      setMessages((prevMessages) => [...prevMessages, message.payloadString]);
      
      // Trigger Firebase notification for new messages
      messaging()
        .getToken()
        .then(fcmToken => {
          if (fcmToken) {
            // Send a message via FCM
            fetch('https://fcm.googleapis.com/fcm/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'key=YOUR_SERVER_KEY', // Replace with your server key
              },
              body: JSON.stringify({
                to: fcmToken,
                notification: {
                  title: 'New MQTT Message',
                  body: message.payloadString,
                },
              }),
            }).catch(error => console.error('FCM Error:', error));
          }
        });
    };

    setClient(mqttClient);

    return () => {
      if (mqttClient.isConnected()) {
        mqttClient.disconnect();
      }
    };
  }, []);

  const connectClient = () => {
    if (client && !client.isConnected()) {
      client.connect({
        onSuccess: () => {
          console.log('Connected');
          setIsConnected(true);
          client.subscribe('95a05c0f-57a9-424a-be9b-2adfe3880708');
        },
        onFailure: (err) => {
          console.log('Connection Failed:', err);
        },
        useSSL: true,
      });
    }
  };

  const disconnectClient = () => {
    if (client && client.isConnected()) {
      client.disconnect();
      console.log('Disconnected');
      setIsConnected(false);
    }
  };

  useEffect(() => {
    onMessageListener(setMessages); // Register foreground message listener
    messaging().requestPermission()
      .then(authStatus => {
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
          console.log('Authorization status:', authStatus);
        }
      });

    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open from background state:', remoteMessage.notification);
    });

    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage.notification);
      }
    });

    return unsubscribe; // Clean up the listener on unmount
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <View style={{ flexDirection: 'row', marginTop: 60 }}>
        <Button
          title="Connect"
          onPress={connectClient}
          disabled={isConnected}
        />
        <Button
          title="Disconnect"
          onPress={disconnectClient}
          disabled={!isConnected}
          style={{ marginLeft: 10 }}
        />
      </View>

      <Text style={{ marginTop: 20, fontWeight: 'bold', fontSize: 16 }}>
        Connection Status: {isConnected ? 'Connected' : 'Disconnected'}
      </Text>

      <Text style={{ marginTop: 20 }}>MQTT Messages:</Text>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text>{item}</Text>}
      />
    </View>
  );
};

export default App;
