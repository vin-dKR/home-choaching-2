import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { signInWithOTP } from '../../actions/auth';

const LoginScreen: React.FC = () => {
    console.log('----111 login page')
    const [contact, setContact] = useState('');
    const router = useRouter();

    const { mutate: sendOTP, isPending } = useMutation({
        mutationFn: signInWithOTP,
    });

    const handleSendOTP = () => {
        console.log("intialize the otp")
        const isEmail = contact.includes('@');
        const options = {
            [isEmail ? 'email' : 'phone']: contact,
        };

        sendOTP(options, {
            onSuccess: (data) => {
                if (data.error) {
                    console.log("intialize on onSuccess")
                    console.log('Error', data.error.message);
                } else {
                    console.log("intialize on else")
                    router.push({ pathname: '/auth/verify-otp', params: { contact } });
                }
            },
            onError: (error) => {
                Alert.alert('An Error Occurred', error.message);
            }
        });
        console.log("error after send otp")
    };

    return (
        <View
            className="flex-1 justify-center p-4 bg-red-900"
        >
            <Text className="text-2xl mb-4 text-center">Enter your email or phone number</Text>
            <TextInput
                className="border p-2 mb-2"
                placeholder="Email or Phone Number"
                value={contact}
                onChangeText={setContact}
                autoCapitalize="none"
            />
            <Button title={isPending ? 'Sending OTP...' : 'Send OTP'} onPress={handleSendOTP} disabled={isPending} />
        </View>
    );
};

export default LoginScreen;
