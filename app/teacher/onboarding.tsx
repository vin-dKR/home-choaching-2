import OnboardingScreen from '@/components/block/onbaording/screen/OnboardingScreen';
import FormInput from '@/components/ui/form-input';
import { Select, SelectItem } from '@/components/ui/select';
import { useOnboardingForm } from '@/hooks/onboarding/useOnboardingForm';
import { useUser } from '@/hooks/uesr/useUser';
import React, { useState } from 'react';

const TeacherOnboardingScreen: React.FC = () => {
    const {
        name, setName,
        phone, setPhone,
        bio, setBio,
        location, setLocation,
        handleGetLocation,
    } = useOnboardingForm();

    const [experience, setExperience] = useState<string>('');
    const [hourlyRate, setHourlyRate] = useState<string>('');
    const [selectedGrades, setSelectedGrades] = useState<SelectItem[]>([]);
    const [selectedBoards, setSelectedBoards] = useState<SelectItem[]>([]);
    const [selectedSubjects, setSelectedSubjects] = useState<SelectItem[]>([]);

    const { gradesData, boardsData, subjectsData, isLoading, isUpdatingProfile, updateProfile } = useUser();

    const handleCompleteProfile = () => {
    }

    return (
        <OnboardingScreen
            title='Set Up Your Teacher Profile'
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
            <FormInput
                placeholder='Year of Experience'
                value={experience}
                onChangeText={setExperience}
                keyboardType='number-pad'
            />
            <FormInput
                placeholder='Hourly Rate (e.g., 500)'
                value={hourlyRate}
                onChangeText={setHourlyRate}
                keyboardType='decimal-pad'
            />

            <Select<SelectItem>
                items={gradesData|| []}
                selectedItems={selectedGrades}
                onValueChange={setSelectedGrades}
                placeholder="Select Grades You Teach"
                isMulti
            />
            <Select<SelectItem>
                items={boardsData|| []}
                selectedItems={selectedBoards}
                onValueChange={setSelectedBoards}
                placeholder="Select Boards You Teach For"
                isMulti
            />
            <Select<SelectItem>
                items={subjectsData || []}
                selectedItems={selectedSubjects}
                onValueChange={setSelectedSubjects}
                placeholder="Select Subjects You Teach"
                isMulti
            />
        </OnboardingScreen>

    )
};

export default TeacherOnboardingScreen;
