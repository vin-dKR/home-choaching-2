import { getBoards, getGrades, getSubjects } from '@/actions/user';
import { supabase } from '@/services/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


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

    const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
        mutationFn: async (profileData: object) => {
            const { error } = await supabase.rpc('update_user_profile', { profile_data: profileData })
            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] })
        },
        onError: (error) => {
            console.log("error iin hooks updatin profile")
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
