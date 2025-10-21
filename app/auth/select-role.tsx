
import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../services/supabase';

const SelectRoleScreen: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: updateUser, isPending } = useMutation({
    mutationFn: async (role: 'student' | 'teacher') => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { error } = await supabase.auth.updateUser({
        data: { 
          role: role,
          onboarded: true
        }
      });

      if (error) throw error;
      return role;
    },
    onSuccess: (role) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      if (role === 'teacher') {
        router.replace('/teacher/onboarding');
      } else {
        router.replace('/student/onboarding');
      }
    },
    onError: (error) => {
      Alert.alert('An Error Occurred', error.message);
    }
  });

  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-2xl mb-8 text-center">What is your role?</Text>
      <View className="flex-row justify-around w-full">
        <Button title="Student" onPress={() => updateUser('student')} disabled={isPending} />
        <Button title="Teacher" onPress={() => updateUser('teacher')} disabled={isPending} />
      </View>
    </View>
  );
};

export default SelectRoleScreen;
