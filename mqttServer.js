import init from 'react_native_mqtt';
import { AsyncStorage } from '@react-native-async-storage/async-storage';
import { Paho } from 'paho-mqtt'; // Ensure you have paho-mqtt installed

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  reconnect: true,
  sync: {},
});

let client = null;

export const initializeClient = () => {
  client = new Paho.MQTT.Client(
    'broker.hivemq.com',
    8884,
    '208d1aef-fa4f-48ee-a507-07fb6d7ec77d'
  );

  client.onConnectionLost = (responseObject) => {
    if (responseObject.errorCode !== 0) {
      console.log('Connection Lost:', responseObject.errorMessage);
    }
  };

  client.onMessageArrived = (message) => {
    console.log('Message Arrived:', message.payloadString);
    if (onMessageReceived) {
      onMessageReceived(message.payloadString);
    }
  };

  return client;
};

export const connectClient = (onConnect, onFailure, onMessageReceived) => {
  if (client && !client.isConnected()) {
    client.connect({
      onSuccess: () => {
        console.log('Connected');
        onConnect();
        client.subscribe('95a05c0f-57a9-424a-be9b-2adfe3880708');
      },
      onFailure: (err) => {
        console.log('Connection Failed:', err);
        onFailure(err);
      },
      useSSL: true,
    });
  }
};

export const disconnectClient = (onDisconnect) => {
  if (client && client.isConnected()) {
    client.disconnect();
    console.log('Disconnected');
    onDisconnect();
  }
};
