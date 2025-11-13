import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../services/supabase';

const TeacherOnboardingScreen: React.FC = () => {
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [subject, setSubject] = useState('');
    const router = useRouter();
    const queryClient = useQueryClient();

    const { mutate: updateProfile, isPending } = useMutation({
        mutationFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user logged in');

            const { error } = await supabase
                .from('profiles')
                .update({ name, bio, onboarded: true })
                .eq('id', user.id);

            if (error) throw error;
        },
        onSuccess: () => {
            console.log("go ahead for the dashboard")
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            router.push('/teacher/dashboard');
        },
        onError: (error) => {
            Alert.alert('An Error Occurred', error.message);
        }
    });

    return (
        <View className="flex-1 justify-center p-4">
            <Text className="text-2xl mb-4 text-center">Teacher Onboarding</Text>
            <TextInput
                className="border p-2 mb-2"
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                className="border p-2 mb-2"
                placeholder="A brief bio"
                value={bio}
                onChangeText={setBio}
                multiline
            />
            <TextInput
                className="border p-2 mb-4"
                placeholder="Subject you teach"
                value={subject}
                onChangeText={setSubject}
            />
            <Button title={isPending ? 'Saving...' : 'Complete Profile'} onPress={() => updateProfile()} disabled={isPending} />
        </View>
    );
};

export default TeacherOnboardingScreen;
