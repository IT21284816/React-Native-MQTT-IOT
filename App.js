import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import mqttClient from './mqttService'; // Import the MQTT service

export default function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleMessage = (topic, message) => {
      setMessage(message.toString());
    };

    mqttClient.on('message', handleMessage);

    // Cleanup on unmount
    return () => {
      mqttClient.off('message', handleMessage);
      mqttClient.end();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>MQTT Message: {message}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
