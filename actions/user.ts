import { supabase } from '../services/supabase';

// WIP interface
// teacher-grade-board is not here
interface TeacherProfile {
    id: string
    name: string
    // avatar_url: string
    // location: string
    // hourly_rate: string
    // experience_years: string
}


// WIP: interface incomplete
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, email, role')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }

    return data as UserProfile;
};

export const getTeachers = async (): Promise<TeacherProfile[] | null> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, name')
        .eq('role', "teacher")

    if (error) throw new Error("Geting problem while teacher feachig")

    return data
}

export const getGrades = async (): Promise<GradeType[]> => {
    const { data, error } = await supabase
        .from("grades")
        .select('*')

    if (error) throw new Error("There is problem in fethcing the grade")
    return data
}

export const getBoards = async (): Promise<BoardType[]> => {
    const { data, error } = await supabase
        .from('boards')
        .select('*')

    if (error) throw new Error("there's a problem fetching the boards")

    return data
}

export const getSubjects = async (): Promise<SubjectsType[]> => {
    const { data, error } = await supabase
        .from('subjects')
        .select('*')

    if (error) throw new Error("error in fetching subjects")
    return data
}
