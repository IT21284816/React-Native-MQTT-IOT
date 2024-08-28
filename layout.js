// Layout.js
import React from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity  } from 'react-native';

const Layout = ({ children, onExit }) => {
  return (
    <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.header}>
        <Text style={styles.headerText}>MQTT Client</Text>
        <TouchableOpacity onPress={onExit} style={styles.exitButton}>
          <Text style={styles.exitButtonText}>Exit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    backgroundColor: '#0078e5',
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row', // Align items in a row
    alignItems: 'center', // Vertically center items
    justifyContent: 'space-between', // Space items to the ends
  },
  headerText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 0,
  },
  exitButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Layout;
