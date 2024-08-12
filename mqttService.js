import { AsyncStorage } from '@react-native-async-storage/async-storage';
import init from 'react_native_mqtt';

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {},
});

const options = {
  host: 'broker.hivemq.com',
  port: 1883,
  path: '',
  id: 'f45e55f7-a0eb-4795-841f-1a3c7c08db68', // Your MQTT Client ID
};

const client = new Paho.MQTT.Client(options.host, options.port, options.path);

client.onConnectionLost = (responseObject) => {
  if (responseObject.errorCode !== 0) {
    console.log('Connection Lost:', responseObject.errorMessage);
  }
};

client.onMessageArrived = (message) => {
  console.log('Message Arrived:', message.payloadString);
};

client.connect({
  onSuccess: () => {
    console.log('Connected to MQTT broker');
    client.subscribe('sensor/accelerometer');
  },
  onFailure: (error) => {
    console.error('Connection failed:', error);
  },
});

export default client;
