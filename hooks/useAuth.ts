
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signInWithPassword } from '../actions/auth';
import { getUserProfile } from '../actions/user';

export const useAuth = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (credentials: SignInWithPassword) => {
            const signInResponse = await signInWithPassword(credentials);

            if (signInResponse.error) {
                return { ...signInResponse, profile: null };
            }

            if (signInResponse.data.user) {
                const profile = await getUserProfile(signInResponse.data.user.id);
                if (profile) {
                    queryClient.setQueryData(['user-profile', signInResponse.data.user.id], profile);
                }
                return { ...signInResponse, profile };
            }

            return { ...signInResponse, profile: null };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['session'] });
        }
    });
};
