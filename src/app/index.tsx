
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Redirect } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useIdTokenAuthRequest } from 'expo-auth-session/providers/google';

import {
  getAuthErrorMessage,
  signInWithGoogleNative,
  signInWithGoogleWeb,
} from '../lib/auth';
import { useAuth } from '../providers/auth-provider';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [request, response, promptAsync] = useIdTokenAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    selectAccount: true,
  });

  useEffect(() => {
    const completeNativeLogin = async () => {
      if (Platform.OS === 'web' || response?.type !== 'success') return;

      const idToken = response.params?.id_token;

      if (!idToken) {
        setError('Google did not return an ID token. Please try again.');
        setLoading(false);
        return;
      }

      try {
        await signInWithGoogleNative(idToken);
      } catch (err) {
        setError(getAuthErrorMessage(err) ?? '');
      } finally {
        setLoading(false);
      }
    };

    completeNativeLogin();
  }, [response]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');

      if (Platform.OS === 'web') {
        await signInWithGoogleWeb();
        setLoading(false);
      } else {
        if (!request) {
          setError('Google login is still loading. Try again shortly.');
          setLoading(false);
          return;
        }

        await promptAsync();
      }
    } catch (err) {
      setError(getAuthErrorMessage(err) ?? '');
      setLoading(false);
    }
  };

  // Safety net: if the guard in _layout.tsx has not moved us yet, go now.
  if (isAuthenticated) return <Redirect href="/dashboard" />;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logo}>HB+</Text>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Sign in with your official HB+ account
        </Text>

        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleGoogleLogin}
          disabled={loading || (Platform.OS !== 'web' && !request)}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Login with Google</Text>
          )}
        </TouchableOpacity>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.footer}>Secure Authentication Portal</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 420,
    padding: 30,
    borderRadius: 18,
    alignItems: 'center',
    elevation: 5,
  },
  logo: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  error: {
    color: '#DC2626',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 15,
  },
  footer: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 25,
  },
});
