// MQTTStatus.js
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { connectMQTT, disconnectMQTT, subscribe, onMessageReceived } from './mqttService';

const MQTTStatus = () => {
  const [status, setStatus] = useState('Disconnected');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const client = connectMQTT();

    client.on('connect', () => {
      setStatus('Connected');
      // Subscribe to the accelerometer topic
      subscribe('sensor/accelerometer');
    });

    client.on('error', () => setStatus('Error'));
    client.on('reconnect', () => setStatus('Reconnecting'));
    client.on('close', () => setStatus('Disconnected'));

    // Handle incoming messages
    onMessageReceived((topic, message) => {
      setMessages(prevMessages => [...prevMessages, { topic, message }]);
    });

    return () => {
      disconnectMQTT();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>Status: {status}</Text>
      <ScrollView style={styles.messageContainer}>
        {messages.map((msg, index) => (
          <View key={index} style={styles.message}>
            <Text>Topic: {msg.topic}</Text>
            <Text>Message: {msg.message}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    marginTop: 20,
    width: '100%',
    flex: 1,
  },
  message: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default MQTTStatus;
