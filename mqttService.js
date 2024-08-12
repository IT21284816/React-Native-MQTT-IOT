// mqttClient.js
import mqtt from 'mqtt';

const clientId = 'f45e55f7-a0eb-4795-841f-1a3c7c08db68';
const host = 'broker.hivemq.com';
const topic = 'sensor/accelerometer';

let client;

export const connectMQTT = (onMessageReceived, onConnectError) => {
  client = mqtt.connect(`wss://${host}:443`, {
    clientId,
    clean: true,
  });

  client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe(topic, (err) => {
      if (err) {
        console.error('Subscription error:', err);
        if (onConnectError) onConnectError(err);
      }
    });
  });

  client.on('message', (topic, message) => {
    const messageString = message.toString();
    console.log('Message received:', messageString);
    if (onMessageReceived) onMessageReceived(topic, messageString);
  });

  client.on('error', (err) => {
    console.error('Connection error:', err);
    if (onConnectError) onConnectError(err);
  });

  client.on('close', () => {
    console.log('MQTT connection closed');
  });
};

export const disconnectMQTT = () => {
  if (client) {
    client.end();
  }
};
