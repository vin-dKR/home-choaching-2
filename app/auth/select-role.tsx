import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../services/supabase';

const SelectRoleScreen: React.FC = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { mutate: setRole, isPending } = useMutation({
        mutationFn: async (role: 'student' | 'teacher') => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user logged in');

            const { error } = await supabase
                .from('profiles')
                .update({ role })
                .eq('id', user.id);

            if (error) throw error;
            return role;
        },
        onSuccess: (role) => {
            console.log("hey we are done selecting the roles")
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            router.replace(role === 'student' ? '/student/onboarding' : '/teacher/onboarding');
        },
        onError: (error) => {
            Alert.alert('An Error Occurred', error.message);
        }
    });

    return (
        <View className="flex-1 justify-center p-4">
            <Text className="text-2xl mb-8 text-center">Choose Your Role</Text>
            <View className="space-y-4">
                <Button
                    title={isPending ? '...' : 'I am a Student'}
                    onPress={() => setRole('student')}
                    disabled={isPending}
                />
                <Button
                    title={isPending ? '...' : 'I am a Teacher'}
                    onPress={() => setRole('teacher')}
                    disabled={isPending}
                />
            </View>
        </View>
    );
};

export default SelectRoleScreen;
