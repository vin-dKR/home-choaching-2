import React, { useState } from 'react';
import SelectionChip from '@/components/block/onbaording/student/SelectionChip';
import { getSession } from '@/actions/auth';
import { Text, TextInput, ActivityIndicator, View, Button, ScrollView, Alert } from 'react-native';

import { useUser } from '@/hooks/uesr/useUser';
import { router } from 'expo-router';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient()
const StudentOnboardingScreen: React.FC = () => {
    const {
        isLoading,
        gradesData,
        boardsData,
        subjectsData,
        updateProfile,
        isUpdatingProfile
    } = useUser()

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [bio, setBio] = useState('');
    const [selectedGradeId, setSelectedGradeId] = useState<number | null>(null);
    const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);
    const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([]);

    const queryClient = useQueryClient()
    const session = queryClient.getQueryData(['session'])
    console.log("--------------session data in onbiarding", session)

    const handleCompleteProfile = () => {

        if (!name || !selectedGradeId || !selectedBoardId) {
            Alert.alert('Missing Information', 'Please enter your name and select a grade and board.');
            return;
        }

        const profileData = {
            name,
            phone,
            bio,
            student_grade_id: selectedGradeId,
            student_board_id: selectedBoardId,
            subject_ids: selectedSubjectIds,
        }

        updateProfile({ profileData, relation: "studies" })
        router.push('/student/dashboard');

    }
    return (
        <ScrollView className="flex-1 p-4 bg-gray-50">
            <Text className="text-2xl font-bold mb-6 text-center">Set Up Your Student Profile</Text>

            <Text className="text-lg font-semibold mb-2">Full Name</Text>
            <TextInput
                className="border rounded-lg p-3 mb-4 bg-white"
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
            />

            <Text className="text-lg font-semibold mb-2">Phone Number</Text>
            <TextInput
                className="border rounded-lg p-3 mb-4 bg-white"
                placeholder="Enter your phone number"
                value={phone}
                onChangeText={setPhone}
            />

            <Text className="text-lg font-semibold mb-2">About You</Text>
            <TextInput
                className="border rounded-lg p-3 mb-4 bg-white"
                placeholder="Tell us little about yourself"
                value={bio}
                onChangeText={setBio}
            />

            {isLoading ? (
                <ActivityIndicator size="large" className="my-8" />
            ) : (
                <>
                    <SelectionChip
                        title="Your Grade"
                        items={gradesData}
                        selectedIds={selectedGradeId ? [selectedGradeId] : []}
                        onToggle={setSelectedGradeId}
                    />
                    <SelectionChip
                        title="Your Board"
                        items={boardsData}
                        selectedIds={selectedBoardId ? [selectedBoardId] : []}
                        onToggle={setSelectedBoardId}
                    />
                    <SelectionChip
                        title="Subjects You're Studying"
                        items={subjectsData}
                        selectedIds={selectedSubjectIds}
                        onToggle={setSelectedSubjectIds}
                        isMultiSelect={true}
                    />
                </>
            )}

            <View>
                <Button
                    title={isUpdatingProfile ? 'Saving...' : 'Complete Profile'}
                    onPress={handleCompleteProfile}
                    disabled={isUpdatingProfile || isLoading}
                />
            </View>
        </ScrollView>
    );
};

export default StudentOnboardingScreen;
