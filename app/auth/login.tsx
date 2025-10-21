
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login, isPending, isError, error } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    login({ email, password }, {
      onSuccess: (data) => {
        if (data.error) {
            Alert.alert('Login Failed', data.error.message);
        } else {
            // The root layout will handle redirecting to the correct dashboard
            // so we don't need to do it here.
        }
      },
      onError: (error) => {
        Alert.alert('An Error Occurred', error.message);
      }
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16, textAlign: 'center' }}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 8, marginBottom: 16 }}
      />
      <Button title={isPending ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={isPending} />
      {isError && <Text style={{ color: 'red', marginTop: 8, textAlign: 'center' }}>{error.message}</Text>}
      <View style={{ marginTop: 16 }} />
      <Button title="Don't have an account? Sign Up" onPress={() => router.push('/auth/signup')} />
    </View>
  );
};

export default LoginScreen;
