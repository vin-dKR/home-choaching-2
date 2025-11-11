import { AuthError, Session, SignInWithPasswordlessCredentials, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

type OTPResponse = {
    data: {
        user: User | null;
        session: Session | null;
    } | null;
    error: AuthError | null;
}

export const signInWithOTP = async (options: { email?: string; phone?: string; }): Promise<OTPResponse> => {
    console.log("------------------option", options)
    const { data, error } = await supabase.auth.signInWithOtp(options as SignInWithPasswordlessCredentials);
    console.log("-----------------data", data)
    console.log("Err----------------err-", error)
    return { data, error };
};

export const verifyOTP = async ({ contact, token }: { contact: string, token: string }): Promise<OTPResponse> => {
    const isEmail = contact.includes('@');
    const options = isEmail
        ? { email: contact, token, type: 'email' as const }
        : { phone: contact, token, type: 'sms' as const };

    const { data, error } = await supabase.auth.verifyOtp(options);
    return { data, error };
};


export const getSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
        throw new Error(error.message);
    }
    return data;
};

export const getProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user logged in');

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}
