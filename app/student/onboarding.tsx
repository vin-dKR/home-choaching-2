
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../services/supabase';

const StudentOnboardingScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { error } = await supabase
        .from('profiles')
        .update({ name, grade })
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      router.replace('/student/dashboard');
    },
    onError: (error) => {
      Alert.alert('An Error Occurred', error.message);
    }
  });

  return (
    <View className="flex-1 justify-center p-4">
      <Text className="text-2xl mb-4 text-center">Student Onboarding</Text>
      <TextInput
        className="border p-2 mb-2"
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        className="border p-2 mb-4"
        placeholder="Your Grade"
        value={grade}
        onChangeText={setGrade}
        keyboardType="numeric"
      />
      <Button title={isPending ? 'Saving...' : 'Complete Profile'} onPress={() => updateProfile()} disabled={isPending} />
    </View>
  );
};

export default StudentOnboardingScreen;
