import React from 'react';
import { View, Text, Button, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../services/supabase';
import { getProfile } from '../../actions/auth';
import { getTeachers } from '@/actions/user';

const StudentDashboard: React.FC = () => {
    const router = useRouter();
    const { data: profile, isLoading, error } = useQuery({
        queryKey: ['profile'],
        queryFn: getProfile,
    });

    const { data: teachersData, isLoading: teacherDataLoading, error: teacherDataError } = useQuery({
        queryKey: ['teachersData'],
        queryFn: getTeachers
    })

    // console.log("-------------adsfsadfasdfasdf teachers data", teachersData)

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
        <View className="flex-1 justify-center items-center items-center p-4">
            <Text className="text-2xl mb-4">Student Dashboard</Text>
            {profile && (
                <View className="mb-4">
                    <Text className="text-lg">Name: {profile.name}</Text>
                    <Text className="text-lg">Email: {profile.email}</Text>
                    <Text className="text-lg">Phone: {profile.phone}</Text>
                    <Text className="text-lg">Bio: {profile.bio}</Text>
                    <Text className="text-lg">Board: {profile.student_board_id}</Text>
                    <Text className="text-lg">Grade: {profile.student_grade_id}</Text>
                </View>
            )}
            <Button title="Logout" onPress={handleLogout} />
        </View>
    );
};

export default StudentDashboard;
