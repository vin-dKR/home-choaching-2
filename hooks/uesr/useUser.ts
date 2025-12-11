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

            const { subject_ids, grade_ids, board_ids, ...mainProfileData } = profileData
            console.log("mainProfileData--------------", subject_ids, "=-----", grade_ids, "=----", board_ids)

            const { error: profileUpdateError } = await supabase
                .from('profiles')
                .update({ ...mainProfileData, onboarded: true })
                .eq('id', user.id)

            console.log(profileUpdateError)
            if (profileUpdateError) throw new Error("Profile Update E0ROR", profileUpdateError)

            if (
                !subject_ids?.length ||
                !grade_ids?.length ||
                !board_ids?.length
            ) {
                return;
            }

            if (
                subject_ids && subject_ids.length > 0 &&
                grade_ids && grade_ids.length > 0 &&
                board_ids && board_ids.length > 0
            ) {
                const subjectsToInsert = subject_ids.map((id) => ({
                    profile_id: user.id,
                    subject_id: id,
                    relation: relation
                }))

                const teacherSubjectsToInsert = subject_ids.map((id) => ({
                    teacher_id: user.id,
                    subject_id: id
                }))

                const gradesToInsert = grade_ids.map((id: number) => ({
                    teacher_id: user.id,
                    grade_id: id
                }))

                const boardsToInsert = board_ids.map((id: number) => ({
                    teacher_id: user.id,
                    board_id: id
                }))

                const { error: subjectInsertError } = await supabase
                    .from('profile_subjects')
                    .insert(subjectsToInsert)

                const [subjErr, gradeErr, boardErr] = await Promise.all([
                    supabase.from('teacher_subjects').insert(teacherSubjectsToInsert),
                    supabase.from('teacher_grades').insert(gradesToInsert),
                    supabase.from('teacher_boards').insert(boardsToInsert),
                ]);

                if (subjectInsertError) throw new Error("Subject Insert ERROR", subjectInsertError)
                if (subjErr.error) throw new Error("Failed to save teacher subjects");
                if (gradeErr.error) throw new Error("Failed to save teacher grades");
                if (boardErr.error) throw new Error("Failed to save teacher boards");
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
