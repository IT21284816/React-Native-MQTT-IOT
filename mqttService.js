// mqttService.js
import mqtt from 'mqtt';

// Define your MQTT broker URL
const BROKER_URL = 'mqtt://your-broker-url:port'; // Replace with your broker's URL

// Create a client instance
const client = mqtt.connect(BROKER_URL, {
  // Optional configuration
  username: 'your-username',
  password: 'your-password',
});

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  // Subscribe to a topic
  client.subscribe('your/topic', (err) => {
    if (err) {
      console.error('Subscription error:', err);
    }
  });
});

export default client;
