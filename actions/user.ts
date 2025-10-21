
import { supabase } from '../services/supabase';

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
