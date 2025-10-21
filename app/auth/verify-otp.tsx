
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { verifyOTP } from '../../actions/auth';

const VerifyOTPScreen: React.FC = () => {
  const { contact } = useLocalSearchParams<{ contact: string }>();
  const [token, setToken] = useState('');
  const router = useRouter();

  const { mutate: verify, isPending } = useMutation({
    mutationFn: verifyOTP,
  });

  const handleVerifyOTP = () => {
    if (!contact) {
        Alert.alert('Error', 'Contact information not found.');
        return;
    }
    verify({ contact, token }, {
        onSuccess: (response) => {
            if (response.error) {
                Alert.alert('Error', response.error.message);
            } else if (response.data &&  response.data.session) {
                // Check if the user is onboarded
                if (response.data.user && response.data.user.user_metadata?.onboarded) {
                    const role = response.data.user.user_metadata?.role;
                    if (role === 'teacher') {
                        router.replace('/teacher/dashboard');
                    } else {
                        router.replace('/student/dashboard');
                    }
                } else {
                    router.replace('/auth/select-role');
                }
            }
        },
        onError: (error) => {
            Alert.alert('An Error Occurred', error.message);
        }
    });
  };

  return (
    <View className="flex-1 justify-center p-4">
      <Text className="text-2xl mb-4 text-center">Enter the OTP sent to {contact}</Text>
      <TextInput
        className="border p-2 mb-2"
        placeholder="OTP"
        value={token}
        onChangeText={setToken}
        keyboardType="number-pad"
      />
      <Button title={isPending ? 'Verifying...' : 'Verify OTP'} onPress={handleVerifyOTP} disabled={isPending} />
    </View>
  );
};

export default VerifyOTPScreen;
