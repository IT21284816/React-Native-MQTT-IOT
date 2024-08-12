import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import MQTTComponent from './MQTTComponent'; // Adjust the path as necessary

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <MQTTComponent />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default App;
