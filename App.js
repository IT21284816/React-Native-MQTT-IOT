import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert, BackHandler, StyleSheet  } from 'react-native';
import init from 'react_native_mqtt';
import { AsyncStorage } from '@react-native-async-storage/async-storage';
import Layout from './layout';

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  reconnect: true,
  sync: {},
});

const App = () => {
  const [messages, setMessages] = useState([]);
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const mqttClient = new Paho.MQTT.Client(
      'broker.hivemq.com',
      8884,
      '208d1aef-fa4f-48ee-a507-07fb6d7ec77d'
    );

    mqttClient.onConnectionLost = (responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.log('Connection Lost:', responseObject.errorMessage);
        setIsConnected(false);
      }
    };

    mqttClient.onMessageArrived = (message) => {
      console.log('Message Arrived:', message.payloadString);
      setMessages((prevMessages) => [...prevMessages, message.payloadString]);
    };

    setClient(mqttClient);

    return () => {
      if (mqttClient.isConnected()) {
        mqttClient.disconnect();
      }
    };
  }, []);

  const connectClient = () => {
    if (client && !client.isConnected()) {
      client.connect({
        onSuccess: () => {
          console.log('Connected');
          setIsConnected(true);
          client.subscribe('95a05c0f-57a9-424a-be9b-2adfe3880708');
        },
        onFailure: (err) => {
          console.log('Connection Failed:', err);
        },
        useSSL: true,
      });
    }
  };

  const disconnectClient = () => {
    if (client && client.isConnected()) {
      client.disconnect();
      console.log('Disconnected');
      setIsConnected(false);
    }
  };

  const handleExit = () => {
    Alert.alert('Exit', 'Are you sure you want to exit?', [
      { text: 'Cancel' },
      { text: 'OK', onPress: () => BackHandler.exitApp() }, // Exit the app
    ]);
  };

  return (
    <Layout onExit={handleExit}>
       {/* Display the connection status */}
       <View style={[styles.statusContainer, isConnected ? styles.connected : styles.disconnected]}>
        <Text style={styles.statusText}>
          Connection Status: {isConnected ? 'Connected' : 'Disconnected'}
        </Text>
      </View>
    <View style={{ padding: 0 }}>
      <View style={{ flexDirection: 'row', marginTop: 60 }}>
        <Button
          title="Connect"
          onPress={connectClient}
          disabled={isConnected}
        />
        <Button
          title="Disconnect"
          onPress={disconnectClient}
          disabled={!isConnected}
          style={{ marginLeft: 10 }}
        />
      </View>

     

      <Text style={{ marginTop: 30, marginBottom:20, fontStyle: 'italic', fontSize:16 }}>MQTT Messages:</Text>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => 
          <View style={styles.messageBox}>
        <Text style={styles.messageText}>{item}</Text>
        </View>}
      />
    </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  statusContainer: {
    padding: 5,
    borderRadius: 5,
    margin: 0,
    alignItems: 'center',
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  connected: {
    backgroundColor: '#03e700',
  },
  disconnected: {
    backgroundColor: 'red',
  },
  messageBox: {
    borderWidth: 1,
    borderColor: '#ccc', // You can customize this color
    padding: 10,
    marginBottom: 10,
    borderRadius: 5, // Optional: adds rounded corners
  },
  messageText: {
    fontSize: 16,
  },
});
export default App;
