import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Button } from 'react-native';
import mqtt from 'mqtt';

export default function App() {
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [messages, setMessages] = useState([]);
  const [client, setClient] = useState(null);

  useEffect(() => {
    // Clean up MQTT client on unmount
    return () => {
      if (client) {
        client.end();
        setConnectionStatus('Disconnected');
      }
    };
  }, [client]);

  const connectClient = () => {
    if (client) return; // Already connected or connecting

    const options = {
      clientId: '95a05c0f-57a9-424a-be9b-2adfe3880709', // Your client ID
      port: 8884, // WebSocket port
      protocol: 'wss', // WebSocket Secure protocol
      connectTimeout: 3000,
    };

    const mqttClient = mqtt.connect('wss://broker.hivemq.com:8884/mqtt', options);

    mqttClient.on('connect', () => {
      setConnectionStatus('Connected');
      mqttClient.subscribe('95a05c0f-57a9-424a-be9b-2adfe3880708'); // Subscribe to the topic
    });

    mqttClient.on('error', (err) => {
      setConnectionStatus('Connection Error');
      console.error('Connection error:', err);
    });

    mqttClient.on('message', (topic, message) => {
      // Handle incoming messages
      setMessages((prevMessages) => [...prevMessages, { topic, message: message.toString() }]);
    });

    setClient(mqttClient);
  };

  const disconnectClient = () => {
    if (client) {
      client.end();
      setClient(null);
      setConnectionStatus('Disconnected');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Connection Status: {connectionStatus}</Text>
      <Button title="Connect" onPress={connectClient} disabled={connectionStatus === 'Connected'} />
      <Button title="Disconnect" onPress={disconnectClient} disabled={connectionStatus === 'Disconnected'} />
      <ScrollView style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <Text key={index}>{`Topic: ${msg.topic}, Message: ${msg.message}`}</Text>
        ))}
      </ScrollView>
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
    padding: 20,
  },
  messagesContainer: {
    marginTop: 20,
    width: '100%',
  },
});
