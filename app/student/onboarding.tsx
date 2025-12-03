import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useUser } from '@/hooks/uesr/useUser';
import { Select, SelectItem } from "@/components/ui/select"
import OnboardingScreen from '@/components/block/onbaording/screen/OnboardingScreen';
import { useOnboardingForm } from '@/hooks/onboarding/useOnboardingForm';

const StudentOnboardingScreen: React.FC = () => {
    const {
        name, setName,
        phone, setPhone,
        bio, setBio,
        location, setLocation,
        handleGetLocation,
    } = useOnboardingForm();

    const [selectedGrade, setSelectedGrade] = useState<SelectItem | null>(null);
    const [selectedBoard, setSelectedBoard] = useState<SelectItem | null>(null);
    const [selectedSubjects, setSelectedSubjects] = useState<SelectItem[]>([]);

    const { gradesData, boardsData, subjectsData, isLoading, isUpdatingProfile, updateProfile } = useUser();

    const handleCompleteProfile = (name: string, phone: string, bio: string, location: string) => {
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
            location,
        };

        updateProfile({ profileData, relation: 'studies' });
    };

    return (
        <OnboardingScreen
            title="Set Up Your Student Profile"
            name={name}
            setName={setName}
            phone={phone}
            setPhone={setPhone}
            bio={bio}
            setBio={setBio}
            location={location}
            setLocation={setLocation}
            handleGetLocation={handleGetLocation}
            onCompleteProfile={handleCompleteProfile}
            isUpdatingProfile={isUpdatingProfile}
            isLoading={isLoading}
        >
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
        </OnboardingScreen>
    );
};

export default StudentOnboardingScreen;
