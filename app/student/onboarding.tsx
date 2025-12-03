import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useUser } from '@/hooks/uesr/useUser';
import { Select, SelectItem } from "@/components/ui/select"
import * as Location from 'expo-location';

const StudentOnboardingScreen: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [bio, setBio] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [selectedGrade, setSelectedGrade] = useState<SelectItem | null>(null);
    const [selectedBoard, setSelectedBoard] = useState<SelectItem | null>(null);
    const [selectedSubjects, setSelectedSubjects] = useState<SelectItem[]>([]);

    const { gradesData, boardsData, subjectsData, isLoading, isUpdatingProfile, updateProfile } = useUser();

    const handleGetLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const point = {
            type: 'Point',
            coordinates: [location.coords.longitude, location.coords.latitude]
        };

        console.log("--------- location is", location)
        console.log("---------------------------------------------------------")
        console.log("--------- point is", point)

        setLocation(JSON.stringify(point));
        Alert.alert('Location captured!', 'Your location has been set.');
    };

    const handleCompleteProfile = () => {
        if (!name || !selectedGrade || !selectedBoard) {
            Alert.alert('Missing Information', 'Please fill in all required fields.');
            return;
        }

        const profileData = {
            name,
            phone,
            bio,
            student_grade_id: selectedGrade.id,
            student_board_id: selectedBoard.id,
            subject_ids: selectedSubjects.map(s => s.id),
            location: location
        };

        updateProfile({ profileData, relation: 'studies' });
    };

    return (
        <ScrollView className="flex-1 p-4 bg-gray-50">
            <Text className="text-2xl font-bold mb-6 text-center">Set Up Your Student Profile</Text>

            <TextInput className="border border-gray-300 rounded-lg p-3 mb-4 bg-white text-base" placeholder="Full Name" value={name} onChangeText={setName} />
            <TextInput className="border border-gray-300 rounded-lg p-3 mb-4 bg-white text-base" placeholder="Phone (Optional)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <TextInput className="border border-gray-300 rounded-lg p-3 mb-4 bg-white text-base" placeholder="Bio (Optional)" value={bio} onChangeText={setBio} multiline />

            <View className="flex-row items-center mb-4">
                <TextInput className="flex-1 border border-gray-300 rounded-lg p-3 mr-2 bg-white text-base" placeholder="Location (e.g., city, state or use GPS)" value={location} onChangeText={setLocation} />
                <Button title="Use My Location" onPress={handleGetLocation} />
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" className="my-8" />
            ) : (
                <>
                    <Select<SelectItem>
                        items={gradesData || []}
                        selectedItem={selectedGrade}
                        onValueChange={setSelectedGrade}
                        placeholder="Select Your Grade"
                    />
                    <Select<SelectItem>
                        items={boardsData || []}
                        selectedItem={selectedBoard}
                        onValueChange={setSelectedBoard}
                        placeholder="Select Your Board"
                    />
                    <Select<SelectItem>
                        items={subjectsData || []}
                        selectedItems={selectedSubjects}
                        onValueChange={setSelectedSubjects}
                        placeholder="Select Subjects You're Studying"
                        isMulti
                    />
                </>
            )}

            <View className="mt-4 mb-8">
                <Button title={isUpdatingProfile ? 'Saving...' : 'Complete Profile'} onPress={handleCompleteProfile} disabled={isUpdatingProfile || isLoading} />
            </View>
        </ScrollView>
    );
};

export default StudentOnboardingScreen;
