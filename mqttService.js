import mqtt from 'mqtt';

// Define your MQTT broker URL
const BROKER_URL = 'mqtt://broker.hivemq.com:1883'; // HiveMQ public broker, port 1883

// Create a client instance with your client ID
const client = mqtt.connect(BROKER_URL, {
  clientId: 'f45e55f7-a0eb-4795-841f-1a3c7c08db68', // Your specific client ID
  clean: true, // Optional: set to false to receive retained messages on reconnection
});

client.on('connect', () => {
  console.log(`Connected to MQTT broker with client ID: ${client.options.clientId}`);
  // Subscribe to the accelerometer topic
  client.subscribe('sensor/accelerometer', (err) => {
    if (err) {
      console.error('Subscription error:', err);
    }
  });
});

export default client;
