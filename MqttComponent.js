import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import mqtt from 'mqtt';

const MqttComponent = () => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('Disconnected');

  useEffect(() => {
    const client = mqtt.connect('wss://mqtt-dashboard.com:8884', {
      clientId: 'clientId-m7IVCcfKJq',
    });

    client.on('connect', () => {
      setStatus('Connected');
      client.subscribe('testtopic/1', (err) => {
        if (err) {
          console.error('Subscription error:', err);
        }
      });
    });

    client.on('message', (topic, payload) => {
      setMessage(payload.toString());
    });

    client.on('error', (err) => {
      console.error('Connection error:', err);
      setStatus('Connection error');
    });

    client.on('close', () => {
      setStatus('Disconnected');
    });

    return () => {
      client.end();
    };
  }, []);

  return (
    <View>
      <Text>Status: {status}</Text>
      <Text>Message: {message}</Text>
    </View>
  );
};

export default MqttComponent;
