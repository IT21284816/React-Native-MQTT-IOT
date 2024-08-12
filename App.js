// App.js
import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, Button } from 'react-native';
import { connectMQTT, disconnectMQTT } from './mqttClient';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const onMessageReceived = (topic, message) => {
      setMessages(prevMessages => [...prevMessages, { topic, message }]);
    };

    const onConnectError = (err) => {
      setError(`Connection Error: ${err.message}`);
    };

    connectMQTT(onMessageReceived, onConnectError);

    return () => {
      disconnectMQTT();
    };
  }, []);

  return (
    <SafeAreaView>
      <View>
        <Text>MQTT Messages:</Text>
        {messages.map((msg, index) => (
          <Text key={index}>{`Topic: ${msg.topic}, Message: ${msg.message}`}</Text>
        ))}
        {error && <Text style={{ color: 'red' }}>{error}</Text>}
        <Button title="Disconnect" onPress={disconnectMQTT} />
      </View>
    </SafeAreaView>
  );
};

export default App;
