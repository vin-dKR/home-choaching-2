import OnboardingScreen from '@/components/block/onbaording/screen/OnboardingScreen';
import FormInput from '@/components/ui/form-input';
import { Select, SelectItem } from '@/components/ui/select';
import { useOnboardingForm } from '@/hooks/onboarding/useOnboardingForm';
import { useUser } from '@/hooks/uesr/useUser';
import React, { useState } from 'react';
import { Alert } from 'react-native';

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
         if (!name || !experience || !hourlyRate || selectedGrades.length === 0 || selectedBoards.length === 0 || selectedSubjects.length === 0) {
      Alert.alert('Missing Information', 'Please fill out all fields and make selections.');
      return;
    }

    const profileData = {
      name,
      phone,
      bio,
      experience_years: parseInt(experience, 10),
      hourly_rate: parseFloat(hourlyRate),
      grade_ids: selectedGrades.map(g => g.id),
      board_ids: selectedBoards.map(b => b.id),
      subject_ids: selectedSubjects.map(s => s.id),
      location,
    };

    updateProfile({ profileData, relation: 'teaches' });
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
                items={gradesData || []}
                selectedItems={selectedGrades}
                onValueChange={setSelectedGrades}
                placeholder="Select Grades You Teach"
                isMulti
            />
            <Select<SelectItem>
                items={boardsData || []}
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
