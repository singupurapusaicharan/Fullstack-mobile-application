// screens/OTPVerification.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';



export default function OTPVerification({ route, navigation }) {
  const [otp, setOtp] = useState('');
  const { email } = route.params;

  // useEffect(() => {
  //   console.log("Received params:", { email });
    
  // });


  const handleSendOtp = async () => {
    try {
      const response = await fetch('http://192.168.29.170:5000/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'OTP sent to your email');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      Alert.alert('Error', 'Failed to send OTP');
    }
  };


  const handleVerifyOtp = async () => {
    try {
      const response = await fetch('http://192.168.29.170:5000/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'OTP verified');
        navigation.navigate('SignIn');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      Alert.alert('Error', 'Failed to verify OTP');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      
      
  
      <TextInput
        placeholder="Enter OTP"
        style={styles.input}
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
        <Text style={styles.buttonText}>Send OTP to Email</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    width: '80%',
    padding: 15,
    backgroundColor: '#5a67d8',
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});




