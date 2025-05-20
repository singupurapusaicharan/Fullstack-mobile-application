// screens/signin.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    // Check for empty fields
    if (!email || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
  

    try {
      const response = await fetch('http://192.168.29.170:5000/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Response data:', data); // Check the response structure
      
      console.log('Response status:', response.status);


      if (response.ok) {
        // Ensure the response contains userId
        if (data && data.userId) {
          // Navigate to the Table screen on successful sign-in
          console.log('User ID:', data.userId); // Log the userId for verification
          
          navigation.navigate('Table', { userId: data.userId }); // Pass userId correctly

        } 
        else {
          Alert.alert('Error', 'Invalid response from server. Please try again later.');
        }
      } else {
        // Show specific error messages from backend
        if (data.message === 'Invalid credentials') {
          Alert.alert('Error', 'Incorrect password. Please try again.');
        } else if (data.message === 'No account created with this email.') {
          Alert.alert('Error', 'No account exists with this email. Please sign up first.');
        } else {
          Alert.alert('Error', 'Login failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
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
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    width: '80%',
    padding: 15,
    backgroundColor: '#5a67d8',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  linkText: {
    color: '#5a67d8',
    marginTop: 15,
  },
});
