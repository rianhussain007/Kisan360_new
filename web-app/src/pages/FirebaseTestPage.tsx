import React, { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const FirebaseTestPage = () => {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage('Login successful!');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMessage('Logged out successfully');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Firebase Connection Test</h2>
      
      {!user ? (
        <form onSubmit={handleLogin} style={styles.form}>
          <h3>Test Authentication</h3>
          <div style={styles.formGroup}>
            <label>Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              style={styles.input}
              required 
            />
          </div>
          <div style={styles.formGroup}>
            <label>Password:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={styles.input}
              required 
            />
          </div>
          <button type="submit" style={styles.button}>Test Login</button>
        </form>
      ) : (
        <div style={styles.loggedIn}>
          <h3>Success! Firebase is connected.</h3>
          <p>User ID: {user.uid}</p>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout} style={styles.button}>Logout</button>
        </div>
      )}
      
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '500px',
    margin: '2rem auto',
    padding: '2rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  } as const,
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  } as const,
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  } as const,
  input: {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  } as const,
  button: {
    padding: '0.75rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '1rem',
  } as const,
  loggedIn: {
    textAlign: 'center',
  } as const,
  message: {
    marginTop: '1rem',
    padding: '0.5rem',
    backgroundColor: '#e8f5e9',
    borderRadius: '4px',
    textAlign: 'center',
  } as const,
};

export default FirebaseTestPage;
