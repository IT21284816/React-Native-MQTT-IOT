import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert, BackHandler, StyleSheet, ImageBackground  } from 'react-native';
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
      '5f7f2334-107b-41ed-89ee-6a8dee6e266c'
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
          client.subscribe('duhun123');
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

      <ImageBackground source={require('./images/background.jpg')} style={styles.background}>

    <View style={{ padding: 20, }}>
      <View style={{ flexDirection: 'row', marginTop: 30, }}>
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

     

      <View style={{ marginTop: 30, marginBottom: 20, backgroundColor: '#00b7ce', padding: 10,maxWidth: 170, borderRadius: 5 }}>
        <Text style={{ fontStyle: 'italic',fontWeight: 'bold', fontSize: 18, color: 'white'}}>MQTT Messages :</Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => 
          <View style={styles.messageBox}>
        <Text style={styles.messageText}>{item}</Text>
        </View>}
      />
    </View></ImageBackground>
    </Layout>
  );
};

const styles = StyleSheet.create({
  statusContainer: {
    padding: 5,
    borderRadius: 0,
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
    borderColor: '#ccc', // Border color
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Transparent background
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    // Shadow properties
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 4, // Shadow blur radius
    elevation: 4, // Elevation for Android shadow
  },
  messageText: {
    fontSize: 16,
    padding:5,
  },
  background: {
    flex: 1,
    width: '100%', // Ensures the image covers the full width
    height: '100%', // Ensures the image covers the full height
    resizeMode: 'cover', // Adjusts the image to cover the entire container
  },

  
});
export default App;
