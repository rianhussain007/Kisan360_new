import React, { useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

const FirebaseConnectionTest = () => {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage('Login successful!');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setMessage('Logged out successfully');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
          <button type="submit" style={styles.button} disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Test Login'}
          </button>
        </form>
      ) : (
        <div style={styles.loggedIn}>
          <h3>✅ Success! Firebase is connected.</h3>
          <p>User ID: {user.uid}</p>
          <p>Email: {user.email}</p>
          <button 
            onClick={handleLogout} 
            style={styles.button}
            disabled={isLoading}
          >
            {isLoading ? 'Signing out...' : 'Logout'}
          </button>
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
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
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
    textAlign: 'center' as const,
  },
  message: {
    marginTop: '1rem',
    padding: '0.5rem',
    backgroundColor: '#e8f5e9',
    borderRadius: '4px',
    textAlign: 'center' as const,
  } as const,
};

export default FirebaseConnectionTest;
