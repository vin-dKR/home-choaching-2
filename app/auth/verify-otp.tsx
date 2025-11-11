import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, verifyOTP } from '../../actions/auth';

const VerifyOTPScreen: React.FC = () => {
    const { contact } = useLocalSearchParams<{ contact: string }>();
    const [token, setToken] = useState('');
    const router = useRouter();
    const queryClient = useQueryClient();

    const { mutate: verify, isPending } = useMutation({
        mutationFn: verifyOTP,
        onSuccess: async (response) => {
            if (response.error) {
                Alert.alert('Verification Error', response.error.message);
                return;
            }

            if (response.data && response.data.session) {
                // Invalidate queries to refetch session and profile
                await queryClient.invalidateQueries({ queryKey: ['session'] });
                const profile = await queryClient.fetchQuery({ queryKey: ['profile'], queryFn: getProfile });

                // Check if the user has completed onboarding
                if (profile && profile.onboarded) {
                    // Redirect to the correct dashboard based on role
                    router.replace(profile.role === 'student' ? '/student/dashboard' : '/teacher/dashboard');
                } else {
                    // New user, redirect to role selection
                    router.replace('/auth/select-role');
                }
            }
        },
        onError: (error) => {
            Alert.alert('An Error Occurred', error.message);
        }
    });

    const handleVerifyOTP = () => {
        if (!contact) {
            Alert.alert('Error', 'Contact information not found.');
            return;
        }
        if (!token) {
            Alert.alert('Error', 'Please enter the OTP.');
            return;
        }
        verify({ contact, token });
    };

    return (
        <View className="flex-1 justify-center p-4">
            <Text className="text-2xl mb-4 text-center">Verify Your Code</Text>
            <TextInput
                className="border p-2 mb-4"
                placeholder="Enter OTP"
                value={token}
                onChangeText={setToken}
                keyboardType="numeric"
            />
            <Button title={isPending ? 'Verifying...' : 'Verify'} onPress={handleVerifyOTP} disabled={isPending} />
        </View>
    );
};

export default VerifyOTPScreen;
