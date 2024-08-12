// MqttClient.js
import mqtt from 'mqtt';
import { useState, useEffect } from 'react';

const useMqttClient = (brokerUrl, clientId, topic) => {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Connect to the MQTT broker with the client ID
    const client = mqtt.connect(brokerUrl, { clientId });

    // Event handler when the client connects to the broker
    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      // Subscribe to the topic
      client.subscribe(topic, (err) => {
        if (err) {
          console.error('Subscribe error:', err);
        }
      });
    });

    // Event handler when a message is received
    client.on('message', (topic, payload) => {
      console.log(`Received message on topic ${topic}: ${payload.toString()}`);
      setMessage(payload.toString());
    });

    // Clean up on component unmount
    return () => {
      client.end();
    };
  }, [brokerUrl, clientId, topic]);

  return message;
};

export default useMqttClient;
