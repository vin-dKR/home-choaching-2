import React, { ReactNode } from 'react';
import { ScrollView, View, Text, Button, ActivityIndicator } from 'react-native';
import FormInput from '@/components/ui/form-input';

interface OnboardingScreenProps {
    title: string;
    children: ReactNode;
    name: string;
    setName: (name: string) => void;
    phone: string;
    setPhone: (phone: string) => void;
    bio: string;
    setBio: (bio: string) => void;
    location: string;
    setLocation: (location: string) => void;
    handleGetLocation: () => void;
    onCompleteProfile: (name: string, phone: string, bio: string, location: string) => void;
    isUpdatingProfile: boolean;
    isLoading: boolean;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
    title,
    children,
    name, setName,
    phone, setPhone,
    bio, setBio,
    location, setLocation,
    handleGetLocation,
    onCompleteProfile,
    isUpdatingProfile,
    isLoading,
}) => {
    return (
        <ScrollView className="flex-1 p-4 bg-gray-50">
            <Text className="text-2xl font-bold mb-6 text-center">{title}</Text>

            <FormInput placeholder="Full Name" value={name} onChangeText={setName} />
            <FormInput placeholder="Phone (Optional)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <FormInput placeholder="Bio (Optional)" value={bio} onChangeText={setBio} multiline />

            <View className="flex-row items-center mb-4">
                <View className="flex-1 mr-2">
                    <FormInput placeholder="Location (e.g., city, state or use GPS)" value={location} onChangeText={setLocation} />
                </View>
                <Button title="Use My Location" onPress={handleGetLocation} />
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" className="my-8" />
            ) : (
                <>{children}</>
            )}

            <View className="mt-4 mb-8">
                <Button
                    title={isUpdatingProfile ? 'Saving...' : 'Complete Profile'}
                    onPress={() => onCompleteProfile}
                    disabled={isUpdatingProfile || isLoading}
                />
            </View>
        </ScrollView>
    );
};

export default OnboardingScreen;
