// App.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useMqttClient from './mqttService';

const App = () => {
  // MQTT broker details
  const brokerUrl = 'mqtt://broker.hivemq.com:1883';
  const clientId = 'f45e55f7-a0eb-4795-841f-1a3c7c08db68';
  const topic = 'sensor/accelerometer';
  
  // Get messages from MQTT
  const message = useMqttClient(brokerUrl, clientId, topic);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>MQTT Messages:</Text>
      <Text style={styles.message}>{message || 'No message received'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: 'blue',
  },
});

export default App;
