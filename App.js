import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { initializeClient, connectClient, disconnectClient } from './mqttServer';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    initializeClient();

    return () => {
      disconnectClient(() => setIsConnected(false));
    };
  }, []);

  const handleConnect = () => {
    connectClient(
      () => setIsConnected(true),
      (err) => console.log(err),
      (message) => setMessages((prevMessages) => [...prevMessages, message])
    );
  };

  const handleDisconnect = () => {
    disconnectClient(() => setIsConnected(false));
  };

  return (
    <View style={{ padding: 20 }}>
      <View style={{ flexDirection: 'row', marginTop: 60 }}>
        <Button
          title="Connect"
          onPress={handleConnect}
          disabled={isConnected}
        />
        <Button
          title="Disconnect"
          onPress={handleDisconnect}
          disabled={!isConnected}
          style={{ marginLeft: 10 }}
        />
      </View>

      <Text style={{ marginTop: 20, fontWeight: 'bold', fontSize: 16 }}>
        Connection Status: {isConnected ? 'Connected' : 'Disconnected'}
      </Text>

      <Text style={{ marginTop: 20 }}>MQTT Messages:</Text>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text>{item}</Text>}
      />
    </View>
  );
};

export default App;
