// mqttService.js
import mqtt from 'mqtt';

let client;
let messageCallbacks = [];

// Connect to the MQTT broker
export const connectMQTT = () => {
  const host = 'mqtt://broker.hivemq.com';
  const options = {
    clientId: 'f45e55f7-a0eb-4795-841f-1a3c7c08db68', // Your client ID
    clean: true, // Clean session
    connectTimeout: 4000, // Connection timeout in ms
  };

  client = mqtt.connect(host, options);

  client.on('connect', () => {
    console.log('Connected to MQTT broker');
  });

  client.on('error', (err) => {
    console.error('MQTT Error:', err);
  });

  client.on('reconnect', () => {
    console.log('Reconnecting to MQTT broker');
  });

  client.on('close', () => {
    console.log('Disconnected from MQTT broker');
  });

  client.on('message', (topic, message) => {
    console.log(`Received message on topic ${topic}: ${message.toString()}`);
    // Notify all registered message handlers
    messageCallbacks.forEach(callback => callback(topic, message.toString()));
  });

  return client;
};

// Disconnect from the MQTT broker
export const disconnectMQTT = () => {
  if (client) {
    client.end();
  }
};

// Subscribe to a topic
export const subscribe = (topic) => {
  if (client) {
    client.subscribe(topic);
  }
};

// Publish a message to a topic
export const publish = (topic, message) => {
  if (client) {
    client.publish(topic, message);
  }
};

// Register a callback to handle messages
export const onMessageReceived = (callback) => {
  messageCallbacks.push(callback);
};
