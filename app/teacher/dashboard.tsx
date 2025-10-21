
import React from 'react';
import { View, Text, Button, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../services/supabase';
import { getProfile } from '../../actions/auth';

const TeacherDashboard: React.FC = () => {
  const router = useRouter();
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/auth/login');
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    Alert.alert('Error fetching profile', error.message);
  }

  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-2xl mb-4">Teacher Dashboard</Text>
      {profile && (
        <View className="mb-4">
          <Text className="text-lg">Name: {profile.name}</Text>
          <Text className="text-lg">Bio: {profile.bio}</Text>
          <Text className="text-lg">Subject: {profile.subject}</Text>
        </View>
      )}
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default TeacherDashboard;
