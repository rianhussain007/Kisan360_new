import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
// import { auth } from '../services/firebase';
// import { signInWithEmailAndPassword, signOut, User } from 'firebase/auth';

const FirebaseTestScreen = () => {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [user, setUser] = useState<{uid: string, email: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Mock Firebase auth state - no real Firebase dependency
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);
      // Mock Firebase login - simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful login
      const mockUser = {
        uid: 'mock-user-123',
        email: email
      };
      setUser(mockUser);
      setMessage('Mock Login successful!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      // Mock Firebase logout - simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUser(null);
      setMessage('Mock Logged out successfully');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Connection Test</Text>
      
      {!user ? (
        <View style={styles.form}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
          />
          
          <Button 
            title={loading ? 'Signing in...' : 'Test Login'} 
            onPress={handleLogin} 
            disabled={loading}
          />
        </View>
      ) : (
        <View style={styles.loggedIn}>
          <Text style={styles.success}>✅ UI Test Mode - Mock Firebase Screen</Text>
          <Text>User ID: {user.uid}</Text>
          <Text>Email: {user.email}</Text>
          <Button 
            title={loading ? 'Signing out...' : 'Logout'} 
            onPress={handleLogout} 
            disabled={loading}
          />
        </View>
      )}
      
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  loggedIn: {
    alignItems: 'center',
  },
  success: {
    color: 'green',
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  message: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#e8f5e9',
    borderRadius: 5,
    textAlign: 'center',
  },
});

export default FirebaseTestScreen;
