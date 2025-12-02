
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { signUpWithPassword } from '../../actions/auth';

const SignUpScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const { mutate: signUp, isPending, isError, error } = useMutation({
        mutationFn: signUpWithPassword,
    });

    const handleSignUp = () => {
        signUp({ email, password }, {
            onSuccess: (data) => {
                if (data.error) {
                    Alert.alert('Sign Up Failed', data.error.message);
                } else {
                    Alert.alert('Success', 'Please check your email to verify your account.');
                    router.push('/auth/login');
                }
            },
            onError: (error) => {
                Alert.alert('An Error Occurred', error.message);
            }
        });
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
            <Text style={{ fontSize: 24, marginBottom: 16, textAlign: 'center' }}>Sign Up</Text>
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
            <Button title={isPending ? 'Creating account...' : 'Sign Up'} onPress={handleSignUp} disabled={isPending} />
            {isError && <Text style={{ color: 'red', marginTop: 8, textAlign: 'center' }}>{error.message}</Text>}
            <View style={{ marginTop: 16 }} />
            <Button title="Already have an account? Login" onPress={() => router.push('/auth/login')} />
        </View>
    );
};

export default SignUpScreen;
