import { getBoards, getGrades, getSubjects } from '@/actions/user';
import { supabase } from '@/services/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

interface UpdateProfileArgs {
    profileData: {
        subject_ids?: number[];
        [key: string]: any;
    };
    relation: 'studies' | 'teaches';
}

export const useUser = () => {
    const queryClient = useQueryClient()

    const { data: gradesData, isLoading: gradesDataLoading, error: gradeErr } = useQuery({
        queryKey: ['grades'],
        queryFn: getGrades
    })

    const { data: boardsData, isLoading: boardsDataLoading, error: boardErr } = useQuery({
        queryKey: ['boards'],
        queryFn: getBoards
    })

    const { data: subjectsData, isLoading: subjectsDataLoading, error: subjectErr } = useQuery({
        queryKey: ['subjects'],
        queryFn: getSubjects
    })

    const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation<void, Error, UpdateProfileArgs>({
        mutationFn: async ({ profileData, relation }) => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("User not AUTHENTICATED")

            const { subject_ids, ...mainProfileData } = profileData

            const { error: profileUpdateError } = await supabase
                .from('profiles')
                .update({ ...mainProfileData, onboarded: true })
                .eq('id', user.id)

            if (profileUpdateError) throw new Error("Profile Update ERROR")

            if (subject_ids && subject_ids.length > 0) {
                const subjectsToInsert = subject_ids.map((id) => ({
                    profile_id: user.id,
                    subject_id: id,
                    relation: relation
                }))

                const { error: subjectInsertError } = await supabase
                    .from('profile_subjects')
                    .insert(subjectsToInsert)

                if (subjectInsertError) throw new Error("Subject Insert ERROR", subjectInsertError)
            }
        },
        onSuccess: (_data, variable) => {
            queryClient.invalidateQueries({ queryKey: ['profile'] })
            const role = variable.relation === "studies" ? "student" : "teacher"
            router.replace(`/${role}/dashboard`)
        },
        onError: (error) => {
            console.log("error iin hooks updatin profile", error)
            throw error
        }
    })


    return {
        gradesData: gradesData ?? [],
        boardsData: boardsData ?? [],
        subjectsData: subjectsData ?? [],
        isLoading: gradesDataLoading || boardsDataLoading || subjectsDataLoading,
        error: gradeErr || boardErr || subjectErr,
        updateProfile,
        isUpdatingProfile
    }
}
