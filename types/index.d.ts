import { Dispatch, SetStateAction, useState } from 'react';

export { }

declare global {
    // auth - types
    interface SignInWithPassword {
        email: string
        password: string
    }

    interface SignUpWithPassword extends SignInWithPassword {
        // You can add additional fields for sign up here, e.g.
        // fullName: string;
    }

    // user - types
    type UserRole = 'student' | 'teacher';

    interface UserProfile {
        id: string;
        email: string;
        role: UserRole;
    }

    // navigation - types
    type RootStackParamList = {
        Login: undefined;
        SignUp: undefined;
        StudentDashboard: undefined;
        TeacherDashboard: undefined;
    };

    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }


    // classroom types
    interface GradeType {
        id: number
        name: string
    }

    interface BoardType {
        id: number
        name: string
    }

    interface SubjectsType {
        id: number
        name: string
        category: string
    }


    // Onboarding ----------------------------------------------
    // student-onboarding

    interface CommonSelectionChipProps {
        title: string
        items: BoardType[] | GradeType[] | SubjectsType[]
        selectedIds: number[]
    }

    type SingleSelectedProps = CommonSelectionChipProps & {
        isMultiSelect?: false
        onToggle: Dispatch<SetStateAction<number | null>>
    }

    type MultiSelectedProps = CommonSelectionChipProps & {
        isMultiSelect: true
        onToggle: Dispatch<SetStateAction<number[]>>
    }

    type SelectionChipProps = SingleSelectedProps | MultiSelectedProps

}
