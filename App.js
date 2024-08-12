import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import mqttClient from './mqttService';

export default function App() {
  const [message, setMessage] = useState('Waiting for message...');

  useEffect(() => {
    mqttClient.onMessageArrived = (msg) => {
      console.log(`Message received: ${msg.payloadString}`);
      setMessage(msg.payloadString);
    };

    return () => {
      mqttClient.disconnect();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>MQTT Message: {message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
