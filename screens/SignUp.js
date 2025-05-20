// screens/SignUp.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';


export default function SignUp({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');


  const handleSignUp = async () => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;


  // Validate input fields
  if (!username || !email || !password || !phone) {
    Alert.alert('Error', 'All fields are required');
    return;
  }

  // Validate password strength
  if (!passwordRegex.test(password)) {
    Alert.alert(
      'Weak Password',
      'Password must be at least 8 characters, include an uppercase letter, a number, and a special character.'
    );
    return;
  }

  
  if (phone.length !== 10) {
    Alert.alert('Error', 'Phone number must be exactly 10 digits');
    return;
  }


  try {
    const response = await fetch('http://192.168.29.170:5000/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, phone }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Response Data:", data); // Debug line
      // Alert.alert('Success', 'OTP sent to your phone');
      navigation.navigate('OTPVerification', { email });
    } else {
      console.log("Server Error:", data.message); // Debug line
      Alert.alert('Error', data.message);
    }
  } catch (error) {
    console.error('Error during signup:', error);
    Alert.alert('Error', 'Something went wrong. Please try again later.');
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
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
      <TextInput
        placeholder="Phone"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.linkText}>Already have an account? Sign In</Text>
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